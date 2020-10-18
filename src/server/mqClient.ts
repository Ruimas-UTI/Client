/* 
 *  This is the default license template.
 *  
 *  File: mqClient.ts
 *  Author: siik
 *  Copyright (c) 2020 siik
 *  
 *  To edit this license information: Press Ctrl+Shift+P and press 'Create new License Template...'.
 */

export interface ZMQMessage {
  action: String;
  data?: JSON;
}

const zmq = require("zeromq"),
  sock = zmq.socket("push");

export function initMQ() {

  sock.connect("tcp://127.0.0.1:5555");
  console.log("MQ bound.");
}

export async function sendMessage(message: ZMQMessage) {
  console.debug(message);
  sock.send(JSON.stringify(message));
}
