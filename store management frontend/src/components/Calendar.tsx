import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export default function Calendar() {
  return (
    <div className="p-4 w-full bg-white border-y rounded">
      <DayPicker
        mode="single"
        selected={new Date()}
        onSelect={(date) => console.log(date)}
        modifiersClassNames={{
          selected: "bg-[#b7a4fb] text-white rounded-full",
          today: "font-bold",
        }}
        className="text-sm w-full"
      />
    </div>
  );
}
