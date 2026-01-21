import Link from "next/link";

const EmptyState = ({ icon, title = "", description = "", hint = { text: "", link: "/" } }) => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="max-w-md text-center flex flex-col items-center justify-center text-white">
                <div className="relative mb-2">
                    {icon}
                </div>
                <h1 className="mb-2 text-2xl font-semibold">
                    {title}
                </h1>
                <p className="mb-3 text-sm">
                    {description}
                </p>
                {hint.link ? (
                    <Link href="/" className="text-sm text-slate-400 mb-3 underline">
                        {hint.text}
                    </Link>

                ) : (
                    <p className="text-sm text-slate-400 mb-3">
                        {hint.text}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmptyState;
