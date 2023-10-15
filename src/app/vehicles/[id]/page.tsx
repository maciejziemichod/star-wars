import ImageWithFallback from "@components/ImageWithFallback";
import { getResourceIds, getVehicleData } from "@lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
    const data = await getVehicleData(params.id);

    if (data === null) {
        notFound();
    }

    return (
        <>
            <h1>{data.name}</h1>

            <ImageWithFallback
                alt={`Image of ${data.name}`}
                fallback="/images/vehicles/placeholder.jpg"
                src={`/images/vehicles/${params.id}.jpg`}
                width={600}
                height={400}
            />

            <p className="pt-1rem">Type: {data.type}</p>

            {data.characters.length > 0 && (
                <>
                    <h2 className="pt-1rem">Pilots: </h2>
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
    const ids = await getResourceIds("vehicles");
    return ids.map((id) => ({ id: id.toString() }));
}
