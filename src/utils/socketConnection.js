import socket from "./socket";

// The socket singleton used to be connected and torn down by whichever inbox
// happened to be mounted, so a seller who was signed in but looking at another
// dashboard page had no live connection at all. Ownership is now shared: every
// part of the app that needs realtime takes a reference and releases it on
// unmount, and the connection stays up as long as at least one holder remains.

let holders = 0;

// Refcounted per id, not a plain set: the seller id is registered by both the
// global notifier and the dashboard inbox, so one of them releasing must not
// un-register the other.
const users = new Map();

const registerAllUsers = () => {
  users.forEach((_count, userId) => {
    socket.emit("addUser", userId);
  });
};

// The server keeps its online list per connection, so a reconnect would leave
// this tab unlisted and every message silently dropped until a reload.
socket.on("connect", registerAllUsers);

// Connects the shared socket (no-op when it is already up) and returns the
// release function. Calling release twice is harmless, which keeps React's
// StrictMode double-invoke of effects safe.
export const acquireSocket = () => {
  holders += 1;

  if (!socket.connected) {
    socket.connect();
  }

  let released = false;

  return () => {
    if (released) return;
    released = true;

    holders = Math.max(0, holders - 1);

    if (holders === 0) {
      socket.disconnect();
    }
  };
};

// Registers an id with the server's online list and returns the release
// function. Registration is repeated automatically after every reconnect.
export const registerSocketUser = (userId) => {
  const id = String(userId ?? "");

  if (!id || id === "undefined" || id === "null") {
    return () => {};
  }

  users.set(id, (users.get(id) || 0) + 1);

  if (socket.connected) {
    socket.emit("addUser", id);
  }

  let released = false;

  return () => {
    if (released) return;
    released = true;

    const next = (users.get(id) || 1) - 1;

    if (next > 0) {
      users.set(id, next);
    } else {
      users.delete(id);
    }
  };
};
