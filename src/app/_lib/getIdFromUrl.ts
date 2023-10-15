export function getIdFromUrl(url: string): number | null {
    const matches = url.match(/(\d+)(?!.*\d)/);

    return matches === null ? null : parseInt(matches[0]);
}
