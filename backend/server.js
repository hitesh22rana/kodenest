require('dotenv').config();
const express = require('express');
const app = express();
const DBConnect = require('./database');
const router = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ACTIONS = require('./actions');

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    cors: {
        origin: process.env.FRONT_URL,
        method: ['GET', 'POST'],
    }
})

app.use(cookieParser());
const corsOption = {
    credentials: true,
    origin: [process.env.FRONT_URL],
};

app.use(cors(corsOption));
app.use('/storage', express.static('storage'));

const PORT = process.env.PORT || 5500;
DBConnect();
app.use(express.json({ limit: '8mb' }));
app.use(router);


// Web Sockets logic
const socketUserMap = {};

io.on('connection', (socket) => {
    socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
        socketUserMap[socket.id] = user;

        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

        // Add peers and offers and all
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTIONS.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user,
            });

            // Send total count of clients to myself as well others
            socket.emit(ACTIONS.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMap[clientId],
            });
        });

        // Join the room
        socket.join(roomId);
    });

    // Handle Relay Ice event
    socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
            peerId: socket.id,
            icecandidate,
        });
    });

    // Handle Relay SDP
    socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription,
        });
    });

    // Handle Mute
    socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.MUTE, {
                peerId: socket.id,
                userId,
            });
        });
    });

    // Hnadle Unmute
    socket.on(ACTIONS.UNMUTE, ({ roomId, userId }) => {
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
        clients.forEach((clientId) => {
            io.to(clientId).emit(ACTIONS.UNMUTE, {
                peerId: socket.id,
                userId,
            });
        });
    });

    // Handle leave/Remove
    const leaveRoom = () => {
        const { rooms } = socket;

        Array.from(rooms).forEach((roomId) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMap[socket.id]?.id,
                });

                socket.emit(ACTIONS.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMap[clientId]?.id,
                });

                socket.leave(roomId);
            });
        });

        delete socketUserMap[socket.id];
    };

    // On leaving the room
    socket.on(ACTIONS.LEAVE, leaveRoom);

    // If any type of disconnecting event occours such as browser close 
    socket.on('disconnecting', leaveRoom);

});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));