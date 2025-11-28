import PostListData from "@/components/PostListData";

const ProfileLikesPage = async ({ params }) => {
    const parameters = await params;
    const userName = parameters.username;

    return (
        <PostListData user={userName} type="user-liked" />
    );
};

export default ProfileLikesPage;
