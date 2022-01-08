import { assign, createMachine, MachineConfig } from "xstate";
import _ from "lodash";

// The events that the machine handles
export type GameMachineEvent =
  | { type: "REORDER"; value: Array<string> }
  | { type: "DELETE" }
  | { type: "KEY_SUBMIT"; key: string }
  | { type: "ANSWER_SUBMIT" }
  | { type: "NOT_ENOUGH_LETTERS" }
  | { type: "INVALID_WORD" }
  | { type: "VALID_WORD" };

// The context (extended state) of the machine
export interface GameMachineContext {
  word: string | null;
  round: number;
  currentGuess: Array<string>;
  board: Array<Array<string>>;
}

const getIsValidWord = async (word: string) => {
  const resp = await fetch("/api/isValidWord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word }),
  });
  const data = await resp.json();
  return data.isValid;
};

const gameSpec: MachineConfig<GameMachineContext, any, GameMachineEvent> = {
  initial: "fetchWord",
  context: {
    round: 0,
    word: null,
    currentGuess: ["-0", "-1", "-2", "-3", "-4"],
    board: [
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
      ["", "", "", "", ""],
    ],
  },
  states: {
    fetchWord: {
      invoke: {
        src: async () => {
          const resp = await fetch("/api/word");
          const data = await resp.json();
          return data.word;
        },
        onDone: {
          target: "start",
          actions: [
            assign({
              word: (_, event) => {
                return event.data;
              },
            }),
          ],
        },
      },
    },
    start: {
      on: {
        REORDER: {
          actions: [assign({ currentGuess: (_, e) => e.value })],
        },
        DELETE: {
          actions: [
            assign({
              currentGuess: (ctx) => {
                const delIx = _.findLastIndex(
                  ctx.currentGuess.map((x) => x.split("-")[0]),
                  (x) => x !== ""
                );
                const newGuess = [...ctx.currentGuess];
                newGuess[delIx] = `-${Date.now()}`;
                return newGuess;
              },
            }),
          ],
        },
        KEY_SUBMIT: {
          actions: [
            assign({
              currentGuess: (ctx, e) => {
                const nextIx = ctx.currentGuess
                  .map((x) => x.split("-")[0])
                  .indexOf("");
                const newState = [...ctx.currentGuess];
                newState[nextIx] = `${e.key}-${Date.now()}`;
                return newState;
              },
            }),
          ],
        },
        ANSWER_SUBMIT: "validateGuess",
      },
    },
    validateGuess: {
      invoke: {
        id: "validateGuess",
        src: (ctx) => async (send) => {
          const isValidGuess = ctx.currentGuess.every(
            (x) => x.split("-")[0] !== ""
          );
          if (!isValidGuess) {
            send("NOT_ENOUGH_LETTERS");
          } else {
            const word = ctx.currentGuess.map((x) => x.split("-")[0]).join("");
            const result = await getIsValidWord(word);
            if (result) {
              send("VALID_WORD");
            } else {
              send("INVALID_WORD");
            }
          }
        },
      },
      on: {
        NOT_ENOUGH_LETTERS: "notEnoughLetters",
        INVALID_WORD: "invalidWord",
        VALID_WORD: "reveal",
      },
    },
    notEnoughLetters: {
      after: {
        2000: "start",
      },
    },
    invalidWord: {
      after: {
        2000: "start",
      },
    },
    reveal: {
      entry: [
        assign<GameMachineContext, GameMachineEvent>({
          currentGuess: () => ["-0", "-1", "-2", "-3", "-4"],
          board: (ctx) => {
            const newBoard = [...ctx.board];
            newBoard[ctx.round] = ctx.currentGuess.map((x) => x.split("-")[0]);
            return newBoard;
          },
        }),
      ],
      exit: [assign({ round: (ctx) => ctx.round + 1 })],
      after: {
        2000: "start",
      },
    },
  },
};

export const gameMachine = createMachine<GameMachineContext, GameMachineEvent>(
  gameSpec
);
