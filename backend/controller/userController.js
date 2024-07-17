import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/helper/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    
    if (!name || !email || !username || !password) {
      return res.status(400).json({
        error: "Fill all the required fields",
      });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashPassword,
    });

    await newUser.save();

    if (newUser) {
      res.status(201).json(
      { message:"Signed up successfully"}
      );
    } else {
      res.status(400).json({
        error: "invalid credentials",
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Error in signUp " });
    console.log("Error in signUp for user " + err.message);
  }
};

const signinUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const checkPassword = await bcrypt.compare(password, user?.password || "");

    if (!user || !checkPassword) {
      return res.status(400).json({
        error: "invalid credentials",
      });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message:"Signed in successfully",
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
      followers: user.followers,
      following: user.following
    });
  } catch (err) {
    res.status(400).json({
      error: "Error occurred while signing in",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });

    res.status(200).json({ message: "user logged out successfully" });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
    console.log("Error in logout: " + err.message);
  }
};
const followUnfollowUser = async (req, res) => {
  try {
    const id = req.params.uId;
    const userToModify = await User.findById(id);

    let currentUser = await User.findById(req.user._id.toString());

    if (id == req.user._id.toString()) {
      return res.status(400).json({
        error: "You are not allowed to follow Yourself",
      });
    }

    if (!userToModify || !currentUser) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      currentUser=await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } },{new: true});
      await User.findByIdAndUpdate(id, { $pull: { followers: id } });
      return res.status(200).json({
        message: "Follow/Unfollow list updated successfully",
        currentUser
      });
    } else {
      currentUser=await User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: id },
        },
        { new: true }
      );
      await User.findByIdAndUpdate(id, { $push: { followers: id } });
    }

    return res.status(200).json({
      message: "Follow/Unfollow list updated successfully",
      currentUser,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
    console.log("Error in follow/Unfollow: " + err.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.uId;
    const userId = req.user._id;

    if (id !== userId.toString()) {
      return res.status(403).json({
        error: "You cannot update another user's profile",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const { name, username, email, bio } = req.body;
    let { password, profilePic } = req.body;

    const updateFields = {};

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        const publicId = user.profilePic.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const uploadedProfile = await cloudinary.uploader.upload(profilePic);
      updateFields.profilePic = uploadedProfile.secure_url;
    }

    if (name) updateFields.name = name;
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (bio) updateFields.bio = bio;

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error occurred while updating user profile",
    });
    console.log("Error in updating user: " + err.message);
  }
};


const profileUser = async (req, res) => {
  try {
    const uName = req.params.uName;

    if (uName === ":") {
      const user = await User.aggregate([
        {
          $project: {
            username: 1,
            numberOfFollowers: { $size: "$followers" },
            name: 1,
            followers: 1,
            profilePic: 1,
            _id:1,
          },
        },
        {
          $sort: { numberOfFollowers: -1 },
        },
        {
          $limit: 50,
        },
      ]);

      if (user) {
        return res.status(200).json({
          message: "profile info fetched successfully",
          user,
        });
      } else {
        return res.status(400).json({
          error: "User not found"
        });
      }
    }
    else {
      const user = await User.find({
        $or: [
          { username: { $regex: `^${uName}`, $options: "i" } },
          { name: { $regex: `^${uName}`, $options: "i" } },
        ],
      }).select("-password")

      if (user) {
        return res.status(200).json({
          message: "profile info fetched successfully",
          user,
        });
      } else {
        return res.status(400).json({
          error: "User not found",
        });
      }
    }
    
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
    console.log("Error in fetching user profile: " + err.message);
  }
};


export {
  signupUser,
  signinUser,
  logoutUser,
  followUnfollowUser,
  updateUser,
  profileUser,
};
