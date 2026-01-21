"use client";

import LoginForm from "@/src/components/auth/LoginForm";
import RegisterForm from "@/src/components/auth/RegisterForm";
import { useGlobalContext } from "@/src/context/GlobalContext";
import { useEffect, useRef, useState } from "react";

const AuthorizationBlock = ({ classes }) => {
    const [loginForm, setLoginForm] = useState(true);
    const { setAuthAttentionHandler } = useGlobalContext();

    const boxRef = useRef(null);
    const [shake, setShake] = useState(false);

    useEffect(() => {
        setAuthAttentionHandler(() => () => {
            if (!boxRef.current) return;

            boxRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
            setShake(true);

            setTimeout(() => setShake(false), 600);
        });
    }, [setAuthAttentionHandler]);

    return (
        <div ref={boxRef}
             className={`flex flex-col p-4 rounded-xl lg:border lg:border-slate-800 ${shake ? "shake-animation" : ""} ${classes}`}>
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
