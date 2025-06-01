import Pagination from "./Pagination";

export default function SearchPagination({ page, pageSize, totalPage, setPage, setPageSize }) {

    return (
        <div className="flex items-center justify-end border-t border-l border-r bg-white p-2 px-3 rounded-t-xl">
            <Pagination setPageSize={setPageSize} totalPage={totalPage} page={page} pageSize={pageSize} setPage={setPage} />
        </div>
    )
}
