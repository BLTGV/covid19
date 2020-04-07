import {
  createStore as createEPStore,
  createTypedHooks,
  persist,
} from "easy-peasy";
import { StoreModel } from "./model";

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

const createStore = (model: StoreModel) =>
  createEPStore(
    persist(model, {
      blacklist: ["data"],
      storage: "localStorage",
    }),
  );

export default createStore;
