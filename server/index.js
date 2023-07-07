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

app.put('/update/:_id', async (req, resp) => {
  console.log(req.params);
  let data = await userRegister.updateOne(req.params, {$set: req.body});
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

const PORT = 8000;

app.listen(PORT, () => {
  console.log('Server is running on live port ' + PORT);
});
