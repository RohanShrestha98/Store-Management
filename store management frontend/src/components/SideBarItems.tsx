export default function SideBarItems({
  item,
  handleActive,
  active,
  hideSidebar,
}) {
  return (
    <div
      key={item?.id}
      onClick={() => handleActive(item)}
      className={`${
        active === item?.link ||
        active === item?.subLink ||
        active === item?.subSubLink
          ? "  bg-blue-800"
          : "  border-transparent hover:bg-blue-800"
      } border-l-2 text-[#f4f4f4] text-sm font-medium flex items-center  gap-2  ${
        hideSidebar ? "py-[10px]" : "py-[10px]"
      } cursor-pointer `}
    >
      <div className="text-lg flex flex-col w-full items-center justify-center">
        <div className="mb-[-3px]">{item?.icon}</div>
        <p className="line-clamp-1 text-[10px] mb-[-3px]">{item?.name}</p>
      </div>
      {/* <div className="mb-[-3px]">{item?.icon}</div> */}
      {/* {!hideSidebar && <div className="line-clamp-1">{item?.name}</div>} */}
    </div>
  );
}
