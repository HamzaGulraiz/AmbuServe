const express = require('express');
const DB = require('./config');
const userRegister = require('./userRegister');
const driverRegister = require('./driverRegister');
// const userLogin = require('./userLogin');
const app = express();
const jwt = require('jsonwebtoken');
const secretKey = 'secretKey';

DB();

app.use(express.json());

///////////////// user apis ////////////////////////////////
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
  let result = await userRegister.updateOne({email : req.body.email}, {$set: req.body});
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

app.post('/driver/register', async (req, resp) => {
  let data = new driverRegister(req.body);
  let company_email = data.company_email;
  // console.log(email);
  let findEmail = await driverRegister.findOne({company_email});
  if (findEmail) {
    console.log('Email already exists');
    return resp.send('Email already exists');
  }
  // // console.log('posted', data.email);

  const token = jwt.sign({data}, secretKey, {expiresIn: '10000s'});
  data.token = token;
  console.log('jwt =>', data);
  const result = await data.save();
  return resp.send(result);
});


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

const PORT = 8000;

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});
