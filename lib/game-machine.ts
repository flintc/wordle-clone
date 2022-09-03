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
  | { type: "VALID_WORD" }
  | { type: "NEW_GAME" };

// The context (extended state) of the machine
export interface GameMachineContext {
  word: string | null;
  round: number;
  currentGuess: Array<string>;
  board: Array<Array<string>>;
  letters: {
    [letter: string]: number;
  };
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
    letters: {},
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
            try {
              const result = await getIsValidWord(word);
              if (result) {
                send("VALID_WORD");
              } else {
                send("INVALID_WORD");
              }
            } catch (e) {
              console.log("!!!!", e);
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
        1000: "start",
      },
    },
    invalidWord: {
      after: {
        1000: "start",
      },
    },
    reveal: {
      entry: [
        assign<GameMachineContext, GameMachineEvent>({
          letters: (ctx) => {
            const letters = {} as { [letter: string]: number };
            ctx.currentGuess.forEach((x, pos) => {
              const letter = x.split("-")[0];

              const isCorrect = ctx.word?.includes(letter.toLowerCase());
              const isSelected =
                isCorrect && pos === ctx.word?.indexOf(letter.toLowerCase());
              // console.log(
              //   "aaaa!",
              //   letter,
              //   ctx.word,
              //   ctx.word?.includes(letter),
              //   pos,
              //   ctx.word?.indexOf(letter)
              // );
              if (!(letters?.[letter] === 2)) {
                letters[letter] =
                  isCorrect && isSelected ? 2 : isCorrect ? 1 : 0;
              }
            });
            // console.log("!!!", ctx.letters, letters);
            return { ...ctx.letters, ...letters };
          },
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
        50: [
          {
            target: "endGameWin",
            cond: (ctx) => {
              const a = _(ctx.letters)
                .toPairs()
                .map((x) => _.zipObject(["letter", "value"], x))
                .filter({ value: 2 });
              const b = _.uniq(ctx.word);
              console.log("end game?", a, b);
              return Array.from(a).length === b.length;
            },
          },
          {
            target: "start",
            cond: (ctx) => {
              console.log("after ctx", ctx);
              return ctx.round !== 5;
            },
          },
          {
            target: "endGameLost",
            cond: (ctx) => {
              console.log("after ctx", ctx);
              return ctx.round === 5;
            },
          },
        ],
      },
    },
    endGameWin: {
      on: {
        NEW_GAME: {
          target: "fetchWord",
          actions: [
            assign({
              round: 0,
              word: null,
              currentGuess: ["-0", "-1", "-2", "-3", "-4"],
              letters: {},
              board: [
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                ["", "", "", "", ""],
              ],
            }),
          ],
        },
      },
    },
    endGameLost: {
      on: {
        NEW_GAME: {
          target: "fetchWord",
          actions: [
            assign({
              round: 0,
              word: null,
              currentGuess: ["-0", "-1", "-2", "-3", "-4"],
              letters: {},
              board: [
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                ["", "", "", "", ""],
                ["", "", "", "", ""],
              ],
            }),
          ],
        },
      },
    },
  },
};

export const gameMachine = createMachine<GameMachineContext, GameMachineEvent>(
  gameSpec
);
