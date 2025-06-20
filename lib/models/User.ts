import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'tutor'],
    required: true,
  },
  bio: {
    type: String,
    default: '',
  },
  subjectsTaught: [{
    type: String,
  }],
  pricePerHour: {
    type: Number,
    default: 0,
  },
  experience: {
    type: String,
    default: '',
  },
  qualifications: {
    type: String,
    default: '',
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    timeSlots: [{
      startTime: String,
      endTime: String,
      available: {
        type: Boolean,
        default: true,
      }
    }],
  }],
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  profileImage: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);