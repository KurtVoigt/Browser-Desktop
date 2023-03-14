import { FC } from "react";


const TextEditor: FC = ({

}) => {
    return (
    <div className="textEditorContainer">
        <div className="optionsBar"></div>
        <textarea className="textBox"></textarea>
    </div>
    )
}


export { TextEditor }