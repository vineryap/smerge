import { Component } from "solid-js";

const Header: Component = () => {
  return (
    <header class="body-font bg-white shadow">
      <div class="sm:mx-10 flex flex-row flex-wrap p-5 justify-between items-center">
        <a
          href="/"
          hreflang="en"
          class="flex lg:w-1/5 title-font font-medium items-center text-gray-900 justify-start mb-4 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span class="ml-3 text-xl">SMerge</span>
        </a>
        <div class="lg:w-2/5 inline-flex justify-end ml-5 lg:ml-0">
          <a class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mb-4 md:mb-0">
            Github
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="w-4 h-4 ml-1"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
