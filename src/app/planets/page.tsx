import List from "@components/List";

export default async function Page() {
    return (
        <>
            <h1>Planets</h1>
            <List resource="planets" slug="planets" width={400} height={400} />
        </>
    );
}
