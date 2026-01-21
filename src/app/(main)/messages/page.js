import EmptyState from "@/src/components/ui/EmptyState";
import Icon from "@/src/components/ui/Icon";

export default function MessagesPage() {
    return (
        <EmptyState
            icon={<Icon name="lock-closed" className="w-12 h-12 text-slate-500" />}
            title="The messages page is locked."
            description="You need an active subscription to access this page."
            hint={{ text: "Go back to the homepage.", link: "/" }}
        />
    );
}
