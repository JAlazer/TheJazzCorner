"use client"

import wpmText from "../mockData/wpmText.json";

import { useState } from "react";

import { useTimer } from "react-timer-hook";

export default function WPM() {

    const [userTxt, setUserTxt] = useState('');
    const [oStrIdx, setStrIdx] = useState(0); // pointer to the odyssey passage

    // const { elapsedTime, isRunning, start, stop, reset } = useTimer();

    const fillerTxt = wpmText[0].toLowerCase()
                                .replaceAll(",", "")
                                .replaceAll(";", "")
                                .replaceAll(".", "")
                                .replaceAll("-", "");

    // ways to handle input field:

    function handleDown(event: React.KeyboardEvent<HTMLInputElement>) {
        const keyPressed = event.key;
        if (keyPressed === " ") {
            console.log("");
        } else if (keyPressed === "Backspace") {
            setUserTxt(userTxt.substring(0, userTxt.length-1));
        } else {
            setUserTxt(userTxt + keyPressed);
        }
        
        if (keyPressed === fillerTxt[oStrIdx]) {
            setStrIdx(oStrIdx + 1);
        }
    }

    function handleSpace(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === " ") {
            setUserTxt('');
        }
    }

    return (
        <>
            <div className="container-hold">
                <div className="flex justify-item center align-items center">
                    <h1>{oStrIdx}</h1>
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
            </div>
            
            
        </>
    )
}