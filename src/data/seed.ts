import { initialColors, RoleList } from "data";

const nodes = {
    'Application-Received': {
        x: -403,
        y: -126,
        width: 200,
        height: 30,
    },
    'Intake-Complete': {
        x: 104,
        y: -46,
        width: 200,
        height: 30,
    },
    Eligibility: {
        x: -252,
        y: -46,
        width: 200,
        height: 30,
    },
    Outreach: {
        x: -70,
        y: -126,
        width: 200,
        height: 30,
    },
    'Case-Review': {
        x: 277,
        y: -126,
        width: 200,
        height: 30,
    },
    'Pending Approval': {
        x: 463,
        y: -46,
        width: 200,
        height: 30,
    },
    Approved: {
        x: 996,
        y: -126,
        width: 200,
        height: 30,
    },
    'Partner-Final-Review': {
        x: 825,
        y: -46,
        width: 200,
        height: 30,
    },
    'Pending-Denial': {
        x: -261,
        y: 39,
        width: 752,
        height: 30,
    },
    'Denied': {
        x: 640,
        y: 39,
        width: 200,
        height: 30,
    },
    'Partner-Review': {
        x: 640,
        y: -126,
        width: 200,
        height: 30,
    }
}

const initialRole = 'Intake-Specialist';
const initialColor = initialColors[initialRole];
const dragHandleClass = '.drag-handle';
const nodeType = 'custom'

const mappedRoles = Object.entries(RoleList).map(([role, id]) => ({ RoleID: id, RoleName: role, IsUniversal: 1, isCluster: 0 }))

const mappedNodes = Object.entries(nodes).map(([nodeName, node]: any) => ({
    id: nodeName,
    dragHandle: dragHandleClass,
    type: nodeType,
    position: {
        x: node.x,
        y: node.y
    },
    data: {
        label: nodeName,
        color: initialColor,
    },
    style: {
        width: node.width,
        height: node.height,
    },
    selected: false,
    positionAbsolute: {
        x: node.x,
        y: node.y
    },
}))

export default [{ ProcessID: 1, ProcessName: 'LBHA v2', nodes: mappedNodes, colors: initialColors, roles: mappedRoles }];