const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser =  require('body-parser');
const mongoose =  require('mongoose');
const cookieParser = require('cookie-parser');

const initWebRoutes = require('./routes/posts.js');

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors([
    {
      origin: "localhost:3000", //servidor que deseas que consuma o (*) en caso que sea acceso libre
      credentials: true
    }
  ]
));

//para poder trabajar con las cookies
app.use(cookieParser())

//Para eliminar la cache 
app.use(function(req, res, next) {
  if (!req.user)
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

// init all web routes
initWebRoutes(app);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_alert", (data) => {
    console.log(data)
    socket.to(data.room).emit("receive_alert", data);
  });
});

mongoose.connect("mongodb+srv://donationsWeb3:W2UjDkinh5g5dAXv@donations.wzxn6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => server.listen(8080, () => console.log(`Server Running on Port: http://localhost:${8080}`)))
  .catch((error) => console.log(`${error} did not connect`));

// mongoose.set('useFindAndModify', false);

