import { useInterpret, useSelector } from "@xstate/react";
import React from "react";
import { Interpreter, State } from "xstate";
import {
  gameMachine,
  GameMachineContext,
  GameMachineEvent,
} from "./game-machine";

type GameContextValue = Interpreter<
  GameMachineContext,
  any,
  GameMachineEvent
> | null;

export const GameContext = React.createContext<GameContextValue>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const service = useInterpret(gameMachine, { devTools: true });
  return (
    <GameContext.Provider value={service}>{children}</GameContext.Provider>
  );
};

export function useGameService() {
  const service = React.useContext(GameContext);
  if (!service) {
    throw new Error("useGameService must be used within a GameProvider");
  }
  return service;
}

export function useGameState(
  selector: (emitted: State<GameMachineContext, GameMachineEvent>) => unknown,
  compare?: (a: unknown, b: unknown) => boolean
) {
  const service = useGameService();
  return useSelector(service, selector, compare);
}

export function useGridRow(rowNumber: number) {
  const row = useGameState(
    (state) => state.context.board[rowNumber]
  ) as Array<string>;
  return row;
}

export function useStateValue() {
  return useGameState((state) => state.value) as string;
}

export function useWord() {
  return useGameState((state) => state.context.word) as string | null;
}

export function useRound() {
  return useGameState((state) => state.context.round) as number;
}

export function useLetters() {
  return useGameState((state) => state.context.letters) as {
    [key: string]: number;
  };
}
