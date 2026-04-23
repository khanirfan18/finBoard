import { Link } from "react-router-dom";
export default function Sidebar() {
  return (
    <div className="w-1/6 bg-[#CF7500]">
      <div className="flex flex-col items-center gap-5">

        <Link to={"/"} className="text-black-500 text-xl font-bold">
          HOME
        </Link>

        <Link to={"budgets"} className="text-black-500 text-xl font-bold">
          BUDGETS
        </Link>

        <Link to={"transaction"} className="text-black-500 text-xl font-bold">
          TRANSACTION
        </Link>

        <Link to={"settings"} className="text-black-500 text-xl font-bold">
          SETTINGS
        </Link>
        
      </div>
    </div>
  );
}
