class UserDto {
    id;
    email;
    name;
    avatar;
    activated;
    createdAt;
    resetLink;

    constructor(user) {
        this.id = user._id;
        this.email = user.email;
        this.name = user.name;
        this.avatar = user.avatar;
        this.activated = user.activated;
        this.createdAt = user.createdAt;
        this.resetLink = "";
    }
}

module.exports = UserDto;