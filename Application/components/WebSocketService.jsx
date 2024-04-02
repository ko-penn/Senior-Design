let socket = null;
let connectionId = null;
let targetLong = null;
let targetLat = null;

const connect = (url) => {
    return new Promise((resolve, reject) => {
        socket = new WebSocket(url);
        socket.onopen = (Response) => {
            send("me")
            console.log(Response)
            console.log('Connected to WebSocket server');
        };

        socket.onmessage = (message) => {
            let JsonMessage = JSON.parse(message.data);
            console.log(JsonMessage)
            console.log('Recieved message');
            if (JsonMessage.me != null) {
              connectionId = JsonMessage.me.connectionId
              // Will allow for the await call statement to continue once the connectionId is succesfully assigned
              resolve()
            }
            
            resolve(message)
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

const disconnect = () => {
  if (socket && socket.readyState === WebSocket.OPEN) { 
    socket.close()
  } 
}

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

const match = (message) => {
  return new Promise((resolve, reject) => { 
    if (socket && socket.readyState === WebSocket.OPEN) {
      send("{\"action\": \"matchUsers\", \"connectionId\": \"" + connectionId +"\"}")
      
      socket.onmessage = (message) => {
        let JsonMessage = JSON.parse(message.data);

        if (JsonMessage.matchId != null) {
          resolve(JsonMessage.matchId)
        }
      }

    } else {
      reject()
    }
  })
};

// used to wait for cordinates updates
const waitForTargetDirections = () => {
  return new Promise((resolve, reject) => { 
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = (message) => {
        let JsonMessage = JSON.parse(message.data);
        if (JsonMessage.update != null) {
          targetLat = JsonMessage.update.latitude
          targetLat = JsonMessage.update.longitude
          resolve()
        }
      }
    } else {
      reject()
    }
  })
};

const sendCurrentLocation = (latitude, longitude) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      send("{\"action\": \"saveLocation\", \"connectionId\": \"" + connectionId +"\", \"longitude\": \"" + longitude + "\", \"latitude\": \""+ latitude +"\"}")
    }
};

const getTargetInitialCordinates = () => {
  return new Promise((resolve, reject) => { 
    if (socket && socket.readyState === WebSocket.OPEN) {
      send("{\"action\": \"getTarget\", \"connectionId\": \"" + connectionId + "\"}")
    }
    socket.onmessage = (message) => {
      // Just incase if the disconnection happens before the cordinates are received
      if (message.data == "Match disconnected") {
        resolve("Match disconnected")
      } else {
        let JsonMessage = JSON.parse(message.data);
        if (JsonMessage.update != null) {
          targetLat = JsonMessage.update.latitude
          targetLong = JsonMessage.update.longitude
          resolve()
        }
      }
    }
  })
}

const waitForSessionUpdates = () => {
  return new Promise((resolve, reject) => {  
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.onmessage = (message) => {
        if (message.data == "Match disconnected") {
          resolve("Match disconnected")
        } else {
          let JsonMessage = JSON.parse(message.data);
          if (JsonMessage.update != null) {
            targetLat = JsonMessage.update.latitude
            targetLat = JsonMessage.update.longitude
            resolve("Update", targetLat, targetLong)
          }
        }
      }
    } else {
      reject()
    }
  })
}


export { connect, disconnect, send, close, match, sendCurrentLocation, waitForTargetDirections, getTargetInitialCordinates, waitForSessionUpdates, connectionId, targetLat, targetLong };