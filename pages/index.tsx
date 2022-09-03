import { AnimatePresence, motion, Reorder } from "framer-motion";
import _ from "lodash";
import Head from "next/head";
import {
  useGameService,
  useGameState,
  useGridRow,
  useLetters,
  useRound,
  useStateValue,
  useWord,
} from "../lib/game-context";

function getLetterStyling(word: string | null, letter: string, pos: number) {
  if (letter === "" || !word) {
    return "";
  }
  const isCorrect = word?.includes(letter);
  const isSelected = word?.includes(letter) && pos === word?.indexOf(letter);
  return isCorrect && isSelected
    ? "bg-correct-3 border-correct-7 text-correct-11"
    : isCorrect
    ? "bg-semicorrect-3 border-semicorrect-7 text-semicorrect-11"
    : "";
}

function GridRow({ rowNumber }: { rowNumber: number }) {
  const row = useGridRow(rowNumber);
  const round = useRound();
  const value = useStateValue();
  const word = useWord();
  // console.log(row, rowNumber, round);
  // if (value === "revealing" && round === rowNumber) {
  // }
  return (
    <>
      {row.map((item: string, ix: number) => (
        <motion.div
          // initial="hidden"
          // animate="visible"
          // variants={{
          //   hidden: { opacity: 0 },
          //   visible: { opacity: 1 },
          // }}
          // transition={{ duration: 1 }}
          key={`${rowNumber}-${ix}`}
          className={`w-14 h-10 border-2 lg:w-16 lg:h-20 border-gray-5 `}
        >
          <AnimatePresence>
            {round > rowNumber && (
              <motion.div
                data-testid={`round-${rowNumber}-pos-${ix}`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                transition={{ duration: 1 }}
                className={`grid place-content-center w-full h-full ${getLetterStyling(
                  word,
                  item.toLowerCase(),
                  ix
                )}`}
              >
                {item}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
          className="relative h-16 text-xl border-2 w-14 lg:text-3xl lg:w-16 lg:h-20 border-gray-5 bg-gray-2"
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
  return <div className="text-xs">{JSON.stringify(out)}</div>;
}

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["del", "Z", "X", "C", "V", "B", "N", "M", "enter"],
];

function Keyboard() {
  const service = useGameService();
  const letters = useLetters();
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
              className={`select-none rounded-md text-11 active:scale-150 active:border ${
                ["del"].includes(key)
                  ? "w-10 h-14 text-xs lg:text-sm"
                  : ["enter"].includes(key)
                  ? "w-14 h-14 text-xs lg:text-sm"
                  : "w-9 h-14 text-lg lg:text-xl"
              } ${
                letters?.[key] === 2
                  ? "bg-correct-3 border-correct-7 text-correct-11"
                  : letters?.[key] === 1
                  ? "bg-semicorrect-3 border-semicorrect-7 text-semicorrect-11"
                  : letters?.[key] === 0
                  ? "bg-gray-2"
                  : "bg-gray-4"
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

function GameEndWin() {
  const service = useGameService();
  return (
    <div>
      <h1>You Win!</h1>
      <button onClick={() => service.send({ type: "NEW_GAME" })}>
        New Game
      </button>
    </div>
  );
}

function GameEndLost() {
  const service = useGameService();
  const word = useWord();
  return (
    <div>
      <h1>You Lost :(</h1>
      <h2>The word was {word}</h2>
      <button onClick={() => service.send({ type: "NEW_GAME" })}>
        New Game
      </button>
    </div>
  );
}

function ErrorModal() {
  const service = useGameService();
}

export default function Home() {
  const value = useStateValue();
  return (
    <div className="flex flex-col items-center justify-start mx-auto mt-2 overflow-hidden select-none ">
      <Head>
        <title>Wordle Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-start flex-1 gap-2 text-center 1 xl:px-20 text-gray-11">
        <GameState />
        <Grid />
        <GuessInput />
        {value === "endGameWin" ? (
          <GameEndWin />
        ) : value === "endGameLost" ? (
          <GameEndLost />
        ) : (
          <Keyboard />
        )}
      </main>
    </div>
  );
}
