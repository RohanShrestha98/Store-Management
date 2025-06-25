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
          ? " border-[#C9BCF7] bg-gray-700"
          : "  border-transparent hover:bg-gray-700"
      } border-l-4 text-[#C9BCF7] text-sm font-medium flex items-center  gap-2 px-4 py-[10px] cursor-pointer `}
    >
      <div className="text-lg">{item?.icon}</div>
      {!hideSidebar && <div className="line-clamp-1">{item?.name}</div>}
    </div>
  );
}
