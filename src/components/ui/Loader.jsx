"use client";

import { SITE_NAME } from "@/src/constants";

const Loader = () => {
    const letters = SITE_NAME.split("");

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex space-x-1">
                {letters.map((letter, i) => (
                    <span
                        key={i}
                        className="text-7xl font-extrabold text-white"
                        style={{
                            display: "inline-block",
                            animation: `twibble 1s ease-in-out ${i * 0.1}s infinite alternate`
                        }}
                    >
                        {letter}
                    </span>
                ))}
            </div>

            <style>
                {`
                    @keyframes twibble {
                        0% { transform: translateX(0) rotate(0deg); }
                        25% { transform: translateX(4px) rotate(5deg); }
                        50% { transform: translateX(8px) rotate(-5deg); }
                        75% { transform: translateX(4px) rotate(3deg); }
                        100% { transform: translateX(0) rotate(0deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default Loader;
