import Composer from "@/components/Composer";
import PostListData from "@/components/PostListData";
import Protected from "@/components/Protected";

export default function HomePage() {
    return (
        <div>
            <Protected>
                <Composer mode="create" />
            </Protected>
            <PostListData />
        </div>
    );
}
