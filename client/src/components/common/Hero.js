import React from "react";

export default function Hero({ heading, message }) {
    return (
        <div className="flex items-center justify-center h-screen mb-12 bg-fixed bg-center bg-cover custom-img">
            {/* Overlay */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/0 z-[2]" />
            <div className="p-5 text-white z-[2] flex flex-col items-center justify-center w-full h-full">
                <h2 className="text-5xl font-bold">{heading}</h2>
                <p className="py-5">{message}</p>
                <button className="px-8 py-2.5 bg-gradient-to-r from-blue-500 to-gray-400 text-white hover:from-gray-400 hover:to-blue-500 hover:text-white rounded-md transition duration-300 ease-in-out">
                    Start
                </button>
            </div>
        </div>
    )
}
