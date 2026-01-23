import PostListData from "@/components/post/PostListData";

const ProfileLikedPage = async ({ params }) => {
    const parameters = await params;
    const userName = parameters.username;

    return (
        <PostListData user={userName} type="user-liked" />
    );
};

export default ProfileLikedPage;
