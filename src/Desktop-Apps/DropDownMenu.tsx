import { FC, Fragment, } from "react";
import "./DropDownMenu.scss";


type SlotInfo = {
    slotName: string;
    slotOptions: string[];
};


type DropDownProps = {
    slotInfo: SlotInfo;
    menuOpen: boolean;
    handleSlotClick: (menu:string)=>void;
    handleSlotOptionClick:(option:string)=>void;
}

const DropDownMenu: FC<DropDownProps> = ({
    slotInfo,
    menuOpen,
    handleSlotClick,
    handleSlotOptionClick
}) => {

    

    let menuContainerClassname:string = "slotDropDown";
    if(menuOpen)
        menuContainerClassname = menuContainerClassname + " visible";

    function createSlot(slot: SlotInfo, action:(event: React.MouseEvent<HTMLButtonElement>)=>void): JSX.Element {
        return (
           

                <Fragment>
                {slot.slotOptions.map((name: string) => {
                    return (<button className="slotOption" key={name} onClick={action} value={name}>{name}</button>);
                })}
                </Fragment>

          
        );
    }

    function handleMenuClick(event: React.MouseEvent<HTMLButtonElement>):void{
        event.stopPropagation();
        handleSlotClick(slotInfo.slotName);
    }

    function handleOptionClick(event: React.MouseEvent<HTMLButtonElement>):void{
        let target = event.target as HTMLButtonElement;
        handleSlotOptionClick(target.value);
    }

    return (
    <div className="processDropDownMenu">
        <button className="dropDownSlot" onClick={handleMenuClick} key={slotInfo.slotName}>{slotInfo.slotName}</button>
        <div className={menuContainerClassname}>
            {createSlot(slotInfo, handleOptionClick)}
        </div>
        
    </div>
    );
}

export { DropDownMenu, };
export type { SlotInfo };