import AuthorizationBlock from "@/components/AuthorizationBlock";
import Profile from "@/components/Profile";
import Protected from "@/components/Protected";
import TrendingBlock from "@/components/TrendingBlock";

const Aside = () => {
    return (
        <>
            <div className="mb-6">
                <Protected>
                    <Profile />
                </Protected>
                <Protected mode="guest">
                    <AuthorizationBlock />
                </Protected>
            </div>
            <div className="mb-6">
                <TrendingBlock />
            </div>
        </>
    );
};

export default Aside;
