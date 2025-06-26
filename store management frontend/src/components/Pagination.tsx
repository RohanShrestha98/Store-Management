import CustomSelect from "@/ui/CustomSelect";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

export default function Pagination({
  totalPage = "",
  pageSize,
  setPageSize,
  page,
  setPage,
}) {
  const options = [
    {
      value: "10",
      label: "10 items",
    },
    {
      value: "25",
      label: "25 items",
    },
    {
      value: "50",
      label: "50 items",
    },
    {
      value: "100",
      label: "100 items",
    },
  ];
  return (
    <div className="flex items-center gap-6 text-[#344054] font-normal text-sm">
      <CustomSelect
        className={"w-[100px] h-7"}
        setSelectedField={setPageSize}
        options={options}
        label={""}
        placeholder={pageSize ? pageSize + " items" : "10 items"}
      />
      {/* <InputField type={"number"} placeholder={""} defaultValue={"1"} setSearchText={setPage} classname={"max-w-[60px] h-7"} defaultValue={undefined} required={undefined} label={undefined} /> */}
      <p className="font-medium text-sm text-[#344054] flex items-center gap-2">
        Page
        <input
          type="number"
          className="w-12 border rounded-[6px] text-center  pl-2 focus-visible:border-gray-700 outline-none"
          defaultValue={parseInt(page)}
          value={parseInt(page)}
          onChange={(e) => {
            totalPage >= e.target.value && setPage(parseInt(e.target.value));
          }}
        />
        of {totalPage}
      </p>
      <div className="flex items-center gap-2 cursor-pointer">
        <div
          onClick={() => parseInt(page) > 1 && setPage(parseInt(page) - 1)}
          className={`${
            parseInt(page) === 1 || totalPage === 1
              ? "bg-gray-100"
              : "bg-transparent"
          } border px-3 py-1 rounded text-gray-600 hover:bg-gray-100`}
        >
          <FaArrowLeft />
        </div>
        <div
          onClick={() =>
            totalPage > parseInt(page) && setPage(parseInt(page) + 1)
          }
          className={`${
            parseInt(page) === totalPage || totalPage === 1 || totalPage === 0
              ? "bg-gray-100"
              : "bg-transparent"
          } border px-3 py-1 rounded text-gray-600 hover:bg-gray-100`}
        >
          <FaArrowRight />
        </div>
      </div>
    </div>
  );
}
