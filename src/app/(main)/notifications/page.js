import EmptyState from "@/components/ui/EmptyState";
import Icon from "@/components/ui/Icon";

export default function NotificationsPage() {
    return (
        <EmptyState
            icon={<Icon name="lock-closed" className="w-12 h-12 text-slate-500" />}
            title="The notification page is locked."
            description="You need an active subscription to access this page."
            hint={{ text: "Go back to the homepage.", link: "/" }}
        />
    );
}
