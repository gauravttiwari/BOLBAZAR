import React from 'react'

const SellerNavBar = () => {
  return (
    <div>
        <div className="flex flex-wrap place-items-center h-46  ">
          <section className="relative mx-auto">
            {/* navbar */}
            <nav className="flex justify-between  text-white w-screen bg-[#1E2852] ">
              <div className="px-5 xl:px-12 py-2 flex w-full items-center ">
                <a className="text-3xl font-bold font-heading" href="#">
                  <div className=" ">
                    <img src="logo2.png" alt="" className="h-16" />
                  </div>
                </a>
                {/* Nav Links */}
                <ul className="hidden md:flex px-4 mx-auto font-semibold font-heading space-x-12">
                  <li>
                    <a className="hover:text-gray-200" href="/">
                      Home
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-gray-200" href="#">
                      Category
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-gray-200" href="/productView">
                      Collections
                    </a>
                  </li>
                  <li>
                    <a className="hover:text-gray-200" href="/contact">
                      Contact Us
                    </a>
                  </li>
                </ul>

                {/* Header Icons */}
                <div className="hidden xl:flex items-center space-x-5 items-center">
                  <>
                    
                    {/* Dropdown menu */}
                    <div
                      id="dropdown"
                      className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Dashboard
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Settings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Earnings
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            Sign out
                          </a>
                        </li>
                      </ul>
                    </div>
                  </>

                  
                  {/* Sign In / Register      */}
                  <a
                    className="flex items-center hover:text-gray-200"
                    href="/login"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 hover:text-gray-200"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
              {/* Responsive navbar */}
              
              <a className="navbar-burger self-center mr-12 xl:hidden" href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 hover:text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </a>
            </nav>
          </section>
        </div>
    </div>
  )
}

export default SellerNavBar