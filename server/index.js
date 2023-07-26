require('dotenv').config();
const express = require('express');
const DB = require('./config');
const userRegister = require('./userRegister');
const driverRegister = require('./driverRegister');
const driverOnline = require('./driverOnline');
// const userLogin = require('./userLogin');
const app = express();
const jwt = require('jsonwebtoken');
const secretKey = 'secretKey';

////////////////////////////////Socket//////////////////////////////////////

const connectedUsers = [];
const connectedDrivers = [];

const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({port: 8080});

wss.on('connection', (ws, request) => {
  const identifier = request.headers['sec-websocket-protocol'];

  if (identifier === 'user') {
    // connectedUsers.push(ws);
    console.log(`A new USER connected with identifier: ${identifier}`);
  } else if (identifier === 'driver') {
    // console.log('driverss ====>', ws, request);
    console.log(`A new DRIVER connected with identifier: ${identifier}`);
    connectedDrivers.push(ws);
  }

  ws.on('message', message => {
    const receivedMessage = JSON.parse(message);
    console.log('Received message:', receivedMessage);
    if (receivedMessage.type === 'user') {
      // Store user connection in the array
      connectedUsers.push({userId: receivedMessage.userId, ws});
      // console.log(`User ${receivedMessage.userId} is connected.`);
      if (connectedDrivers.length < 1) {
        console.log(
          `Received ${receivedMessage.type} message:`,
          receivedMessage,
          'no drivers',
        );
        setTimeout(() => {
          ws.send(`No drivers available`, 'error');
        }, 2000);
      } else {
        sendRequestToAllDrivers(receivedMessage);
      }
    } else if (receivedMessage.type === 'driver') {
      console.log('Received response from driver:', receivedMessage);
      // Find user connection based on user ID and send the response back to the user
      if (receivedMessage.status === 'canceled') {
        const userConnection = connectedUsers.find(
          user => user.userId === receivedMessage.userId,
        );
        if (userConnection) {
          userConnection.ws.send(JSON.stringify(receivedMessage));
          console.log('sent response from driver: canceled');
        } else {
          console.log(
            `User with ID ${receivedMessage.userId} not found or disconnected.`,
          );
        }
      } else if (receivedMessage.status === 'active') {
      }
    } else {
      console.log('Invalid message format:', receivedMessage);
    }
  });

  ws.on('close', () => {
    console.log(`${identifier} disconnected`);
    // Remove user connection from the array
    if (identifier === 'user') {
      const index = connectedUsers.findIndex(user => user.ws === ws);
      if (index !== -1) {
        console.log(`User ${connectedUsers[index].userId} disconnected.`);
        connectedUsers.splice(index, 1);
      }
    }
  });
});

// Function to send a request message to all connected drivers
function sendRequestToAllDrivers(requestData) {
  const message = JSON.stringify(requestData);
  connectedDrivers.forEach(driverWs => {
    driverWs.send(message);
  });
}

////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 8000;

DB();

app.use(express.json());

///////////////// user apis //////////////////////////
app.post('/create', async (req, resp) => {
  let data = new userRegister(req.body);
  let email = data.email;
  let findEmail = await userRegister.findOne({email});
  if (findEmail) {
    console.log('Email already exists');
    return resp.send('Email already exists');
  }
  // console.log('posted', data.email);

  const token = jwt.sign({data}, secretKey, {expiresIn: '10000s'});
  data.token = token;
  console.log('jwt =>', data);
  const result = await data.save();
  return resp.send(result);
});

app.get('/login', async (req, resp) => {
  const {email, password} = req.query;
  console.log({email, password});
  let data = await userRegister.findOne({email});
  if (data == null) {
    resp.send('Email does not exist');
  } else {
    if (password != data.password) {
      resp.send('Password does not match');
    } else {
      resp.send(data);
    }
  }
});

app.put('/update', async (req, resp) => {
  const {email, password} = req.body;
  // console.log(email);
  // let data = await userRegister.findOne({email});
  // console.log(data);
  let result = await userRegister.updateOne(
    {email: req.body.email},
    {$set: req.body},
  );
  /////////////////////////////////////////////////////
  let data = await userRegister.findOne({email});
  if (data == null) {
    resp.send('Email does not exist');
  } else {
    if (password != data.password) {
      resp.send('Password does not match');
    } else {
      resp.send(data);
    }
  }
});

app.get('/search/:key', async (req, resp) => {
  let data = await userRegister.find({
    $or: [
      {
        email: {$regex: req.params.key},
      },
      // {brand: {$regex: req.params.key}}
    ],
  });
  resp.send(data);
});

app.get('/list', async (req, resp) => {
  let data = await userRegister.find();
  console.log('found data', data);
  resp.send(data);
});

app.delete('/delete/:_id', async (req, resp) => {
  console.log(req.params);
  let data = await userRegister.deleteOne(req.params);
  resp.send(data);
});

///////////// drivers api///////////////////////////

app.post('/driver/create', async (req, resp) => {
  let data = new driverRegister(req.body);
  let email = data.company_email;

  let findEmail = await driverRegister.findOne({email});
  if (findEmail) {
    console.log('Email already exists ');
    return resp.send('Email already exists');
  }
  // console.log('posted', data.email);
  const token = jwt.sign({data}, secretKey, {expiresIn: '10000s'});
  data.token = token;
  console.log('jwt =>', data);
  const result = await data.save();
  return resp.send(result);
});

// app.post('/driver/register', async (req, resp) => {
//   let data = new driverRegister(req.body);
//   let company_email = data.company_email;
//   // console.log(email);
//   let findEmail = await driverRegister.findOne({company_email});
//   if (findEmail) {
//     console.log('Email already exists');
//     return resp.send('Email already exists');
//   }
//   // // console.log('posted', data.email);

//   const token = jwt.sign({data}, secretKey, {expiresIn: '10000s'});
//   data.token = token;
//   console.log('jwt =>', data);
//   const result = await data.save();
//   return resp.send(result);
// });

app.get('/driver/login', async (req, resp) => {
  const {driver_name, password} = req.query;
  // console.log(req.params);
  console.log({driver_name, password});
  let data = await driverRegister.findOne({driver_name});
  console.log(data);
  if (data == null) {
    resp.send('Email does not exist');
  } else {
    if (password != data.password) {
      resp.send('Password does not match');
    } else {
      resp.send(data);
    }
  }
});
////////////////////////////////////////////////////////

///////////////////////////online driver////////////////////////////
app.post('/driver/online', async (req, resp) => {
  let data = new driverOnline(req.body);
  let company_email = data.company_email;
  console.log(company_email);
  let findEmail = await driverOnline.findOne({company_email});
  if (findEmail) {
    console.log('Driver already Online');
    return resp.send('Driver already Online');
  } else {
    const result = await data.save();
    return resp.send('driver is online');
  }
  // // console.log('posted', data.email);
});

app.delete('/driver/delete/:token', async (req, resp) => {
  // console.log(req.params);
  let data = await driverOnline.deleteOne(req.params);
  resp.send(data);
});

app.get('/driver/list', async (req, resp) => {
  let data = await driverOnline.find();
  console.log('found data', data);
  resp.send(data);
});

/////////////////////////////////////////////////////////////////////////////

//////////////socket connection //////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
  console.log('Server is running on live port ' + PORT);
});
