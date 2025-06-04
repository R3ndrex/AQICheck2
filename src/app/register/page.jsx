"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    async function handleSubmit(e) {
        setError("");
        e.preventDefault();
        try {
            const resUserExists = await fetch("/api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                }),
            });
            const { user } = await resUserExists.json();
            if (user) {
                setError("User already exists");
                return;
            }
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (res.ok) {
                setEmail("");
                setPassword("");
                setName("");
                router.push("/login");
            } else {
                setError("Invalid email or password");
            }
        } catch (error) {
            console.error("Error during registration: ", error);
            setError("Something went wrong. Try again.");
        }
    }
    return (
        <main className="flex flex-wrap justify-center items-top mt-14">
            <section className="m-5">
                <form
                    className="flex flex-col gap-5 bg-white pt-8 pb-8 pl-12 pr-12 shadow-[0_10px_25px_rgba(0,0,0,0.1)] text-center"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <h1 className="text-2xl">Register</h1>
                    <div className="flex flex-col items-start">
                        <label
                            htmlFor="name"
                            className="text-gray-500 font-semibold"
                        >
                            Name
                        </label>
                        <input
                            className="p-1 text-xl placeholder-slate-400"
                            type="text"
                            value={name}
                            placeholder="Name"
                            id="name"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                            className="p-1 text-xl placeholder-slate-400"
                            type="password"
                            value={password}
                            placeholder="Password"
                            id="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="text-red-500 h-[2ch]">{error}</div>
                    </div>
                    <button
                        className="pb-2 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                        type="submit"
                    >
                        Create account
                    </button>
                    <Link
                        className="text-emerald-500 font-semibold animated-underline"
                        href={"/login"}
                    >
                        Already have an account?
                    </Link>
                </form>
            </section>
        </main>
    );
}
