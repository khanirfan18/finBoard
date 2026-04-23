import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header>
      <nav className="flex flex-row items-center bg-[#1A1C20] h-25">
        <img
          className="w-27 mx-5 mb-3"
          src="src/assets/finb.gif"
          alt="finboard icon"
        />

      </nav>
    </header>
  );
}
