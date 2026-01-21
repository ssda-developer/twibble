import PostThread from "@/src/components/post/PostThread";
import BackButton from "@/src/components/ui/BackButton";

const PostPage = async ({ params }) => {
    const { id, username } = await params;

    return (
        <div className="w-full lg:max-w-3xl mx-auto">
            <BackButton text="Back" />
            <PostThread id={id} username={username} />
        </div>
    );
};

export default PostPage;
