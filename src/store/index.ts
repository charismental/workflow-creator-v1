import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { MainStore } from "types";
import { mainState } from "./state";
import { mainActions } from "./actions";

const store = (set: any, get: () => MainStore): MainStore => ({
    ...mainState,
    ...mainActions(set, get),
});

export default create(devtools(store, {
    name: "Main-Store",
    serialize: {
        options: {
            map: true,
            date: true,
            set: true,
            symbol: true,
            error: true,
        },
    },
}));
