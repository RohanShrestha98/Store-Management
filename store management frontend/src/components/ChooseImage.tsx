import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";

export default function ChooseImage({
  setSelectedImage,
  selectedImage,
  duration,
  setDuration,
  accept = ".jpg, .jpeg, .png, .webp",
  defaultUrl,
  title,
}) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && title === "Video") {
      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = () => {
        const durationInSeconds = videoElement.duration;
        setDuration(durationInSeconds);
      };

      videoElement.onerror = () => {
        toast.error("Error loading video");
      };

      videoElement.src = URL.createObjectURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-[#344054] font-medium text-sm">{title ?? "Image"}</h1>
      <div className="flex items-center rounded-[4px] max-w-[462px]">
        <div className="w-full border-l justify-between border-t border-b  h-8 rounded-l-[6px] flex items-center   px-2 text-sm text-gray-500 bg-white line-clamp-1">
          {selectedImage?.name?.slice(0, 40) ??
            defaultUrl?.slice(0, 40) ??
            `Select a ${title ?? "image"}`}
          {selectedImage?.name && !defaultUrl && (
            <RxCross2
              className="text-red-600"
              onClick={() => setSelectedImage()}
            />
          )}
        </div>
        <input
          id={title ?? "Image"}
          accept={accept}
          onChange={(e) => {
            setSelectedImage(e.target.files?.[0]);
            handleFileChange(e);
          }}
          className="hidden"
          type="file"
        />
        <label
          htmlFor={title ?? "Image"}
          className="whitespace-nowrap cursor-pointer text-sm text-[#4365a7] bg-white border-[#070808] border rounded-r-[6px]  h-8 flex items-center px-3 "
        >
          Browse File
        </label>
      </div>
    </div>
  );
}
