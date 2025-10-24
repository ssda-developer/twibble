"use client";

const Avatar = ({ letter, size = "small" }) => {
    const currentSize = size === "small" ? "h-11 w-11 text-base" : "h-24 w-24 text-4xl";
    return (
        <div
            className={`${currentSize} rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold`}>
            {letter}
        </div>
    );
};

export default Avatar;
