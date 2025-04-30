import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    aqi: { type: Number, required: true },
});

export default mongoose.models.Station ||
    mongoose.model("Station", StationSchema);
