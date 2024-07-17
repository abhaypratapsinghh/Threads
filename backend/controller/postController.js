import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res.status(404).json({
        error: "Postedby and text is required",
      });
    }

    const user = await User.findById(postedBy);

    if (user._id.toString() != req.user._id.toString()) {
      return res.status(404).json({
        error: "Not authorized to create post",
      });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(404).json({
        error: "text limit exceeded",
      });
    }

    let image = [];
    for (let i = 0; i < img.length; i++) {
      const uploadedProfile = await cloudinary.uploader.upload(img[i]);
      image.push(uploadedProfile.secure_url);
    }

    const newPost = new Post({ postedBy, text, image });
    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Error occured in createPostController" + err.message,
    });
    console.error(err.message);
  }
};

const getPost = async (req, res) => {
  try {
    const pId = req.params.pId || "";

    const post = await Post.findById(pId)
      .populate("postedBy")
      .populate({
        path: "replies",
        populate: {
          path: "postedBy",
        },
      });

    if (!post) {
      return res.status(404).json({
        error: "No post found",
      });
    } else {
      return res.status(200).json({
        message: "Post retrieved successfully",
        post,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Error occured in createPostController" + err.message,
    });
    console.error(err.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const pId = req.params.pId || "";

    const post = await Post.findById(pId);

    if (!post) {
      return res.status(404).json({
        error: "Post Not Found",
      });
    }

    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        error: "Not Authorised to delete ",
      });
    }

    const img = post.image;
    if (img.length > 0) {
      img.map(async (image) => {
        const publicId = image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
       }
      )
    }
    
   

    await Post.findByIdAndDelete(pId);

    await Post.updateMany({ replies: pId }, { $pull: { replies: pId } });

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: "Error occured in deletePostController" + err.message,
    });
    console.error(err.message);
  }
};

const likePost = async (req, res) => {
  try {
    const pId = req.params.pId;

    const userId = req.user._id;

    const post = await Post.findById(pId);

    if (!post) {
      return res.status(404).json({
        error: "Post Not Found",
      });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      await Post.updateOne({ _id: pId }, { $pull: { likes: userId } });
      return res.status(200).json({
        message: "Post Unliked successfully",
      });
    } else {
      await Post.updateOne({ _id: pId }, { $push: { likes: userId } });
      return res.status(200).json({
        message: "Post liked successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Error occured in deletePostController" + err.message,
    });
    console.error(err.message);
  }
};

const replyPost = async (req, res) => {
  try {
    const pId = req.params.pId;

    let post = await Post.findById(pId);

    if (!post) {
      return res.status(404).json({
        error: "Post Not Found",
      });
    }
    const { postedBy, text, img } = req.body;

    if (!postedBy || !text) {
      return res.status(404).json({
        error: "Postedby and text is required",
      });
    }

    const user = await User.findById(postedBy);

    if (user._id.toString() != req.user._id.toString()) {
      return res.status(404).json({
        error: "Login to comment on the post",
      });
    }

    const maxLength = 500;
    if (text.length > maxLength) {
      return res.status(404).json({
        error: "text limit exceeded",
      });
    }

    let image = [];
    for (let i = 0; i < img.length; i++) {
      const uploadedProfile = await cloudinary.uploader.upload(img[i]);
      image.push(uploadedProfile.secure_url);
    }

    const Reply = new Post({ postedBy, text, image, parentPost: pId });
    await Reply.save();
    await Post.updateOne({ _id: pId }, { $push: { replies: Reply._id } });

    post = await Post.findById(pId)
      .populate("postedBy")
      .populate({
        path: "replies",
        populate: {
          path: "postedBy",
        },
      });

    res.status(201).json({
      message: "replied successfully",
      post,
      Reply,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error occured in replying" + err.message,
    });
    console.error(err.message);
  }
};

const feedPost = async (req, res) => {
  try {
    const feedPosts = await Post.find({ parentPost:null }).populate('postedBy').sort({
      createdAt: -1,
    });

    res.status(200).json({
      error: "Feed retrieved successfully",
      feedPosts,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error occured in loading feed" + err.message,
    });
    console.error(err.message);
  }
};

const userPosts = async (req, res) => {
  try {
    const userId = req.params.uId || "";

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
    }

    const feedPosts = await Post.find({ postedBy: userId, parentPost: null })
      .populate("postedBy")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Feed retrieved successfully",
      feedPosts,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error occured in loading feed" + err.message,
    });
    console.error(err.message);
  }
};
const userReplies = async (req, res) => {
  try {
    const userId = req.params.uId.toString()||"";

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        error: "User not found",
      });
    }

    const feedPosts = await Post.find({
      postedBy: userId,
      parentPost: { $ne: null },
    })
      .populate("postedBy")
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: "Feed retrieved successfully",
      feedPosts,
    });
  } catch (err) {
    res.status(500).json({
      error: "Error occured in loading feed" + err.message,
    });
    console.error(err.message);
  }
};
export {
  createPost,
  getPost,
  deletePost,
  likePost,
  replyPost,
  feedPost,
  userPosts,
  userReplies
};
