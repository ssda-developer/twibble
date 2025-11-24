"use client";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useRef, useState } from "react";

const AuthorizationBlock = () => {
    const [loginForm, setLoginForm] = useState(true);
    const { authAttentionId } = useUserContext();
    const boxRef = useRef(null);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        if (!authAttentionId) return;

        if (boxRef.current) {
            boxRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            setShake(true);

            const timeout = setTimeout(() => {
                setShake(false);
            }, 600);

            return () => clearTimeout(timeout);
        }
    }, [authAttentionId]);

    return (
        <div ref={boxRef}
             className={`p-4 rounded-xl border border-slate-800 flex flex-col ${shake ? "shake-animation" : ""}`}>
            {loginForm &&
                <>
                    <LoginForm />
                    <p className="mt-2 text-sm text-slate-400">
                        Don't have an account?
                        <button onClick={() => setLoginForm(false)}
                                className="ml-1 underline cursor-pointer  text-sky-400 hover:text-sky-300 transition">
                            Register
                        </button>
                    </p>
                </>
            }
            {!loginForm &&
                <>
                    <RegisterForm />
                    <p className="mt-2 text-sm text-slate-400">
                        Already have an account?
                        <button onClick={() => setLoginForm(true)}
                                className="ml-1 underline cursor-pointer  text-sky-400 hover:text-sky-300 transition">
                            Login
                        </button>
                    </p>
                </>
            }

            <style>
                {`
                    @keyframes shake {
                        0% { transform: translateX(0); }
                        15% { transform: translateX(-6px); }
                        30% { transform: translateX(6px); }
                        45% { transform: translateX(-5px); }
                        60% { transform: translateX(5px); }
                        75% { transform: translateX(-3px); }
                        90% { transform: translateX(3px); }
                        100% { transform: translateX(0); }
                    }
                        
                    .shake-animation {
                        animation: shake 0.6s ease-in-out;
                    }
                `}
            </style>
        </div>
    );
};

export default AuthorizationBlock;
