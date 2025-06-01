import { RxCross2 } from "react-icons/rx";

export default function FileUpload({
  setValue,
  registerName,
  accept = ".jpg, .jpeg, .png",
  watch,
  defaultUrl,
  title,
}) {
  const fileName = watch(`${registerName}`);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center rounded-[4px]">
        <div className="w-full border-l justify-between border-t border-b  h-8 rounded-l-[6px] flex items-center   px-2 text-sm text-gray-500 bg-white line-clamp-1">
          {fileName?.name?.slice(0, 40) ??
            defaultUrl?.slice(0, 40) ??
            `Select a ${title ?? "image"}`}
          {(fileName?.name || defaultUrl) && (
            <RxCross2
              className="text-red-"
              onClick={() => setValue(registerName, "")}
            />
          )}
        </div>
        <input
          id={registerName}
          accept={accept}
          onChange={(e) => setValue(registerName, e.target.files?.[0])}
          className="hidden"
          type="file"
        />
        <label
          htmlFor={registerName}
          className="whitespace-nowrap cursor-pointer text-sm text-[#4365a7] bg-white border-[#4365a7] border rounded-r-[6px]  h-8 flex items-center px-3 "
        >
          Browse {title ?? "file"}
        </label>
      </div>
    </div>
  );
}
