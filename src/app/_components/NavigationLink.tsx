"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationLinkProps = {
    label: string;
    href: string;
};
export default function NavigationLink({ label, href }: NavigationLinkProps) {
    const pathname = usePathname();

    return (
        <Link
            href={href}
            style={{ textDecoration: pathname === href ? "underline" : "none" }}
        >
            {label}
        </Link>
    );
}
