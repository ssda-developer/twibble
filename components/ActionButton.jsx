import { formatCount } from "@/utils";

const ActionButton = ({ children, count, className = "", ariaLabel }) => {
    const formatted = formatCount(count);
    return (
        <button
            className={`flex items-center p-1 cursor-pointer rounded-full ${className}`}
            aria-label={ariaLabel}
            title={ariaLabel}
        >
            {children}
            {formatted !== 0 && <span className="ml-1">{formatted}</span>}
        </button>
    );
};

export default ActionButton;
