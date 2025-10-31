import TweetCard from "@/components/TweetCard";

const PostList = ({ posts }) => {
    if (!posts || posts.length === 0) return <p>No posts</p>;

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
