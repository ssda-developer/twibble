import Icon from "@/components/Icon";

const ActionIconButton = ({
                              iconName,
                              onClick,
                              isLocked = false,
                              ariaLabel,
                              className = ""
                          }) => {
    return (
        <button
            type="button"
            onClick={isLocked ? () => {
            } : onClick}
            disabled={isLocked}
            aria-label={ariaLabel}
            className={`
                 flex items-center justify-center mr-3
                ${isLocked ? "opacity-40 cursor-not-allowed" : ""}
                ${className}
            `}
        >
            <div className="relative">
                <Icon name={iconName} />

                {isLocked && (
                    <Icon
                        name="lock-closed"
                        className="absolute -top-1 -right-1 w-3 h-3 text-white"
                    />
                )}
            </div>
        </button>
    );
};

export default ActionIconButton;
