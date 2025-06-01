/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

const variants = {
  enter: (direction) => ({
    x: direction === "right" ? 300 : -300,
    y: -20,
    scale: 0.6,
    opacity: 0,
  }),
  exit: (direction) => ({
    x: direction === "left" ? 300 : -300,
    y: -20,
    scale: 0.6,
    opacity: 0,
  }),
};
export default function AuthLayout({
  children,
  view,
  direction,
  changeView,
  submitHandler,
  isLoading = false,
}) {
  let heading = "Welcome Back";
  let mainBtnText = "Sign In";
  let altBtnText = "";
  let altBtnLabel = "";
  let loadingText = "Signing In...";

  if (view === "reset") {
    heading = "Recover Account";
    mainBtnText = "Request Verification Code";
    altBtnText = "Sign In";
    altBtnLabel = "Remembered your password?";
    loadingText = "Requesting Code...";
  } else if (view === "verification") {
    heading = "Verify Account";
    mainBtnText = "Verify OTP";
    altBtnText = "";
    altBtnLabel = "";
    loadingText = "Verifying OTP...";
  }

  return (
    <div className="animate-slide-in-right">
      <h2 className="text-[44px] font-semibold text-primary">{heading}</h2>
      <form onSubmit={submitHandler}>
        <fieldset className="flex flex-col gap-4">{children}</fieldset>
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            className="relative mt-2 flex w-full justify-center px-3 py-3 uppercase"
            //   isLoading={isLoading}
          >
            <span>{isLoading ? loadingText : mainBtnText}</span>
          </button>
          <div className="flex justify-center gap-2 text-sm">
            <span className="text-grayText">{altBtnLabel}</span>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={changeView}
            >
              {altBtnText}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
