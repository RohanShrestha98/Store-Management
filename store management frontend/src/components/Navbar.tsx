import { useLocation, useNavigate } from "react-router-dom";
import profile from "../assets/profile.svg";
import { IoNotificationsOutline } from "react-icons/io5";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef, useState } from "react";
import truncateText from "@/utils/truncateText";
import { useNotificationData } from "@/hooks/useQueryData";
import { IoMdArrowBack } from "react-icons/io";

export default function Navbar() {
  const loaction = useLocation();
  const headerName = capitalizeFirstLetter(loaction.pathname?.slice(1)).replace(
    /[-/]/g,
    " "
  );
  const navigate = useNavigate();
  // const { data, isLoading, isError } = useNotificationData();
  const data = [{ data: [] }];

  const { user } = useAuthStore();
  const [showNotification, setShowNotification] = useState(false);
  const buttonRef = useRef(null);
  console.log("user", user?.data);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border-b sticky top-0 flex items-center z-10 bg-white justify-between h-14 w-full px-6">
      <div className="flex items-center gap-2 text-[#808080]">
        <h1 className="font-semibold text-md ">
          {headerName === "" ? "Dashboard" : headerName}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative inline-block">
          <button
            ref={buttonRef}
            onClick={() => setShowNotification(!showNotification)}
            className="px-4 py-2 cursor-pointer rounded-lg  transition duration-200"
          >
            <div className="border-r pr-3 text-[#374253] ">
              <IoNotificationsOutline
                className="border shadow rounded-full p-2"
                size={36}
              />
            </div>
          </button>

          {showNotification && (
            <div className="absolute left-[-60px] mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-4 px-3 z-10">
              {!data?.data && (
                <p className="text-center my-20">No data to show</p>
              )}
              {data?.data && (
                <p className="flex justify-between items-center border-b mb-3 text-sm pb-1 font-bold text-gray-600">
                  Notifications
                </p>
              )}
              <div className="flex flex-col gap-2">
                {data?.data?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-white shadow-sm border  border-gray-200 rounded-[10px] py-2 px-3 text-sm hover:shadow-md transition-shadow"
                  >
                    <h2 className="text-gray-800 font-semibold ">
                      {truncateText(item?.title, 40)}
                    </h2>
                    <p className="text-gray-500 text-xs font-medium">
                      {truncateText(item?.description, 100)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <p className="text-[#4D4D4D] font-medium">
          {user?.data?.firstName ?? user?.data?.name ?? "Rohan"}
        </p>
        <img
          onClick={() => navigate("/settings")}
          src={profile}
          className="w-9 h-9 cursor-pointer rounded-full object-cover"
          alt=""
        />
      </div>
    </div>
  );
}
