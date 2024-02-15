let socket = null;

const connect = (url) => {
    return new Promise((resolve, reject) => {
        socket = new WebSocket(url);

        socket.onopen = (Response) => {
          // TODO: On 
          console.log(Response)
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (message) => {
            console.log(message.data)
            console.log('Recieved message');
        };

        socket.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            reject(error); // Reject the promise if there's an error
        };
    })
};

// format for message input variable:
//{"action": "sendMessage", "message": "Your message that gets send to everyone for now"}
//{"action": "location", "connectionId": "#", "longitude": "#", "latitude": "#"}
const send = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.error('WebSocket connection not open');
  }
};

const close = () => {
  if (socket) {
    socket.close();
  }
};

export { connect, send, close };