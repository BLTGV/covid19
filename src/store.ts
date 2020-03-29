import { createStore, createTypedHooks, persist } from "easy-peasy";
import model, { StoreModel } from "./model";

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

const store = createStore(
  persist(model, {
    blacklist: ["data"],
    storage: "localStorage",
  }),
);

export default store;
