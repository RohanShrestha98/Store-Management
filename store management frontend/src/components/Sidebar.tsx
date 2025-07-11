import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import LogoutModal from "./LogoutModal";
import {
  LuLayoutDashboard,
  LuSquareUser,
  LuStore,
  LuUserRound,
} from "react-icons/lu";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import { CiBoxList } from "react-icons/ci";
import { FiUsers } from "react-icons/fi";
import { TbReportSearch } from "react-icons/tb";
import SideBarItems from "./SideBarItems";
import { useAuthStore } from "@/store/useAuthStore";

export default function Sidebar({ hideSidebar, setHideSidebar }) {
  const [active, setActive] = useState(window.location.pathname);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const role = user?.data?.role;

  useEffect(() => {
    setActive(window.location.pathname);
  }, [window.location.pathname]);

  // All sidebar items
  const allSidebarItems = [
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
      link: role === "Staff" ? "/add-product" : "/product",
      subLink: "/add-product",
    },
    {
      id: 4,
      name: "Checkout",
      icon: <LuSquareUser />,
      link: "/user-product",
    },
    {
      id: 5,
      name: "Staff",
      icon: <FiUsers />,
      link: "/user",
    },
    {
      id: 6,
      name: "Store",
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
      name: "Sales",
      icon: <TbReportSearch />,
      link: "/sales",
    },
    {
      id: 9,
      name: "Notification",
      icon: <IoNotificationsOutline />,
      link: "/notification",
    },
    {
      id: 10,
      name: "Pay Check",
      icon: <TbReportSearch />,
      link: "/pay-check",
    },
    {
      id: 11,
      name: "Profile",
      icon: <LuUserRound />,
      link: "/profile",
    },
  ];

  const sidebarItemsByRole = {
    Admin: allSidebarItems,
    Manager: allSidebarItems.filter(
      (item) => !["Vendor", "Store"].includes(item.name)
    ),
    Staff: allSidebarItems.filter((item) =>
      [
        "Dashboard",
        "Checkout",
        "Sales",
        "Notification",
        "Profile",
        "Product",
      ].includes(item.name)
    ),
  };

  const roleSidebarItems = sidebarItemsByRole[role] || [];

  const handleActive = (item) => {
    setActive(item.link);
    navigate(item.link);
  };

  return (
    <div className="border-r h-full w-full flex flex-col bg-[#000080] text-[#f4f4f4]">
      <div
        onClick={() => {
          setActive("/");
          navigate("/");
        }}
        className="flex cursor-pointer md:justify-center px-4 py-2 gap-1 items-center mb-1"
      >
        <img className="h-12 w-12" src={logo} alt="logo" />
        {!hideSidebar && (
          <div className="flex flex-col mt-2">
            <p className="text-[10px] font-semibold mb-[-6px] pl-[2px]">
              store
            </p>
            <p className="font-bold text-xl">STORE</p>
          </div>
        )}
      </div>

      <div className="flex flex-col h-[84vh] overflow-auto no-scrollbar">
        <div className="flex flex-col">
          {roleSidebarItems.map((item) => (
            <SideBarItems
              key={item.id}
              item={item}
              handleActive={handleActive}
              active={active}
              hideSidebar={hideSidebar}
            />
          ))}
        </div>
      </div>

      <LogoutModal asChild>
        <div
          onClick={() => {}}
          className="flex px-4 py-2 pt-4 font-medium items-center gap-2 text-red-600 border-l-4 border-transparent cursor-pointer"
        >
          <div className="text-lg">
            <IoIosLogOut size={20} />
          </div>
          {!hideSidebar && <div className="line-clamp-1">Logout</div>}
        </div>
      </LogoutModal>
    </div>
  );
}
