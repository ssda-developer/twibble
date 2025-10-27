import ProfileBlock from "@/components/ProfileBlock";

const ProfileLayout = ({ children }) => {
    return (
        <>
            <ProfileBlock />
            {children}
        </>
    );
};

export default ProfileLayout;
