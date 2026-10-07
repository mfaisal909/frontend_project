
import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { server } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import socket from "../../utils/socket";
import { format } from "timeago.js";

const DashboardMessages = () => {
  const { seller, isLoading } = useSelector((state) => state.seller);

  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const [open, setOpen] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    socket.connect();

    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });

    return () => {
      socket.off("getMessage");
    };
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
          {
            withCredentials: true,
          }
        );

        setConversations(resonse.data.conversations);
      } catch (error) {
        // console.log(error);
      }
    };

    getConversation();
  }, [seller, messages]);

  useEffect(() => {
    if (seller) {
      const sellerId = seller?._id;

      socket.emit("addUser", sellerId);

      socket.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => member !== seller?._id
    );

    const online = onlineUsers.find(
      (user) => user.userId === chatMembers
    );

    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat?._id}`
        );

        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member.id !== seller._id
    );

    socket.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message)
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socket.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: newMessage,
          lastMessageId: seller._id,
        }
      )
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setImages(reader.result);
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const imageSendingHandler = async (e) => {
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socket.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e,
    });

    try {
      await axios
        .post(`${server}/message/create-new-message`, {
          images: e,
          sender: seller._id,
          text: newMessage,
          conversationId: currentChat._id,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="m-5 h-[85vh] w-[90%] overflow-y-scroll rounded-2xl border border-gray-200 bg-white shadow-sm">
      {!open && (
        <>
          <div className="border-b border-gray-200 px-6 py-5">
            <h1 className="text-center text-2xl font-bold text-gray-800 md:text-3xl">
              All Messages
            </h1>
            <p className="mt-1 text-center text-sm text-gray-500">
              Manage your customer conversations
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {conversations &&
              conversations.map((item, index) => (
                <MessageList
                  data={item}
                  key={index}
                  index={index}
                  setOpen={setOpen}
                  setCurrentChat={setCurrentChat}
                  me={seller._id}
                  setUserData={setUserData}
                  userData={userData}
                  online={onlineCheck(item)}
                  setActiveStatus={setActiveStatus}
                  isLoading={isLoading}
                />
              ))}
          </div>
        </>
      )}

      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          setMessages={setMessages}
          handleImageUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
  isLoading,
}) => {
  console.log(data);

  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };

  const [active, setActive] = useState(0);

  useEffect(() => {
    const userId = data.members.find((user) => user != me);

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [me, data]);

  return (
    <div
      className={`group flex w-full cursor-pointer items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-gray-50 ${
        active === index ? "bg-gray-50" : "bg-white"
      }`}
      onClick={(e) =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative shrink-0">
        <img
          src={`${user?.avatar?.url}`}
          alt={user?.name || "User"}
          className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
        />

        <div
          className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
            online ? "bg-green-500" : "bg-gray-300"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h1 className="truncate text-base font-semibold text-gray-800 md:text-lg">
            {user?.name}
          </h1>

          <AiOutlineArrowRight className="shrink-0 text-gray-300 transition group-hover:text-gray-600" />
        </div>

        <p className="mt-1 truncate text-sm text-gray-500 md:text-base">
          {!isLoading && data?.lastMessageId !== user?._id
            ? "You:"
            : user?.name?.split(" ")[0] + ": "}{" "}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  scrollRef,
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
}) => {
  return (
    <div className="flex min-h-full flex-col bg-gray-50">
      {/* Message Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-4 shadow-sm md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            <img
              src={`${userData?.avatar?.url}`}
              alt={userData?.name || "User"}
              className="h-12 w-12 rounded-full border border-gray-200 object-cover md:h-14 md:w-14"
            />

            <div
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                activeStatus ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-gray-800 md:text-lg">
              {userData?.name}
            </h1>

            <p
              className={`text-xs font-medium ${
                activeStatus ? "text-green-600" : "text-gray-400"
              }`}
            >
              {activeStatus ? "Active Now" : "Offline"}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close conversation"
          onClick={() => setOpen(false)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
        >
          <AiOutlineArrowRight size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="h-[65vh] overflow-y-auto px-3 py-4 md:px-5">
        {messages &&
          messages.map((item, index) => {
            const isSeller = item.sender === sellerId;

            return (
              <div
                key={index}
                className={`my-3 flex w-full ${
                  isSeller ? "justify-end" : "justify-start"
                }`}
                ref={scrollRef}
              >
                {!isSeller && (
                  <img
                    src={`${userData?.avatar?.url}`}
                    className="mr-2 h-9 w-9 shrink-0 self-end rounded-full object-cover md:mr-3 md:h-10 md:w-10"
                    alt={userData?.name || "User"}
                  />
                )}

                <div className="max-w-[75%] md:max-w-[65%]">
                  {item.images && (
                    <img
                      src={`${item.images?.url}`}
                      alt="Message attachment"
                      className="mb-2 max-h-[300px] w-auto max-w-full rounded-xl border border-gray-200 object-cover shadow-sm"
                    />
                  )}

                  {item.text !== "" && (
                    <div
                      className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                        isSeller
                          ? "rounded-br-md bg-gray-900 text-white"
                          : "rounded-bl-md bg-white text-gray-800 border border-gray-200"
                      }`}
                    >
                      <p className="break-words text-sm leading-6 md:text-base">
                        {item.text}
                      </p>
                    </div>
                  )}

                  <p
                    className={`pt-1 text-[11px] text-gray-400 ${
                      isSeller ? "text-right" : "text-left"
                    }`}
                  >
                    {format(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* Send Message */}
      <form
        aria-required={true}
        className="border-t border-gray-200 bg-white p-3 md:p-4"
        onSubmit={sendMessageHandler}
      >
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 shadow-sm transition focus-within:border-gray-400 focus-within:bg-white">
          <div className="shrink-0">
            <input
              type="file"
              name=""
              id="image"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            <label
              htmlFor="image"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-200 hover:text-gray-800"
            >
              <TfiGallery size={19} />
            </label>
          </div>

          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full border-0 bg-transparent px-2 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:ring-0 md:text-base"
          />

          <button
            type="submit"
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition hover:bg-gray-700 active:scale-95"
          >
            <AiOutlineSend size={19} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
