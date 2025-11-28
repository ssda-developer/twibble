import PostView from "@/components/PostView";

const PostPage = async ({ params }) => {
    const { id, username } = await params;

    return (
        <div className="max-w-3xl mx-auto">
            <PostView id={id} username={username} />
        </div>
    );
};

export default PostPage;
