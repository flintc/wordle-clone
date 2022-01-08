import { Reorder } from "framer-motion";
import _ from "lodash";
import Head from "next/head";
import {
  useGameService,
  useGameState,
  useGridRow,
  useWord,
} from "../lib/game-context";

function GridRow({ rowNumber }: { rowNumber: number }) {
  const row = useGridRow(rowNumber);
  const word = useWord();
  return (
    <>
      {row.map((item: string, ix: number) => (
        <div
          key={`${rowNumber}-${ix}`}
          className="grid w-10 h-12 border-2 lg:w-16 lg:h-20 border-gray-5 place-content-center"
        >
          {item}
        </div>
      ))}
    </>
  );
}

function Grid() {
  return (
    <div className="grid grid-cols-5 grid-rows-6">
      {_.range(6).map((row: number) => (
        <GridRow key={`row-${row}`} rowNumber={row} />
      ))}
    </div>
  );
}

function GuessInput() {
  const service = useGameService();
  const value = useGameState(
    (state) => state.context.currentGuess
  ) as Array<string>;
  return (
    <Reorder.Group
      axis="x"
      values={value}
      onReorder={(z) => {
        service.send({ type: "REORDER", value: z });
      }}
      className="grid grid-cols-5"
    >
      {value.map((x) => (
        <Reorder.Item
          key={x}
          value={x}
          className="relative w-12 h-16 text-xl border-2 lg:text-3xl lg:w-16 lg:h-20 border-gray-5 bg-gray-2"
        >
          <span className="grid w-full h-full text-gray-12 place-content-center">
            {x.split("-")[0]}
          </span>
          <input
            type="text"
            readOnly
            className="absolute inset-0 w-full h-full bg-transparent"
          />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

function GameState() {
  const out = useGameState((x) => {
    return {
      value: x?.value,
      round: x?.context?.round,
    };
  }, _.isEqual);
  return <div>{JSON.stringify(out)}</div>;
}

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["del", "Z", "X", "C", "V", "B", "N", "M", "enter"],
];

function Keyboard() {
  const service = useGameService();
  return (
    <div className="flex flex-col gap-0.5 lg:gap-2 mx-auto">
      {KEYS.map((keyRow, ix) => (
        <div key={`keyRow-${ix}`} className="flex gap-0.5 flex-nowrap mx-auto">
          {keyRow.map((key, col) => (
            <button
              key={`keyCol-${col}`}
              onClick={() => {
                if (key === "enter") {
                  service.send({ type: "ANSWER_SUBMIT" });
                } else if (key === "del") {
                  service.send({ type: "DELETE" });
                } else {
                  service.send({ type: "KEY_SUBMIT", key });
                }
              }}
              className={`rounded-md bg-gray-4 text-11 ${
                ["del"].includes(key)
                  ? "w-10 h-12 text-xs lg:text-sm"
                  : ["enter"].includes(key)
                  ? "w-14 h-12 text-xs lg:text-sm"
                  : "w-9 h-12 text-lg lg:text-xl"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 m-auto">
      <Head>
        <title>Wordle Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center flex-1 gap-4 text-center 1 xl:px-20 text-gray-11">
        <GameState />
        <Grid />
        <GuessInput />
        <Keyboard />
      </main>
    </div>
  );
}
