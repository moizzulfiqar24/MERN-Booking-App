import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from './routes/users'
import authRoutes from './routes/auth';
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL, // Ensure this is correctly set
    credentials: true, // This allows cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'] // Optionally specify allowed methods
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    .then(() => {
        console.log("Connected to Local DB")
    });

const PORT = 9000;
app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});

