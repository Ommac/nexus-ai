const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const registerHandlers = require("./handlers");
const { CORS_ORIGIN, JWT_SECRET } = require("../secrets");

let io;

// Tracks how many sockets each user currently has open.
// Map<userId: string, Set<socketId: string>>
// Used so we only mark a user offline when their LAST socket disconnects
// (handles multiple tabs / devices).
const userSocketMap = new Map();

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
  });
  console.log("Socket.io initialized");

  // --- Authentication middleware ---
  // Every socket connection must present a valid JWT in handshake.auth.token.
  // On success we attach socket.userId so handlers never trust client-supplied IDs.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error: no token provided"));
    }
    try {
      const data = jwt.verify(token, JWT_SECRET);
      socket.userId = data.user.id;
      next();
    } catch (err) {
      next(new Error("Authentication error: invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id} (user: ${socket.userId})`);

    // Track this socket in the per-user set
    if (!userSocketMap.has(socket.userId)) {
      userSocketMap.set(socket.userId, new Set());
    }
    userSocketMap.get(socket.userId).add(socket.id);

    registerHandlers(io, socket, userSocketMap);

    socket.on("disconnect", () => {
      const sockets = userSocketMap.get(socket.userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          userSocketMap.delete(socket.userId);
        }
      }
    });
  });

  return io;
};

module.exports = { initSocket };
