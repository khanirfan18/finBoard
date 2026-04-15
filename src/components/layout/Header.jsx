import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header>
      <nav className="flex flex-row items-center bg-[#1A1C20] h-25 justify-between">
        <img
          className="w-27 mx-5 mb-3"
          src="src/assets/finb.gif"
          alt="finboard icon"
        />

        <div className="flex flex-row gap-5">
          <Link to={"/"} className="text-orange-500 text-2xl font-bold">
            HOME
          </Link>
          <Link to={"budgets"} className="text-orange-500 text-2xl font-bold">
            BUDGETS
          </Link>
          <Link
            to={"transaction"}
            className="text-orange-500 text-2xl font-bold"
          >
            TRANSACTION
          </Link>
        </div>
      </nav>
    </header>
  );
}
