import { useRef, useState } from "react";
import "./Home.css";

export const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [toBeTyped, setToBeTyped] = useState(
    "quick brown fox lying in the box,हिन्दी जिसके मानकीकृत रूप को मानक हिन्दी कहा जाता है"
  );
  // const [element, setElement] = useState([]);

  const toBeTypedRef = useRef(null);
  const userInputRef = useRef(null);
  const userPastedText = useRef(null);

  const checkCorrectCount = () => {
    const toBeTypedWord = toBeTyped.split(" ");
    const userInputWord = userInput.split(" ");

    let count = 0;
    let spans = [];

    userInputWord?.forEach((userWord, idx) => {
      const { count: eachWordCount, elements } = [...userWord]?.reduce(
        (acc, char, i) => {
          if (char === toBeTypedWord[idx][i]) {
            return {
              count: acc.count + 1,
              elements: [
                ...acc.elements,
                <span style={{ color: "green" }}>{char}</span>,
              ],
            };
          } else {
            return {
              count: acc.count,
              elements: [
                ...acc.elements,
                <span style={{ color: "red" }}>{char}</span>,
              ],
            };
          }
        },
        { count: 0, elements: [] }
      );
      count += eachWordCount;
      spans = [...spans, elements, <span> </span>];
    });

    return { count, spans };
  };

  const changeText = (e) => {
    e.preventDefault();
    if (userPastedText?.current.value) {
      setToBeTyped(userPastedText?.current.value);
      userPastedText.current.value = "";
    }
  };

  return (
    <main className="home">
      <h4>
        {checkCorrectCount()?.count} {toBeTyped.replaceAll(" ", "").length}
      </h4>
      <section className="typing-section">
        <textarea ref={toBeTypedRef} value={toBeTyped} />
        <div>
          {checkCorrectCount()?.spans?.map((el) => {
            return el;
          })}
        </div>
        <form onSubmit={changeText}>
          <textarea ref={userPastedText} placeholder="Paste your text here" />
          <button type="submit">Submit</button>
        </form>
        <textarea
          placeholder="start typing here"
          onChange={(e) => setUserInput(e.target.value)}
        />
      </section>
    </main>
  );
};
