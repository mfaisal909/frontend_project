import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../../utils/socket";
import { acquireSocket, registerSocketUser } from "../../utils/socketConnection";
import { server } from "../../server";
import { incrementUnread, resetUnread } from "../../redux/reducers/chatNotify";

const INBOX_PATH = "/dashboard-messages";

// The sender is always a customer id the shop has no record of until now, and
// a toast per message would re-resolve the same handful of names. One lookup
// per sender is enough for the lifetime of the tab.
const senderNames = new Map();

const resolveSenderName = async (senderId) => {
  const key = String(senderId);

  if (senderNames.has(key)) {
    return senderNames.get(key);
  }

  try {
    const { data } = await axios.get(`${server}/user/user-info/${key}`);
    const name = data?.user?.name || "Customer";

    senderNames.set(key, name);

    return name;
  } catch {
    return "Customer";
  }
};

const previewOf = (text, images) => {
  const trimmed = (text || "").trim();

  if (trimmed) {
    return trimmed.length > 80 ? `${trimmed.slice(0, 80)}...` : trimmed;
  }

  return images ? "sent a photo" : "sent a message";
};

// Keeps the shop owner reachable for live customer messages on every page, not
// only while the inbox is open: it holds the shared socket connection, toasts
// when a customer writes in, and maintains the unread badge shown on the
// dashboard sidebar and header.
const SellerMessageNotifier = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sellerId = useSelector(
    (state) => state.seller?.seller?._id || null
  );

  useEffect(() => {
    if (!sellerId) return;

    const release = acquireSocket();
    const releaseUser = registerSocketUser(sellerId);

    const onMessage = (data) => {
      // One browser can hold a seller and a buyer session on the same socket;
      // receiverId says which of them this message was actually addressed to.
      if (String(data.receiverId) !== String(sellerId)) return;
      if (String(data.senderId) === String(sellerId)) return;

      // The inbox updates its own list and open thread, so a toast there would
      // only duplicate what the seller is already looking at.
      if (window.location.pathname === INBOX_PATH) return;

      dispatch(incrementUnread(sellerId));

      const preview = previewOf(data.text, data.images);

      resolveSenderName(data.senderId).then((name) => {
        toast.info(`New message from ${name}: ${preview}`, {
          // One live toast per conversation instead of a stack per message.
          toastId: `seller-chat-${data.conversationId}`,
          onClick: () => navigate(INBOX_PATH),
        });
      });
    };

    socket.on("getMessage", onMessage);

    return () => {
      socket.off("getMessage", onMessage);
      releaseUser();
      release();
    };
  }, [sellerId, dispatch, navigate]);

  // Arriving on the inbox is the seller acknowledging their messages, which is
  // also the only place the badge is cleared.
  useEffect(() => {
    if (!sellerId || location.pathname !== INBOX_PATH) return;

    dispatch(resetUnread(sellerId));
  }, [sellerId, location.pathname, dispatch]);

  return null;
};

export default SellerMessageNotifier;
