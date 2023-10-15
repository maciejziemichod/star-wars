"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import Image from "next/image";

type ImageWithFallbackProps = {
    fallback: string;
    alt: string;
    src: string;
    width: number;
    height: number;
};

export default function ImageWithFallback({
    fallback,
    alt,
    src,
    width,
    height,
}: ImageWithFallbackProps) {
    const [error, setError] = useState<null | SyntheticEvent>(null);

    useEffect(() => {
        setError(null);
    }, [src]);

    return (
        <Image
            onError={setError}
            alt={error === null ? alt : `Placeholder of ${alt}`}
            src={error === null ? src : fallback}
            width={width}
            height={height}
        />
    );
}
