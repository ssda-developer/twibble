import Icon from "@/components/Icon";
import StatusBlock from "@/components/StatusBlock";

export default function SearchPage() {
    return (
        <StatusBlock
            icon={<Icon name="lock-closed" className="h-12 w-12" />}
            title="The messages page is locked."
            description="You need an active subscription to access this page."
            hint={{ text: "Go back to the homepage.", link: "/" }}
        />
    );
}
