import { Link } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="w-full border-t border-fin-border bg-fin-card mt-auto">
      <div className="px-4 md:px-8 py-10">

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Section */}
          <div className="space-y-5">
            <div>
              <h2
                className="text-3xl text-transparent bg-clip-text bg-gradient-to-b from-[#FF6B00] to-[#FF8C00]"
                style={{
                  fontFamily: "'Righteous', 'Bungee', cursive",
                  filter: "drop-shadow(3px 3px 0px #1F1F1F)",
                }}
              >
                FINBOARD
              </h2>

              <p className="text-gray-400 text-sm leading-6 mt-4">
                Smart finance dashboard for tracking budgets,
                transactions, analytics, and financial growth
                with a modern responsive interface.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4">

              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#111111] border border-[#1F1F1F] text-gray-400 hover:text-[#FF6B00] hover:border-[#FF6B00]/40 hover:scale-110 transition-all duration-300"
              >
                <FaGithub size={18} />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#111111] border border-[#1F1F1F] text-gray-400 hover:text-[#FF6B00] hover:border-[#FF6B00]/40 hover:scale-110 transition-all duration-300"
              >
                <FaLinkedin size={18} />
              </a>

              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#111111] border border-[#1F1F1F] text-gray-400 hover:text-[#FF6B00] hover:border-[#FF6B00]/40 hover:scale-110 transition-all duration-300"
              >
                <FaXTwitter size={18} />
              </a>

            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5 tracking-wide">
              Navigation
            </h3>

            <div className="flex flex-col gap-3 text-sm">

              <Link
                to="/"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors"
              >
                Home
              </Link>

              <Link
                to="/budgets"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors"
              >
                Budgets
              </Link>

              <Link
                to="/transaction"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors"
              >
                Transactions
              </Link>

              <Link
                to="/settings"
                className="text-gray-400 hover:text-[#FF6B00] transition-colors"
              >
                Settings
              </Link>

            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5 tracking-wide">
              Features
            </h3>

            <div className="flex flex-col gap-3 text-sm text-gray-400">

              <span className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                Expense Tracking
              </span>

              <span className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                Budget Planning
              </span>

              <span className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                Financial Reports
              </span>

              <span className="hover:text-[#FF6B00] transition-colors cursor-pointer">
                Real-time Analytics
              </span>

            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-5 tracking-wide">
              Contact
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FaEnvelope className="text-[#FF6B00]" />
                <span>support@finboard.com</span>
              </div>

              <p className="text-sm text-gray-400 leading-6">
                Have questions or suggestions?
                Connect with our support team anytime.
              </p>

              <button className="px-5 py-2.5 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] hover:opacity-90 text-white rounded-lg text-sm font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(255,107,0,0.2)]">
                Get Support
              </button>

            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-[#1F1F1F] mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm text-center md:text-left">
            © 2026 FINBOARD. All Rights Reserved.
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            Made with ❤️ using React + Tailwind CSS
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;