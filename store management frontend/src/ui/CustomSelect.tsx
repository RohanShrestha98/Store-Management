import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomSelect({
  id,
  options,
  defaultValue,
  label,
  isSearchPagination,
  placeholder,
  setIsFilter,
  className,
  labelName,
  disabled,
  required,
  setSelectedField,
}) {
  return (
    <div>
      {labelName && (
        <p className="text-[#344054] font-medium text-sm mb-1">
          {labelName}
          {required && <span className="text-red-600">*</span>}{" "}
        </p>
      )}
      <Select
        onValueChange={(e) => {
          setSelectedField(e);
          isSearchPagination && setIsFilter(true);
        }}
        disabled={disabled}
      >
        <SelectTrigger
          className={`w-[180px] border rounded-lg bg-white focus-visible:border-gray-700 ${className}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        {/* <p onClick={() => setSelectedField("")}>
            <RxCross2 size={16} className="mr-2 cursor-pointer" />
          </p> */}
        <SelectContent className="bg-white ">
          <SelectGroup>
            <SelectLabel>{label}</SelectLabel>
            {options?.length ? (
              <>
                {options?.map((item) => {
                  return (
                    <SelectItem
                      disabled={item?.label === "No Options"}
                      value={item?.value?.toString()}
                    >
                      {item?.label}
                    </SelectItem>
                  );
                })}
              </>
            ) : (
              <SelectItem disabled value={"No Options"}>
                No Options
              </SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
