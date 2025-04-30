"use client";
import "./globals.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UserLocationContext } from "./context/UserLocationContext";

export default function RootLayout({ children }) {
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (err) => {
                    console.error(
                        `Geolocation Error: ${err.message}\n Error code: ${err.code}`
                    );
                }
            );
        }
    }, []);

    return (
        <html>
            <body>
                <div
                    onClick={(e) => {
                        if (
                            ref.current &&
                            !ref.current.contains(e.target) &&
                            visible
                        ) {
                            setVisible(false);
                        }
                    }}
                >
                    <UserLocationContext value={userLocation}>
                        {children}
                    </UserLocationContext>
                    <button
                        className="burger cursor-pointer m-5 mt-1 absolute top-0 right-0 w-[3rem] h-[3rem]"
                        onClick={() => setVisible((prev) => !prev)}
                    >
                        <div className="h-[1rem]"></div>
                        <div className="h-[1rem]"></div>
                        <div className="h-[1rem]"></div>
                    </button>

                    <aside
                        ref={ref}
                        className={`fixed h-[100%] text-2xl top-0 right-0 p-1 bg-emerald-200 w-[25%] ease-in-out duration-[1s] transition ${
                            visible ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        <ul className="flex flex-col items-center gap-5">
                            <li className="mt-8">
                                <Link href="/">Main Page</Link>
                            </li>
                            <li>
                                <Link href="/map">Map</Link>
                            </li>
                            <li></li>
                        </ul>
                    </aside>
                </div>
            </body>
        </html>
    );
}
