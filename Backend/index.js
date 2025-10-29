import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import routes (make sure all .js extensions are included)
import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import recommendationRoute from "./route/recommendationRoutes.route.js"; // <-- your recommendation route
import orderRoute from "./route/order.route.js";


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Load environment variables
dotenv.config();

// MongoDB connection
const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

try {
  await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("MongoDB Connection Error:", error);
}

// Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/api/recommend", recommendationRoute); // <-- this must come BEFORE app.listen()
app.use("/order", orderRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
