import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";

const Footer = () => {
  return (
 <footer className="w-full border-t border-[#1F1F1F] bg-fin-card/95 backdrop-blur-md mt-auto">

  <div className="px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">

    {/* Logo & Tagline */}
    <div>
      <h2
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF9F43]"
        style={{ fontFamily: "'Righteous', cursive" }}
      >
        FINBOARD
      </h2>

      <p className="text-xs text-gray-500 mt-1">
        Smart Finance • Modern Analytics
      </p>
    </div>

    {/* Right Side */}
    <div className="flex items-center gap-3">

      <button className="px-4 py-2 rounded-lg text-sm bg-[#151515] border border-[#262626] text-gray-300 hover:border-[#FF6B00]/40 hover:text-[#FF6B00] transition-all duration-300">
        Contact
      </button>

      <button className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-[#FF6B00] to-[#FF9F43] text-white hover:opacity-90 transition-all duration-300 shadow-[0_0_20px_rgba(255,107,0,0.2)]">
        Get Started
      </button>

    </div>
  </div>

  {/* Bottom */}
  <div className="border-t border-[#1F1F1F] py-3 text-center text-xs text-gray-500">
    © 2026 FINBOARD • Built with React & Tailwind CSS
  </div>

</footer>
  );
};

export default Footer;