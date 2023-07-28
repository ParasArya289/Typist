import { useEffect, useMemo, useRef, useState } from "react";
import { Action } from "../../Components/Action/Action";
import { Dashboard } from "../../Components/Dashboard/Dashboard";
import { englishToHindiMap } from "../../LangaugeMap/LangaugeMap";
import "./Home.css";

export const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [toBeTyped, setToBeTyped] = useState(
    "The quick brown fox jumps over the lazy dog"
  );
  const [startedTyping, setStartedTyping] = useState(false);
  const [finishedTyping, setFinishedTyping] = useState(false);
  const [testTime, setTestTime] = useState(null);
  const [restart, setRestart] = useState(false);
  const [backSpacePressed, setBackSpacePressed] = useState(0);

  const [incorrectWord, setIncorrectWord] = useState(0);
  const [langauge, setLanguage] = useState("universal");

  const containerRef = useRef(null);
  const toBeTypedRef = useRef(null);
  const userInputRef = useRef(null);
  const userPastedText = useRef(null);

  const MAX_INPUT_LENGTH = toBeTyped?.replaceAll("\u200D", "")?.length;

  const processInput = (e) => {
    const { value } = e.target;

    if (langauge === "hindi") {
      let isWaiting = false;
      const convertedText = [...value]?.reduce((acc, char) => {
        if (englishToHindiMap[char] === "ि") {
          isWaiting = true;
          // return acc;
          return (acc = acc + "ि");
        }
        if (isWaiting) {
          isWaiting = false;
          return (acc = acc.slice(0, -1) + englishToHindiMap[char] + "ि");
        }
        return (acc += englishToHindiMap[char] ?? "");
      }, "");
      setUserInput(convertedText.replaceAll("\u200D", ""));
      console.log(convertedText);
      return;
    }
    // if (userInputRef?.current?.value?.length)

    setUserInput(value);
  };

  const checkCorrectCount = () => {
    const toBeTypedWord = toBeTyped.replaceAll("\u200D", "").split(" ");
    const userInputWord = userInput.replaceAll("\u200D", "").split(" ");

    let count = 0;
    let wordCount = 0;
    let incorrectWordCount = 0;
    let corrects = [];

    if (userInput?.length && toBeTyped.length) {
      userInputWord?.forEach((userWord, idx) => {
        const { count: eachCharCount, elements } = [...userWord]?.reduce(
          (acc, char, i) => {
            let toBeTypedChar = toBeTypedWord[idx][i];
            // let convertedChar =
            //   langauge === "hindi"
            //     ? englishToHindiMap[toBeTypedChar]
            //     : toBeTypedChar;

            if (char.replace("\u200D", "") === toBeTypedChar) {
              return {
                count: acc.count + 1,
                elements: [
                  ...acc.elements,
                  {
                    correct: true,
                    index: i,
                    word: char,
                  },
                ],
              };
            } else {
              return {
                count: acc.count,
                elements: [
                  ...acc.elements,
                  {
                    correct: false,
                    index: i,
                    word: char,
                  },
                ],
              };
            }
          },
          { count: 0, elements: [] }
        );
        count += eachCharCount;
        corrects = [...corrects, elements];

        if (userInputWord[idx] === toBeTypedWord[idx]) {
          wordCount += 1;
        }
        //  else if (
        //   userInputWord[idx] !== toBeTypedWord[idx] &&
        //   !userInputWord[idx + 1]
        // ) {
        //   incorrectWordCount += 1;
        //   setIncorrectWord((prev) => prev + 1);
        // }
      });
    }

    if (userInputWord?.length >= toBeTypedWord?.length) {
      setFinishedTyping(true);
      setStartedTyping(false);
      console.log("exceed");
      return { count, wordCount, corrects, incorrectWordCount };
    }
    return { count, wordCount, corrects, incorrectWordCount };
  };

  const { count, wordCount, corrects, incorrectWordCount } = useMemo(() => {
    return checkCorrectCount();
  }, [userInput, toBeTyped]);

  const renderText = () => {
    const toBeTypedWord = toBeTyped.replaceAll("\u200D", "").split(" ");
    const userInputWord = userInput.replaceAll("\u200D", "").split(" ");

    const allText = [];

    toBeTypedWord.forEach((word, wordIndex) => {
      const correctWord = corrects[wordIndex];
      const userTypedWord = userInputWord[wordIndex] || "";

      let highlight = "";
      if (userInputWord.length - 1 === wordIndex && userInput.length >= 1) {
        highlight = "highlight";
      }

      for (let charIndex = 0; charIndex < word.length; charIndex++) {
        const correct =
          correctWord &&
          correctWord[charIndex] &&
          correctWord[charIndex].correct;
        const userTypedChar = userTypedWord[charIndex] || "";
        const currentWord = word[charIndex];

        if (correct === true) {
          allText.push(
            <span className={`correct ${highlight}`}>{currentWord}</span>
          );
        } else if (correct === false) {
          allText.push(
            <span className={`incorrect ${highlight}`}>{currentWord}</span>
          );
        } else {
          allText.push(<span className={highlight}>{word[charIndex]}</span>);
        }
      }
      if (userTypedWord.length > word.length) {
        // Handle additional characters typed by the user
        for (
          let charIndex = word.length;
          charIndex < userTypedWord.length;
          charIndex++
        ) {
          const userTypedChar = userTypedWord[charIndex];
          allText.push(
            <span
              className={`incorrect ${highlight}`}
              // key={`${userTypedChar}-${charIndex}`}
            >
              {userTypedChar}
            </span>
          );
        }
      }
      allText.push(<span> </span>);
    });
    return allText;
  };

  const memoizedRenderText = useMemo(
    () => renderText(),
    [userInput, toBeTyped]
  );

  const changeText = (e) => {
    e.preventDefault();
    if (userPastedText?.current.value) {
      const formattedText = userPastedText?.current.value?.replaceAll(
        "\n",
        " "
      );
      setToBeTyped(formattedText);
      userPastedText.current.value = "";
    }
  };

  const handleBackSpace = (e) => {
    if (e.key === "Backspace" && userInput) {
      setBackSpacePressed((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const highlightedElement = document.querySelector(
      ".textToBeTyped > .highlight"
    );
    if (highlightedElement) {
      highlightedElement.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  }, [userInput]);

  useEffect(() => {
    const toBeTypedWord = toBeTyped.replaceAll("\u200D", "").split(" ");
    const userInputWord = userInput.replaceAll("\u200D", "").split(" ");

    if (userInput.length > 0 && !startedTyping) {
      setStartedTyping(() => true);
      setFinishedTyping(() => false);
    }

    if (
      userInputWord[userInputWord.length - 1] ===
        toBeTypedWord[toBeTypedWord.length - 1] &&
      userInputWord.length >= toBeTypedWord.length
    ) {
      setFinishedTyping(() => true);
      setStartedTyping(() => false);
      userInputRef.current.disabled = true;
    }
  }, [userInput, toBeTyped]);

  return (
    <main className="home">
      <Dashboard
        count={count}
        wordCount={wordCount}
        totalWordsTyped={userInput.replaceAll("\u200D", "")}
        totalWords={toBeTyped.split(" ")}
        incorrectWordCount={incorrectWordCount}
        incorrectWord={incorrectWord}
        startedTyping={startedTyping}
        finishedTyping={finishedTyping}
        setStartedTyping={setStartedTyping}
        setFinishedTyping={setFinishedTyping}
        restart={restart}
        setRestart={setRestart}
        userInputRef={userInputRef}
        setUserInput={setUserInput}
      />

      {/* <h4>
        {count} / {toBeTyped.replaceAll(" ", "").length} {wordCount} /
        {toBeTyped.split(" ").length} Backspace: {backSpacePressed}{" "}
        <select onChange={(e) => setLanguage(e.target.value)} value={langauge}>
          <option value="hindi" disabled>
            Hindi
          </option>
          <option value="universal">Universal</option>
        </select>
      </h4> */}
      <section className="typing-section">
        <div ref={containerRef} className="textToBeTyped">
          {memoizedRenderText}
        </div>

        <form onSubmit={changeText}>
          <textarea ref={userPastedText} placeholder="Paste your text here" />
          <button type="submit">Submit</button>
        </form>

        <textarea
          ref={userInputRef}
          placeholder="start typing here"
          onChange={(e) => processInput(e)}
          onKeyDown={(e) => handleBackSpace(e)}
          value={userInput}
          // maxLength={MAX_INPUT_LENGTH}
          onMouseDown={(e) => {
            userInputRef?.current?.focus();
            e.preventDefault();
          }}
        />
        {(finishedTyping || startedTyping) && (
          <button onClick={() => setRestart(() => true)}>{"Restart"}</button>
        )}
      </section>
    </main>
  );
};
