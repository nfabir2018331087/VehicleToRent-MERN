const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  reservationId: {
    type: String,
    required: true,
    unique: true
  },
  pickupDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    required: true
  },
  vehicleType: {
    type: String,
    required: true
  },
  vehicle: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  additionalCharges: {
    collisionDamageWaiver: {
      type: Boolean,
      default: false
    },
    liabilityInsurance: {
      type: Boolean,
      default: false
    },
    rentalTax: {
      type: Boolean,
      default: false
    }
  },
  duration: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reservation = mongoose.model('Reservation', ReservationSchema);

module.exports = Reservation;
