import PostListData from "@/components/post/PostListData";

const ProfilePostedPage = async ({ params }) => {
    const parameters = await params;
    const userName = parameters.username;

    return (
        <PostListData user={userName} type="user-posted" />
    );
};

export default ProfilePostedPage;
