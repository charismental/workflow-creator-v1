export function pathFromPoints(points: string): string {
    const pointsArray = points.split(';');
    
    return pointsArray.reduce((acc, point, i) => {
        acc += `${i === 0 ? 'M' : point ? 'L' : ''}${point}`;

        return acc;
    }, '');
}
