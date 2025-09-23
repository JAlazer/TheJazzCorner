"use client"

import wpmText from "../mockData/wpmText.json";

import { useState } from "react";

import Countdown from "./InputTimer";

export default function WPM() {

    const [userTxt, setUserTxt] = useState('');
    const [oStrIdx, setStrIdx] = useState(0); // pointer to the odyssey passage
    const [charCount, setCharCount] = useState(0);
    const [words, setWords] = useState(['']);

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
            console.log("");
        } else if (keyPressed === "Backspace") {
            setUserTxt(userTxt.substring(0, userTxt.length-1));
        } else {
            setUserTxt(userTxt + keyPressed);
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
        }
    }

    return (
        <>
            <div className="container-hold">
                <div className="header">
                    <h1>{oStrIdx}</h1>
                    <div className="text-lg font-mono mb-2">
                        <Countdown />
                    </div>
                </div>

                <div className="text-hold">
                    {fillerTxt}
                </div>

                <div className="type cheker">
                    <input 
                        className="border border-black-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        onKeyDown={(e) => handleDown(e)}
                        onKeyUp={(e) => {
                            handleSpace(e)
                        }}
                        value={userTxt}
                        onChange={() => {}}
                    />
                </div>

                <h1>{userTxt}</h1>
                <ul>
                    {words.map(
                        (aWord) => {
                            return (
                                <li>
                                    {aWord}
                                </li>
                            )
                        }
                    )}
                </ul>
            </div>
            
            
        </>
    )
}