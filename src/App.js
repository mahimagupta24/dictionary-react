import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [iconIsVisible,setIconIsVisible] =useState(true)

  const wordHandler = (e) => setWord(e.target.value);

  const clickHandler = () => {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setResult(data);
        if ( data.title === "No Definitions Found") {
          setError("Couldn't find the word");
        } else {
          setResult(data);
          setError("");
        }
        if(data[0]?.phonetics[1]?.audio){
          setIconIsVisible(true)
        }else{
          setIconIsVisible(false)
        }
      }
      )
      .catch((error) => {
        console.log(error);
        setError(" Enter the word");
      });
  };

  const playAudio = () => {
    const audioSrc = result[0].phonetics[1].audio;
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play();
    }
  };

  return (
    <div className="container">
      <input
      className="input"
        type="text"
        value={word}
        placeholder="type your text here..."
        onChange={wordHandler}
      />
      <button id ="search-box"onClick={clickHandler}>Search</button>
      {result.length > 0 ? (
        <div>
            <h2 className="word">{result[0].word}</h2>
            <div className="output"> 
           <h3 className="phonetics"style={{color:'#ae9cff'}}> {result[0].phonetics[1]?.text ?? "No phonetics found"}</h3>
           {iconIsVisible&&<button id="play-btn" onClick={playAudio} >
              <FontAwesomeIcon icon={faVolumeHigh} ></FontAwesomeIcon>
            </button>}
            </div>
            <div className="details">
              {result[0].meanings[0]?.definitions[0]?.definition ??
                "no definition"}
            </div>
        </div>
      ) : (
        <h2>{error}</h2>
      )}
    </div>
  );
}
export default App;
