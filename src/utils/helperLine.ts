export function getHelperLinePositions(payload: { nodeId: string }): [number | undefined, number | undefined, string | undefined, string | undefined, string | undefined, string | undefined, string | undefined, string | undefined] {
    const parentElement = document.querySelector('.react-flow__nodes');

    const siblingNodes = (Array.from(parentElement?.children || []))?.filter(({ attributes }) => Object.values(attributes).some(({ name, value }) => name === 'data-id' && value !== payload?.nodeId));

    const triggerValues: any = siblingNodes.reduce((acc, curr) => {
        const { top, bottom, left, right }: { top: number; bottom: number; left: number; right: number } = curr.getBoundingClientRect();
        const bounds = { top, bottom, left, right };
        const accumulator: any = { ...acc };

        Object.entries(bounds).forEach(([key, value]: [string, any]) => {
            const rounded = parseInt(value);
            if (Array.isArray(accumulator[key])) accumulator[key].push({ value: rounded, key: curr.getAttribute('data-id') });
        })

        return accumulator;
    }, { top: [], bottom: [], left: [], right: [] });

    const [node] = document.querySelectorAll(`[data-id='${payload.nodeId}']`);
    const xConnection = { value: undefined, key: undefined, targetSide: undefined, sourceSide: undefined };
    const yConnection = { value: undefined, key: undefined, targetSide: undefined, sourceSide: undefined };
    const { top, bottom, left, right }: { top: number; bottom: number; left: number; right: number } = node.getBoundingClientRect();
    const snapGap = 4;

    Object.entries({ top, bottom, left, right }).forEach(([sourceSide, value]: [string, number]) => {
        switch (sourceSide) {
            case 'top':
                const foundTopFromTop = triggerValues.top.find((triggerValue: any) => Math.abs(triggerValue.value - value) <= snapGap);
                const foundBottomFromTop = triggerValues.bottom.find((triggerValue: any) => Math.abs(triggerValue.value - value) <= snapGap);
                if (foundTopFromTop) Object.assign(yConnection, { ...foundTopFromTop, targetSide: 'top', sourceSide });
                else if (foundBottomFromTop && !yConnection.key) Object.assign(yConnection, { ...foundBottomFromTop, targetSide: 'bottom', sourceSide });
                break;
            case 'bottom':
                const foundTopFromBottom = triggerValues.top.find((triggerValue: any) => Math.abs(triggerValue.value - value) <= snapGap);
                const foundBottomFromBottom = triggerValues.bottom.find((triggerValue: any) => Math.abs(triggerValue.value - value) <= snapGap);
                if (foundTopFromBottom && (!yConnection.key || yConnection.targetSide === 'bottom')) Object.assign(yConnection, { ...foundTopFromBottom, targetSide: 'top', sourceSide });
                else if (foundBottomFromBottom && !yConnection.key) Object.assign(yConnection, { ...foundBottomFromBottom, targetSide: 'bottom', sourceSide });
                break;
            case 'right':
                const foundRightFromRight = triggerValues.right.find((triggerValue: any) => Math.abs(triggerValue.value - value) <= snapGap);
                const foundLeftFromRight = triggerValues.left.find((triggerValue: any) => Math.abs(triggerValue.value - value) <= snapGap);
                if (foundRightFromRight) Object.assign(xConnection, { ...foundRightFromRight, targetSide: 'right', sourceSide });
                else if (foundLeftFromRight && !xConnection.key) Object.assign(xConnection, { ...foundLeftFromRight, targetSide: 'left', sourceSide });
                break;
            case 'left':
                const foundRightFromLeft = triggerValues.right.find((triggerValue: any) => Math.abs(triggerValue.value - value) <= snapGap);
                const foundLeftFromLeft = triggerValues.left.find((triggerValue: any) => Math.abs(triggerValue.value - value) <= snapGap);
                if (foundRightFromLeft && (!xConnection.key || xConnection.targetSide === 'left')) Object.assign(xConnection, { ...foundRightFromLeft, targetSide: 'right', sourceSide });
                else if (foundLeftFromLeft && !xConnection.key) Object.assign(xConnection, { ...foundLeftFromLeft, targetSide: 'left', sourceSide });
        }
    });

    return [xConnection.value, yConnection.value, xConnection.key, yConnection.key, xConnection.targetSide, yConnection.targetSide, xConnection.sourceSide, yConnection.sourceSide];
}
