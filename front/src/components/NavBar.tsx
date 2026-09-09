import { useEffect, useRef, useState } from "react";
import { IoMenu, IoClose, IoNotifications } from "react-icons/io5";
import logo from "../assets/Logo OTOB.png";
import { Link } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { useNotificationStore } from "../store/notification.store";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = useNotificationStore((state) => state.unreadCount());
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      {/* NAVBAR */}
      <div className="flex flex-row h-26 w-screen items-center justify-between px-4 pt-4 pb-2 md:px-8 shadow-md">
        <div className="flex flex-row items-center gap-8">
          <img src={logo} className="w-20 h-20 object-contain" alt="Logo" />
          <h1 className="text-4xl font-bold font-inter">OTOB</h1>
        </div>
        {/* MENU DESKTOP */}
        <div className="hidden lg:flex items-center gap-10 font-bold">
          <Link
            to="/"
            className="hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
          >
            Home
          </Link>

          <Link
            to="/all-companies"
            className="hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
          >
            Companies
          </Link>

          <Link
            to="/tasks"
            className="hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
          >
            Tasks
          </Link>

          <Link
            to="/planning"
            className="hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
          >
            Planning
          </Link>

          <Link
            to="/user-profile"
            className="hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
          >
            Profile
          </Link>
        </div>
        <div className="flex flex-row gap-4 md:gap-16 items-center justify-end">
          <Link to={"/notif"}>
            <div className="relative">
              <IoNotifications size={28} className="hover:text-gray-500" />

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-4.5 text-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </Link>
          <button className="hover:text-red-500 font-semibold transition lg:flex flex-row text-center items-center gap-2 hidden">
            Logout
            <IoMdLogOut size={25} />
          </button>
          {/* BURGER MOBILE */}
          <button onClick={() => setIsOpen(!isOpen)} className="flex lg:hidden burger-button">
            {isOpen ? (
              <IoClose size={45} className="hover:text-gray-500" />
            ) : (
              <IoMenu size={45} className="hover:text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* MENU */}
      <div
        ref={menuRef}
        className={`absolute z-1 top-24 right-4 w-56 bg-white rounded-xl p-6 flex flex-col items-center gap-4 transform transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.25)] ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <Link
          to={`/`}
          onClick={() => setIsOpen(false)}
          className="font-bold hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
        >
          Home
        </Link>
        <Link
          to={`/all-companies`}
          onClick={() => setIsOpen(false)}
          className="font-bold hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
        >
          Companies
        </Link>
        <Link
          to={`/tasks`}
          onClick={() => setIsOpen(false)}
          className="font-bold hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
        >
          Tasks
        </Link>
        <Link
          to={`/user-profile`}
          onClick={() => setIsOpen(false)}
          className="font-bold hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
        >
          Profile
        </Link>
        <Link
          to={`/planning`}
          onClick={() => setIsOpen(false)}
          className="font-bold hover:underline hover:decoration-yellow-500 hover:decoration-2 underline-offset-4"
        >
          Planning
        </Link>

        <button className="hover:text-red-500 font-semibold transition flex flex-row text-center items-center gap-2">
          Logout
          <IoMdLogOut size={25} />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
