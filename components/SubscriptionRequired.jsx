"use client";

import Icon from "@/components/Icon";

const SubscriptionRequired = ({
                                  title = "This section is locked",
                                  description = "You need an active subscription to access this page.",
                                  hint = "Subscribe now to unlock all features and content.",
                                  showLockIcon = true
                              }) => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <div className="max-w-md text-center flex flex-col items-center justify-center text-white">
                {showLockIcon && (
                    <div className="relative mb-2">
                        <Icon name="lock-closed" className="h-12 w-12" />
                    </div>
                )}
                <h1 className="mb-2 text-2xl font-semibold">
                    {title}
                </h1>
                <p className="mb-3 text-sm">
                    {description}
                </p>
                {hint && (
                    <p className="text-xs text-slate-400">
                        {hint}
                    </p>
                )}
            </div>
        </div>
    );
};

export default SubscriptionRequired;
