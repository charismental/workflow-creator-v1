export function pathFromPoints(points: string): string {
    const pointsArray = points.split(';');
    
    return pointsArray.reduce((acc, point, i) => {
        acc += `${i === 0 ? 'M' : point ? 'L' : ''}${point}`;

        return acc;
    }, '');
}

export function testPathForPoint(path: string, point: {x: number; y: number}, start = true): boolean {
    if (!path) return false;
    const commands = path.split(/(?=L|Q)/);
    const coordinates: {x: number; y: number}[] = [];

    for (const cmd of commands) {
        const coordinatesFromString = (str: string) => {
            const [x, y] = str.split(/[,\s+]/).map(el => Math.round(parseFloat(el)));
            return { x, y };
        }

        coordinates.push(coordinatesFromString(cmd.slice(1).trim()));
    }

    return start ? coordinates[0].x === point.x && coordinates[0].y === point.y : coordinates[coordinates.length - 1].x === point.x && coordinates[coordinates.length - 1].y === point.y;
}