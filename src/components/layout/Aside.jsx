import AuthorizationBlock from "@/src/components/auth/AuthorizationBlock";
import Protected from "@/src/components/auth/Protected";
import Profile from "@/src/components/profile/Profile";
import SubscriptionAlert from "@/src/components/profile/SubscriptionAlert";
import TrendingBlock from "@/src/components/trending/TrendingBlock";

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
