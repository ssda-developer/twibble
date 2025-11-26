"use client";

import Icon from "@/components/Icon";

const UnderConstruction = ({
                               title = "Page under construction",
                               description = "We're working on this section. Something cool will be here soon.",
                               hint = "For now, you can go back to the feed and browse new posts."
                           }) => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="max-w-md text-center flex flex-col items-center justify-center text-white">
                <Icon name="wrench-screwdriver" className="h-12 w-12 mb-2" />
                <h1 className="mb-2 text-2xl font-semibold">
                    {title}
                </h1>
                <p className="mb-3 text-sm">{description}</p>
                {hint && (
                    <p className="text-xs">
                        {hint}
                    </p>
                )}
            </div>
        </div>
    );
};

export default UnderConstruction;
