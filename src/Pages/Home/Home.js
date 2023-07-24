import { useRef, useState } from "react";
import { englishToHindiMap } from "../../LangaugeMap/LangaugeMap";
import "./Home.css";

export const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [toBeTyped, setToBeTyped] = useState(
    "quick brown fox lying in the box,हिन्दी जिसके मानकीकृत रूप को मानक हिन्दी कहा जाता है"
  );
  const [backSpacePressed, setBackSpacePressed] = useState(0);

  const [langauge, setLanguage] = useState("hindi");

  const toBeTypedRef = useRef(null);
  const userInputRef = useRef(null);
  const userPastedText = useRef(null);

  const processInput = (e) => {
    const { value } = e.target;

    if (langauge === "hindi") {
      const convertedText = [...value]?.reduce(
        (acc, char) => (acc += englishToHindiMap[char]),
        ""
      );
      setUserInput(convertedText);
      return;
    }
    setUserInput(e.target.value);
  };

  const checkCorrectCount = () => {
    const toBeTypedWord = toBeTyped.split(" ");
    const userInputWord = userInput.split(" ");

    let count = 0;
    let corrects = [];

    if (userInput.length && toBeTyped.length) {
      userInputWord?.forEach((userWord, idx) => {
        const { count: eachWordCount, elements } = [...userWord]?.reduce(
          (acc, char, i) => {
            if (char === toBeTypedWord[idx][i]) {
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
        count += eachWordCount;
        corrects = [...corrects, elements];
      });
    }
    return { count, corrects };
  };

  const renderText = () => {
    const toBeTypedWord = toBeTyped.split(" ");
    const userInputWord = userInput.split(" ");

    const { corrects } = checkCorrectCount();

    const allText = [];

    toBeTypedWord.forEach((word, wordIndex) => {
      const correctWord = corrects[wordIndex];
      const userTypedWord = userInputWord[wordIndex] || "";

      let heighlight = "";
      if (userInputWord.length - 1 === wordIndex && userInput.length >= 1) {
        heighlight = { backgroundColor: "yellow" };
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
            <letter style={{ color: "green", ...heighlight }}>
              {currentWord}
            </letter>
          );
        } else if (correct === false) {
          allText.push(
            <letter style={{ color: "red", ...heighlight }}>
              {currentWord}
            </letter>
          );
        } else {
          allText.push(
            <letter style={{ ...heighlight }}>{word[charIndex]}</letter>
          );
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
            <letter style={{ color: "red", ...heighlight }}>
              {userTypedChar}
            </letter>
          );
        }
      }
      allText.push(<letter> </letter>);
    });
    return allText;
  };

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

  const moveCarret = (e) => {
    const { value } = e.target.value;
    setUserInput(value);

    if (toBeTypedRef.current) {
      toBeTypedRef.current.selectionStart = 4;
      toBeTypedRef.current.selectionEnd = 4;
    }
  };

  const handleBackSpace = (e) => {
    if (e.key === "Backspace" && userInput) {
      setBackSpacePressed((prev) => prev + 1);
    }
  };

  return (
    <main className="home">
      <h2>{userInput}</h2>
      <h4>
        {checkCorrectCount()?.count} / {toBeTyped.replaceAll(" ", "").length}{" "}
        Backspace: {backSpacePressed}{" "}
        <select onChange={(e) => setLanguage(e.target.value)}>
          <option value="hindi">Hindi</option>
          <option value="english">English</option>
        </select>
      </h4>
      <section className="typing-section">
        {/* <textarea ref={toBeTypedRef} value={toBeTyped} /> */}
        <div className="textToBeTyped">{renderText()}</div>
        <form onSubmit={changeText}>
          <textarea ref={userPastedText} placeholder="Paste your text here" />
          <button type="submit">Submit</button>
        </form>
        <textarea
          placeholder="start typing here"
          onChange={(e) => processInput(e)}
          onKeyDown={(e) => handleBackSpace(e)}
        />
      </section>
    </main>
  );
};
