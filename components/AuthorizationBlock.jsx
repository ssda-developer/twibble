const AuthorizationBlock = () => {
    return (
        <div className="p-4 rounded-xl border border-slate-800 flex flex-col">
            {/*<div className="mb-6 flex items-center gap-2">*/}
            {/*    <button*/}
            {/*        type="button"*/}
            {/*        className="px-4 py-2 rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 transition"*/}
            {/*        aria-current="page"*/}
            {/*    >*/}
            {/*        Login*/}
            {/*    </button>*/}
            {/*    <button*/}
            {/*        type="button"*/}
            {/*        className="px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"*/}
            {/*    >*/}
            {/*        Registration */}
            {/*    </button>*/}
            {/*</div>*/}

            <form className="space-y-4" aria-label="Форма авторизации">
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm text-slate-300">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2 transition"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm text-slate-300">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2 transition"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm text-slate-300 select-none">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-sky-500 focus:ring-sky-500"
                        />
                        Remember me
                    </label>
                    <a href="#" className="text-sm text-sky-400 hover:text-sky-300 transition">
                        Forgot password?
                    </a>
                </div>

                <button
                    type="submit"
                    className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white px-4 py-2.5 transition"
                >
                    Login
                </button>
            </form>

            {/*<div className="relative my-6">*/}
            {/*    <div className="absolute inset-0 flex items-center">*/}
            {/*        <span className="w-full border-t border-slate-800"></span>*/}
            {/*    </div>*/}
            {/*    <div className="relative flex justify-center text-sm">*/}
            {/*        <span className="px-2 bg-slate-900/40 text-slate-400">or</span>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <p className="mt-2 text-center text-sm text-slate-400">
                Don't have an account?
                <a href="#" className="text-sky-400 hover:text-sky-300 transition">
                    Register
                </a>
            </p>

        </div>
    );
};

export default AuthorizationBlock;
