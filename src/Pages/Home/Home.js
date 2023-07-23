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

  const checkCorrectCount = () => {
    const toBeTypedWord = toBeTyped.split(" ");
    const userInputWord = userInput.split(" ");

    let count = 0;
    let spans = [];

    // userInputWord?.forEach((userWord, idx) => {
    //   const eachWordCount = [...userWord]?.reduce(
    //     (acc, char, i) => (char === toBeTypedWord[idx][i] ? acc + 1 : acc),
    //     0
    //   );
    //   count += eachWordCount;
    // });

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

  // const changeText = (e) => {
  //   return
  // }

  return (
    <main className="home">
      <h4>
        {checkCorrectCount()?.count} {toBeTyped.replaceAll(" ", "").length}
      </h4>
      <section className="typing-section">
        <textarea value={toBeTyped} />
        <div>
          {checkCorrectCount()?.spans?.map((el) => {
            return el;
          })}
        </div>
        {/* <textarea placeholder="Paste your text here" onChange={(e)=>}/> */}
        <textarea
          placeholder="start typing here"
          onChange={(e) => setUserInput(e.target.value)}
        />
      </section>
    </main>
  );
};
