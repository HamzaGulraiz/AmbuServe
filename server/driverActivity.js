const mongoose = require("mongoose");
const driverActitivySchema = mongoose.Schema({
  driver_contact: String,
  driver_name: String,
  company_email: String,
  company_name: String,
  vehicle_number: String,
  office_address: String,
  type: String,
  full_name: String,
  email: String,
  contact: String,
  emergency_contact: String,
  cnic: String,
  pickup_location: String,
  dropOff_location: String,
  distance_covered: String,
  total_time: String,
  date: String,
});

module.exports = mongoose.model("driver_activities", driverActitivySchema);
