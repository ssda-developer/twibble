import TweetCard from "@/components/TweetCard";

const PostList = ({ posts = [] }) => {
    return (
        <ul>
            {posts.map((post) => (
                <li key={post._id} className="border-b border-slate-800">
                    <TweetCard {...post} />
                </li>
            ))}
        </ul>
    );
};

export default PostList;
