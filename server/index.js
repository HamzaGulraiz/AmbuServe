require("dotenv").config();
const express = require("express");
const DB = require("./config");
const userRegister = require("./userRegister");
const driverRegister = require("./driverRegister");
const driverOnline = require("./driverOnline");
const driverActivity = require("./driverActivity");
const jwt = require("jsonwebtoken");
const app = express();
const secretKey = "secretKey";
const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer(app);
const io = socketIO(server);

const users = {};
const drivers = {};

io.on("connection", (socket) => {
  socket.on("user_request", (data) => {
    console.log("Data from user =====>", data);

    const driverIds = Object.keys(drivers);
    if (driverIds.length > 0) {
      console.log("found drivers");
      for (const driverId of driverIds) {
        const driverSocket = drivers[driverId];
        driverSocket.emit("new_request", data);
      }
    } else {
      socket.emit("no_drivers_available", "No drivers available");
    }
  });

  socket.on("cancel_request", (data) => {
    const userSocket = users[data.userId];
    if (userSocket) {
      console.log("Data from user =====>", data);
      userSocket.emit("canceled", data);
    }
  });

  socket.on("ride_completed", (data) => {
    const userSocket = users[data.userId];
    if (userSocket) {
      userSocket.emit("ride_completed", data);
    }
  });

  socket.on("driver_response", (data) => {
    console.log("driver response=====>", data);
    const userSocket = users[data.userId];
    if (userSocket) {
      userSocket.emit("driver_response", data);
    }
  });

  socket.on("identify", (data) => {
    if (data.type === "user") {
      console.log("A new user connected");
      users[data.userId] = socket;
    } else if (data.type === "driver") {
      console.log("A new driver connected");
      drivers[data.driverId] = socket;
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");

    const userIndex = Object.values(users).indexOf(socket);
    if (userIndex !== -1) {
      delete users[Object.keys(users)[userIndex]];
    }

    const driverIndex = Object.values(drivers).indexOf(socket);
    if (driverIndex !== -1) {
      delete drivers[Object.keys(drivers)[driverIndex]];
    }
  });
});

DB();

app.use(express.json());

///////////////// user apis //////////////////////////
app.post("/create", async (req, resp) => {
  let data = new userRegister(req.body);
  let email = data.email;
  let findEmail = await userRegister.findOne({ email });
  if (findEmail) {
    console.log("Email already exists");
    return resp.send("Email already exists");
  }

  const token = jwt.sign({ data }, secretKey, { expiresIn: "10000s" });
  data.token = token;
  console.log("jwt =>", data);
  const result = await data.save();
  return resp.send(result);
});

app.get("/login", async (req, resp) => {
  const { email, password } = req.query;
  console.log({ email, password });
  let data = await userRegister.findOne({ email });
  if (data == null) {
    resp.send("Email does not exist");
  } else {
    if (password != data.password) {
      resp.send("Password does not match");
    } else {
      resp.send(data);
    }
  }
});

app.put("/update", async (req, resp) => {
  const { email, password } = req.body;
  let result = await userRegister.updateOne(
    { email: req.body.email },
    { $set: req.body }
  );
  /////////////////////////////////////////////////////
  let data = await userRegister.findOne({ email });
  if (data == null) {
    resp.send("Email does not exist");
  } else {
    if (password != data.password) {
      resp.send("Password does not match");
    } else {
      resp.send(data);
    }
  }
});

app.get("/search/:key", async (req, resp) => {
  let data = await userRegister.find({
    $or: [
      {
        email: { $regex: req.params.key },
      },
    ],
  });
  resp.send(data);
});

app.get("/list", async (req, resp) => {
  let data = await userRegister.find();
  console.log("found data", data);
  resp.send(data);
});

app.delete("/delete/:_id", async (req, resp) => {
  console.log(req.params);
  let data = await userRegister.deleteOne(req.params);
  resp.send(data);
});

///////////// drivers api///////////////////////////

app.post("/driver/create", async (req, resp) => {
  let data = new driverRegister(req.body);
  let contact = data.driver_contact;

  let findContact = await driverRegister.findOne({ contact });
  if (findContact) {
    return resp.send("Contact already exists");
  }
  const token = jwt.sign({ data }, secretKey, { expiresIn: "10000s" });
  data.token = token;
  console.log("jwt =>", data);
  const result = await data.save();
  return resp.send(result);
});

app.get("/driver/login", async (req, resp) => {
  const { driver_name, password } = req.query;
  console.log({ driver_name, password });
  let data = await driverRegister.findOne({ driver_name });
  console.log(data);
  if (data == null) {
    resp.send("Email does not exist");
  } else {
    if (password != data.password) {
      resp.send("Password does not match");
    } else {
      resp.send(data);
    }
  }
});
////////////////////////////////////////////////////////

///////////////////////////driver activity////////////////////////////
app.post("/driver/activity", async (req, resp) => {
  // console.log(req.body);
  let data = new driverActivity(req.body);
  // console.log("wtf", data);
  const result = await data.save();
  return resp.send(result);
});

app.get("/driver/rides/:driver_contact", async (req, res) => {
  try {
    const driver_contact = req.params.driver_contact;
    console.log(driver_contact);
    const drivers = await driverActivity.find({
      driver_contact: driver_contact,
    });

    res.status(200).json({ drivers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving drivers", error: error.message });
  }
});
/////////////////////////////////////////////////////////////////////////////

///////////////////////////online driver////////////////////////////
app.post("/driver/online", async (req, resp) => {
  let data = new driverOnline(req.body);
  let company_email = data.company_email;
  console.log(company_email);
  let findEmail = await driverOnline.findOne({ company_email });
  if (findEmail) {
    console.log("Driver already Online");
    return resp.send("Driver already Online");
  } else {
    const result = await data.save();
    return resp.send("driver is online");
  }
});

app.delete("/driver/delete/:token", async (req, resp) => {
  let data = await driverOnline.deleteOne(req.params);
  resp.send(data);
});

app.get("/driver/list", async (req, resp) => {
  let data = await driverOnline.find();
  console.log("found data", data);
  resp.send(data);
});
/////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
