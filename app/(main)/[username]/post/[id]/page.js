import PostThread from "@/components/PostThread";

const PostPage = async ({ params }) => {
    const { id, username } = await params;

    return (
        <div className="w-full lg:max-w-3xl mx-auto">
            <PostThread id={id} username={username} />
        </div>
    );
};

export default PostPage;
