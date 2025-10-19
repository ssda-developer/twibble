import ActionButton from "@/components/ActionButton";
import Icon from "@/components/Icon";

const ActionsBlock = ({ classes, retweets, reposts, likes, views }) => {
    return (
        <div className={`flex justify-between text-gray-400 text-sm mt-2 mx-[-4px] ${classes}`}>
            <ActionButton
                count={retweets}
                className="hover:text-blue-500"
                ariaLabel="Retweets"
            >
                <Icon name="chat-bubble-oval-left" />
            </ActionButton>
            <ActionButton
                count={reposts}
                className="hover:text-green-500"
                ariaLabel="Reposts"
            >
                <Icon name="arrow-path-rounded-square" />
            </ActionButton>
            <ActionButton
                count={likes}
                className="hover:text-red-500"
                ariaLabel="Likes"
            >
                <Icon name="heart" />
            </ActionButton>
            <ActionButton
                count={views}
                className="hover:text-purple-500"
                ariaLabel="Views"
            >
                <Icon name="chart-bar-square" />
            </ActionButton>
            <div className="flex">
                <button className="flex items-center cursor-pointer p-1 rounded-full hover:text-blue-500">
                    <Icon name="bookmark" />
                </button>
                <button className="flex items-center cursor-pointer p-1 ml-1 rounded-full hover:text-blue-500">
                    <Icon name="arrow-up-tray" />
                </button>
            </div>
        </div>
    );
};

export default ActionsBlock;
