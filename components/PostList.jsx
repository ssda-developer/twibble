import PostCard from "@/components/PostCard";

const PostList = ({ posts }) => {
    if (!posts || posts.length === 0) return <p>No posts</p>;

    return (
        <ul className="border-t border-slate-800">
            {posts.map((post) => (
                <li key={post._id} className="border-b border-slate-800">
                    <PostCard {...post} />
                </li>
            ))}
        </ul>
    );
};

export default PostList;
