"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
                callbackUrl: "/",
            });

            if (res.error) {
                console.log("Invalid credentials");
                setError("Invalid email or password");
            } else {
                router.push(res.url || "/");
            }
        } catch (e) {
            console.error("Login error:", e);
            setError("Something went wrong. Try again.");
        }
    }
    return (
        <main className="flex flex-wrap justify-center items-top mt-14">
            <section className="m-5">
                <form
                    className="flex flex-col gap-5 bg-white pt-8  pb-8 pl-12 pr-12 shadow-[0_10px_25px_rgba(0,0,0,0.1)] text-center"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <h1 className="text-2xl">Enter details</h1>
                    <div className="flex flex-col items-start">
                        <label
                            htmlFor="email"
                            className="text-gray-500 font-semibold"
                        >
                            Email
                        </label>
                        <input
                            className="p-1 text-xl placeholder-slate-400"
                            type="text"
                            value={email}
                            placeholder="Email"
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-start mb-4">
                        <label
                            htmlFor="password"
                            className="text-gray-500 font-semibold"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            className="p-1 text-xl placeholder-slate-400"
                            value={password}
                            placeholder="Password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <div className="text-red-500">{error}</div>}
                    </div>
                    <button
                        type="submit"
                        className="pb-2 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                    >
                        Login
                    </button>
                    <Link
                        className="text-emerald-500 font-semibold animated-underline"
                        href={"/register"}
                    >
                        Dont have an account?
                    </Link>
                </form>
            </section>
        </main>
    );
}
