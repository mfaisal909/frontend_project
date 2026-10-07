
import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import {
  HiOutlineReceiptRefund,
  HiOutlineShoppingBag,
} from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">

      {/* ================= PROFILE ================= */}
      <button
        type="button"
        onClick={() => setActive(1)}
        className={`group flex w-full items-center rounded-xl px-3 py-3.5 text-left transition-all duration-200 ${
          active === 1
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
            active === 1
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
          }`}
        >
          <RxPerson size={21} />
        </div>

        <span className="ml-3 hidden text-sm font-semibold md:block">
          Profile
        </span>
      </button>


      {/* ================= ORDERS ================= */}
      <button
        type="button"
        onClick={() => setActive(2)}
        className={`group mt-2 flex w-full items-center rounded-xl px-3 py-3.5 text-left transition-all duration-200 ${
          active === 2
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
            active === 2
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
          }`}
        >
          <HiOutlineShoppingBag size={21} />
        </div>

        <span className="ml-3 hidden text-sm font-semibold md:block">
          Orders
        </span>
      </button>


      {/* ================= REFUNDS ================= */}
      <button
        type="button"
        onClick={() => setActive(3)}
        className={`group mt-2 flex w-full items-center rounded-xl px-3 py-3.5 text-left transition-all duration-200 ${
          active === 3
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
            active === 3
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
          }`}
        >
          <HiOutlineReceiptRefund size={21} />
        </div>

        <span className="ml-3 hidden text-sm font-semibold md:block">
          Refunds
        </span>
      </button>


      {/* ================= INBOX ================= */}
      <button
        type="button"
          onClick={() => setActive(4)}
        className={`group mt-2 flex w-full items-center rounded-xl px-3 py-3.5 text-left transition-all duration-200 ${
          active === 4
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
            active === 4
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
          }`}
        >
          <AiOutlineMessage size={21} />
        </div>

        <span className="ml-3 hidden text-sm font-semibold md:block">
          Inbox
        </span>
      </button>


      {/* ================= TRACK ORDER ================= */}
      <button
        type="button"
        onClick={() => setActive(5)}
        className={`group mt-2 flex w-full items-center rounded-xl px-3 py-3.5 text-left transition-all duration-200 ${
          active === 5
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
            active === 5
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
          }`}
        >
          <MdOutlineTrackChanges size={21} />
        </div>

        <span className="ml-3 hidden text-sm font-semibold md:block">
          Track Order
        </span>
      </button>


      {/* ================= CHANGE PASSWORD ================= */}
      <button
        type="button"
        onClick={() => setActive(6)}
        className={`group mt-2 flex w-full items-center rounded-xl px-3 py-3.5 text-left transition-all duration-200 ${
          active === 6
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
            active === 6
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
          }`}
        >
          <RiLockPasswordLine size={21} />
        </div>

        <span className="ml-3 hidden text-sm font-semibold md:block">
          Change Password
        </span>
      </button>


      {/* ================= ADDRESS ================= */}
      <button
        type="button"
        onClick={() => setActive(7)}
        className={`group mt-2 flex w-full items-center rounded-xl px-3 py-3.5 text-left transition-all duration-200 ${
          active === 7
            ? "bg-red-50 text-red-600 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
            active === 7
              ? "bg-red-100 text-red-600"
              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
          }`}
        >
          <TbAddressBook size={21} />
        </div>

        <span className="ml-3 hidden text-sm font-semibold md:block">
          Address
        </span>
      </button>


      {/* ================= ADMIN DASHBOARD ================= */}
      {user && user?.role === "Admin" && (
        <Link
          to="/admin/dashboard"
          className="block"
          onClick={() => setActive(8)}
        >
          <div
            className={`group mt-2 flex w-full items-center rounded-xl px-3 py-3.5 transition-all duration-200 ${
              active === 8
                ? "bg-red-50 text-red-600 shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg transition-all ${
                active === 8
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
              }`}
            >
              <MdOutlineAdminPanelSettings size={21} />
            </div>

            <span className="ml-3 hidden text-sm font-semibold md:block">
              Admin Dashboard
            </span>
          </div>
        </Link>
      )}


      {/* ================= LOGOUT ================= */}
      <button
        type="button"
        onClick={logoutHandler}
        className="group mt-2 flex w-full items-center rounded-xl px-3 py-3.5 text-left text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-all group-hover:bg-red-100 group-hover:text-red-600">
          <AiOutlineLogin size={21} />
        </div>

        <span className="ml-3 hidden text-sm font-semibold md:block">
          Log out
        </span>
      </button>

    </div>
  );
};

export default ProfileSidebar;