import PostThread from "@/components/PostThread";

const PostView = ({ id, username }) => {
    return (
        <PostThread id={id} username={username} />
    );
};

export default PostView;

