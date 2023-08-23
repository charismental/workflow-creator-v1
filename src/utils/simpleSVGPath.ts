export function simplifySVGPath(pathData: string, returnCoordinatesArray = false): string {
    const commands = pathData.split(/(?=L|Q)/);
    if (!commands) pathData;

    const coordinates = [];

    for (const cmd of commands) {
        const coordinatesFromString = (str: string) => {
            const [x, y] = str.split(/[,\s+]/).map(el => Math.round(parseFloat(el)));
            return { x, y };
        }

        const [command, paramString] = [cmd[0], cmd.slice(1).trim()];

        if (command === 'Q') {
            const [first, second] = paramString.split(' ');
            coordinates.push(coordinatesFromString(first), coordinatesFromString(second));
        } else {
            coordinates.push(coordinatesFromString(paramString));
        }
    }

    let prevDirection: 'x' | 'y' | null = null;

    const simplifiedCoordinates = coordinates.reduce((acc: { x: number, y: number }[], { x, y }, i) => {
        const prevIndex = acc.length - 1;

        if (i === 0) return [{ x, y }];
        if (i === 1) {
            prevDirection = acc[prevIndex]?.x === x ? 'y' : 'x';
            acc.push({ x, y });
        } else if (acc[prevIndex]?.x === x && prevDirection === 'y') {
            acc[prevIndex] = { ...acc[prevIndex], y };
        } else if (acc[prevIndex - 1]?.y === y && prevDirection === 'x') {
            acc[prevIndex] = { ...acc[prevIndex], x };
        } else {
            acc.push({ x, y });
            prevDirection = prevDirection === 'x' ? 'y' : 'x';
        }

        return acc;
    }, [])

    if (returnCoordinatesArray) return simplifiedCoordinates.map(({ x, y }) => `${x},${y}`).join(';') + ';';

    const simplifiedPath = simplifiedCoordinates.reduce((acc, { x, y }, i) => {
        if (i === 0) acc += `M${x},${y}`;
        else acc += `L${x},${y}`;

        return acc;
    }, '')

    return simplifiedPath;
}
