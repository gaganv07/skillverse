import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email address"]
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ["student", "teacher", "mentor", "school", "organizer", "admin"],
      default: "student"
    },
    avatar: String,
    phone: String,
    schoolName: String,
    district: String,
    state: String,
    bio: String,
    languages: {
      type: [String],
      default: ["English"]
    },
    skills: {
      type: [String],
      default: []
    },
    socialLinks: {
      linkedin: String,
      github: String,
      youtube: String,
      website: String,
      instagram: String
    },
    bookmarks: [
      {
        itemType: {
          type: String,
          enum: ["project", "talent", "student"]
        },
        itemId: mongoose.Schema.Types.ObjectId
      }
    ],
    isVerified: {
      type: Boolean,
      default: false
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    stats: {
      followersCount: { type: Number, default: 0 },
      followingCount: { type: Number, default: 0 },
      projectsCount: { type: Number, default: 0 },
      talentsCount: { type: Number, default: 0 },
      achievementsCount: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function savePassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
