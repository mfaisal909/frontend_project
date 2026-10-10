import { io } from "socket.io-client";
import backendUrl from "../server";

// Realtime messaging is served by the backend process itself, so reuse the API
// host by default. Only override with VITE_SOCKET_URL if it's explicitly correct.
const SOCKET_URL = (
  backendUrl ||
  import.meta.env.VITE_SOCKET_URL ||
  (typeof window !== "undefined" ? window.location.origin : "") ||
  "http://localhost:8000"
).replace(/\/+$/, "");

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
  reconnectionAttempts: 8,
  timeout: 10000,
  autoConnect: false,
});

socket.on("connect_error", (error) => {
  console.error(
    `Could not reach the chat server at ${SOCKET_URL}: ${error.message}. ` +
      `Start the backend with "npm run dev" from the project root, or point ` +
      `VITE_SOCKET_URL at the host running the socket.io server.`
  );
});

export default socket;