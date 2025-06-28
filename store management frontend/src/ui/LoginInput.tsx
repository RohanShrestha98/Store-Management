import { useState } from "react";
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";
export default function LoginInput({
  type = "text",
  placeholder = "",
  className = "",
  defaultValue = "",
  required = false,
  label = "",
  register,
  isSearchPagination,
  setIsFilter,
  name = "",
  error,
  setSearchText = () => {},
}) {
  const [passwordType, setPasswordType] = useState("password");
  return (
    <div>
      {label && (
        <p className="text-[#344054] leading-5 font-medium text-sm mb-1">
          {label} {required && <span className="text-red-600">*</span>}{" "}
        </p>
      )}
      <div
        className={`flex items-center  justify-between pr-3 h-10 w-full border border-gray-300 bg-white  text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground  outline-none focus-visible:ring-2 focus-visible:ring-ring hover:border-gray-700 focus-visible:ring-offset-2 py-1 disabled:cursor-not-allowed disabled:opacity-50
                   ${className}`}
      >
        <input
          placeholder={placeholder}
          onChange={(e) => {
            setSearchText(e.target.value);
            isSearchPagination && setIsFilter(true);
          }}
          defaultValue={defaultValue}
          {...register(name)}
          type={type === "password" ? passwordType : type}
          className={` h-full w-full px-3 py-2 outline-none  focus-visible:border-gray-700`}
        />
        {type === "password" && (
          <div className="text-gray-500">
            {passwordType === "password" ? (
              <BsEye size={17} onClick={() => setPasswordType("text")} />
            ) : (
              <BsEyeSlash
                size={17}
                onClick={() => setPasswordType("password")}
              />
            )}
          </div>
        )}
      </div>
      <p className="text-red-600 text-xs">{error}</p>
    </div>
  );
}
