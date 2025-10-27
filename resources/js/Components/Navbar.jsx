import { Link, usePage } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { useState } from "react";

export default function Navbar() {
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user?.role?.name || "guest";

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    // Menu berdasarkan role
    const getMenuItems = () => {
        switch (role.toLowerCase()) {
            case "admin":
                return [{ name: "Dashboard", route: "admin.dashboard" }];
            case "moderator":
                return [{ name: "Dashboard", route: "moderator.dashboard" }];
            case "member":
                return [{ name: "Dashboard", route: "members.dashboard" }];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    return (
        <nav className="border-b border-gray-100 bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                    {/* Logo & Menu */}
                    <div className="flex">
                        <div className="flex shrink-0 items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.route}
                                    href={route(item.route)}
                                    active={route().current(item.route)}
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* User Dropdown */}
                    <div className="hidden sm:ms-6 sm:flex sm:items-center">
                        <div className="relative ms-3">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md">
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                        >
                                            <span className="mr-1">
                                                {user.name}
                                            </span>

                                            <svg
                                                className="-me-0.5 ms-2 h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-2 text-xs text-gray-400 border-b">
                                        Role:{" "}
                                        <span className="font-semibold capitalize">
                                            {role}
                                        </span>
                                    </div>

                                    {role.toLowerCase() === "company" && (
                                        <Dropdown.Link
                                            href={route("company.profile.show")}
                                        >
                                            View Profile
                                        </Dropdown.Link>
                                    )}

                                    {role.toLowerCase() === "jobseeker" && (
                                        <Dropdown.Link
                                            href={route(
                                                "jobseeker.profile.show"
                                            )}
                                        >
                                            View Profile
                                        </Dropdown.Link>
                                    )}

                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-me-2 flex items-center sm:hidden">
                        <button
                            onClick={() =>
                                setShowingNavigationDropdown(
                                    (previousState) => !previousState
                                )
                            }
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    className={
                                        !showingNavigationDropdown
                                            ? "inline-flex"
                                            : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                                <path
                                    className={
                                        showingNavigationDropdown
                                            ? "inline-flex"
                                            : "hidden"
                                    }
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={
                    (showingNavigationDropdown ? "block" : "hidden") +
                    " sm:hidden"
                }
            >
                <div className="space-y-1 pb-3 pt-2">
                    {menuItems.map((item) => (
                        <ResponsiveNavLink
                            key={item.route}
                            href={route(item.route)}
                            active={route().current(item.route)}
                        >
                            {item.name}
                        </ResponsiveNavLink>
                    ))}
                </div>

                <div className="border-t border-gray-200 pb-1 pt-4">
                    <div className="px-4 flex items-center">
                        <div>
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 space-y-1">
                        {role.toLowerCase() === "company" && (
                            <ResponsiveNavLink
                                href={route("company.profile.show")}
                            >
                                View Profile
                            </ResponsiveNavLink>
                        )}

                        {role.toLowerCase() === "jobseeker" && (
                            <ResponsiveNavLink
                                href={route("jobseeker.profile.show")}
                            >
                                View Profile
                            </ResponsiveNavLink>
                        )}

                        <ResponsiveNavLink
                            method="post"
                            href={route("logout")}
                            as="button"
                        >
                            Log Out
                        </ResponsiveNavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}
