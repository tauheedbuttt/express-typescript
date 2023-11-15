import mongoose from "mongoose"

const Role = new mongoose.Schema({
    name: {
        type: String
    },
    permissions: [{
        permission: {
            type: mongoose.Types.ObjectId,
            ref: 'Permission'
        },
        actions: [{
            type: mongoose.Types.ObjectId,
            ref: 'Action'
        }]
    }],
    deleted: {
        type: Boolean,
        default: false
    },
    editable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model('Role', Role);
