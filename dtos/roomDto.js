class RoomDto {
    id;
    topic;
    roomType;
    secretToken;
    speakers;
    ownerId;
    createdAt;

    constructor(room) {
        this.id = room._id;
        this.topic = room.topic;
        this.roomType = room.roomType;
        this.secretToken = room.secretToken;
        this.ownerId = room.ownerId;
        this.speakers = room.speakers;
        this.createdAt = room.createdAt;
    }
}
module.exports = RoomDto;