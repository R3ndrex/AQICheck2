import Link from "next/link";
import { UserLocationContext } from "./context/UserLocationContext";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
export default function Layout({ children }) {
    const { data: session, status } = useSession();
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
        <div
            onClick={(e) => {
                if (ref.current && !ref.current.contains(e.target) && visible) {
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
                className={`fixed h-[100%] text-2xl top-0 right-0 p-1 bg-emerald-200 w-[25%] ease-in-out duration-[0.75s] transition ${
                    visible ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <ul className="flex flex-col items-start p-5 gap-5">
                    {session ? (
                        <ul className="mt-8 flex flex-row gap-5 items-center justify-center">
                            <li className="text-xl pb-2 mt-3 pt-2 pr-3">
                                {session.user?.name
                                    ? `Hi, ${session.user.name}`
                                    : "Hi, User"}
                            </li>
                            <li>
                                <button
                                    onClick={signOut}
                                    className="text-base pb-2 mt-3 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-slate-200 hover:bg-emerald-300"
                                >
                                    Log out
                                </button>
                            </li>
                        </ul>
                    ) : (
                        <ul className="mt-8 flex flex-row gap-5">
                            <li>Hi Guest</li>{" "}
                            <>
                                <li>
                                    <Link
                                        href="/register"
                                        onClick={(e) => {
                                            if (pathname === "/register") {
                                                e.preventDefault();
                                            } else {
                                                setVisible((prev) => !prev);
                                            }
                                        }}
                                        className="text-base pb-2 mt-3 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-slate-200 hover:bg-emerald-300"
                                    >
                                        Register
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/login"
                                        onClick={(e) => {
                                            if (pathname === "/login") {
                                                e.preventDefault();
                                            } else {
                                                setVisible((prev) => !prev);
                                            }
                                        }}
                                        className=" text-base pb-2 mt-3 pt-2 pl-3 pr-3 cursor-pointer border-1 bg-slate-200 hover:bg-emerald-300"
                                    >
                                        Login
                                    </Link>
                                </li>
                            </>
                        </ul>
                    )}
                    <li
                        className={`transform duration-500 ${
                            pathname === "/" ? "underline" : ""
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
                            className={`animated-underline ${
                                pathname === "/"
                                    ? "font-semibold pointer-events-none"
                                    : "text-black"
                            }`}
                        >
                            Main
                        </Link>
                    </li>
                    <li
                        className={`transform duration-500 ${
                            pathname === "/map" ? "underline" : ""
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
                            className={`animated-underline ${
                                pathname === "/map"
                                    ? "font-semibold pointer-events-none"
                                    : "text-black"
                            }`}
                        >
                            Map
                        </Link>
                    </li>
                    <li
                        className={`transform duration-500 ${
                            pathname === "/stations" ? "underline" : ""
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
                            className={`animated-underline ${
                                pathname === "/stations"
                                    ? "font-semibold pointer-events-none"
                                    : "text-black"
                            }`}
                        >
                            Stations
                        </Link>
                    </li>
                </ul>
            </aside>
        </div>
    );
}
