import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

export default function BaseLayout() {
  const [hideSidebar, setHideSidebar] = useState(true);
  // useEffect(() => {
  //   const handleResize = () => setHideSidebar(window.innerWidth <= 1224);
  //   handleResize();
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`${
          hideSidebar ? "min-w-[72px]" : "w-1/6"
        } h-screen overflow-hidden sticky top-0`}
      >
        <Sidebar setHideSidebar={setHideSidebar} hideSidebar={hideSidebar} />
      </div>
      <div className={`w-full bg-[#f4f4f4]`}>
        <Navbar />
        <div className="h-[90vh] overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
