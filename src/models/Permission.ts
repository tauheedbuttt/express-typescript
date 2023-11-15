import mongoose from "mongoose"

const Permission = new mongoose.Schema({
    name: {
        type: String
    },
    url: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export default mongoose.model('Permission', Permission);