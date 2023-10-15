import NavigationLink from "@components/NavigationLink";

export default function Navigation() {
    const links = [
        {
            label: "Characters",
            href: "/characters",
        },
        {
            label: "Planets",
            href: "/planets",
        },
        {
            label: "Vehicles",
            href: "/vehicles",
        },
    ];

    return (
        <nav>
            <ul>
                {links.map((link) => (
                    <li key={link.href}>
                        <NavigationLink {...link} />
                    </li>
                ))}
            </ul>
        </nav>
    );
}
