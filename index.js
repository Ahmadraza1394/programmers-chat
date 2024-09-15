const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/javascript", (req, res) => {
  res.sendFile(__dirname + "/public/javascript.html");
});

app.get("swift", (req, res) => {
  res.sendFile(__dirname + "/public/swift.html");
});

app.get("/css", (req, res) => {
  res.sendFile(__dirname + "/public/css.html");
});

// tech namespace
const tech = io.of("/tech");
// listens for new client connections
tech.on("connection", (socket) => {
  socket.on("join", (data) => {
    socket.join(data.room);
    tech.in(data.room).emit("message", `New user joined ${data.room} room!`);
  });
  //   listens for the message event, which is triggered when a client sends a message. The server receives the message (msg) as a parameter.
  socket.on("message", (data) => {
    // This broadcasts the message to all connected clients
    console.log("message: " + data.msg);
    tech.in(data.room).emit("message", data.msg);
  });
  socket.on("disconnect", () => {
    // for server side
    console.log("user disconnected");
    tech.emit("message", "user disconnected");
  });
});
