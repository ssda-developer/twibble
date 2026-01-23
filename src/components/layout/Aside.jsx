import AuthorizationBlock from "@/components/auth/AuthorizationBlock";
import Protected from "@/components/auth/Protected";
import Profile from "@/components/profile/Profile";
import SubscriptionAlert from "@/components/profile/SubscriptionAlert";
import TrendingBlock from "@/components/trending/TrendingBlock";

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
                <Protected>
                    <SubscriptionAlert />
                </Protected>
            </div>
            <div className="mb-6">
                <TrendingBlock />
            </div>
        </>
    );
};

export default Aside;
