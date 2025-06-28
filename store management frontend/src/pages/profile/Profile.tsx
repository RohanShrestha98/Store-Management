import profileImage from "@/assets/profile.svg";
import Calendar from "@/components/Calendar";
import truncateText from "@/utils/truncateText";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserDetailsData } from "@/hooks/useQueryData";

export default function Profile() {
  const { user } = useAuthStore();
  const {
    data: userDetailsData,
    isLoading,
    isError,
  } = useUserDetailsData(user?.data?.email);

  const data = userDetailsData?.data?.[0];
  const profileData = [
    {
      label: "Phone number",
      value: "+1 " + data?.phoneNumber,
    },
    {
      label: "Address",
      value: truncateText(data?.address, 25),
    },
    {
      label: "Work at store",
      value: data?.storeNumber,
    },
    {
      label: "Pay per hour ($)",
      value: data?.payPerHour,
    },
    {
      label: "Shift Time",
      value: `${data?.shift[0]?.start} - ${data?.shift[0]?.end}`,
    },

    {
      label: "Verified",
      value: data?.isVerified ? "Yes" : "No",
    },
  ];

  const daysMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className=" h-[84vh] md:h-full overflow-auto no-scrollbar flex justify-between gap-3 md:flex-col">
        <div className=" w-1/3 lg:w-1/2 md:w-full border border-gray-300 h-full bg-white p-3 pt-4 items-center flex gap-2 flex-col ">
          <img
            className="w-[140px] h-[140px] object-fill"
            src={profileImage}
            alt=""
          />
          <div className="text-center">
            <p className="text-base font-semibold text-gray-700">
              {data?.firstName + " " + data?.lastName}
            </p>
            <p className="text-sm font-medium text-gray-700">{data?.email}</p>
          </div>
          <div className="w-full flex flex-col gap-2 mt-4 px-2">
            {profileData?.map((item) => {
              return (
                <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                  <p className="font-semibold">{item?.label}</p>
                  <p>{item?.value}</p>
                </div>
              );
            })}
            <div className="flex items-center justify-between text-sm font-medium text-gray-700">
              <p className="font-semibold">Working Days</p>
              <p>{data?.days?.map((d) => daysMap[d]).join(", ")}</p>
            </div>
          </div>
        </div>
        <div className="w-2/3 lg:w-1/2 md:w-full border border-gray-300 bg-white h-full overflow-auto">
          <div className="p-3 underline">Schedule</div>
          <div className="grid grid-cols-2 lg:grid-cols-1">
            <Calendar />
            <div className="border bg-[#f9f9f9] flex flex-col gap-3 p-3 h-[74vh] overflow-auto no-scrollbar">
              <div className="border border-gray-300 p-3 bg-white">
                <div className="flex items-end justify-between font-semibold border-b border-gray-400">
                  <p className=" ">Last Punch</p>
                  <p className="text-sm  text-[#5d31fd]">View</p>
                </div>
                <div className="flex text-sm font-semibold gap-6 pt-3 px-2">
                  <p className=" text-center">
                    Sat <br /> Jun 21
                  </p>
                  <p className="font-medium">Punch at 05:56 AM</p>
                </div>
              </div>
              <div className="border border-gray-300 p-3 bg-white">
                <div className="flex items-end justify-between font-semibold border-b border-gray-400">
                  <p className=" ">Next Shift</p>
                  <p className="text-sm  text-[#5d31fd]">View</p>
                </div>
                {data?.days?.map((item, index) => {
                  return (
                    <div className="flex text-sm font-semibold gap-6 py-3 px-2 border-b">
                      <p className=" text-center">
                        {daysMap[item]} <br /> Jun {21 + index}
                      </p>
                      <p className="font-normal">
                        {data?.shift?.[0]?.start +
                          " - " +
                          data?.shift?.[0]?.end}
                        <br />
                        Store Staff
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
