import { Link } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? "border-primary bg-primary/5 text-primary focus:border-primary focus:bg-primary/5 focus:text-primary"
                    : "border-transparent text-gray-600 hover:border-secondary hover:bg-secondary/5 hover:text-secondary focus:border-secondary focus:bg-secondary/5 focus:text-bg-secondary"
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
