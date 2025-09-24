
import wpmText from "../../mockData/wpmText.json";

interface TextStreamProps {
    text: string
    txtIdx: number
}

export default function TextStream({text, txtIdx}: TextStreamProps) {


    function changeTextToGreen(text: string, i: number) {
        return (
            <></>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <div>
                <span className="font-bold">Pointer:</span> {txtIdx}
            </div>
            <div>
                {text}
            </div>
        </div>
    )
}