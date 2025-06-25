import CustomSelect from "@/ui/CustomSelect";
import InputField from "@/ui/InputField";
import { useState } from "react";
import { MdClear } from "react-icons/md";

export default function FilterSearch({
  options,
  searchText,
  input = true,
  inputPlaceholder,
  selectPlaceholder,
  subjectOptions,
  setSelectedField,
  setSearchText,
  setSelectedSubject,
  select = true,
}) {
  const [isFilter, setIsFilter] = useState(false);

  return (
    <div className="flex items-center justify-between ">
      <div className="flex items-center gap-2  text-[#667085]">
        {select && (
          <>
            <CustomSelect
              isSearchPagination
              setIsFilter={setIsFilter}
              className={"w-[200px] text-xs"}
              options={options}
              isFilter={isFilter}
              label={""}
              placeholder={selectPlaceholder}
              setSelectedField={setSelectedField}
            />

            {setSelectedSubject && (
              <CustomSelect
                isSearchPagination
                setIsFilter={setIsFilter}
                className={"w-[200px] text-xs"}
                options={subjectOptions}
                label={""}
                placeholder={"Select Subject"}
                setSelectedField={setSelectedSubject}
              />
            )}
          </>
        )}
        {input && (
          <InputField
            isSearchPagination
            isFilter={isFilter}
            setIsFilter={setIsFilter}
            setSearchText={setSearchText}
            placeholder={inputPlaceholder}
            classname={"w-[200px] text-xs"}
            defaultValue={searchText}
            required={undefined}
            label={undefined}
          />
        )}
        {isFilter && (
          <MdClear
            className="border cursor-pointer border-red-500 h-8 w-8 p-[6px] rounded-[6px] hover:bg-red-500 hover:text-white bg-white text-red-500"
            onClick={() => {
              setSelectedField();
              setSearchText("");
              setIsFilter(false);
              setSelectedSubject && setSelectedSubject();
            }}
          />
        )}
      </div>
    </div>
  );
}
