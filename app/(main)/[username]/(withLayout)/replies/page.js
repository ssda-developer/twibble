import PostListData from "@/components/PostListData";

const ProfilePostsPage = async ({ params }) => {
    const parameters = await params;
    const userName = parameters.username;

    return (
        <PostListData user={userName} type="user-replied" />
    );
};

export default ProfilePostsPage;
