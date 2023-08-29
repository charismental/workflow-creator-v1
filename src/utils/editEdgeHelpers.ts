import { Nullable } from "types";

export function pathIsEditable(points: string): boolean {
    const pointsArray = points.split(';');

    return pointsArray.length > 4;
}

export function handleEdgeChanges(points: string, xDelta: number, yDelta: number): string {

    const lineDirection = (p1: { x: number; y: number }, p2: { x: number; y: number }): Nullable<string> => {
        if (p1.x === p2.x) return 'vertical';
        if (p1.y === p2.y) return 'horizontal';
        return null;
    };

    const pointsArray = points.split(';');
    pointsArray.pop();

    const cloned = [...pointsArray];
    
    pointsArray.forEach((point, i) => {
        if (i !== 0 && i !== pointsArray.length - 1) {
            const [x, y] = point.split(',').map(el => parseInt(el));
            const [prevX, prevY] = pointsArray[i - 1].split(',').map(el => parseInt(el));
            const canMoveX = !!(prevX && prevY) &&
                (i !== 1 ||
                    lineDirection({ x, y }, { x: prevX, y: prevY }) === 'horizontal') &&
                (i !== pointsArray.length - 2 ||
                    (pointsArray?.[i + 1] &&
                        lineDirection({ x, y }, { x: parseInt(pointsArray[i + 1]?.split(',')[0]), y: parseInt(pointsArray[i + 1]?.split(',')[1]) }) === 'horizontal'
                    )
                );

            const canMoveY = !!(prevX && prevY) &&
                (i !== 1 ||
                    lineDirection({ x, y }, { x: prevX, y: prevY }) === 'vertical') &&
                (i !== pointsArray.length - 2 ||
                    (pointsArray?.[i + 1] &&
                        lineDirection({ x, y }, { x: parseInt(pointsArray[i + 1].split(',')[0]), y: parseInt(pointsArray[i + 1].split(',')[1]) }) === 'vertical'
                    )
                );

            cloned[i] = `${canMoveX ? x + xDelta : x},${canMoveY ? y + yDelta : y}`;
        }
    });

    return cloned.reduce((acc, point, i) => {
        acc += `${i === 0 ? 'M' : point ? 'L' : ''}${point}`;

        return acc;
    }, '');
}