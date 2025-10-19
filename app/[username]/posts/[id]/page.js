import Composer from "@/components/Composer";
import TweetCardDetailed from "@/components/TweetCardDetailed";
import TweetList from "@/components/TweetList";

const PostPage = async ({ params }) => {
    const { id } = await params;

    const res = await fetch(`http://localhost:3000/api/tweets/${encodeURIComponent(id)}`);
    const post = await res.json();

    return (
        <article className="max-w-3xl mx-auto">
            <TweetCardDetailed {...post} />
            <Composer placeholder="Post your reply" />
            <TweetList />
        </article>
    );
};

export default PostPage;
