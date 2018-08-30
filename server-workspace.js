const net = require('net');
const fs = require('fs');
const chatLogFile = __dirname + '/chatlog.txt';

let userList = [];
let count = 0;

let server = net.createServer(client => {

    client.write('Welcome to the chat server!');
    count++
    client.chatUserID = count;
    client.setEncoding('utf8');
    userList.push(client);

    write(`Guest${client.chatUserID} has connected`);

    client.on('data', data => {
        write(`Guest${client.chatUserID}: ${data}`);
    });

    client.on('close', () => {
        write(`Guest${client.chatUserID} has disconnected`);
        userList.splice((client.chatUserID -1), 1);
    });
    
    function write(message) {
        userList.forEach((user) => {
            if (user !== client) {
                console.log(message);
                user.write(message);
                fs.appendFile(chatLogFile, message + '\n', (err) => {
                    if (err) console.log(err);
                });
            }
            if (userList.length === 1) {
                console.log(message);
            }
        });
    }
}).listen(5000);

console.log('Listening on port 5000');