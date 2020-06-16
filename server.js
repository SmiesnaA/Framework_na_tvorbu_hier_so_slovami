const http = require("http");
const express = require("express");

const webpack = require("webpack");
const webpackConfig = require("./webpack.config");
const compiler = webpack(webpackConfig);

// Create the app, setup the webpack middleware
const app = express();
app.use(
  require("webpack-dev-middleware")(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  })
);
app.use(require("webpack-hot-middleware")(compiler));

// You probably have other paths here
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.use("/", express.static(__dirname));

const server = new http.Server(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8080;

server.listen(PORT, function (err) {
  if (err) throw err;
  console.log("listening on port 8080");
});

SOCKET_LIST = [];
var waiting = [];
var count = 0;

io.on("connection", function (client) {
  count++;
  SOCKET_LIST.push(client);
  io.sockets.emit("broadcast", count);

  client.on("newConnection", function () {
    if (count > 1) {
      var rnd = 0;
      while (SOCKET_LIST[rnd] == client) {
        if (count > 1) {
          rnd = Math.floor(Math.random() * count);
        } else {
          return;
        }
      }
      SOCKET_LIST[rnd].emit("getGraph");
      waiting.push(client);
    }
  });

  client.on("graph", function (data) {
    for (let s of waiting) {
      s.emit("newGraph", data);
    }
  });

  client.on("gameDone", function (data) {
    io.sockets.emit("gameDone", data);
  });

  client.on("clickedNode", function (data) {
    var node = JSON.parse(data);
    io.sockets.emit("clickedNode", [node.id, node.name]);
  });

  client.on("correctClickedNodes", function (data) {
    io.sockets.emit("correctClickedNodes", data);
  });

  client.on("clickedNodeAddEdge", function (data) {
    var node = JSON.parse(data);
    io.sockets.emit("clickedNodeAddEdge", [node.id, node.name]);
  });


  client.on("clickedRemoveAddEdge", function (data) {
    var node = JSON.parse(data);
    io.sockets.emit("clickedNodeRemoveEdge", [node.str1, node.str2]);
  });

  client.on("position", function (data) {
    var node = JSON.parse(data);
    io.sockets.emit("position", [node.id, node.x, node.y]);
  });

  client.on("correct", function (data) {
    var d = JSON.parse(data);
    io.sockets.emit("correct", d.name);
  });

  client.on("incorrect", function () {
    io.sockets.emit("incorrect");
  });

  client.on("addNode", function (data) {
    var d = JSON.parse(data);
    io.sockets.emit("addNode", [d.name, d.editable]);
  });

  client.on("addChildNode", function (data) {
    var d = JSON.parse(data);
    io.sockets.emit("addChildNode", [d.name1, d.name2, d.editable]);
  });

  client.on("editNode", function (data) {
    var d = JSON.parse(data);
    io.sockets.emit("editNode", [d.id, d.name]);
  });

  client.on("removeNode", function (data) {
    var d = JSON.parse(data);
    io.sockets.emit("removeNode", d.id);
  });

  client.on("addEdge", function (data) {
    var d = JSON.parse(data);
    io.sockets.emit("addEdge", [d.name1, d.name2]);
  });

  client.on("addEdgeToFirstNode", function (data) {
    io.sockets.emit("addEdgeToFirstNode");
  });

  client.on("addEdgeToPrevNode", function (data) {
    io.sockets.emit("addEdgeToPrevNode");
  });

  client.on("rndGame", function (data) {
    io.sockets.emit("rndGame");
  });

  client.on("newGame", function (data) {
    io.sockets.emit("newGame");
  });

  client.on("disconnect", function () {
    SOCKET_LIST = SOCKET_LIST.filter((s) => s != client);
    count--;
    io.sockets.emit("disconnected", count);
  });
});
