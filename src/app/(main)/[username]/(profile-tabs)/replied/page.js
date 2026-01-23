import PostListData from "@/components/post/PostListData";

const ProfileRepliedPage = async ({ params }) => {
    const parameters = await params;
    const userName = parameters.username;

    return (
        <PostListData user={userName} type="user-replied" />
    );
};

export default ProfileRepliedPage;
