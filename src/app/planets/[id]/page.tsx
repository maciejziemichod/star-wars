import ImageWithFallback from "@components/ImageWithFallback";
import { getPlanetData, getResourceIds } from "@lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const data = await getPlanetData(params.id);

    if (data === null) {
        notFound();
    }

    return (
        <>
            <h1>{data.name}</h1>

            <ImageWithFallback
                alt={`Image of ${data.name}`}
                fallback="/images/planets/placeholder.jpg"
                src={`/images/planets/${params.id}.jpg`}
                width={600}
                height={400}
            />

            <p className="pt-1rem">Population: {data.population}</p>

            {data.characters.length > 0 && (
                <>
                    <h2 className="pt-1rem">Residents: </h2>
                    <ul>
                        {data.characters.map(({ id, name }) => (
                            <li key={id}>
                                <Link href={`/characters/${id}`}>{name}</Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}

export async function generateStaticParams() {
    const ids = await getResourceIds("planets");
    return ids.map((id) => ({ id: id.toString() }));
}
