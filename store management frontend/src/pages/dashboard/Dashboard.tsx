import DashboardTop from "./DashboardTop";
import DashboardNotification from "./DashboardNotification";
import DashboardPayment from "./DashboardPayment";
import UserTrends from "./UserTrends";
import UserOverview from "./UserOverview";
import PaymentGateway from "./PaymentGateway";

export default function Dashboard() {
  return (
    <div className="px-4 py-4">
      <DashboardTop />
      <div className="grid grid-cols-2 gap-5 my-4">
        <UserOverview />
        {/* <RecentPayment /> */}
        <DashboardNotification />
      </div>
      <div className="grid grid-cols-2 gap-2 ">
        <UserTrends />
        {/* <DashboardPayment /> */}
        <PaymentGateway />
      </div>
    </div>
  );
}
