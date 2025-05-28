"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    async function handleSubmit(e) {
        setError("");
        e.preventDefault();
        try {
            const res = await signIn("credentials", {
                email,
                password,
                callbackUrl: "/",
            });
            if (res.error) {
                setError("Invalid credentials");
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }
    return (
        <main className="flex flex-wrap justify-center items-top mt-14">
            <section className="m-5">
                <form
                    className="flex flex-col gap-5"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <h1 className="text-2xl">Enter details</h1>
                    <input
                        type="text"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        value={password}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="pb-2 mt-3 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                    >
                        Login
                    </button>
                </form>
                {error && <div className="text-red-500">{error}</div>}
            </section>
        </main>
    );
}
