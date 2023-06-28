const roomService = require("../services/room-service");
const RoomDto = require('../dtos/roomDto');

class RoomsController {
    async create(req, res) {
        const { topic, roomType } = req.body;

        if (!topic || !roomType) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const room = await roomService.create({
            topic,
            roomType,
            ownerId: req.user._id,
        });

        return res.status(201).json(new RoomDto(room));
    }

    async getAll(req, res) {
        const rooms = await roomService.getAllRooms(['open']);
        const allRooms = rooms.map((room) => new RoomDto(room));
        return res.status(200).json(allRooms);
    }

    async getRoomByID(req, res) {
        const room = await roomService.getRoom(req.params.roomId);
        if (!room) return res.status(400).json({ message: "Inavlid RoomID!" });
        return res.status(200).json(room);
    }

    async getPrivateRoomByToken(req, res) {
        const { token } = req.body;
        const room = await roomService.getRoomBySecretToken(token);
        if (!room || room.roomType !== "private" || room.secretToken !== token) return res.status(400).json({ message: "Inavlid Secret token!" });
        return res.status(200).json(room._id);
    }
}

module.exports = new RoomsController();