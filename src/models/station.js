import mongoose from "mongoose";

const StationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    aqiHistory: [
        {
            aqi: { type: Number, required: true },
            recordedAt: { type: Date, default: Date.now },
        },
    ],
});
export default mongoose.models.Station ||
    mongoose.model("Station", StationSchema);
