import "./TextEditor.scss"
import { FC, useRef, useState } from "react";
import { DropDownMenu, SlotInfo } from "./DropDownMenu";
import axios from "axios";

type TextEditorProps = {
    exit: ()=>void;
    saveFile: (fileName:string)=>void;
}

const TextEditor: FC<TextEditorProps> = ({
    exit,
    saveFile
}) => {

    const [fileMenuOpen, setFileMenuOpen] = useState(false);
    const [formatMenuOpen, setFormatMenuOpen] = useState(false);
    const [fileText, setFileText] = useState("");
    const [fileName, setFileName] = useState("");
    const [possibleFileName, setPossFileName] = useState("");
    let fileMenu: SlotInfo = {
        slotName: "File",
        slotOptions: ["Save", "Load"],
    };
    let formattingMenu: SlotInfo = {
        slotName: "Format",
        slotOptions: ["Font"],
    };

    function handleSlotClick(menu: string): void {
        switch (menu) {
            case (fileMenu.slotName):
                setFileMenuOpen(!fileMenuOpen);
                setFormatMenuOpen(false);
                return;
            case (formattingMenu.slotName):
                setFormatMenuOpen(!formatMenuOpen);
                setFileMenuOpen(false);
                return;
            default:
                return;
        }
    }

    function handleInput(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        setFileText(event.target.value);
    }

    function handleFileNameInput(event: React.ChangeEvent<HTMLInputElement>):void{
        setPossFileName(event.target.value);
    }
    function handleFileNameSave():void{
        setFileName(possibleFileName);
        saveFile(possibleFileName);
    }


    function handleAppClick(event: React.MouseEvent<HTMLDivElement>): void {
        setFileMenuOpen(false);
        setFormatMenuOpen(false);
    }

    function handleFileOptionClick(option: string): void {
        
        //save
        if (option === fileMenu.slotOptions[0]) {
            axios.post('/text-file', {
                name: fileName,
                content: fileText,
                user: 1
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        return;
    }

    function handleFormatOptionClick(option: string): void {
        return;
    }

    function getAppView(): JSX.Element {
        //need to create icon with id field on to desktop when file name is given and save it
        if (fileName === "") {
            return (
                <div className="fileNameDialogue">
                    <div className="messageBox">Please input a file name:</div>
                    <input type="text" className="fileNameInput" onChange={handleFileNameInput} value={possibleFileName}/>
                    <div className="buttonContainer">
                        <button type="button" className="fileNameSave" onClick={handleFileNameSave}>Save</button>
                        <button type="button" className="fileNameCancel" onClick={exit}>Cancel</button>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="textEditorContainer" onClick={handleAppClick}>
                    <div className="optionsBar">
                        <DropDownMenu slotInfo={fileMenu} menuOpen={fileMenuOpen} handleSlotClick={handleSlotClick}
                            handleSlotOptionClick={handleFileOptionClick} />
                        <DropDownMenu slotInfo={formattingMenu} menuOpen={formatMenuOpen} handleSlotClick={handleSlotClick}
                            handleSlotOptionClick={handleFormatOptionClick} />
                    </div>
                    <textarea className="textBox" value={fileText} onChange={handleInput}></textarea>
                </div>
            )
        }
    }



    return (getAppView());
}


export { TextEditor }