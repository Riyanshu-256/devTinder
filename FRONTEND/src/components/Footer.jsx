import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-dark-border bg-dark-card/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold shadow">
                D
              </div>
              <span className="text-xl font-bold gradient-text">DevTinder</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              DevTinder is a developer-first networking platform built to help
              developers connect, collaborate, and grow together through
              meaningful professional connections.
            </p>
          </div>

          {/* PRODUCT LINKS */}
          <div className="md:ml-auto">
            <h4 className="text-gray-200 font-semibold mb-3">Product</h4>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/profile"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/connections"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  Connections
                </Link>
              </li>
              <li>
                <Link
                  to="/requests"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  Requests
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-10 pt-6 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} DevTinder. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">Built with ❤️ for developers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
