import PostListData from "@/components/PostListData";

const ProfileSavedPage = async ({ params }) => {
    const parameters = await params;
    const userName = parameters.username;

    return (
        <PostListData user={userName} type="userSaves" />
    );
};

export default ProfileSavedPage;
