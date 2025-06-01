import Select from "react-select";

export function MultiSelect({
  options,
  selected,
  setSelected,
  className,
  labelName,
  required,
  placeholder,
}) {
  return (
    <div className="w-full">
      {labelName && (
        <p className="text-[#344054] font-medium text-sm mb-1">
          {labelName}
          {required && <span className="text-red-600">*</span>}{" "}
        </p>
      )}
      <Select
        className={`w-[180px] border rounded-lg bg-white focus-visible:border-gray-700 ${className}`}
        isMulti
        defaultValue={placeholder}
        placeholder={placeholder}
        options={options}
        value={selected}
        onChange={setSelected}
      />
    </div>
  );
}
