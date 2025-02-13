require( "reflect-metadata");
const app = require("./app");
const http = require("http");
const normalizePort = require("normalize-port");
var port = normalizePort(process.env.Port || "9000");
const port_kill=require('kill-port');
app.set("port", port);
var server = http.createServer(app);
server.listen(port, () => {
  console.log("server is listening really");
});
server.on("error", onError);
server.on("listening", onListening);
function onError(error) {
  if (error.syscall !== "listen") 
  {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code){
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      port_kill('9000','tcp');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
function onListening() {

  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Server Running on Port:", port);
}
