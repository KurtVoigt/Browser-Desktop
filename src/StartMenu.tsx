import React, {MouseEvent, FC, createElement, Fragment } from "react";
import "./StartMenu.scss";


type StartMenuProps = {
    visible: boolean,
    onProgramSelect: (event: React.MouseEvent)=>void,
}

const StartMenu: FC<StartMenuProps> = ({
    visible,
    onProgramSelect
}) => {
    let className = "start-menu-container";
    if(visible){
        className = className + " visible";
    }
    

    function createMenuSlots(amount:number): JSX.Element[]{
            let elements:JSX.Element[] = [];
            for(let i =1; i <= amount; i++){
                
                elements.push(createElement("div",{className: "start-menu-slot", onClick: onProgramSelect, key: i}, `app ${i}`));
            }
            return elements;
        
    }
    return(
        <div className={className}>
            {
                createMenuSlots(4).map((element) =>{
                    return(
                        <Fragment key={element.key}>
                            {element}
                        </Fragment>
                    )
                })
            }
        </div>
    )
}

export {StartMenu}