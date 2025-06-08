export default function formatTime(timeValue) {
  let [hour, minute] = timeValue.split(":").map(Number);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12; // convert 0 → 12
  return `${hour}:${minute.toString().padStart(2, "0")} ${ampm}`;
}
