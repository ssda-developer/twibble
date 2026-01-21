import EmptyState from "@/src/components/ui/EmptyState";
import Icon from "@/src/components/ui/Icon";
import { verifyOwner } from "@/src/lib/auth-check";

export default async function PrivateLayout({ children, params }) {
    const parameters = await params;
    const userName = parameters.username;

    const isOwner = await verifyOwner(userName);

    if (!isOwner) {
        return (
            <EmptyState
                title="This information is private"
                description="Only the account owner can see this page."
                icon={<Icon name="lock-closed" className="w-12 h-12 text-slate-500" />}
            />
        );
    }

    return <>{children}</>;
}
