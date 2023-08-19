export function getHelperLinePositions(payload: { nodeId: string }): [number | undefined, number | undefined] {
    const parentElement = document.querySelector('.react-flow__nodes');

    const siblingNodes = (Array.from(parentElement?.children || []))?.filter(({ attributes }) => Object.values(attributes).some(({ name, value }) => name === 'data-id' && value !== payload?.nodeId));

    const triggerValues = siblingNodes.reduce((acc, curr) => {
        const { top, bottom, left, right }: { top: number; bottom: number; left: number; right: number } = curr.getBoundingClientRect();
        const bounds = { top, bottom, left, right };
        const accumulator: any = { ...acc };

        Object.entries(bounds).forEach(([key, value]: [string, any]) => {
            const rounded = Math.round(value);
            if (Array.isArray(accumulator[key]) && !accumulator[key].includes(rounded)) accumulator[key].push(rounded);
        })

        return accumulator;
    }, { top: [], bottom: [], left: [], right: [] });

    const [node] = document.querySelectorAll(`[data-id='${payload.nodeId}']`);

    const { top, bottom, left, right }: { top: number; bottom: number; left: number; right: number } = node?.getBoundingClientRect();

    const x = [...triggerValues.right, ...triggerValues.left].find((v: number) => [Math.round(left), Math.round(right)].includes(v));

    const y = [...triggerValues.top, ...triggerValues.bottom].find((v: number) => [Math.round(top), Math.round(bottom)].includes(v));
    
    return [x, y];
}
