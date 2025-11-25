const SkeletonPost = ({ withImage = false }) => {
    return (
        <div className="flex p-4">
            <div className="mr-3 flex flex-col items-center">
                <div className="h-10.5 w-10.5 rounded-lg skeleton bg-slate-800" />
            </div>

            <div className="flex-1">
                <div className="mt-3 mb-3 flex items-center">
                    <div className="flex mr-auto flex-1 space-y-1">
                        <div className="h-5 w-5/12 skeleton bg-slate-800" />
                        <div className="h-5 w-2/12 skeleton bg-slate-800 ml-2" />
                    </div>
                </div>

                <div className="mt-1 space-y-2">
                    <div className="h-6 w-4/12 skeleton bg-slate-800" />
                    <div className="h-6 w-12/12 skeleton bg-slate-800" />
                    <div className="h-6 w-8/12 skeleton bg-slate-800" />
                    {withImage &&
                        <div className="flex mt-5">
                            <div className="h-46 w-9/12 rounded-xl skeleton bg-slate-800" />
                            <div className="h-46 w-3/12 rounded-tl-xl rounded-bl-xl skeleton bg-slate-800 ml-2" />
                        </div>}
                </div>

                <div className="flex justify-between text-sm my-4 text-gray-400">
                    <div className="h-5 w-5 skeleton bg-slate-800" />
                    <div className="h-5 w-5 skeleton bg-slate-800" />
                    <div className="h-5 w-5 skeleton bg-slate-800" />
                    <div className="h-5 w-5 skeleton bg-slate-800" />
                    <div className="flex space-x-1">
                        <div className="h-5 w-5 skeleton bg-slate-800" />
                        <div className="h-5 w-5 skeleton bg-slate-800 ml-4" />
                    </div>
                </div>
            </div>

            <style>
                {`
                    .skeleton {
                        overflow: hidden;
                        position: relative;
                    }
                    
                    .skeleton::after {
                        animation: skeleton-shimmer 1.4s infinite;
                        background-image: linear-gradient(
                                90deg,
                                rgba(255, 255, 255, 0) 0,
                                rgba(255, 255, 255, 0.18) 20%,
                                rgba(255, 255, 255, 0.25) 60%,
                                rgba(255, 255, 255, 0)
                        );
                        content: "";
                        inset: 0;
                        position: absolute;
                        transform: translateX(-100%);
                    }
                    
                    @keyframes skeleton-shimmer {
                        100% {
                            transform: translateX(100%);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default SkeletonPost;
