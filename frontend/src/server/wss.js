const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const port = 8181;
const DBPort = 2121;
const connections = {};
const users = {};
const usernamesList = [];
let topic = null;

// May need this for a more complicated request from the client but for now keeping it out.
// const broadcastUsers = () => {
//     Object.keys(connections).forEach((id) => {
//         const socket = connections[id];
//         socket.emit('userData', users); // sent via named event
//     });
// };

const getTopic = async () => {
    try {
        const res = await fetch(`http://localhost:${DBPort}/api/searches/topic`);
        if (!res.ok) throw new Error('Failed to fetch searches');
        const data = await res.json();
        return data.artist;
        
    } catch (err) {
        console.log(err);
        return null;
    }

}

// Kick off logic here
(async () => {
  try {
    topic = await getTopic(); // async API call
  } catch (err) {
    console.error('Failed to fetch topic:', err);
  }
})();

const sendUsername = (username, id) => {
    const socket = connections[id];
    socket.emit('getUsername', username);
    console.log(`${username} has been sent to the client!`)
}

// Used for all broadcast messages at the moment 
const broadcastMessages = () => {

    // Build a flat array
    const allMessages = Object.values(users).flatMap(user =>
        user.messages.map(msg => ({
        username: user.username,
        message: msg.message,
        timestamp: msg.timestamp,
    })));

    // Broadcast to all users
    Object.keys(connections).forEach((id) => {
        const socket = connections[id];
        socket.emit('messageData', allMessages); // sent via named event
    });
};

const broadcastTopic = async (topic, id) => {
    console.log(topic);
    // Broadcast to connected user 
    const socket = connections[id];
    socket.emit('topicData', topic);
    once = true;
}

const handleMessage = (data, uniqueID) => {
  const timestamp = new Date().toLocaleTimeString();
  const fullMessage = { message : data.message, timestamp : timestamp };

  const user = users[uniqueID];
  user.messages.push(fullMessage);

  broadcastMessages();
};

const handleClose = (uniqueID) => {
  const username = users[uniqueID]?.username;
  delete connections[uniqueID];
  delete users[uniqueID];

  // remove user from userList
  const userIndex = usernamesList.indexOf(username);
  usernamesList.splice(userIndex, 1);

  console.log(`${username} disconnected`);
  // console.log(usernamesList);
  broadcastMessages();
};

function createUsername(){
    if(usernamesList.length === 0){
        return 'User 1';
    }
    else{
        // find length
        let x = 1;
        // work way up to length of list and if not found then add this first
        while(x <= usernamesList.length){
            if(!usernamesList.includes(`User ${x}`)){
                return `User ${x}`;
            }
            x = x + 1;
        }
        return `User ${usernamesList.length + 1}`;
    }   
}

io.on('connection', (socket) => {
    // get randomly created topic only once on startup

    // create unique ID
    const uniqueID = uuidv4();
    // create username
    const username = createUsername();
    usernamesList.push(username);
    // console.log(usernamesList);

    console.log(`New connection: ${uniqueID} (${username})`);

    connections[uniqueID] = socket;

    users[uniqueID] = {
        username,
        messages: [],
    };
    socket.on('requestUsername', () => sendUsername(username, uniqueID));
    // only do this once
    socket.on('message', (data) => handleMessage(data, uniqueID));
    socket.on('disconnect', () => handleClose(uniqueID));
    broadcastMessages();
    broadcastTopic(topic, uniqueID);
});

server.listen(port, () => {
  console.log(`Socket.IO server listening on port ${port}`);
});
