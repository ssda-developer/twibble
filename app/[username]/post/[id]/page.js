import Composer from "@/components/Composer";
import TweetCardDetailed from "@/components/TweetCardDetailed";
import TweetList from "@/components/TweetList";

const PostPage = async ({ params }) => {
    const { id, username } = await params;
    // console.log(id, username);

    const res = await fetch(`http://localhost:3000/api/posts/${encodeURIComponent(id)}`);
    const post = await res.json();

    return (
        <article className="max-w-3xl mx-auto">
            <TweetCardDetailed {...post} />
            <Composer parentId={id} placeholder="Post your reply" />
            <TweetList apiLink={`/api/posts/${id}/replies`} />
        </article>
    );
};

export default PostPage;
