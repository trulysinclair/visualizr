import { Slice, Store } from "@/types/store";
import { State, StoreMutatorIdentifier, StateCreator } from "zustand";

type Logger = <
  T extends State,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T extends State>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  type T = ReturnType<typeof f>;

  const loggedSet: typeof set = (...all) => {
    // console.log(...(name ? [`${name} Previous:`] : []), get());

    // get the payload from the action
    // @ts-ignore:disable-next-line
    const payload: Store = all[0];

    // console.log(...(name ? [`${name} Action:`] : []), ...all);

    set(...all);

    // console.log(...(name ? [`${name} Update:`] : []), get());
  };

  store.setState = loggedSet;

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as unknown as Logger;