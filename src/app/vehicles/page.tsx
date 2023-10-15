import List from "@components/List";

export default async function Page() {
    return (
        <>
            <h1>Vehicles</h1>
            <List
                resource="vehicles"
                slug="vehicles"
                width={600}
                height={400}
            />
        </>
    );
}
