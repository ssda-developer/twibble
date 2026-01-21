import Protected from "@/src/components/auth/Protected";
import Composer from "@/src/components/post/Composer";
import PostListData from "@/src/components/post/PostListData";

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
