import Icon from "@/components/ui/Icon";

const DataPlaceholder = ({ type = "feed", className = "" }) => {
    const getIcon = () => {
        switch (type) {
            case "reply":
                return <Icon name="chat-bubble-left-right" className="w-7 h-7" />;
            case "user-posted":
                return <Icon name="inbox" className="w-7 h-7" />;
            case "user-replied":
                return <Icon name="chat-bubble-left" className="w-7 h-7" />;
            case "user-saved":
                return <Icon name="bookmark" className="w-7 h-7" />;
            case "user-liked":
                return <Icon name="heart" className="w-7 h-7" />;
            case "feed":
            default:
                return <Icon name="inbox" className="w-7 h-7" />;
        }
    };

    const getText = () => {
        switch (type) {
            case "reply":
                return "No replies yet";
            case "user-posted":
                return "This user hasn't posted anything yet";
            case "user-replied":
                return "This user hasn't replied on any posts yet";
            case "user-saved":
                return "This user hasn't saved posts yet";
            case "user-liked":
                return "This user hasn't liked posts yet";
            case "feed":
                return "No posts in the feed yet";
            default:
                return "Nothing here yet";
        }
    };

    return (
        <div
            className={`flex flex-col items-center justify-center py-12 text-center border-t border-slate-800 text-slate-400 ${className}`}
        >
            {getIcon()}
            <p className="mt-3 text-md">{getText()}</p>
        </div>
    );
};

export default DataPlaceholder;
