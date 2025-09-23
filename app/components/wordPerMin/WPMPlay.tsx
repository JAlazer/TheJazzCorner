"use client"

import { Button } from "../ui/button";
import { useState } from "react";
import WPM from "./WordPM";

export default function WPMPlay() {
    const [isClicked, setClick] = useState(false);

    function handleClick() {
        setClick(!isClicked);
    }

    function switchScreen() {
        if (isClicked) {
            return (
            <>
                <WPM />
                <Button
                    onClick={() => {handleClick()}}>
                    Back
                </Button>
            </>
            
        )
        } else {
            return (
                <Button
                    onClick={() => {handleClick()}}
                >
                    Play WPM Here!
                </Button>
            )
        }
    }

    return (
        <>
            {/* First button play then scroll in WordPM component */}
            {switchScreen()}
            
        </>
    )
}