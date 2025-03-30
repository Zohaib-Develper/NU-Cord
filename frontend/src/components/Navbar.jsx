import React from "react";
import Logo from "../assets/logo.png"
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div>
      <header className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="md:flex md:items-center md:gap-12 text-[#5e17eb] font-semibold">
              <a className="flex items-end gap-1" href="#">
                <img src={Logo} alt="Logo" className="h-10 w-auto" />
                <p className="text-xl py-1">NU-Cord</p>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-18 text-md">
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-[#5e17eb] dark:text-white dark:hover:text-white/75"
                      href="#">
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-[#5e17eb] dark:text-white dark:hover:text-white/75"
                      href="#">
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-[#5e17eb] dark:text-white dark:hover:text-white/75"
                      href="#">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-[#5e17eb] dark:text-white dark:hover:text-white/75"
                      href="#">
                      Community
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <a
                  className="rounded-xl bg-[#5e17eb] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-80"
                  href="#">
                  Login
                </a>
                <div className="hidden sm:flex">
                  <a
                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-white hover:bg-white hover:text-[#5e17eb]"
                    href="#">
                    Register
                  </a>
                </div>
              </div>
              <div className="block md:hidden">
                <button
                  className="rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 dark:bg-gray-800 dark:text-white dark:hover:text-white/75"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-xs z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)} // Close menu when clicking outside
            />

            <div className="fixed top-0 right-0 w-2/3 h-full bg-white dark:bg-gray-900 z-50 md:hidden shadow-lg">
              <nav className="flex flex-col h-full p-4">
                <ul className="flex flex-col gap-6 text-sm">
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Contact
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75 dark:text-white dark:hover:text-white/75"
                      href="#"
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Community
                    </a>
                  </li>
                </ul>
                <div className="mt-auto pb-4">
                  <a
                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-white hover:bg-white hover:text-[#5e17eb]"
                    href="#"
                    onClick={() => setIsMobileMenuOpen(false)}>
                    Register
                  </a>
                </div>
              </nav>
            </div>
          </>
        )}
      </header>
    </div>
  );
};

export default Navbar;
