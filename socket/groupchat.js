module.exports = function(io) {

    io.on('connection', (socket) => {

        socket.on('join', (data) => {
            socket.join(data.room);
        });

        socket.on('createMessage', (message) => {
            socket.join(message.room);
            io.to(message.room).emit('newMessage', {
                text: message.text,
                room: message.room,
            });
        });
        
    });
}