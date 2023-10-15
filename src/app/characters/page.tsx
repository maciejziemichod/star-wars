import List from "@components/List";

export default async function Page() {
    return (
        <>
            <h1>Characters</h1>
            <List
                resource="people"
                slug="characters"
                width={400}
                height={550}
            />
        </>
    );
}
