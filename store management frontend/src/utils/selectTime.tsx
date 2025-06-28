import { useEffect, useState } from "react";
import formatTime from "./formatTime"; // assume it converts "09:00" to a 24-hour format

const weekOptions = [
  { value: 1, day: "Sun" },
  { value: 2, day: "Mon" },
  { value: 3, day: "Tus" },
  { value: 4, day: "Wed" },
  { value: 5, day: "Thr" },
  { value: 6, day: "Fri" },
  { value: 7, day: "Sat" },
];

export default function SelectTime({
  setSelectedTime,
  label,
  defaultTime = "09:00",
}) {
  const [localTimes, setLocalTimes] = useState(() =>
    weekOptions?.map((item) => ({
      day: item?.day,
      time: formatTime(defaultTime),
    }))
  );

  // Sync localTimes to parent state
  useEffect(() => {
    setSelectedTime(localTimes);
  }, [localTimes, setSelectedTime]);

  const handleOpenTimeClick = (e, item) => {
    const { value } = e.target;
    setLocalTimes((prev) =>
      prev.map((entry) =>
        entry?.day === item?.day
          ? { ...entry, value: formatTime(value) }
          : entry
      )
    );
  };

  return (
    <div className="">
      <p className="text-[#344054] leading-5 font-medium text-sm mb-1">
        {label} <span className="text-red-600">*</span>
      </p>
      <div className="grid grid-cols-4 gap-1 border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-[#344054]">
        {weekOptions.map((item) => (
          <div key={item?.day} className="flex items-center justify-between">
            {item?.day} :
            <input
              type="time"
              defaultValue={defaultTime}
              onChange={(e) => handleOpenTimeClick(e, item)}
              className="outline-none border-r border-gray-400"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
