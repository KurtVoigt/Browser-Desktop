import "./TextEditor.scss"
import { FC, useRef, useState } from "react";
import { DropDownMenu, SlotInfo } from "./DropDownMenu";
import axios from "axios";
import { ApplicationProcess, SavedAppsType } from "../Desktop";

type TextEditorProps = {
    exit: () => void;
    saveFile: (file: SavedAppsType) => void;
    token: string;
    relog: () => void;
    userID: string;
    process: ApplicationProcess;
    deleteFile: (fileName: string) => void;
}

const TextEditor: FC<TextEditorProps> = ({
    exit,
    saveFile,
    token,
    relog,
    userID,
    process,
    deleteFile
}) => {

    let defautFileText: string = "";
    let defaultFileName: string = "";

    if (process.data) {
        defautFileText = process.data.content;
        defaultFileName = process.data.name;
    }
    const [fileMenuOpen, setFileMenuOpen] = useState(false);
    const [formatMenuOpen, setFormatMenuOpen] = useState(false);
    const [fileText, setFileText] = useState(defautFileText);
    const [fileName, setFileName] = useState(defaultFileName);
    const [possibleFileName, setPossFileName] = useState("");
    let fileMenu: SlotInfo = {
        slotName: "File",
        slotOptions: ["Save", "Delete"],
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

    function handleFileNameInput(event: React.ChangeEvent<HTMLInputElement>): void {
        setPossFileName(event.target.value);
    }
    function handleFileNameSave(): void {
        setFileName(possibleFileName);
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
                user: userID,
                token: token,
            })
                .then(function (response) {
                    let iconInfo: SavedAppsType = {
                        _id: response.data,
                        fileName: fileName
                    }
                    saveFile(iconInfo);
                })
                .catch(function (error) {
                    console.log(error);
                    if (error.response) {
                        //bad token, re-login for a new one
                        if (error.response.status === 401) {
                            relog();
                        }
                    }
                });
        }
        //delete
        else if (option === fileMenu.slotOptions[1]) {
            axios.delete("/text-file", {
                params: {
                    name: fileName,
                    content: fileText,
                    user: userID,
                    token: token,
                }
            }).then((response) => {
                exit();
                deleteFile(fileName);
            }).catch((err) => {
                console.log(err);

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
                    <input type="text" className="fileNameInput" onChange={handleFileNameInput} value={possibleFileName} />
                    <div className="buttonContainer">
                        <button type="button" className="fileNameSave" onClick={handleFileNameSave}>Save</button>
                        <button type="button" className="fileNameCancel" onClick={exit}>Cancel</button>
                    </div>
                </div>
            )
        }
        else {
            /*TODO implement format bar 
            <DropDownMenu slotInfo={formattingMenu} menuOpen={formatMenuOpen} handleSlotClick={handleSlotClick}
                            handleSlotOptionClick={handleFormatOptionClick} />*/
            return (
                <div className="textEditorContainer" onClick={handleAppClick}>
                    <div className="optionsBar">
                        <DropDownMenu slotInfo={fileMenu} menuOpen={fileMenuOpen} handleSlotClick={handleSlotClick}
                            handleSlotOptionClick={handleFileOptionClick} />

                    </div>
                    <textarea className="textBox" value={fileText} onChange={handleInput}></textarea>
                </div>
            )
        }
    }



    return (getAppView());
}


export { TextEditor }