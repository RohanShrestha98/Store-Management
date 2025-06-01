export default function InputField({
  type = "text",
  disabled,
  placeholder = "",
  className,
  defaultValue = "",
  required = false,
  label = "",
  register = () => {},
  isSearchPagination,
  setIsFilter,
  name = "",
  setSearchText = () => {},
}) {
  return (
    <div>
      {label && (
        <p className="text-[#344054] leading-5 font-medium text-sm mb-1">
          {label} {required && <span className="text-red-600">*</span>}{" "}
        </p>
      )}
      <input
        placeholder={placeholder}
        onChange={(e) => {
          setSearchText(e.target.value);
          isSearchPagination && setIsFilter(true);
        }}
        disabled={disabled}
        value={isSearchPagination && defaultValue}
        defaultValue={defaultValue}
        {...register(name)}
        type={type}
        style={{ borderRadius: "6px" }}
        className={`flex h-8 w-[220px] border border-gray-300 rounded-lg bg-white px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                   ${className} w-full`}
      />
    </div>
  );
}
