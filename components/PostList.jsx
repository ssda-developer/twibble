import EmptyState from "@/components/EmptyState";
import PostCard from "@/components/PostCard";

const PostList = ({ posts, type }) => {
    if (!posts || posts.length === 0) return <EmptyState type={type} />;

    return (
        <ul className={`border-t border-slate-800 ${type}`}>
            {posts.map((post, idx) => (
                <li key={post?._id}
                    className={`${type === "parents" || idx === posts.length - 1 ? "" : "border-b border-slate-800"}`}>
                    <PostCard post={post} type={type} />
                </li>
            ))}
        </ul>
    );
};

export default PostList;
