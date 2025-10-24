import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, ArrowLeft, MoreVertical, Phone, Video, Smile, } from "lucide-react";
import Input from "../ui/Input";
// import { Avatar } from "../../../components/ui/avatar"
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import { DIRECT_CHAT_EVENTS, HttpStatusCode, ROLE, } from "../../../shared/constants/constants";
import { useSocket } from "../../../contexts/SocketContext";
import Picker from "emoji-picker-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppHooks";
import { AuthAPI } from "../../../services/AuthAPI";
import { logout } from "../../store/slices/authSlice";
import { hostLogout } from "../../store/slices/hostSlice";
import { adminLogout } from "../../store/slices/adminSlice";
export default function ChatPage({ users, currentUserId, role, onSendMessage, onMarkAsRead, updateLastMessage, }) {
    const socket = useSocket();
    const [showPicker, setShowPicker] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showSidebar, setShowSidebar] = useState(true);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const messageEndRef = useRef(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const filteredUsers = users.filter((user) => user.firstName.toLowerCase().includes(searchQuery.toLowerCase()));
    const selectedUser = users.find((user) => user.participants.some((p) => p === selectedUserId)) ||
        searchedUsers.find((user) => user._id === selectedUserId);
    const getMessages = async (conversationId) => {
        try {
            const response = await userService.getMessages(conversationId);
            if (response.status === HttpStatusCode.OK) {
                console.log(response);
                setMessages(response.data.messages.reverse());
            }
        }
        catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    };
    const handleSelectedConversation = (conversation) => {
        const targetUserId = currentUserId === conversation.receiverId
            ? conversation.lastSender
            : conversation.receiverId;
        setSelectedUserId(targetUserId);
        console.log(targetUserId, conversation);
        setShowSidebar(false);
        onMarkAsRead(conversation._id);
        getMessages(conversation._id);
    };
    const handleUserSelect = (conversationId) => {
        setSelectedUserId(conversationId);
        setShowSidebar(false); // Hide sidebar on mobile when chat is selected
        // onMarkAsRead(conversationId);
        getMessages(conversationId);
    };
    const handleSendMessage = () => {
        if (newMessage.trim() && selectedUserId) {
            console.log(newMessage);
            onSendMessage(selectedUserId, newMessage.trim());
            // console.log(
            //   "handle send message selelcted user : ",
            //   messages[0].conversationId
            // );
            // getMessages(messages[0].conversationId)
            setNewMessage("");
        }
    };
    // const handleSendMessageToConversation = () => {
    //   if(newMessage.trim() && selectedConversation) {
    //     onSendMessage(selectedConversation.receiverId, newMessage.trim())
    //     setNewMessage("")
    //   }
    // }
    const handleBackToSidebar = () => {
        setShowSidebar(true);
        setSelectedUserId(null);
    };
    const formatTime = (date) => {
        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };
    const formatLastMessageTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0)
            return formatTime(date);
        if (days === 1)
            return "Yesterday";
        if (days < 7)
            return date.toLocaleDateString("en-US", { weekday: "short" });
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    function scroll() {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        }
    }
    useEffect(() => {
        const handler = setTimeout(async () => {
            if (!searchQuery.trim())
                return;
            try {
                const response = await userService.searchUser(searchQuery);
                if (response.status === HttpStatusCode.OK) {
                    console.log("user search result: ", response);
                    setSearchedUsers(response.data.userSearch);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        }, 200);
        return () => clearTimeout(handler);
    }, [searchQuery]);
    useEffect(() => {
        if (!socket)
            return;
        const authAPI = new AuthAPI();
        scroll();
        socket.on(DIRECT_CHAT_EVENTS.SEND_MESSAGE, (data) => {
            setMessages((prev) => [...prev, data.message]);
            updateLastMessage(data.conversation);
            scroll();
        });
        socket.on(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, (data) => {
            console.log("Message received:", data);
            setMessages((prev) => [...prev, data.message]);
            updateLastMessage(data.conversation);
            scroll();
        });
        socket?.on(DIRECT_CHAT_EVENTS.DISCONNECT, async () => {
            console.log("socket diconnect triggered.....");
            try {
                const response = await authAPI.logout(role);
                if (response.status === HttpStatusCode.OK) {
                    if (role === ROLE.USER) {
                        dispatch(logout());
                        navigate("/login");
                    }
                    else if (role === ROLE.HOST) {
                        dispatch(hostLogout());
                        navigate("/host/login");
                    }
                    else if (role === ROLE.ADMIN) {
                        dispatch(adminLogout());
                        navigate("/admin/login");
                    }
                }
            }
            catch (error) {
                console.log(error);
                if (error instanceof Error) {
                    toast.error(error.message);
                }
            }
        });
        return () => {
            socket.off(DIRECT_CHAT_EVENTS.SEND_MESSAGE);
            socket.off(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE);
        };
    }, [socket, updateLastMessage, dispatch, navigate, role]);
    return (_jsxs("div", { className: "flex h-screen ", children: [_jsxs(motion.div, { className: `${showSidebar ? "flex" : "hidden"} md:flex flex-col w-full md:w-80 border-r border-gray-200`, initial: { x: -300 }, animate: { x: 0 }, transition: { duration: 0.3 }, children: [_jsxs("div", { className: "p-4 border-b border-gray-200", children: [_jsx("h1", { className: "text-xl font-semibold mb-3", children: "Messages" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" }), _jsx(Input, { placeholder: "Search conversations...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "pl-10" })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto", children: [filteredUsers.map((user) => (_jsx(motion.div, { className: `p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${selectedUserId === user._id ? "bg-blue-50 border-blue-200" : ""}`, onClick: () => handleSelectedConversation(user), whileHover: { backgroundColor: "#f9fafb" }, whileTap: { scale: 0.98 }, children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "relative" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium text-gray-900 truncate", children: user.firstName + " " + user.lastName }), user.lastMessage && (_jsx("span", { className: "text-xs text-gray-500", children: formatLastMessageTime(user.lastMessageAt) }))] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm text-gray-500 truncate", children: user.lastMessage || "No messages yet" }), user.unreadCount[currentUserId] > 0 && (_jsx("span", { className: "bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center", children: user.unreadCount[currentUserId] }))] })] })] }) }, user._id))), searchedUsers.map((user) => (_jsx(motion.div, { className: `p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${selectedUserId === user._id ? "bg-blue-50 border-blue-200" : ""}`, onClick: () => handleUserSelect(user._id), whileHover: { backgroundColor: "#f9fafb" }, whileTap: { scale: 0.98 }, children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "relative" }), _jsx("div", { className: "flex-1 min-w-0", children: _jsx("div", { className: "flex items-center justify-between", children: _jsx("h3", { className: "font-medium text-gray-900 truncate", children: user.firstName + " " + user.lastName }) }) })] }) }, user._id)))] })] }), _jsx("div", { className: `${showSidebar ? "hidden" : "flex"} md:flex flex-col flex-1`, children: selectedUser ? (_jsxs(_Fragment, { children: [_jsx("div", { className: " flex flex-col shrink-0 p-4 border-b border-gray-200 bg-white", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "md:hidden", onClick: handleBackToSidebar, children: _jsx(ArrowLeft, { className: "w-4 h-4" }) }), _jsx("div", { className: "relative" }), _jsx("div", { children: _jsx("h2", { className: "font-medium text-gray-900", children: selectedUser.firstName + " " + selectedUser.lastName }) })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "ghost", size: "sm", children: _jsx(Phone, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => navigate(`/video/${selectedUserId}`), children: _jsx(Video, { className: "w-4 h-4" }) }), _jsx(Button, { variant: "ghost", size: "sm", children: _jsx(MoreVertical, { className: "w-4 h-4" }) })] })] }) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 ", children: [_jsx(AnimatePresence, { children: messages.map((message) => (_jsx(motion.div, { className: `flex ${message.senderId === currentUserId
                                            ? "justify-end"
                                            : "justify-start"}`, initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.3 }, children: _jsxs("div", { className: `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === currentUserId
                                                ? "bg-blue-500 text-white"
                                                : "bg-gray-100 text-gray-900"}`, children: [_jsx("p", { className: "text-sm", children: message.content }), _jsx("p", { className: `text-xs mt-1 ${message.senderId === currentUserId
                                                        ? "text-blue-100"
                                                        : "text-gray-500"}`, children: formatLastMessageTime(message.sentAt) })] }) }, message._id))) }), _jsx("div", { ref: messageEndRef })] }), showPicker && (_jsx("div", { onMouseLeave: () => setShowPicker(false), children: _jsx(Picker, { lazyLoadEmojis: true, width: "70%", onEmojiClick: (emojiObject) => setNewMessage((prev) => prev + emojiObject.emoji) }) })), _jsx("div", { className: " shrink-0 p-4 border-t border-gray-200 bg-white ", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setShowPicker((prev) => !prev), children: _jsx(Smile, { className: "w-4 h-4" }) }), _jsx(Input, { placeholder: "Type a message...", value: newMessage, onChange: (e) => setNewMessage(e.target.value), onKeyPress: (e) => e.key === "Enter" && handleSendMessage(), className: "flex-1" }), _jsx(Button, { onClick: handleSendMessage, disabled: !newMessage.trim(), children: _jsx(Send, { className: "w-4 h-4" }) })] }) })] })) : (_jsx("div", { className: "flex-1 flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Search, { className: "w-8 h-8 text-gray-400" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-900 mb-2", children: "Select a conversation" }), _jsx("p", { className: "text-gray-500", children: "Choose from your existing conversations or start a new one" })] }) })) })] }));
}
