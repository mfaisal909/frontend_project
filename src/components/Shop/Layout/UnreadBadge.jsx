import React from "react";

// Red pill on the Shop Inbox icon, shown in the sidebar and in the dashboard
// header so an unread customer message is visible from either.
const UnreadBadge = ({ count }) => {
  if (!count) return null;

  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-center text-[10px] font-semibold leading-none text-white ring-2 ring-white">
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default UnreadBadge;
