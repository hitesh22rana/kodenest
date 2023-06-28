const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema(
    {
        topic: { type: String, required: true },
        roomType: { type: String, required: true },
        secretToken: { type: String, required: false },
        ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
        speakers: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Room', roomSchema, 'rooms');