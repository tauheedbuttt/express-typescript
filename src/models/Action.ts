import mongoose from "mongoose"

const Action = new mongoose.Schema({
    permission: {
        type: mongoose.Types.ObjectId,
        ref: 'Permission'
    },
    name: {
        type: String
    },
    deleted: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

export default mongoose.model('Action', Action);
