"use client";

import { useLoginUser } from "@/app/features/hooks";
import Icon from "@/components/Icon";
import { useState } from "react";

export default function LoginForm() {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { mutate } = useLoginUser();

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: null
        }));
        setGeneralError(null);
    };

    const validateForm = (values) => {
        const nextErrors = {};
        const username = (values.username || "").trim();
        const password = values.password || "";

        if (!username) {
            nextErrors.username = "Username is required.";
        }

        if (!password) {
            nextErrors.password = "Password is required.";
        }

        return nextErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;

        const cleaned = {
            username: (form.username || "").trim(),
            password: form.password || ""
        };

        const validationErrors = validateForm(cleaned);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setGeneralError(null);

        mutate(
            cleaned,
            {
                onSuccess: () => {
                    setLoading(false);
                },
                onError: (error) => {
                    setLoading(false);
                    setGeneralError(error?.message || "Something went wrong");
                }
            }
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            aria-label="Login form"
            className="flex flex-col gap-3 max-w-sm"
            noValidate
        >
            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm text-slate-300">
                    User name
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    inputMode="text"
                    placeholder="your_user.name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2 transition"
                    value={form.username}
                    onChange={handleChange}
                    autoComplete="username"
                    aria-invalid={!!errors.username}
                />
                {errors.username && (
                    <p className="text-yellow-300 text-xs">{errors.username}</p>
                )}
            </div>

            <div className="space-y-2 relative">
                <label htmlFor="password" className="block text-sm text-slate-300">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2 transition"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    aria-invalid={!!errors.password}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 translate-y-1/2 text-sm text-slate-400"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <Icon name="eye-slash" /> : <Icon name="eye" />}
                </button>
                {errors.password && (
                    <p className="text-yellow-300 text-xs">{errors.password}</p>
                )}
            </div>

            {generalError && (
                <p className="text-red-500 text-sm">{generalError}</p>
            )}

            <button
                disabled={loading}
                className={`w-full inline-flex justify-center items-center gap-2 rounded-lg px-4 py-2 transition ${
                    loading
                        ? "bg-sky-500/80"
                        : "bg-sky-600 hover:bg-sky-500 active:bg-sky-700"
                } text-white`}
            >
                {loading ? "Loading..." : "Login"}
            </button>
        </form>
    );
}
