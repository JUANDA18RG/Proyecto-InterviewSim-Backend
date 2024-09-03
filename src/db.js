import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/");
    console.log("MongoDB is connected");
  } catch (error) {
    console.error(error);
  }
};

