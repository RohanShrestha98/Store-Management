import { act, useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import LogoutModal from "./LogoutModal";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { TbReportSearch } from "react-icons/tb";
import { LuSquareUser } from "react-icons/lu";
import SideBarItems from "./SideBarItems";
import { LuStore } from "react-icons/lu";
import { useAuthStore } from "@/store/useAuthStore";

export default function Sidebar({ hideSidebar, setHideSidebar }) {
  const [active, setActive] = useState(window.location.pathname);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.data?.role?.id;

  useEffect(() => {
    setActive(window.location.pathname);
  }, [window.location.pathname]);

  const sidebar = [
    { id: 1, name: "Dashboard", icon: <LuLayoutDashboard />, link: "/" },
    {
      id: 2,
      name: "Category",
      icon: <MdOutlineCategory />,
      link: "/category",
      subLink: "/add-category",
      subSubLink: "/edit-category",
    },
    {
      id: 3,
      name: "Product",
      icon: <CiBoxList />,
      link: "/product",
      subLink: "/add-product",
    },
    {
      id: 4,
      name: "User Product",
      icon: <LuSquareUser />,
      link: "/user-product",
    },

    {
      id: 5,
      name: "Staff",
      // visiable: role == 1 ? false : true,
      icon: <FiUsers />,
      link: "/user",
    },
    {
      id: 6,
      name: "Store",
      // visiable: role == 1 ? false : true,
      icon: <LuStore />,
      link: "/store",
    },
    {
      id: 7,
      name: "Vendor",
      icon: <LuSquareUser />,
      link: "/vendor",
    },
    {
      id: 8,
      name: "Sales History",
      icon: <TbReportSearch />,
      link: "/sales-history",
    },
    {
      id: 9,
      name: "Notification",
      icon: <IoNotificationsOutline />,
      link: "/notification",
    },
    {
      id: 10,
      name: "Risk Details",
      icon: <TbReportSearch />,
      link: "/risk-details",
    },
    {
      id: 11,
      name: "Settings",
      icon: <IoSettingsOutline />,
      link: "/settings",
    },
  ];

  const handleActive = (item) => {
    setActive(item?.link);
    navigate(`${item?.link}`);
  };

  return (
    <div className="border-r h-full  w-full flex flex-col bg-black  text-[#C9BCF7] ">
      <div
        onClick={() => {
          setActive("/");
          navigate("/");
        }}
        className="flex cursor-pointer md:justify-center p-4 gap-1 items-center mb-1"
      >
        <img className="h-12 w-12" src={logo} alt="logo" />
        <div className="flex flex-col mt-2">
          <p className="text-[10px] font-semibold mb-[-6px] pl-[2px]">store</p>
          <p className="font-bold text-xl">STORE</p>
        </div>
      </div>
      <div className="flex  flex-col  h-[84vh] overflow-auto no-scrollbar ">
        <div className="flex flex-col ">
          {sidebar?.map((item) => {
            if (!item?.visiable) {
              return (
                <SideBarItems
                  item={item}
                  handleActive={handleActive}
                  active={active}
                  hideSidebar={hideSidebar}
                />
              );
            }
          })}
        </div>
        {/* {sidebar?.map((items) => {
          return (
            <div key={items?.id} className="flex flex-col gap-2 ">
              {items?.map((item) => {
                return (
                  <SideBarItems
                    item={item}
                    handleActive={handleActive}
                    active={active}
                    hideSidebar={hideSidebar}
                  />
                );
              })}
            </div>
          );
        })} */}
      </div>
      <LogoutModal asChild>
        <div
          onClick={() => {}}
          className={`flex  px-4 py-[2px] font-medium items-center  gap-2 text-red-600  mt-4  border-l-4 border-transparent cursor-pointer `}
        >
          <div className="text-lg">
            <IoIosLogOut />
          </div>
          {!hideSidebar && <div className="line-clamp-1">Logout</div>}
        </div>
      </LogoutModal>
    </div>
  );
}
