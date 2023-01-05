const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const ngrok = require('ngrok');
const port = process.env.PORT || 3000;
//middleware
app.use(express.static('public'));
app.set('view engine', 'ejs');

//routes
app.get("/", (req, res) => {
    res.render("index");
})
//creating unique id by uuid and rediricting the route
app.get("/uuid", (req, res) => {
    res.redirect("/" + uuidv4());
})
//socket connection
io.on('connection', socket => {
    //joining the room in socket 
    socket.on('join-room', roomId => {
        room = io.sockets.adapter.rooms.get(roomId);
        var roomSize = 0;
        //setting the roomSize
        if (room) {
            roomSize = room.size;
        }
        //if roomSize is less than 2 join user to to the room
        if (roomSize < 2) {
            socket.join(roomId);
            socket.broadcast.to(roomId).emit('user-connected');
            socket.on('disconnect', () => {
                socket.broadcast.to(roomId).emit('user-disconnected');
            })
            socket.on('can-play', () => {
                socket.broadcast.to(roomId).emit('can-play');
            })
            socket.on('clicked', (id) => {
                socket.broadcast.to(roomId).emit('clicked', id);
            })
        }
        //if roomsize is greateer that two emit that room is full
         else {
            socket.emit('full-room');
        }
    })
})
//getting the id from req.params rendering ejs file
app.get("/:room", (req, res) => {
    res.render("room", {
        roomId: req.params.room
    });
})
//connecting the ngrok 
server.listen(port, () => console.log(`Server running on port ${port}`));
(async function(){
    const url = await ngrok.connect({
        proto:'http',
        addr:port,
        authtoken:'2ItcO1pxPHwKl81EJuLodWGgOVi_5sd5GCq3BQbR1a2jJuFr3'
    });
    console.log(url);
})();