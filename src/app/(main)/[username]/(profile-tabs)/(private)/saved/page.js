import PostListData from "@/src/components/post/PostListData";

const ProfileSavedPage = async ({ params }) => {
    const parameters = await params;
    const userName = parameters.username;

    return (
        <PostListData user={userName} type="user-saved" />
    );
};

export default ProfileSavedPage;
