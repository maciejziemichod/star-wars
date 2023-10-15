import { fireEvent, render, screen } from "@testing-library/react";
import Navigation from "../src/app/_components/Navigation";
import NavigationLink from "../src/app/_components/NavigationLink";
import MobileNavigationToggle from "../src/app/_components/MobileNavigationToggle";
import ImageWithFallback from "../src/app/_components/ImageWithFallback";
import React from "react";
import "@testing-library/jest-dom";

describe("Navigation", () => {
    it("renders navigation", () => {
        render(<Navigation />);

        expect(screen.getByRole("list")).toBeInTheDocument();

        const links = screen.getAllByRole("link");

        expect(links).toHaveLength(3);
        links.forEach((link) => {
            expect(link).toBeInTheDocument();
        });

        expect(screen.getByText("Characters")).toBeInTheDocument();
        expect(screen.getByText("Planets")).toBeInTheDocument();
        expect(screen.getByText("Vehicles")).toBeInTheDocument();
    });
});

describe("Navigation link", () => {
    it("renders navigation link", () => {
        const label = "Planets";
        const href = "/planets";

        render(<NavigationLink label={label} href={href} />);

        const link = screen.getByRole("link");

        expect(link).toBeInTheDocument();
        expect(link.getAttribute("href")).toBe(href);

        expect(screen.getByText(label)).toBeInTheDocument();
    });
});

describe("Mobile navigation toggle", () => {
    it("renders mobile navigation toggle", () => {
        const testText = "test text";

        const handleClick = jest.spyOn(React, "useState");
        const setIsOpen = jest.fn();
        handleClick.mockImplementation((isOpen) => [isOpen, setIsOpen]);

        render(
            <MobileNavigationToggle>
                <ul>
                    <li>{testText}</li>
                </ul>
            </MobileNavigationToggle>,
        );

        const button = screen.getByRole("button");

        expect(screen.getByText("Star Wars")).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(screen.getByRole("list")).toBeInTheDocument();
        expect(screen.getByText(testText)).toBeInTheDocument();

        fireEvent.click(button);
        expect(setIsOpen).toBeCalled();

        jest.restoreAllMocks();
    });
});

describe("Image with fallback", () => {
    it("renders image", () => {
        const alt = "Image of planet 1";
        const existingImage = "1.jpg";

        render(
            <ImageWithFallback
                fallback="/images/planets/placeholder.jpg"
                alt={alt}
                src={`/images/planets/${existingImage}`}
                width={400}
                height={400}
            />,
        );

        const image = screen.getByRole("img");
        expect(image).toBeInTheDocument();
        expect(image.getAttribute("src")).toMatch(existingImage);
        expect(image.getAttribute("alt")).toBe(alt);
    });

    it("renders fallback image", () => {
        const alt = "Image of planet 1";
        const existingImage = "__notexistingimage.jpg";
        const placeholderImage = "placeholder.jpg";

        render(
            <ImageWithFallback
                fallback={`/images/planets/${placeholderImage}`}
                alt={alt}
                src={`/images/planets/${existingImage}`}
                width={400}
                height={400}
            />,
        );

        const image = screen.getByRole("img");
        fireEvent.error(image);

        expect(image).toBeInTheDocument();
        expect(image.getAttribute("src")).toMatch(placeholderImage);
        expect(image.getAttribute("alt")).toBe(`Placeholder of ${alt}`);
    });
});
