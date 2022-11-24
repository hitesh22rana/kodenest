const RoomModel = require("../models/room");
const otpService = require("./otp-service");

class RoomService {
    async create(payload) {
        const { topic, roomType, ownerId } = payload;

        let secretToken = '';
        if (roomType === 'private') {
            secretToken = await otpService.generateSecretToken();
        }

        const room = await RoomModel.create({
            topic,
            roomType,
            secretToken,
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

    async getRoomBySecretToken(token) {
        try {
            const room = await RoomModel.findOne({ secretToken: token });
            return room
        } catch (err) {
            return null
        }
    }
}

module.exports = new RoomService()