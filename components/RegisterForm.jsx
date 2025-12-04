"use client";

import Avatar from "@/components/Avatar";
import Icon from "@/components/Icon";
import { useRegisterUser } from "@/features/hooks";
import { generateAvatarColors } from "@/utils";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const RegisterForm = () => {
    const [form, setForm] = useState({
        username: "",
        displayName: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarColors] = useState(() => generateAvatarColors());
    const router = useRouter();
    const pathname = usePathname();
    const { mutate } = useRegisterUser();

    const getInitials = (name) => {
        if (!name) return "?";

        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((p) => p.replace(/[^A-Za-z0-9]/g, ""));

        if (parts.length === 0) return "?";
        if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const initials = getInitials(form.displayName);

    const validateForm = (values) => {
        const nextErrors = {};

        const username = (values.username || "").trim();
        const displayName = (values.displayName || "").trim();
        const password = values.password || "";
        const confirmPassword = values.confirmPassword || "";

        if (!displayName) {
            nextErrors.displayName = "Display name is required.";
        } else if (displayName.length > 18) {
            nextErrors.displayName = "Display name must be 18 characters or less.";
        }

        if (!username) {
            nextErrors.username = "Username is required.";
        } else if (!/^[a-zA-Z0-9._]+$/.test(username)) {
            nextErrors.username =
                "Only English letters, digits, dots and underscores allowed.";
        } else if (username.length > 15) {
            nextErrors.username = "Username must be 15 characters or less.";
        }

        if (password.length < 6) {
            nextErrors.password = "Password must be at least 6 characters.";
        }

        if (password !== confirmPassword) {
            nextErrors.confirmPassword = "Passwords do not match.";
        }

        return nextErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "displayName") {
            newValue = value.slice(0, 18);
        }

        if (name === "username") {
            newValue = value.replace(/[^a-zA-Z0-9._]/g, "").slice(0, 15);
        }

        setForm((prev) => ({
            ...prev,
            [name]: newValue
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: null,
            general: null
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;

        const cleaned = {
            username: (form.username || "").trim(),
            displayName: (form.displayName || "").trim(),
            password: form.password || "",
            confirmPassword: form.confirmPassword || ""
        };

        const validationErrors = validateForm(cleaned);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        const colors = {
            background: avatarColors.bgColor || avatarColors.background,
            text: avatarColors.textColor || avatarColors.text
        };

        mutate(
            {
                displayName: cleaned.displayName,
                username: cleaned.username,
                password: cleaned.password,
                avatar: {
                    initials,
                    colors
                }
            },
            {
                onSuccess: () => {
                    setLoading(false);

                    if (pathname === "/authorization") {
                        router.push("/");
                    } else {
                        router.refresh();
                    }
                },
                onError: (err) => {
                    setLoading(false);
                    setErrors((prev) => ({
                        ...prev,
                        general: err?.message || "Something went wrong"
                    }));
                }
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-sm" noValidate>
            <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                    <label htmlFor="displayName" className="block text-sm text-slate-300">
                        Display name
                    </label>
                    <div className="flex">
                        <input
                            id="displayName"
                            name="displayName"
                            type="text"
                            placeholder="New User"
                            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2 transition"
                            value={form.displayName}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                        <Avatar
                            classes="ml-2"
                            colors={{
                                background: avatarColors.bgColor || avatarColors.background,
                                text: avatarColors.textColor || avatarColors.text
                            }}
                            letter={initials}
                        />
                    </div>
                    {errors.displayName && (
                        <p className="text-yellow-300 text-xs">{errors.displayName}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="username" className="block text-sm text-slate-300">
                    User name
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="your_user.name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2 transition"
                    value={form.username}
                    onChange={handleChange}
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
                    autoComplete="new-password"
                    aria-invalid={!!errors.password}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 translate-y-1/2 text-sm text-slate-400"
                >
                    {showPassword ? <Icon name="eye-slash" /> : <Icon name="eye" />}
                </button>
                {errors.password && (
                    <p className="text-yellow-300 text-xs">{errors.password}</p>
                )}
            </div>

            <div className="space-y-2 relative">
                <label htmlFor="confirmPassword" className="block text-sm text-slate-300">
                    Confirm password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 px-3 py-2 transition"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="absolute right-2 translate-y-1/2 text-sm text-slate-400"
                >
                    {showConfirmPassword ? <Icon name="eye-slash" /> : <Icon name="eye" />}
                </button>
                {errors.confirmPassword && (
                    <p className="text-yellow-300 text-xs">{errors.confirmPassword}</p>
                )}
            </div>

            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

            <button
                disabled={loading}
                className={`w-full inline-flex justify-center items-center gap-2 rounded-lg px-4 py-2 transition ${
                    loading ? "bg-sky-500/80" : "bg-sky-600 hover:bg-sky-500 active:bg-sky-700"
                } text-white`}
            >
                {loading ? "Loading..." : "Sign up"}
            </button>
        </form>
    );
};

export default RegisterForm;
