const Avatar = ({ letter }) => {
    return (
        <div
            className="h-11 w-11 rounded-full bg-orange-600 flex items-center justify-center text-white font-semibold">
            {letter}
        </div>
    );
};

export default Avatar;
