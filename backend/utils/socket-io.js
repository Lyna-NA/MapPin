let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        methods: "GET, POST, PUT, DELETE",
        allowedHeaders: "Authorization, Content-Type",
        CustomOrigin: "http://localhost:3000",
        // credentials: true,
      },
    });
    io.on("connection", (socket) => {
      console.log("Result");
      console.log(`socket ${socket.id} connected`);
    });
    return io;
  },
  getIO: () => {
    // if(io == undefined || io == null){
    //   console.log('Socket initialization failed!');
    // }else{
    //   console.log('Socket is ready');
    // }
    return io;
  },
};