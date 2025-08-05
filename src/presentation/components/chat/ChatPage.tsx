import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Smile,
} from "lucide-react";
import Input from "../Input";
// import { Avatar } from "../../../components/ui/avatar"
import { Button } from "../ui/button";
import type {
  Conversation,
  ConversationResponse,
  Message,
  SearchUsers,
} from "../../../shared/types/global";
import toast from "react-hot-toast";
import { userService } from "../../../services/UserService";
import { DIRECT_CHAT_EVENTS } from "../../../shared/constants/constants";
import { useSocket } from "../../../contexts/SocketContext";

interface ChatPageProps {
  users: ConversationResponse[];
  currentUserId: string;
  onSendMessage: (userId: string, content: string) => void;
  onMarkAsRead: (userId: string) => void;
  updateLastMessage: (conversation: Conversation) => void;
}

export default function ChatPage({
  users,
  currentUserId,
  onSendMessage,
  onMarkAsRead,
  updateLastMessage,
}: ChatPageProps) {
  const socket = useSocket();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchedUsers, setSearchedUsers] = useState<SearchUsers[]>([]);
  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedUser =
    users.find((user) => user.participants.some((p) => p === selectedUserId)) ||
    searchedUsers.find((user) => user._id === selectedUserId);

  const getMessages = async (conversationId: string) => {
    try {
      const response = await userService.getMessages(conversationId);
      if (response.status === 200) {
        console.log(response);
        setMessages((response.data.messages as Message[]).reverse());
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleSelectedConversation = (conversation: ConversationResponse) => {
    const targetUserId =
      currentUserId === conversation.receiverId
        ? conversation.lastSender
        : conversation.receiverId;
    setSelectedUserId(targetUserId as string);
    console.log(targetUserId, conversation);
    setShowSidebar(false);
    onMarkAsRead(conversation._id);
    getMessages(conversation._id);
  };

  const handleUserSelect = (conversationId: string) => {
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

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatLastMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return formatTime(date);
    if (days === 1) return "Yesterday";
    if (days < 7) return date.toLocaleDateString("en-US", { weekday: "short" });
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!searchQuery.trim()) return;
      try {
        const response = await userService.searchUser(searchQuery);
        if (response.status === 200) {
          console.log("user search result: ", response);
          setSearchedUsers(response.data.userSearch as SearchUsers[]);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    // const socket = socketService.instance;
    if (!socket) return;

    socket.on(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE, (data) => {
      console.log("Message received:", data);
      setMessages((prev) => [...prev, data.message]);
      updateLastMessage(data.conversation);
    });

    return () => {
      socket.off(DIRECT_CHAT_EVENTS.RECEIVE_MESSAGE);
    };
  }, [socket, updateLastMessage]);

  useEffect(() => {
    if (!socket) return;

    socket.on(DIRECT_CHAT_EVENTS.SEND_MESSAGE, (data) => {
      setMessages((prev) => [...prev, data.message]);
      updateLastMessage(data.conversation);
    });

    return () => {
      socket.off(DIRECT_CHAT_EVENTS.SEND_MESSAGE);
    };
  }, [socket, updateLastMessage]);

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Users List */}
      <motion.div
        className={`${
          showSidebar ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-80 border-r border-gray-200`}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <motion.div
              key={user._id}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                selectedUserId === user._id ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={() => handleSelectedConversation(user)}
              whileHover={{ backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {/* <Avatar className="w-12 h-12">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="rounded-full" />
                  </Avatar> */}
                  {/* {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )} */}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {user.firstName + " " + user.lastName}
                    </h3>
                    {user.lastMessage && (
                      <span className="text-xs text-gray-500">
                        {formatLastMessageTime(user.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">
                      {user.lastMessage || "No messages yet"}
                    </p>
                    {user.unreadCount[currentUserId] > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {user.unreadCount[currentUserId]}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {searchedUsers.map((user) => (
            <motion.div
              key={user._id}
              className={`p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
                selectedUserId === user._id ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={() => handleUserSelect(user._id)}
              whileHover={{ backgroundColor: "#f9fafb" }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {/* <Avatar className="w-12 h-12">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="rounded-full" />
                  </Avatar> */}
                  {/* {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )} */}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">
                      {user.firstName + " " + user.lastName}
                    </h3>
                    {/* {user.lastMessage && (
                      <span className="text-xs text-gray-500">{formatLastMessageTime(user.lastMessage.timestamp)}</span>
                    )} */}
                  </div>
                  {/* <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 truncate">{user.lastMessage?.content || "No messages yet"}</p>
                    {user.unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {user.unreadCount}
                      </span>
                    )}
                  </div> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chat Area */}
      <div
        className={`${showSidebar ? "hidden" : "flex"} md:flex flex-col flex-1`}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden"
                    onClick={handleBackToSidebar}
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  <div className="relative">
                    {/* <Avatar className="w-10 h-10">
                      <img
                        src={selectedUser.avatar || "/placeholder.svg"}
                        alt={selectedUser.name}
                        className="rounded-full"
                      />
                    </Avatar> */}
                    {/* {selectedUser.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )} */}
                  </div>
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {selectedUser.firstName + " " + selectedUser.lastName}
                    </h2>
                    {/* <p className="text-sm text-gray-500">{selectedUser.isOnline ? "Online" : "Offline"}</p> */}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message: Message) => (
                  <motion.div
                    key={message._id}
                    className={`flex ${
                      message.senderId === currentUserId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === currentUserId
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId === currentUserId
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {formatLastMessageTime(message.sentAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-gray-500">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
