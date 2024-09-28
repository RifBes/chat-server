const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

// инициализация
const app = express();
const router = require("./route");
const { addUser, findUser, getRoomUsers, removeUser } = require("./users");

app.use(cors({ origin: "*" }));
app.use(router);

// создали сервер
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // заход в комнату
  socket.on("join", ({ username, room }) => {
    // присоединяемся в комнату
    socket.join(room);

    // дастаём юзера
    const { user, isExist } = addUser({ username, room });
    const userMessage = isExist
      ? `It's you again, ${user.username}`
      : `Hey, ${user.username}`;

    // отдаем сообщение о привествикии
    socket.emit("message", {
      data: { user: { username: "Admin" }, message: userMessage },
    });

    // сообщение другимм юзерам о новичке
    socket.broadcast.to(user.room).emit("message", {
      data: {
        user: { username: "Admin" },
        message: `${user.username} has join`,
      },
    });

    io.to(user.room).emit("Room", {
      data: { room: user.room, users: getRoomUsers(user.room) },
    });
  });

  // отправка сообщений
  socket.on("sendMessage", ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.room).emit("message", { data: { user, message } });
    }
  });

  // покидаем чат
  socket.on("leftRoom", ({ params }) => {
    const user = removeUser(params);

    if (user) {
      const { room, username } = user;
      io.to(room).emit("message", {
        data: {
          user: { username: "Admin" },
          message: `${username} has left the chat`,
        },
      });
      io.to(user.room).emit("Room", {
        data: { room: room, users: getRoomUsers(room) },
      });
    }
  });

  io.on("disconnect", () => {
    console.log("Disconnected");
  });
});

// слушаем его, запуск
server.listen(5000, () => {
  console.log("server is running");
});
