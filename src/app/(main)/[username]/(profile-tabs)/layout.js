import ProfileBlock from "@/components/profile/ProfileBlock";

const ProfileLayout = async ({ children, params }) => {
    const parameters = await params;
    const userName = parameters.username;

    return (
        <>
            <ProfileBlock userName={userName} />
            {children}
        </>
    );
};

export default ProfileLayout;
