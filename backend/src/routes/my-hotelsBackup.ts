// import express, { Request, Response } from 'express';
// import multer from 'multer';
// import Hotel from "../models/hotel";
// import { HotelType } from '../shared/types';
// import verifyToken from '../middleware/auth';
// import { body } from 'express-validator';

// const router = express.Router();

// // Configure multer to store images in memory
// const storage = multer.memoryStorage();
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
//     }
// });

// // Route for creating a new hotel
// router.post("/",
//     verifyToken, [
//     body("name").notEmpty().withMessage("Name is required"),
//     body("city").notEmpty().withMessage("City is required"),
//     body("country").notEmpty().withMessage("Country is required"),
//     body("description").notEmpty().withMessage("Description is required"),
//     body("type").notEmpty().withMessage("Hotel type is required"),
//     body("pricePerNight")
//         .notEmpty()
//         .isNumeric()
//         .withMessage("Price per night is required and must be a number"),
//     body("facilities")
//         .notEmpty()
//         .isArray()
//         .withMessage("Facilities are required"),
// ],
//     upload.array("imageFiles", 6), // Handle up to 6 image uploads
//     async (req: Request, res: Response) => {
//         try {
//             const imageFiles = req.files as Express.Multer.File[];
//             const newHotel: HotelType = req.body;

//             // Convert image files to Base64 strings
//             const imageBase64Strings = imageFiles.map((file) => {
//                 return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
//             });

//             // Assigning images directly to newHotel document
//             newHotel.imageUrls = imageBase64Strings;
//             newHotel.lastUpdated = new Date();
//             newHotel.userId = req.userId;

//             const hotel = new Hotel(newHotel);
//             await hotel.save();

//             res.status(201).send(hotel);
//         } catch (e) {
//             console.log("Error creating hotel:", e)
//             res.status(500).json({ message: "Something went wrong :(" })
//         }
//     });

// // Route to get all hotels for a user
// router.get("/", verifyToken, async (req: Request, res: Response) => {
//     try {
//         const hotels = await Hotel.find({ userId: req.userId });
//         res.json(hotels);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching hotels" });
//     }
// });

// // Route to get a specific hotel by ID
// router.get("/:id", verifyToken, async (req: Request, res: Response) => {
//     try {
//         const hotel = await Hotel.findOne({
//             _id: req.params.id,
//             userId: req.userId
//         });
//         if (!hotel) {
//             return res.status(404).json({ message: "Hotel not found" });
//         }
//         res.json(hotel);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching hotel" });
//     }
// });

// // Route to update hotel images
// router.put("/:hotelId/images", verifyToken, upload.array("imageFiles", 6), async (req: Request, res: Response) => {
//     try {
//         const files = req.files as Express.Multer.File[];
//         const imageBase64Strings = files.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`);

//         const updatedHotel = await Hotel.findOneAndUpdate({
//             _id: req.params.hotelId,
//             userId: req.userId
//         }, {
//             $set: { imageUrls: imageBase64Strings },
//             $currentDate: { lastUpdated: true }
//         }, {
//             new: true
//         });

//         if (!updatedHotel) {
//             return res.status(404).json({ message: "Hotel not found" });
//         }

//         res.status(201).json(updatedHotel);
//     } catch (error) {
//         console.log("Error updating images:", error);
//         res.status(500).json({ message: "Something went wrong" });
//     }
// });

// export default router;

// // import express, { Request, Response } from 'express';
// // import multer from 'multer';
// // import Hotel from "../models/hotel";
// // import { HotelType } from '../shared/types';
// // import verifyToken from '../middleware/auth';
// // import { body } from 'express-validator';

// // const router = express.Router();

// // // Configure multer to store images in memory
// // const storage = multer.memoryStorage();
// // const upload = multer({
// //     storage: storage,
// //     limits: {
// //         fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
// //     }
// // });

// // router.post("/",
// //     verifyToken, [
// //     body("name").notEmpty().withMessage("Name is required"),
// //     body("city").notEmpty().withMessage("City is required"),
// //     body("country").notEmpty().withMessage("Country is required"),
// //     body("description").notEmpty().withMessage("Description is required"),
// //     body("type").notEmpty().withMessage("Hotel type is required"),
// //     body("pricePerNight")
// //         .notEmpty()
// //         .isNumeric()
// //         .withMessage("Price per night is required and must be a number"),
// //     body("facilities")
// //         .notEmpty()
// //         .isArray()
// //         .withMessage("Facilities are required"),
// // ],
// //     upload.array("imageFiles", 6), // Handle up to 6 image uploads
// //     async (req: Request, res: Response) => {
// //         try {
// //             const imageFiles = req.files as Express.Multer.File[];
// //             const newHotel: HotelType = req.body;

// //             // Convert image files to Base64 strings
// //             const imageBase64Strings = imageFiles.map((file) => {
// //                 return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
// //             });

// //             // Assigning images directly to newHotel document
// //             newHotel.imageUrls = imageBase64Strings;
// //             newHotel.lastUpdated = new Date();
// //             newHotel.userId = req.userId;

// //             const hotel = new Hotel(newHotel);
// //             await hotel.save();

// //             res.status(201).send(hotel);
// //         } catch (e) {
// //             console.log("Error creating hotel:", e)
// //             res.status(500).json({ message: "Something went wrong :(" })
// //         }
// //     });

// // router.get("/", verifyToken, async (req: Request, res: Response) => {
// //     try {
// //         const hotels = await Hotel.find({ userId: req.userId });
// //         res.json(hotels);
// //     } catch (error) {
// //         res.status(500).json({ message: "Error fetching hotels" });
// //     }
// // });

// // router.get("/:id", verifyToken, async (req: Request, res: Response) => {
// //     const id = req.params.id.toString();
// //     try {
// //         const hotel = await Hotel.findOne({
// //             _id: id,
// //             userId: req.userId
// //         })
// //         res.json(hotel);
// //     } catch (error) {
// //         res.status(500).json({ message: "Error fetching hotels" })
// //     }
// // })

// // // Update hotel images endpoint
// // router.put("/:hotelId/images", verifyToken, upload.array("imageFiles", 6), async (req: Request, res: Response) => {
// //     try {
// //         const files = req.files as Express.Multer.File[];
// //         const imageBase64Strings = files.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`);

// //         const updatedHotel = await Hotel.findOneAndUpdate({
// //             _id: req.params.hotelId,
// //             userId: req.userId
// //         }, {
// //             $set: { imageUrls: imageBase64Strings },
// //             $currentDate: { lastUpdated: true }
// //         }, {
// //             new: true
// //         });

// //         if (!updatedHotel) {
// //             return res.status(404).json({ message: "Hotel not found" });
// //         }

// //         res.json(updatedHotel);
// //     } catch (error) {
// //         console.log("Error updating images:", error);
// //         res.status(500).json({ message: "Something went wrong" });
// //     }
// // });

// // export default router;



// // // import express, { Request, Response } from 'express';
// // // import multer from 'multer';
// // // import cloudinary from 'cloudinary';
// // // import Hotel, { HotelType } from '../models/hotel';
// // // import verifyToken from '../middleware/auth';
// // // import { body } from 'express-validator';

// // // const router = express.Router();

// // // const storage = multer.memoryStorage();
// // // const upload = multer({
// // //     storage: storage,
// // //     limits: {
// // //         fileSize: 5 * 1024 * 1024 // 5MB
// // //     }
// // // })

// // // router.post("/",
// // //     verifyToken, [
// // //     body("name").notEmpty().withMessage("Name is required"),
// // //     body("city").notEmpty().withMessage("City is required"),
// // //     body("country").notEmpty().withMessage("Country is required"),
// // //     body("description").notEmpty().withMessage("Description is required"),
// // //     body("type").notEmpty().withMessage("Hotel type is required"),
// // //     body("pricePerNight")
// // //         .notEmpty()
// // //         .isNumeric()
// // //         .withMessage("Price per night is required and must be a number"),
// // //     body("facilities")
// // //         .notEmpty()
// // //         .isArray()
// // //         .withMessage("Facilities are required"),
// // // ],
// // //     upload.array("imageFiles", 6),
// // //     async (req: Request, res: Response) => {
// // //         try {
// // //             const imageFiles = req.files as Express.Multer.File[];
// // //             const newHotel: HotelType = req.body;

// // //             const uploadPromises = imageFiles.map(async (image) => {
// // //                 const b64 = Buffer.from(image.buffer).toString("base64")
// // //                 let dataURI = "data:" + image.mimetype + ";base64," + b64;
// // //                 const res = await cloudinary.v2.uploader.upload(dataURI);
// // //                 return res.url;
// // //             });

// // //             const imageUrls = await Promise.all(uploadPromises);
// // //             newHotel.imageUrls = imageUrls;
// // //             newHotel.lastUpdated = new Date();
// // //             newHotel.userId = req.userId;

// // //             const hotel = new Hotel(newHotel);
// // //             await hotel.save();

// // //             res.status(201).send(hotel);
// // //         } catch (e) {
// // //             console.log("Error creating hotel:", e)
// // //             res.status(500).json({ message: "Something went wrong :(" })
// // //         }
// // //     })

// // // router.get("/", verifyToken, async (req: Request, res: Response) => {
// // //     const hotels = await Hotel.find({
// // //         userId: req.userId
// // //     })
// // //     res.json(hotels);

// // //     try {
// // //         const hotels = await Hotel.find({userId: req.userId});
// // //         res.json(hotels);
// // //     } catch (error) {
// // //         res.status(500).json({message: "Error fetching hotels:("})
// // //     }
// // // })

// // // export default router;

// // // ------------------------------------------------

// // // import express, { Request, Response } from 'express';
// // // import multer from 'multer';
// // // import Hotel from "../models/hotel"
// // // import { HotelType } from '../shared/types';
// // // import verifyToken from '../middleware/auth';
// // // import { body } from 'express-validator';

// // // const router = express.Router();

// // // // Setting up multer to store images in memory
// // // const storage = multer.memoryStorage();
// // // const upload = multer({
// // //     storage: storage,
// // //     limits: {
// // //         fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
// // //     }
// // // });

// // // router.post("/",
// // //     verifyToken, [
// // //     body("name").notEmpty().withMessage("Name is required"),
// // //     body("city").notEmpty().withMessage("City is required"),
// // //     body("country").notEmpty().withMessage("Country is required"),
// // //     body("description").notEmpty().withMessage("Description is required"),
// // //     body("type").notEmpty().withMessage("Hotel type is required"),
// // //     body("pricePerNight")
// // //         .notEmpty()
// // //         .isNumeric()
// // //         .withMessage("Price per night is required and must be a number"),
// // //     body("facilities")
// // //         .notEmpty()
// // //         .isArray()
// // //         .withMessage("Facilities are required"),
// // // ],
// // //     upload.array("imageFiles", 6), // Handle up to 6 image uploads
// // //     async (req: Request, res: Response) => {
// // //         try {
// // //             const imageFiles = req.files as Express.Multer.File[];
// // //             const newHotel: HotelType = req.body;

// // //             // Convert image files to Base64 strings
// // //             const imageBase64Strings = imageFiles.map((file) => {
// // //                 return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
// // //             });

// // //             // Assigning images directly to newHotel document
// // //             newHotel.imageUrls = imageBase64Strings;
// // //             newHotel.lastUpdated = new Date();
// // //             newHotel.userId = req.userId;

// // //             const hotel = new Hotel(newHotel);
// // //             await hotel.save();

// // //             res.status(201).send(hotel);
// // //         } catch (e) {
// // //             console.log("Error creating hotel:", e)
// // //             res.status(500).json({ message: "Something went wrong :(" })
// // //         }
// // //     });

// // // router.get("/", verifyToken, async (req: Request, res: Response) => {
// // //     try {
// // //         const hotels = await Hotel.find({ userId: req.userId });
// // //         res.json(hotels);
// // //     } catch (error) {
// // //         res.status(500).json({ message: "Error fetching hotels:(" });
// // //     }
// // // });

// // // router.get("/:id", verifyToken, async (req: Request, res: Response) => {
// // //     const id = req.params.id.toString();
// // //     try {
// // //         const hotel = await Hotel.findOne({
// // //             _id: id,
// // //             userId: req.userId
// // //         })
// // //         res.json(hotel);
// // //     } catch (error) {
// // //         res.status(500).json({ message: "Error fetching hotels" })
// // //     }
// // // })

// // // async function uploadImages(imageFiles: Express.Multer.File[]) {
// // //     const uploadPromises = imageFiles.map(async (image) => {
// // //         const b64 = Buffer.from(image.buffer).toString("base64");
// // //         let dataURI = "data:" + image.mimetype + ";base64," + b64;
// // //         const res = await cloudinary.v2.uploader.upload(dataURI);
// // //         return res.url;
// // //     });

// // //     const imageUrls = await Promise.all(uploadPromises);
// // // }

// // // router.get("/:hotelId", verifyToken, upload.array("imageFiles"), async (req: Request, res: Response) => {
// // //     try {
// // //         const updatedHotel: HotelType = req.body;
// // //         updatedHotel.lastUpdated = new Date();

// // //         const hotel = await Hotel.findOneAndUpdate({
// // //             _id: req.params.hotelId,
// // //             userId: req.userId,
// // //         }, updatedHotel, {
// // //             new: true
// // //         })

// // //         if (!hotel) {
// // //             return res.status(404).json({ message: "Hotel not found" })
// // //         }

// // //         const files = req.files as Express.Multer.File[];
// // //         const updatedImageUrls = await uploadImages(files);

// // //         hotel.imageUrls = [...updatedImageUrls, ...Hotel(updatedHotel.imageUrls || [])];

// // //         await hotel.save();

// // //     } catch (error) {
// // //         res.status(500).json({ message: "Something went wrong" })
// // //     }
// // // })

// // // export default router;



