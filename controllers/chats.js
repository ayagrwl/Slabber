'use-strict'

module.exports = function(){
    return {
        SetRouting: function(router){
            router.get('/chatroom/:roomid', (req, res, next) => {
                var roomid = req.params.roomid;
                res.render('../views/chatroom.ejs', {room: roomid, roomName: 'Chat Room '+roomid});
            });
            router.get('/chat/:chatid', (req, res, next) => {
                var chatid = req.params.chatid;
                res.render('../views/chat.ejs', {chat: chatid, friendName: 'Friend'});
            });     
        }

    }
}
