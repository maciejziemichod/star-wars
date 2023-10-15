import { Resource, getResourceList } from "@lib/data";
import { getIdFromUrl } from "@lib/getIdFromUrl";
import Link from "next/link";
import ImageWithFallback from "@components/ImageWithFallback";
import styles from "@components/List.module.css";

type ListProps = {
    resource: Resource;
    slug: string;
    width: number;
    height: number;
};

export default async function List({
    resource,
    slug,
    width,
    height,
}: ListProps) {
    const data = await getResourceList(resource);
    const list = data
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ name, url }, index) => {
            const id = getIdFromUrl(url) ?? index + 1;

            return (
                <Link key={id} href={`/${slug}/${id}`}>
                    <div className={styles.box}>
                        <ImageWithFallback
                            alt={`Image of ${name}`}
                            fallback={`/images/${slug}/placeholder.jpg`}
                            src={`/images/${slug}/${id}.jpg`}
                            width={width}
                            height={height}
                        />
                        <p className={styles.name}>{name}</p>
                    </div>
                </Link>
            );
        });

    return <div className={styles.container}>{list}</div>;
}
