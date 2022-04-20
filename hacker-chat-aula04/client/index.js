#!/usr/bin/env node

/*

  chmod +x index.js

*/

/*
npm i -g @paulo930/hacker-chat-client

-- remover todos
CLIENT
npm unlink -g @paulo930/hacker-chat-client
npm unpublish --force

SERVER
heroku apps:delete

hacker-chat --username cassiel --room sala01

node index.js \
    --username erickwendel \
    --room sala01 \
    --hostUri localhost
*/

import Events from 'events';
import CliConfig from './src/cliConfig.js';
import EventManager from './src/eventManager.js';
import SocketClient from './src/socket.js';
import TerminalController from './src/terminalController.js';

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componentEmitter = new Events();
const socketClient = new SocketClient(config);
await socketClient.initialize();
const eventManager = new EventManager({ componentEmitter, socketClient });
const events = eventManager.getEvents();
socketClient.attachEvents(events);

const data = {
  roomId: config.room,
  userName: config.username,
};
eventManager.joinRoomAndWaitForMessages(data);

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);
