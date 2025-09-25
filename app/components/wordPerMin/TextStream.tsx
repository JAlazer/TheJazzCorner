

import wpmText from "../../mockData/wpmText.json";

interface TextStreamProps {
    text: string
    txtIdx: number
    isPressed: boolean
}

export default function TextStream({text, txtIdx, isPressed}: TextStreamProps) {
    const testTxt = "Hello!";


    function changeTextToGreen(text: string, i: number, pressed: boolean) {
        if (pressed) {
            const charPressed = text[i];
            return text.substring(0, i) + "<span className=\"text-green-600\">" + charPressed + "</span>";
        }
    }

    return (
        <div className="flex flex-col items-center">
            <div>
                <span className="font-bold">Pointer:</span> {txtIdx}
            </div>
            <div>
                <span>{text.substring(0, txtIdx)}</span>
                <span className="">{text[txtIdx]}</span>
                <span>{text.substring(txtIdx+1, text.length)}</span>
            </div>
        </div>
    )
}