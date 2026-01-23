import PostCard from "@/components/post/PostCard";
import DataPlaceholder from "@/components/ui/DataPlaceholder";
import { usePathname } from "next/navigation";

const PostList = ({ posts, type }) => {
    const pathname = usePathname();

    if (!posts || posts.length === 0) return <DataPlaceholder type={type} />;

    const visiblePosts = posts.filter(post => {
        if (!post) return false;

        const isUnlikedOnLikesPage = pathname.includes("/liked") && post.userState?.liked === false;
        const isUnsavedOnSavesPage = pathname.includes("/saved") && post.userState?.saved === false;

        return !(isUnlikedOnLikesPage || isUnsavedOnSavesPage);
    });

    if (visiblePosts.length === 0) return <DataPlaceholder type={type} />;

    return (
        <ul className={`border-t border-slate-800 ${type}`}>
            {visiblePosts.map((post, idx) => (
                <li
                    key={post?._id}
                    className={`${type === "parents" || idx === visiblePosts.length - 1 ? "" : "border-b border-slate-800"}`}
                >
                    <PostCard post={post} type={type} />
                </li>
            ))}
        </ul>
    );
};

export default PostList;
