// doing it this way for now to get around use of hook
import { RoleList, StateList, initialColors } from 'data';
import { create } from 'zustand';

function returnObjectMap(list: any, initial: any) {
    return Object.keys(list).forEach(el => {
        initial[el] = [];
    })
}

interface MainState {
    activeRole: string;
    initialAllEdges: any;
    initialAllStates: any;
    states: {[key: string]: number};
    allEdges: any;
    allCanSeeStates: any;
    roleColors: {[key: string]: string};
    roles: {[key: string]: number};
}

interface MainActions {
    setActiveRole: (role: string) => void;
    setState: (el: {[key: string]: number}) => void;
    setAllEdges: (el: {[key: string]: number}) => void;
    setAllCanSeeStates: (el: any) => void;
    setRoleColors: (el: {[key: string]: string}) => void;
    setRoles: (el: {[key: string]: number}) => void
}

const useMainStore = create<MainState & MainActions>()(
    (set) => ({
        activeRole: 'Intake-Specialist',
        setActiveRole: (role) => set(() => ({activeRole: role})),
        initialAllEdges: {},
        initialAllStates: {}, // cannot Object.keys() it....
        states: {...StateList},
        setState: (el) => set(() => ({states: el})),
        allEdges: [],
        setAllEdges: (el) => set(() => ({allEdges: el})),
        allCanSeeStates: {},
        setAllCanSeeStates: (el) => set(() => ({allCanSeeStates: el})),
        roleColors: {...initialColors},
        setRoleColors: (el) => set(() => ({roleColors: el})),
        roles: {...RoleList},
        setRoles: (el) => set(() => ({roles: el}))
    }))


export default useMainStore;