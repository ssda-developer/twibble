"use client";

import { useLoginUser } from "@/app/features/hooks";
import { useState } from "react";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { mutate } = useLoginUser();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        mutate(
            { username, password },
            {
                onSuccess: () => {
                    setLoading(false);
                },
                onError: (error) => {
                    setError(error?.message || "Error");
                }
            }
        );
    }

    return (
        <form onSubmit={handleSubmit} aria-label="Login form" className="flex flex-col gap-3 max-w-sm">
            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm text-slate-300">
                    User name
                </label>
                <input
                    id="username"
                    type="username"
                    inputMode="username"
                    placeholder="your user name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2 transition"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                disabled={loading}
                className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white px-4 py-2 transition"
            >
                {loading ? "Loading..." : "Login"}
            </button>
        </form>
    );
}
