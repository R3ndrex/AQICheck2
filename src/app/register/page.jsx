"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
                console.log("User registration failed");
            }
        } catch (error) {
            console.log("Error during registration: ", error);
        }
    }
    return (
        <main className="flex flex-wrap justify-center items-top mt-9">
            <section className="m-5">
                <form
                    className="flex flex-col gap-5"
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <h1>Register</h1>
                    <input
                        type="text"
                        value={name}
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
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
                        className="pb-2 mt-3 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-emerald-200"
                        type="submit"
                    >
                        Create account
                    </button>
                </form>
                {error && <div className="text-red-500">{error}</div>}
            </section>
        </main>
    );
}
