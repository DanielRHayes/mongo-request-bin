
let io;
module.exports = {
    setServer: (server) => {
        io = require("socket.io")(server);
        io.on("connection", socket => {
            console.log("socket connected");
        });
    },
    getIo: () => io, 
    emit: (...arg) => {
        if(io != undefined) {
            io.emit(...arg);
        }
        else {
            console.log("io is undefined");
        }
    }
}