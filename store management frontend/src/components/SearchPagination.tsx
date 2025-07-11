import Pagination from "./Pagination";

export default function SearchPagination({
  page,
  pageSize,
  totalPage,
  setPage,
  setPageSize,
  setSearchText,
  disabled,
  searchText,
}) {
  return (
    <div
      className={`flex items-center ${
        disabled ? "justify-end" : "justify-between"
      }  border-l border-r bg-white p-2 px-3`}
    >
      {!disabled && (
        <input
          placeholder={"Search ..."}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          value={searchText}
          disabled={disabled}
          className={`flex h-8 w-[220px] border text-gray-600 border-gray-300 rounded-lg bg-white px-3 py-2 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:border-gray-700 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
                `}
        />
      )}

      <Pagination
        setPageSize={setPageSize}
        totalPage={totalPage}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
      />
    </div>
  );
}
