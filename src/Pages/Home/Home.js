import { useRef, useState } from "react";
import "./Home.css";

export const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [toBeTyped, setToBeTyped] = useState(
    "quick brown fox lying in the box,हिन्दी जिसके मानकीकृत रूप को मानक हिन्दी कहा जाता है"
  );
  const [backSpacePressed, setBackSpacePressed] = useState(0);

  // const [element, setElement] = useState([]);

  const toBeTypedRef = useRef(null);
  const userInputRef = useRef(null);
  const userPastedText = useRef(null);

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

      for (let charIndex = 0; charIndex < word.length; charIndex++) {
        const correct =
          correctWord &&
          correctWord[charIndex] &&
          correctWord[charIndex].correct;
        const userTypedChar = userTypedWord[charIndex] || "";

        if (correct === true) {
          allText.push(<letter style={{ color: "green" }}>{userTypedChar}</letter>);
        } else if (correct === false) {
          allText.push(<letter style={{ color: "red" }}>{userTypedChar}</letter>);
        } else {
          allText.push(<letter>{word[charIndex]}</letter>);
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
          allText.push(<letter style={{ color: "red" }}>{userTypedChar}</letter>);
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
    if (e.key === "Backspace") {
      setBackSpacePressed((prev) => prev + 1);
    }
  };

  return (
    <main className="home">
      <h4>
        {checkCorrectCount()?.count} / {toBeTyped.replaceAll(" ", "").length}{" "}
        Backspace: {backSpacePressed}
      </h4>
      <section className="typing-section">
        {/* <textarea ref={toBeTypedRef} value={toBeTyped} /> */}
        <div className="textToBeTyped">
          {renderText()}
        </div>
        <form onSubmit={changeText}>
          <textarea ref={userPastedText} placeholder="Paste your text here" />
          <button type="submit">Submit</button>
        </form>
        <textarea
          placeholder="start typing here"
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => handleBackSpace(e)}
        />
      </section>
    </main>
  );
};
