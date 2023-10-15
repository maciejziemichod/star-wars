import { getIdFromUrl } from "./getIdFromUrl";

const apiUrl = "https://swapi.dev/api";
const fetchOptions = { next: { revalidate: 60 * 60 * 24 } };

export type Resource = "people" | "planets" | "vehicles";
type ResourceListItem = {
    name: string;
    url: string;
};
type ResourceListResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: ResourceListItem[];
};

export async function getResourceList(
    resource: Resource,
): Promise<ResourceListItem[]> {
    const baseUrl = `${apiUrl}/${resource}`;
    let collection: ResourceListItem[] = [];

    try {
        const response = await fetch(baseUrl, fetchOptions);

        if (response.status !== 200) {
            return [];
        }

        const data: ResourceListResponse = await response.json();

        collection = data.results;

        const count = data.count;
        const divider = data.results.length;
        const iterations = Math.ceil(count / divider) - 1;
        const promises = [];

        for (let i = 2; i < iterations + 2; ++i) {
            promises.push(
                fetch(`${baseUrl}?page=${i}`, fetchOptions).then((res) =>
                    res.json(),
                ),
            );
        }

        const responses = await Promise.allSettled(promises);

        responses.forEach((data) => {
            if (data.status === "rejected" || !("results" in data.value)) {
                return;
            }

            collection = [...collection, ...data.value.results];
        });
    } catch (error) {
        console.error(error);
    }

    return collection;
}

export async function getResourceIds(resource: Resource): Promise<number[]> {
    const data = await getResourceList(resource);
    const ids = data.map(({ url }) => getIdFromUrl(url));
    return ids.filter((id): id is number => id !== null);
}

type CharacterResponse = {
    name: string;
    homeworld: string;
    species: string[];
    vehicles: string[];
};
type CharacterAsset = {
    id: number;
    name: string;
};
type CharacterData = {
    name: string;
    race: string | null;
    image: string;
    planet: CharacterAsset | null;
    vehicles: CharacterAsset[];
};

export async function getCharacterData(
    id: string,
): Promise<CharacterData | null> {
    const url = `${apiUrl}/people/${id}`;

    try {
        const response = await fetch(url, fetchOptions);

        if (response.status !== 200) {
            return null;
        }

        const data: CharacterResponse = await response.json();

        const [race, planet, vehicles] = await Promise.allSettled([
            getCharacterRace(data.species),
            getCharacterPlanet(data.homeworld),
            getCharacterVehicles(data.vehicles),
        ]);

        return {
            name: data.name,
            image: `/images/characters/${id}`,
            race: race.status === "fulfilled" ? race.value : null,
            planet: planet.status === "fulfilled" ? planet.value : null,
            vehicles: vehicles.status === "fulfilled" ? vehicles.value : [],
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getCharacterRace(races: string[]): Promise<string | null> {
    if (races.length === 0) {
        return "Human";
    }

    try {
        const response = await fetch(races[0], fetchOptions);

        if (response.status !== 200) {
            return null;
        }

        const data = await response.json();

        return typeof data.name === "string" ? data.name : null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getCharacterPlanet(
    planet: string,
): Promise<CharacterAsset | null> {
    try {
        const response = await fetch(planet, fetchOptions);

        if (response.status !== 200) {
            return null;
        }

        const data = await response.json();

        if (typeof data.name !== "string" || typeof data.url !== "string") {
            return null;
        }

        const id = getIdFromUrl(data.url);

        if (id === null) {
            return null;
        }

        return {
            id,
            name: data.name,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getCharacterVehicles(
    vehicles: string[],
): Promise<CharacterAsset[]> {
    const promises = vehicles.map((vehicle) =>
        fetch(vehicle, fetchOptions).then((res) => res.json()),
    );
    const characterVehicles: CharacterAsset[] = [];

    (await Promise.allSettled(promises)).forEach((result) => {
        if (result.status === "rejected") {
            return;
        }

        if (
            typeof result.value.name !== "string" ||
            typeof result.value.url !== "string"
        ) {
            return;
        }

        const id = getIdFromUrl(result.value.url);

        if (id === null) {
            return;
        }

        const vehicle: CharacterAsset = {
            id,
            name: result.value.name,
        };

        characterVehicles.push(vehicle);
    });

    return characterVehicles;
}

type Character = {
    id: number;
    name: string;
};

type PlanetResponse = {
    name: string;
    population: string;
    residents: string[];
};
type PlanetData = {
    name: string;
    population: string;
    characters: Character[];
};

export async function getPlanetData(id: string): Promise<PlanetData | null> {
    const url = `${apiUrl}/planets/${id}`;

    try {
        const response = await fetch(url, fetchOptions);

        if (response.status !== 200) {
            return null;
        }

        const data: PlanetResponse = await response.json();
        const characters = await getRelatedCharacters(data.residents);

        return {
            name: data.name,
            population: data.population,
            characters,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

type VehicleResponse = {
    name: string;
    vehicle_class: string;
    pilots: string[];
};
type VehicleData = {
    name: string;
    type: string;
    characters: Character[];
};

export async function getVehicleData(id: string): Promise<VehicleData | null> {
    const url = `${apiUrl}/vehicles/${id}`;

    try {
        const response = await fetch(url, fetchOptions);

        if (response.status !== 200) {
            return null;
        }

        const data: VehicleResponse = await response.json();
        const characters = await getRelatedCharacters(data.pilots);

        return {
            name: data.name,
            type: data.vehicle_class,
            characters,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getRelatedCharacters(
    characters: string[],
): Promise<Character[]> {
    const promises = characters.map((character) =>
        fetch(character, fetchOptions).then((res) => res.json()),
    );
    const relatedCharacters: Character[] = [];

    (await Promise.allSettled(promises)).forEach((result) => {
        if (result.status === "rejected") {
            return;
        }

        if (
            typeof result.value.name !== "string" ||
            typeof result.value.url !== "string"
        ) {
            return;
        }

        const id = getIdFromUrl(result.value.url);

        if (id === null) {
            return;
        }

        const character: Character = {
            id,
            name: result.value.name,
        };

        relatedCharacters.push(character);
    });

    return relatedCharacters;
}
