const mongoose = require("mongoose");
const deliveryBoySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  location: {
    type: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  status: String,
  vehicleType: String,
  licensePlate: String,
  shiftInfo: {
    startTime: String,
    endTime: String,
  },
});

const collectionName = "DeliveryBoy";

module.exports = mongoose.model(collectionName, deliveryBoySchema);
