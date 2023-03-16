import "./TextEditor.scss"
import { FC, useState } from "react";
import { DropDownMenu, SlotInfo } from "./DropDownMenu";


const TextEditor: FC = ({

}) => {


    const [fileMenuOpen, setFileMenuOpen] = useState(false);
    const [formatMenuOpen, setFormatMenuOpen] = useState(false);
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

    function handleAppClick(event: React.MouseEvent<HTMLDivElement>): void {
        setFileMenuOpen(false);
        setFormatMenuOpen(false);
    }

    function handleFileOptionClick(option: string): void {
        return;
    }
    function handleFormatOptionClick(option: string): void {
        return;
    }


    return (
        <div className="textEditorContainer" onClick={handleAppClick}>
            <div className="optionsBar">
                <DropDownMenu slotInfo={fileMenu} menuOpen={fileMenuOpen} handleSlotClick={handleSlotClick}
                    handleSlotOptionClick={handleFileOptionClick} />
                <DropDownMenu slotInfo={formattingMenu} menuOpen={formatMenuOpen} handleSlotClick={handleSlotClick} 
                handleSlotOptionClick={handleFormatOptionClick}/>
            </div>
            <textarea className="textBox"></textarea>
        </div>
    )
}


export { TextEditor }