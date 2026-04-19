'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const routeTitles: Record<string, string> = {
    "/": "Home",
    "/dashboard": "Dashboard",
    "/calendar": "Calendar",
    "/history": "History",
    "/predict": "Prediction",
    "/profile": "Profile",
    "/upload": "Upload",
    "/auth/login": "Login",
    "/auth/register": "Register",
    "/auth/forgot-password": "Forgot Password",
};

export default function Pathname() {
    const pathname = usePathname();

    useEffect(() => {
        const pageTitle = routeTitles[pathname] ?? pathname
            .split("/")
            .filter(Boolean)
            .map((segment) =>
                segment
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (character) => character.toUpperCase())
            )
            .join(" / ");

        document.title = pageTitle ? `LifeMarkers - ${pageTitle}` : "LifeMarkers";
    }, [pathname]);

    return null;
}