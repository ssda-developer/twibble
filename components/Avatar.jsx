"use client";

const Avatar = ({ colors = { background: "#0086D1", text: "#ffffff" }, letter, size = "small" }) => {
    const currentSize = size === "small" ? "h-11 w-11 text-base" : "h-24 w-24 text-4xl";

    return (
        <div
            className={`${currentSize} rounded-full flex items-center justify-center font-semibold`}
            style={{ backgroundColor: colors?.background, color: colors?.text }}>
            {letter}
        </div>
    );
};

export default Avatar;
