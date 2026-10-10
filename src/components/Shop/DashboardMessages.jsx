
import axios from "axios";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { server, resolveImageUrl } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineArrowRight,
  AiOutlinePlus,
  AiOutlineSend,
} from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import { toast } from "react-toastify";
import socket from "../../utils/socket";
import { acquireSocket, registerSocketUser } from "../../utils/socketConnection";
import { format } from "timeago.js";

// Rendered whenever a thread has no usable avatar (deleted account, missing
// upload, unresolved path), so the <img> never gets an empty src.
const FALLBACK_AVATAR =
  "https://dummyimage.com/128x128/e5e7eb/6b7280?text=C";

const avatarSrc = (avatar) =>
  resolveImageUrl(avatar?.url || avatar) || FALLBACK_AVATAR;

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
  const [open, setOpen] = useState(false);
  // The shop can open a thread first: the picker lists the buyers who ordered
  // from it, because those are the people this inbox is about.
  const [showNewChat, setShowNewChat] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  // Bumped whenever a live message lands outside the open thread, so the list
  // refetches and the preview line catches up without a manual refresh.
  const [refreshTick, setRefreshTick] = useState(0);
  const scrollRef = useRef(null);
  // Read inside the socket callbacks, which must not be re-registered every
  // time the open thread changes.
  const currentChatRef = useRef(null);

  useEffect(() => {
    // The connection is shared with the global seller notifier, so this only
    // takes a reference: closing the inbox must not drop the owner's live
    // connection on the rest of the site.
    const release = acquireSocket();

    const onMessage = (data) => {
      setArrivalMessage({
        sender: data.senderId,
        receiverId: data.receiverId,
        text: data.text,
        images: data.images,
        conversationId: data.conversationId,
        createdAt: Date.now(),
      });
    };

    socket.on("getMessage", onMessage);

    return () => {
      socket.off("getMessage", onMessage);
      release();
    };
  }, []);

  // Kept in a ref so the socket callbacks above can read the open thread
  // without being re-registered whenever it changes.
  useEffect(() => {
    currentChatRef.current = currentChat ?? null;
  }, [currentChat]);

  useEffect(() => {
    if (!arrivalMessage) return;

    // One browser can hold a seller and a buyer session on the same socket;
    // receiverId says which of them this message was actually addressed to,
    // so the other session must ignore it entirely.
    if (
      arrivalMessage.receiverId &&
      String(arrivalMessage.receiverId) !== String(seller?._id)
    ) {
      return;
    }

    // A live message belongs to the open thread only when the ids line up.
    // `conversationId` is sent by both sides, but an event that predates it is
    // still accepted through the member check below.
    const chat = currentChatRef.current;

    if (!chat?._id || !chat.members.includes(arrivalMessage.sender)) {
      setRefreshTick((tick) => tick + 1);
      return;
    }

    if (
      arrivalMessage.conversationId &&
      arrivalMessage.conversationId !== chat._id
    ) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: arrivalMessage.sender,
        text: arrivalMessage.text,
        images: arrivalMessage.images,
        createdAt: arrivalMessage.createdAt,
      },
    ]);
  }, [arrivalMessage, seller?._id]);

  useEffect(() => {
    // Without a signed-in seller the id would be undefined and the request
    // would come back empty, which is indistinguishable from "no threads".
    if (!seller?._id) return;

    let cancelled = false;

    const getConversation = async () => {
      try {
        const resonse = await axios.get(
          `${server}/conversation/get-all-conversation-seller/${seller._id}`,
          {
            withCredentials: true,
          }
        );

        if (cancelled) return;

        setConversations(resonse.data.conversations || []);
      } catch (error) {
        console.log(error);
      }
    };

    getConversation();

    return () => {
      cancelled = true;
    };
  }, [seller, messages, refreshTick]);

  useEffect(() => {
    if (!seller?._id) return;

    // Refcounted alongside the global notifier's own registration of the same
    // id, so leaving this page does not un-list the shop.
    const releaseUser = registerSocketUser(seller._id);
    const onUsers = (data) => {
      setOnlineUsers(Array.isArray(data) ? data : []);
    };

    socket.on("getUsers", onUsers);

    return () => {
      socket.off("getUsers", onUsers);
      releaseUser();
    };
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
    // currentChat is undefined until a thread is opened, so requesting here
    // would hit /get-all-messages/undefined.
    if (!currentChat?._id) return;

    let cancelled = false;

    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`
        );

        if (!cancelled) setMessages(response.data.messages || []);
      } catch (error) {
        console.log(error);
      }
    };

    getMessage();

    return () => {
      cancelled = true;
    };
  }, [currentChat]);

  // Buyers of this shop, fetched while the picker is open so the list is never
  // held in state for a session in which it is never shown.
  useEffect(() => {
    if (!showNewChat) return;

    let cancelled = false;

    const getCustomers = async () => {
      setCustomersLoading(true);

      try {
        const response = await axios.get(
          `${server}/order/get-customers-of-shop`,
          { withCredentials: true }
        );

        if (!cancelled) setCustomers(response.data.customers || []);
      } catch {
        if (!cancelled) setCustomers([]);
      } finally {
        if (!cancelled) setCustomersLoading(false);
      }
    };

    getCustomers();

    return () => {
      cancelled = true;
    };
  }, [showNewChat]);

  // Opens (or reuses) the thread with the chosen buyer and jumps straight into
  // it, the same way clicking a row in the list does.
  const startChatWith = async (customer) => {
    try {
      const response = await axios.post(
        `${server}/conversation/start-conversation-seller`,
        { userId: customer._id },
        { withCredentials: true }
      );

      const conversation = response.data?.conversation;

      if (!conversation?._id) return;

      setConversations((prev) =>
        prev.some((item) => item._id === conversation._id)
          ? prev
          : [conversation, ...prev]
      );
      setCurrentChat(conversation);
      setUserData(customer);
      setActiveStatus(
        onlineUsers.some((user) => user.userId === customer._id)
      );
      setMessages([]);
      setNewMessage("");
      setCustomerSearch("");
      setShowNewChat(false);
      setOpen(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not start the conversation"
      );
    }
  };

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();

    const text = newMessage.trim();

    // An empty string would still go out over the socket and show the other
    // side a bubble with no content, while nothing is written to the database.
    if (!text || !currentChat?._id || !seller?._id) return;

    const message = {
      sender: seller._id,
      text,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socket.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text,
      conversationId: currentChat._id,
    });

    try {
      const response = await axios.post(
        `${server}/message/create-new-message`,
        message,
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, response.data.message]);
      await updateLastMessage(text);
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Could not send the message"
      );
    }
  };

  const updateLastMessage = async (text) => {
    socket.emit("updateLastMessage", {
      lastMessage: text,
      lastMessageId: seller._id,
    });

    try {
      await axios.put(
        `${server}/conversation/update-last-message/${currentChat._id}`,
        {
          lastMessage: text,
          lastMessageId: seller._id,
        },
        { withCredentials: true }
      );

      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    // Reset lets the same file be picked again after a failed upload.
    e.target.value = "";

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        imageSendingHandler(reader.result);
      }
    };

    reader.readAsDataURL(file);
  };

  const imageSendingHandler = async (image) => {
    if (!currentChat?._id || !seller?._id) return;

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id
    );

    socket.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: image,
      conversationId: currentChat._id,
    });

    try {
      const response = await axios.post(
        `${server}/message/create-new-message`,
        {
          images: image,
          sender: seller._id,
          text: "",
          conversationId: currentChat._id,
        },
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, response.data.message]);
      await updateLastMessageForImage();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Could not send the image"
      );
    }
  };

  const updateLastMessageForImage = async () => {
    socket.emit("updateLastMessage", {
      lastMessage: "Photo",
      lastMessageId: seller._id,
    });

    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      },
      { withCredentials: true }
    );
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // The session is restored once on page load, so there is a moment where the
  // seller id is not known yet. Rendering earlier would dereference it.
  if (!seller?._id) {
    return (
      <div className="m-4 flex h-[85vh] w-[calc(100%-2rem)] items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm md:m-6 md:w-[calc(100%-3rem)]">
        <p className="text-sm text-gray-500">Loading your inbox...</p>
      </div>
    );
  }

  return (
    <div className="m-4 h-[85vh] w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:m-6 md:w-[calc(100%-3rem)]">
      {!open && (
        <>
          <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-5 py-5">
            <h1 className="text-center flex-1 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">
              All Messages
            </h1>

            <button
              type="button"
              onClick={() => setShowNewChat(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
            >
              <AiOutlinePlus size={16} />
              New chat
            </button>
          </div>

          {/* All messages list */}
          <div className="h-[calc(85vh-81px)] overflow-y-auto">
            {!isLoading && (!conversations || conversations.length === 0) ? (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <span className="text-2xl">💬</span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                  No conversations yet
                </h2>

                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Customers will appear here once they message you about their
                  orders. You can also start the conversation yourself.
                </p>

                <button
                  type="button"
                  onClick={() => setShowNewChat(true)}
                  className="mt-5 flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                >
                  <AiOutlinePlus size={16} />
                  New chat
                </button>
              </div>
            ) : (
              conversations &&
              conversations.map((item, index) => (
                <MessageList
                  data={item}
                  key={item._id || index}
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
              ))
            )}
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

      {showNewChat && (
        <NewChatPicker
          loading={customersLoading}
          customers={customers}
          search={customerSearch}
          onSearch={setCustomerSearch}
          onClose={() => setShowNewChat(false)}
          onPick={startChatWith}
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
  };

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!me) return;

    const userId = data.members.find((member) => member !== me);

    if (!userId) return;

    let cancelled = false;

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);

        if (!cancelled) setUser(res.data.user);
      } catch (error) {
        // A conversation can outlive the buyer's account, and that answers
        // 404. Show a neutral placeholder instead of "Loading..." forever.
        if (cancelled) return;

        if (error.response?.status !== 404) console.log(error);

        setUser({
          _id: userId,
          name: error.response?.status === 404 ? "Deleted user" : "Unknown user",
          avatar: null,
        });
      }
    };

    getUser();

    return () => {
      cancelled = true;
    };
  }, [me, data]);

  return (
    <div
      className={`flex w-full cursor-pointer items-center border-b border-gray-100 px-4 py-4 transition-colors duration-200 hover:bg-gray-50 ${
        active === index ? "bg-gray-50" : "bg-white"
      }`}
      onClick={() =>
        setActive(index) ||
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative shrink-0">
          <img
            src={avatarSrc(user?.avatar)}
            alt=""
            className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm md:h-14 md:w-14"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = FALLBACK_AVATAR;
            }}
          />

        {online ? (
          <div className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
        ) : (
          <div className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-white bg-gray-300" />
        )}
      </div>

      <div className="min-w-0 pl-3">
        <h1 className="truncate text-base font-semibold text-gray-900 md:text-lg">
          {user?.name || "Loading..."}
        </h1>

        <p className="mt-0.5 truncate text-sm text-gray-500 md:text-base">
          {!isLoading && data?.lastMessageId !== user?._id
            ? "You:"
            : (user?.name || "").split(" ")[0] + ": "}{" "}
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
    <div className="flex h-full w-full flex-col bg-white">
      {/* message header */}
      <div className="flex w-full shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex min-w-0 items-center">
          <img
            src={avatarSrc(userData?.avatar)}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-gray-100 md:h-14 md:w-14"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_AVATAR;
          }}
        />

          <div className="min-w-0 pl-3">
            <h1 className="truncate text-base font-semibold text-gray-900 md:text-lg">
              {userData?.name || "Customer"}
            </h1>

            <h1
              className={`mt-0.5 text-sm font-medium ${
                activeStatus ? "text-green-500" : "text-gray-400"
              }`}
            >
              {activeStatus ? "Active Now" : ""}
            </h1>
          </div>
        </div>

        <AiOutlineArrowRight
          size={22}
          className="cursor-pointer rounded-full p-1 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
          onClick={() => setOpen(false)}
        />
      </div>

      {/* messages */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 px-4 py-4 md:px-5">
        {messages.length === 0 && (
          <p className="pt-6 text-center text-sm text-gray-400">
            No messages yet. Say hello to your customer.
          </p>
        )}

        {messages &&
          messages.map((item, index) => {
            // A message image reaches here either as the stored { url } object
            // or, when it only travelled over the socket, as a raw data uri.
            const imageSrc =
              typeof item.images === "string"
                ? item.images
                : item.images?.url;

            return (
              <div
                className={`my-3 flex w-full ${
                  item.sender === sellerId ? "justify-end" : "justify-start"
                }`}
                ref={scrollRef}
                key={item._id || `${item.createdAt}-${index}`}
              >
                <div className="max-w-[75%] md:max-w-[65%]">
                  {item.sender !== sellerId && (
                    <img
                      src={avatarSrc(userData?.avatar)}
                      className="mb-1 h-9 w-9 rounded-full object-cover md:h-10 md:w-10"
                      alt=""
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = FALLBACK_AVATAR;
                      }}
                    />
                  )}

                  {imageSrc && (
                    <img
                      src={resolveImageUrl(imageSrc)}
                      className="mb-2 h-56 w-56 rounded-xl object-cover shadow-sm md:h-72 md:w-72"
                      alt=""
                    />
                  )}

                  {item.text ? (
                    <div
                      className={`w-fit rounded-2xl px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm md:text-base ${
                        item.sender === sellerId
                          ? "rounded-br-md bg-gray-900"
                          : "rounded-bl-md bg-emerald-500"
                      }`}
                    >
                      <p>{item.text}</p>
                    </div>
                  ) : null}

                  <p
                    className={`pt-1 text-[11px] text-gray-400 ${
                      item.sender === sellerId ? "text-right" : "text-left"
                    }`}
                  >
                    {format(item.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* send message input */}
      <form
        aria-required={true}
        className="flex w-full shrink-0 items-center gap-3 border-t border-gray-200 bg-white p-3 md:p-4"
        onSubmit={sendMessageHandler}
      >
        <div className="shrink-0">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />

          <label
            htmlFor="image"
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
          >
            <TfiGallery size={20} />
          </label>
        </div>

        <div className="relative w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-gray-50 px-5 py-3 pr-12 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-100 md:text-base"
          />

          <input
            type="submit"
            value="Send"
            className="hidden"
            id="send"
          />

          <label
            htmlFor="send"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white transition-colors duration-200 hover:bg-gray-700"
          >
            <AiOutlineSend size={18} />
          </label>
        </div>
      </form>
    </div>
  );
};

// Buyer picker for a thread the shop opens itself. Only buyers who ordered from
// this shop are offered: they are the people this inbox is about, and without
// that list the shop would have no way to know who it can write to.
const NewChatPicker = ({
  loading,
  customers,
  search,
  onSearch,
  onClose,
  onPick,
}) => {
  const keyword = search.trim().toLowerCase();

  const filtered = keyword
    ? customers.filter((customer) =>
        `${customer.name || ""} ${customer.email || ""}`
          .toLowerCase()
          .includes(keyword)
      )
    : customers;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-100 px-4 py-3">
          <h2 className="text-[18px] font-semibold text-gray-900">
            New conversation
          </h2>

          <AiOutlineArrowRight
            size={20}
            className="cursor-pointer text-gray-600 hover:text-gray-900"
            onClick={onClose}
          />
        </div>

        <div className="p-3">
          <input
            type="text"
            autoFocus
            placeholder="Search customers by name or email..."
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:bg-white"
          />
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-3 pb-3">
          {loading && (
            <p className="py-3 text-[14px] text-gray-500">Loading...</p>
          )}

          {!loading && filtered.length === 0 && (
            <p className="py-3 text-[14px] text-gray-500">
              {customers.length
                ? "No customer matches your search."
                : "No customers yet. Buyers appear here once they have ordered from this shop."}
            </p>
          )}

          {!loading &&
            filtered.map((customer) => (
              <div
                key={customer._id}
                className="flex cursor-pointer items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-100"
                onClick={() => onPick(customer)}
              >
                <div className="flex min-w-0 items-center">
                  <img
                    src={
                      resolveImageUrl(customer.avatar?.url || customer.avatar) ||
                      "https://dummyimage.com/88x88/38c776/ffffff?text=C"
                    }
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "https://dummyimage.com/88x88/38c776/ffffff?text=C";
                    }}
                  />

                  <div className="min-w-0 pl-3">
                    <h1 className="truncate text-[16px] font-medium text-gray-900">
                      {customer.name}
                    </h1>

                    <p className="truncate text-[13px] text-gray-500">
                      {customer.email}
                    </p>
                  </div>
                </div>

                <span className="shrink-0 pl-2 text-[12px] text-gray-500">
                  {customer.orders} {customer.orders === 1 ? "order" : "orders"}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardMessages;