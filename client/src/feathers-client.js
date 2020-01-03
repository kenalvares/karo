const io = require("socket.io-client");
const feathers = require("@feathersjs/feathers");
const auth = require("@feathersjs/authentication-client");
const socketio = require("@feathersjs/socketio-client");

const socket = io("http://localhost:3030");
const feathersClient = feathers();

feathersClient
  .configure(socketio(socket))
  .configure(auth({ storage: window.localStorage }));

export default feathersClient;
