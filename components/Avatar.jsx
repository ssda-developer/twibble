"use client";

const Avatar = ({ colors = { background: "#0086D1", text: "#ffffff" }, letter, size = "small", classes }) => {
    const currentSize = size === "small" ? "h-10.5 w-10.5 text-base" : "h-24 w-24 text-4xl";

    return (
        <div
            className={`${currentSize} rounded-lg flex-shrink-0 flex items-center justify-center font-semibold ${classes}`}
            style={{ color: colors?.text, backgroundColor: colors?.background }}>
            {letter}
        </div>
    );
};

export default Avatar;
