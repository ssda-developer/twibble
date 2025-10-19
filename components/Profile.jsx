import Avatar from "@/components/Avatar";

const Profile = () => {
    return (
        <div className="p-4 rounded-xl border border-slate-800 flex">
            <Avatar letter="SS" />
            <div className="flex flex-col ml-2">
                <span>Serhii Syrytisa</span>
                <span className="text-sm">@serhiisyrytsia</span>
            </div>
        </div>
    );
};

export default Profile;
