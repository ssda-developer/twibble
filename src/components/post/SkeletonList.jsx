import SkeletonPost from "@/components/post/SkeletonPost";

const SkeletonList = ({ count = 5 }) => {
    const items = Array.from({ length: count });

    return (
        <ul className="border-t border-slate-800">
            {items.map((_, index) => {
                const withImage = Math.random() < 0.5;

                return (
                    <li key={index} className="border-b border-slate-800">
                        <SkeletonPost withImage={withImage} />
                    </li>
                );
            })}
        </ul>
    );
};

export default SkeletonList;
