import React, { useEffect } from "react";
import { useChatStore } from "./../store/useChatStore.js";
import ChatHeader from "./ChatHeader.jsx";
import MessageInput from "./MessageInput.jsx";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import { useAuthStore } from "../store/useAuthStore.js";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css"; // import styles

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="w-screen flex flex-col">
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <div className="flex-1 flex flex-col overflow-auto">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${
                message.senderId === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image-avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    className="rounded-full w-full h-full"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">{message.createdAt}</time>
              </div>
              <div className="chat-bubble flex flex-col bg-transparent">
                {message.image && (
                  <Zoom>
                    <img
                      src={message.image}
                      alt="Attachment"
                      className="rounded-lg max-w-full w-[80%] sm:w-[60%] md:w-[50%] lg:w-[40%] h-auto mb-2 bg-transparent object-cover mx-auto border-0"
                      loading="lazy"
                    />
                  </Zoom>
                )}
                {message.text && (
                  <p className="text-2xl">{message.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
