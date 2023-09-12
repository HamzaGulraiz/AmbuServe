// useSocket.js
// import {useEffect, useState} from 'react';
// import io from 'socket.io-client';

// const useSocket = socketUrl => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io(socketUrl, {transports: ['websocket']});
//     newSocket.emit('identify', {type: 'driver', driverId: newSocket.id});
//     setSocket(newSocket);

//     return () => {
//       if (newSocket) {
//         newSocket.disconnect();
//       }
//     };
//   }, [socketUrl]);

//   return socket;
// };

// export default useSocket;
