import ImageWithFallback from "@components/ImageWithFallback";
import { getCharacterData, getResourceIds } from "@lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const data = await getCharacterData(params.id);

    if (data === null) {
        notFound();
    }

    return (
        <>
            <h1>{data.name}</h1>

            <ImageWithFallback
                alt={`Image of ${data.name}`}
                fallback="/images/characters/placeholder.jpg"
                src={`/images/characters/${params.id}.jpg`}
                width={400}
                height={550}
            />

            {data.race !== null && <p className="pt-1rem">Race: {data.race}</p>}

            {data.planet !== null && (
                <>
                    <h2 className="pt-1rem">Planet:</h2>
                    <p className="pt-0.5rem">
                        <Link href={`/planets/${data.planet.id}`}>
                            {data.planet.name}
                        </Link>
                    </p>
                </>
            )}

            {data.vehicles.length > 0 && (
                <>
                    <h2 className="pt-1rem">Vehicles: </h2>
                    <ul>
                        {data.vehicles.map(({ id, name }) => (
                            <li key={id}>
                                <Link href={`/vehicles/${id}`}>{name}</Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </>
    );
}

export async function generateStaticParams() {
    const ids = await getResourceIds("people");
    return ids.map((id) => ({ id: id.toString() }));
}
