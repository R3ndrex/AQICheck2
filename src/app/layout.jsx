"use client";

import "./globals.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { UserLocationContext } from "./context/UserLocationContext";
import { usePathname } from "next/navigation";
export default function RootLayout({ children }) {
    const pathname = usePathname();
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
                        className="burger cursor-pointer m-5 mt-[0.5rem] absolute top-0 right-0 w-[2.5rem] h-[2.5rem]"
                        onClick={() => setVisible((prev) => !prev)}
                    >
                        <div className="h-[0.75rem]"></div>
                        <div className="h-[0.75rem]"></div>
                        <div className="h-[0.75rem]"></div>
                    </button>

                    <aside
                        ref={ref}
                        className={`fixed h-[100%] text-2xl top-0 right-0 p-1 bg-emerald-200 w-[25%] ease-in-out duration-[1s] transition ${
                            visible ? "translate-x-0" : "translate-x-full"
                        }`}
                    >
                        <ul className="flex flex-col items-center gap-5">
                            <li
                                className={`mt-8 transform duration-500 ${
                                    pathname === "/"
                                        ? "scale-115"
                                        : "hover:scale-125"
                                }`}
                            >
                                <Link
                                    href="/"
                                    onClick={(e) => {
                                        if (pathname === "/") {
                                            e.preventDefault();
                                        } else {
                                            setVisible((prev) => !prev);
                                        }
                                    }}
                                    className={`hover:underline ${
                                        pathname === "/"
                                            ? "text-gray-700 font-semibold pointer-events-none"
                                            : "text-black"
                                    }`}
                                >
                                    Main
                                </Link>
                            </li>
                            <li
                                className={`transform duration-500 ${
                                    pathname === "/map"
                                        ? "scale-115"
                                        : "hover:scale-125"
                                }`}
                            >
                                <Link
                                    href="/map"
                                    onClick={(e) => {
                                        if (pathname === "/map") {
                                            e.preventDefault();
                                        } else {
                                            setVisible((prev) => !prev);
                                        }
                                    }}
                                    className={`hover:underline ${
                                        pathname === "/map"
                                            ? "text-gray-700 font-semibold pointer-events-none"
                                            : "text-black"
                                    }`}
                                >
                                    Map
                                </Link>
                            </li>
                            <li
                                className={`transform duration-500 ${
                                    pathname === "/stations"
                                        ? "scale-115"
                                        : "hover:scale-125"
                                }`}
                            >
                                <Link
                                    href="/stations"
                                    onClick={(e) => {
                                        if (pathname === "/stations") {
                                            e.preventDefault();
                                        } else {
                                            setVisible((prev) => !prev);
                                        }
                                    }}
                                    className={`hover:underline ${
                                        pathname === "/stations"
                                            ? "text-gray-600 font-semibold pointer-events-none"
                                            : "text-black"
                                    }`}
                                >
                                    Stations
                                </Link>
                            </li>
                        </ul>
                    </aside>
                </div>
            </body>
        </html>
    );
}
