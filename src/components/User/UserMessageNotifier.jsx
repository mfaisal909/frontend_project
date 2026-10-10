import { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../../utils/socket";
import { acquireSocket, registerSocketUser } from "../../utils/socketConnection";
import { server } from "../../server";

const INBOX_PATH = "/inbox";

// The sender is a shop id, resolved once per tab so a burst of messages does
// not refetch the same name.
const shopNames = new Map();

const resolveShopName = async (shopId) => {
  const key = String(shopId);

  if (shopNames.has(key)) {
    return shopNames.get(key);
  }

  try {
    const { data } = await axios.get(`${server}/shop/get-shop-info/${key}`);
    const name = data?.shop?.name || "the shop";

    shopNames.set(key, name);

    return name;
  } catch {
    return "the shop";
  }
};

const previewOf = (text, images) => {
  const trimmed = (text || "").trim();

  if (trimmed) {
    return trimmed.length > 80 ? `${trimmed.slice(0, 80)}...` : trimmed;
  }

  return images ? "sent a photo" : "sent a message";
};

// Buyer-side counterpart of SellerMessageNotifier. The shopper used to be
// registered with the socket only while /inbox was mounted, so a message that
// arrived on any other page was routed to nobody and dropped by the server.
// Holding the connection here keeps the customer online everywhere and toasts
// them when a shop writes in.
const UserMessageNotifier = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user?.user?._id || null);

  useEffect(() => {
    if (!userId) return;

    const release = acquireSocket();
    const releaseUser = registerSocketUser(userId);

    const onMessage = (data) => {
      // One browser can hold a seller and a buyer session on the same socket;
      // receiverId says which of them this message was addressed to.
      if (String(data.receiverId) !== String(userId)) return;
      if (String(data.senderId) === String(userId)) return;

      // The inbox updates its own list and open thread, so a toast there would
      // only duplicate what the shopper is already looking at.
      if (window.location.pathname === INBOX_PATH) return;

      const preview = previewOf(data.text, data.images);

      resolveShopName(data.senderId).then((name) => {
        toast.info(`New message from ${name}: ${preview}`, {
          // One live toast per conversation instead of a stack per message.
          toastId: `user-chat-${data.conversationId}`,
          onClick: () =>
            navigate(`${INBOX_PATH}?conversationId=${data.conversationId}`),
        });
      });
    };

    socket.on("getMessage", onMessage);

    return () => {
      socket.off("getMessage", onMessage);
      releaseUser();
      release();
    };
  }, [userId, navigate]);

  return null;
};

export default UserMessageNotifier;
