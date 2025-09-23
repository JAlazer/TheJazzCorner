"use client"

import wpmText from "../mockData/wpmText.json";

import { useState } from "react";

export default function WPM() {

    const [userTxt, setUserTxt] = useState('');

    return (
        <>
            <div className="container-hold">
                <div className="text-hold">
                {wpmText[0]}
                </div>
                <div className="type cheker">
                    <input 
                        type="text"
                        value={userTxt}
                        onChange={(event) => {
                            setUserTxt(event.target.value);
                            alert("changed!")}}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                alert("Entered!")
                            }
                        }}/>
                </div>
                <h1>{userTxt}</h1>
            </div>
            
            
        </>
    )
}