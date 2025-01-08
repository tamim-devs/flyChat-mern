import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async(req,res) =>{
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.error("Error in getUserForSidebar:", error.message);
    res.status(500).json({message: "Internal server error"})
  }
}

export const getMessages = async(req,res)=> {
  try {
    const { id:userToChatId } = req.parms
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        {senderId: myId, reciverId: userToChatId},
        {senderId: userToChatId, reciverId: myId}
      ]
    })

    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in getMessage controller :", error.message);
    res.status(500).json({message: "Internal Server Error"})
    
  }
}

export const sendMessage = async(req,res)=>{
try {
  const {text,image} = req.body;
  const { id: reciverId} = req.parms;
  const senderId = req.user._id;

  let imageUrl;
  if(image){
    // Upload 64 image to clodinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      imageUrl: imageUrl,
    });
    await newMessage.save();

    // todo: realtime functionality goes here => socekt.io
    res.status(201).json(newMessage)
} catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    console.log("Error in sendMessage controller: ", error.message);
    
}
}