import Protected from "@/components/auth/Protected";
import Composer from "@/components/post/Composer";
import PostListData from "@/components/post/PostListData";

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
