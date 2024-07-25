import Link from "next/link";
import React from "react";

export default function CourseCard({ title, coursename, id }) {
  return (
    <div className="flex px-8 lg:h-[6rem] md:h-[5rem] md:flex-row flex-col justify-between bg-blue-1 bg-opacity-10 items-center rounded-md shadow-lg my-4">
      <span className="lg:text-base md:text-sm md:text-left text-center font-semibold my-2">
        {title}
      </span>
      <div className="flex lg:space-x-10 md:space-x-6 items-center md:flex-row flex-col md:space-y-0 space-y-3">
        <Link href={`/courses/${coursename}`}>
          <a className="bg-blue-1 text-white lg:px-8 md:px-6 px-5 py-2 rounded-md hover:bg-blue-500 transition duration-300 ease-in-out">
            Mehr infos
          </a>
        </Link>
      </div>
    </div>
  );
}
