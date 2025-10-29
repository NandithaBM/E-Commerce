import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ useNavigate added
import Login from "./Login";
import Logout from "./Logout";
import { useAuth } from "../context/AuthProvider";

function Navbar() {
  const [authUser, setAuthUser] = useAuth();
  const navigate = useNavigate(); // ✅ needed for search redirect
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [sticky, setSticky] = useState(false);

  const element = document.documentElement;

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = (
    <>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/course">Books</Link></li>
    </>
  );

  return (
    <div className={`max-w-screen-2xl container mx-auto md:px-20 px-4 fixed top-0 left-0 right-0 z-50 ${
      sticky
        ? "shadow-md bg-base-200 dark:bg-slate-700 dark:text-white duration-300"
        : "dark:bg-slate-800 dark:text-white"
    }`}>
      <div className="navbar">
        {/* START */}
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"/>
              </svg>
            </div>
            <ul tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {navItems}
            </ul>
          </div>
          <Link to="/" className="text-2xl font-bold cursor-pointer">BookStore</Link>
        </div>

        {/* CENTER */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{navItems}</ul>
        </div>

        {/* END */}
        <div className="navbar-end space-x-3">
          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <label className="px-3 py-2 border rounded-md flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="grow outline-none rounded-md px-1 dark:bg-slate-900 dark:text-white"
              />
              <button type="submit">
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 16 16"
                     fill="currentColor"
                     className="w-4 h-4 opacity-70">
                  <path fillRule="evenodd"
                        d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                        clipRule="evenodd"/>
                </svg>
              </button>
            </label>
          </form>

          {/* Theme Toggle */}
          <label className="swap swap-rotate">
  <input type="checkbox" onChange={() => setTheme(theme === "dark" ? "light" : "dark")} />
  
  {/* Light mode icon (sun) */}
  <svg className="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 4.75a.75.75 0 01.75.75v1.75a.75.75 0 01-1.5 0V5.5A.75.75 0 0112 4.75zm0 12.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5zM4.75 12a.75.75 0 01.75-.75h1.75a.75.75 0 010 1.5H5.5A.75.75 0 014.75 12zm12.75.75a.75.75 0 010-1.5h1.75a.75.75 0 010 1.5H17.5zM12 18.25a.75.75 0 01.75.75v1.75a.75.75 0 01-1.5 0V19a.75.75 0 01.75-.75zm-5.303-2.197a.75.75 0 011.06 0l1.24 1.24a.75.75 0 11-1.06 1.06l-1.24-1.24a.75.75 0 010-1.06zm9.606 0a.75.75 0 010 1.06l-1.24 1.24a.75.75 0 11-1.06-1.06l1.24-1.24a.75.75 0 011.06 0zM6.757 6.757a.75.75 0 011.06 0l1.24 1.24a.75.75 0 11-1.06 1.06L6.757 7.817a.75.75 0 010-1.06zm10.486 0a.75.75 0 010 1.06l-1.24 1.24a.75.75 0 11-1.06-1.06l1.24-1.24a.75.75 0 011.06 0z" />
  </svg>

  {/* Dark mode icon (moon) */}
  <svg className="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M21.752 15.002A9 9 0 0112 3a9 9 0 107.998 12.002 7.5 7.5 0 01-8.252-7.5 7.5 7.5 0 009.006 7.5z" />
  </svg>
</label>


          {/* Auth Buttons */}
          {authUser ? (
            <>
              <Link to="/cart">
                <button className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 duration-300">
                  View Cart
                </button>
              </Link>
              <Link to="/profile">
                <button className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 duration-300">
                  My Profile
                </button>
              </Link>
              <Logout />
            </>
          ) : (
            <div>
              <a
                className="bg-black text-white px-3 py-2 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
                onClick={() => document.getElementById("my_modal_3").showModal()}
              >
                Login
              </a>
              <Login />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
