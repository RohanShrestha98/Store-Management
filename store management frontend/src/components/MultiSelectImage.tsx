import { GoPlus } from "react-icons/go";

export default function MultiSelectImage({ files = [], setFiles }) {
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const combined = [...(files || []), ...selected].slice(0, 5);
    setFiles(combined);
    e.target.value = "";
  };
  console.log("files", files);

  const numberImages = Array.from({ length: 1 });

  return (
    <div>
      <p className="text-[#344054] leading-5 font-medium text-sm mb-1">
        Images
      </p>

      <div className="flex gap-x-2">
        {numberImages.map((_, index) => {
          const image = files[index];

          return (
            <label
              key={index}
              htmlFor={!image ? "files" : undefined}
              className="cursor-pointer border-dashed flex items-center justify-center border-gray-400 w-12 h-12 border rounded overflow-hidden"
            >
              {image ? (
                <img
                  className="w-full h-full object-cover"
                  src={URL.createObjectURL(image)}
                  alt={`selected-${index}`}
                />
              ) : (
                <GoPlus className="text-gray-500" />
              )}
            </label>
          );
        })}
      </div>

      <input
        type="file"
        className="hidden"
        id="files"
        multiple
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
