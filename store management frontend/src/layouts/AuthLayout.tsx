import { Outlet } from "react-router-dom";
import login from "../assets/logo.svg";

const AuthLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen ">
      <div className="flex  sm:items-center sm:justify-center sm:p-0">
        <div className="bg-[#121212] flex flex-col items-center h-screen justify-center  px-[150px] lg:px-8 md:px-6 sm:px-3   w-1/2">
          <img src={login} alt="" className=" w-40 h-40" />
          <p className="text-[#C9BDF6] text-xl font-bold text-center">
            Staff Management <br /> System
          </p>
        </div>
        <div className="md:w-full w-1/2 h-screen overflow-auto pb-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
