import express, { Request, Response } from "express";
import multer from "multer";
import Hotel from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";

const router = express.Router();

// Setting up memory storage, which stores files as buffers
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});

// POST endpoint to create a new hotel with images
router.post(
    "/",
    verifyToken,
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("country").notEmpty().withMessage("Country is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("type").notEmpty().withMessage("Hotel type is required"),
        body("pricePerNight")
            .notEmpty()
            .isNumeric()
            .withMessage("Price per night is required and must be a number"),
        body("facilities")
            .notEmpty()
            .isArray()
            .withMessage("Facilities are required"),
    ],
    upload.array("imageFiles", 6),
    async (req: Request, res: Response) => {
        try {
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            const imageUrls = await uploadImagesToMongo(imageFiles);
            newHotel.imageUrls = imageUrls;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId;

            const hotel = new Hotel(newHotel);
            await hotel.save();
            res.status(201).send(hotel);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Something went wrong" });
        }
    }
);

// GET endpoint to fetch all hotels for a user
router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
});

// GET endpoint to fetch a specific hotel by ID
router.get("/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        const hotel = await Hotel.findOne({
            _id: req.params.id,
            userId: req.userId,
        });
        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotel" });
    }
});

// PUT endpoint to update a hotel, including images
router.put(
    "/:hotelId",
    verifyToken,
    upload.array("imageFiles"),
    async (req: Request, res: Response) => {
        try {
            const updatedHotel: HotelType = req.body;
            updatedHotel.lastUpdated = new Date();

            const hotel = await Hotel.findOneAndUpdate(
                {
                    _id: req.params.hotelId,
                    userId: req.userId,
                },
                updatedHotel,
                { new: true }
            );

            if (!hotel) {
                return res.status(404).json({ message: "Hotel not found" });
            }

            const files = req.files as Express.Multer.File[];
            if (files && files.length > 0) {
                const updatedImageUrls = await uploadImagesToMongo(files);
                hotel.imageUrls = updatedImageUrls.concat(updatedHotel.imageUrls || []);
                await hotel.save();
            }

            res.status(201).json(hotel);
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    }
);

// Function to encode image files as Base64 and return the data URIs
async function uploadImagesToMongo(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        return "data:" + image.mimetype + ";base64," + b64;
    });

    return await Promise.all(uploadPromises);
}

export default router;
