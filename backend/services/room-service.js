const RoomModel = require("../models/room");

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        const room = await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId]
        });

        return room;
    }

    async getAllRooms(types) {
        const rooms = await RoomModel.find({ roomType: { $in: types } })
            .populate('speakers')
            .populate('ownerId')
            .exec();
        return rooms;
    }

    async getRoom(roomId) {
        try {
            const room = await RoomModel.findOne({ _id: roomId });
            return room;
        } catch (err) {
            return null;
        }
    }
}

module.exports = new RoomService()