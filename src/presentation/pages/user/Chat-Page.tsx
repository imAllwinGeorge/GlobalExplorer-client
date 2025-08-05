import { useEffect } from "react";
// import { socketService } from "../../../services/SocketService";
// import { io } from "socket.io-client";
import { useState } from "react";
import type { Conversation, ConversationResponse, Message } from "../../../shared/types/global";
import ChatPage from "../../components/chat/ChatPage";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import { DIRECT_CHAT_EVENTS } from "../../../shared/constants/constants";
import { useSocket } from "../../../contexts/SocketContext";
// import toast from "react-hot-toast";

export interface User {
  _id: string;
  firstName: string;
  avatar: string;
  isOnline: boolean;
}

export interface ChatUser extends User {
  lastMessage?: Message;
  unreadCount: number;
}

const Chat = () => {
  const socket = useSocket();
  const [users, setUsers] = useState<ConversationResponse[]>([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleSendMessage = (userId: string, content: string) => {
    // const newMessage: Message = {
    //   _id: Date.now().toString(),
    //   senderId: "current",
    //   content,
    //   sentAt: new Date(),
    //   read: true,
    // };
    console.log(content,userId)
    try {
      // const socket = socketService.instance;
      if(!socket) return;

      socket.emit(DIRECT_CHAT_EVENTS.SEND_MESSAGE,{
        receiverId: userId,
        content
      })

      
    } catch (error) {
      console.log(error)
    }

    // setMessages((prev) => ({
    //   ...prev,
    //   [userId]: [...(prev[userId] || []), newMessage],
    // }));

    // Update last message for user
    // setUsers((prev) =>
    //   prev.map((user) =>
    //     user._id === userId ? { ...user, lastMessage: newMessage } : user
    //   )
    // );
  };

  const handleMarkAsRead = async (conversationId: string) => {
    console.log(conversationId)
    if(!user?._id) return 
   try {
     const response = await userService.MarkReadMessage(conversationId, user._id);
    if(response.status === 200){
      console.log(response)
      const convo = response.data.conversation as Conversation
      const conversations = users.map((prev) => prev._id === convo._id ? {...convo, receiverId: prev.receiverId, firstName: prev.firstName, lastName: prev.lastName}: prev)
      setUsers(conversations)
    }
   } catch (error) {
    console.log(error);
    if(error instanceof Error) toast.error(error.message)
   }
    
    // setUsers((prev) =>
    //   prev.map((user) =>
    //     user._id === userId ? { ...user, unreadCount: 0 } : user
    //   )
    // );
  };

  const updateCoversation = (conversation: Conversation) => {
    const newConversation = users.map((prev) => prev._id === conversation._id ? {...conversation, receiverId: prev.receiverId, firstName: prev.firstName, lastName: prev.lastName}: prev)
    setUsers(newConversation )
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //     const socket = socketService.instance;
  //     console.log("chat page socket:  ", socket);
  //     // const socket = io("http://localhost:3000")

  //     // socket.on("connect", () => {
  //     console.log("connected to server: ", socket);

  //     socket.emit("test:event", { hello: "world" });

  //     socket.on("test:response", (data) => {
  //       console.log("Server response: ", data);
  //     });
  //     // });
  //   }, 1000);

  //   //     socket.emit("test:event", {hello: "world"});

  //   //         socket.on("test:response", (data) => {
  //   //             console.log("Server response: ", data);
  //   //         });
  // }, []);

  useEffect(() => {
    const fetchConversation = async function () {
      try {
        const response = await userService.getConverSations(
          user?._id as string
        );

        if (response.status === 200) {
          console.log("conversation response: ", response);
          setUsers(response.data.conversations as ConversationResponse[])
        }
      } catch (error) {
        console.log("error fetchConversation", error);
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    };

    fetchConversation();
  },[user]);
  return (
    <div className="h-screen">
      
        <ChatPage
        users={users as ConversationResponse[]}
        currentUserId={user?._id as string}
        onSendMessage={handleSendMessage}
        onMarkAsRead={handleMarkAsRead}
        updateLastMessage={updateCoversation}
      />
      
    </div>
  );
};

export default Chat;
