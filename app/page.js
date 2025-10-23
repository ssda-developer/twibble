import Composer from "@/components/Composer";
import TweetList from "@/components/TweetList";

export default function HomePage() {
    return (
        <div>
            <Composer />
            <TweetList apiLink="/api/tweets" />
        </div>
    );
}
