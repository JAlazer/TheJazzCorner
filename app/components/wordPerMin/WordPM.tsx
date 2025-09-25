"use client"

import wpmText from "../../mockData/wpmText.json";

import { useState } from "react";

import Countdown from "./InputTimer";
import TextStream from "./TextStream";

export default function WPM() {

    const [userTxt, setUserTxt] = useState('');
    const [oStrIdx, setStrIdx] = useState(0); // pointer to the odyssey passage
    const [charCount, setCharCount] = useState(0);
    const [words, setWords] = useState(['']);
    const [pressed, setPress] = useState(false); // ensure color change only upon press

    // const { elapsedTime, isActive, startTimer, stopTimer, resetTimer } = useInputTimer();
    const startTime = performance.now();
    let elapsedTime = 0;

    // const { elapsedTime, isRunning, start, stop, reset } = useTimer();

    const fillerTxt = wpmText[0].toLowerCase()
                                .replaceAll(",", "")
                                .replaceAll(";", "")
                                .replaceAll(".", "")
                                .replaceAll("-", "");

    // ways to handle input field:

    function handleDown(event: React.KeyboardEvent<HTMLInputElement>) {
        const keyPressed = event.key;

        // add to the overall userword inputted
        if (keyPressed === " ") {
            setCharCount(charCount + 1);
        } else if (keyPressed === "Backspace") {
            setUserTxt(userTxt.substring(0, userTxt.length-1));
        } else {
            setUserTxt(userTxt + keyPressed);
            setCharCount(charCount + 1);
            setPress(true);
        }
        
        // move the pointer
        if (keyPressed === fillerTxt[oStrIdx]) {
            setStrIdx(oStrIdx + 1);
        }

        // start the timer
        if (words.length === 0) {
            // startTimer();
        }
    }

    function handleSpace(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === " ") {
            words.push(userTxt);
            
            elapsedTime = performance.now() - startTime;

            setUserTxt('');
        } else {
            setPress(false);
        }
    }


    function wpmCalculate30Sec(totalCharsNum: number) {
        return totalCharsNum / 5 / 0.5
    }

    return (
        <>
            <div className="flex flex-col items-center text-center">
                <div className="flex flex-col items-center text-center">
                    <Countdown duration={30}/>
                </div>

                <div className="text-left">
                    <TextStream text={fillerTxt} txtIdx={oStrIdx} isPressed={pressed}/>
                </div>

                <div className="type cheker">
                    <input 
                        className="bg-white text-black p-2 border border-gray-300 rounded-lg"
                        type="text"
                        onKeyDown={(e) => handleDown(e)}
                        onKeyUp={(e) => {
                            handleSpace(e)
                        }}
                        value={userTxt}
                        onChange={() => {}}
                    />
                </div>

               <h1>WPM: {wpmCalculate30Sec(charCount)}</h1>
            </div>
            
            
        </>
    )
}