import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
// import { socketService } from "../../../services/SocketService";
// import { io } from "socket.io-client";
import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { DIRECT_CHAT_EVENTS, HttpStatusCode } from "../../../shared/constants/constants";
import { useSocket } from "../../../contexts/SocketContext";
import ChatPage from "../../components/chat/ChatPage";
import { hostService } from "../../../services/HostService";
const Chat = () => {
    const socket = useSocket();
    const [users, setUsers] = useState([]);
    const user = useSelector((state) => state.host.host);
    const handleSendMessage = (userId, content) => {
        // const newMessage: Message = {
        //   _id: Date.now().toString(),
        //   senderId: "current",
        //   content,
        //   sentAt: new Date(),
        //   read: true,
        // };
        console.log(content, userId);
        try {
            // const socket = socketService.instance;
            if (!socket)
                return;
            console.log("before emit");
            socket.emit(DIRECT_CHAT_EVENTS.SEND_MESSAGE, {
                receiverId: userId,
                content,
            });
        }
        catch (error) {
            console.log(error);
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
    const handleMarkAsRead = async (conversationId) => {
        console.log(conversationId);
        if (!user?._id)
            return;
        try {
            const response = await hostService.MarkReadMessage(conversationId, user._id);
            if (response.status === HttpStatusCode.OK) {
                console.log(response);
                const convo = response.data.conversation;
                const conversations = users.map((prev) => prev._id === convo._id
                    ? {
                        ...convo,
                        receiverId: prev.receiverId,
                        firstName: prev.firstName,
                        lastName: prev.lastName,
                    }
                    : prev);
                setUsers(conversations);
            }
        }
        catch (error) {
            console.log(error);
            if (error instanceof Error)
                toast.error(error.message);
        }
        // setUsers((prev) =>
        //   prev.map((user) =>
        //     user._id === userId ? { ...user, unreadCount: 0 } : user
        //   )
        // );
    };
    const updateCoversation = (conversation) => {
        const newConversation = users.map((prev) => prev._id === conversation._id
            ? {
                ...conversation,
                receiverId: prev.receiverId,
                firstName: prev.firstName,
                lastName: prev.lastName,
            }
            : prev);
        setUsers(newConversation);
    };
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
                const response = await hostService.getConverSations(user?._id);
                if (response.status === HttpStatusCode.OK) {
                    console.log("conversation response: ", response);
                    setUsers(response.data.conversations);
                }
            }
            catch (error) {
                console.log("error fetchConversation", error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        };
        fetchConversation();
    }, [user]);
    return (_jsx("div", { className: "h-screen", children: _jsx(ChatPage, { users: users, currentUserId: user?._id, role: user?.role, onSendMessage: handleSendMessage, onMarkAsRead: handleMarkAsRead, updateLastMessage: updateCoversation }) }));
};
export default Chat;
