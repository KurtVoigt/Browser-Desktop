import React, { MouseEvent, FC, createElement, Fragment } from "react";
import "./StartMenu.scss";


type StartMenuProps = {
    visible: boolean,
    onProgramSelect: (event: React.MouseEvent) => void,
    installedApps: string[]
}

const StartMenu: FC<StartMenuProps> = ({
    visible,
    onProgramSelect,
    installedApps
}) => {
    let className = "start-menu-container";
    if (visible) {
        className = className + " visible";
    }


    function createMenuSlots(): JSX.Element[] {
        let elements: JSX.Element[] = [];
        for (let i = 0; i < installedApps.length; i++) {

            elements.push(createElement("div", {
                className: "start-menu-slot", onClick: onProgramSelect,
                key: installedApps[i]
            }, `${installedApps[i]}`));
        }
        return elements;

    }
    return (
        <div className={className}>
            {
                createMenuSlots().map((element) => {
                    return (
                        <Fragment key={element.key}>
                            {element}
                        </Fragment>
                    )
                })
            }
        </div>
    )
}

export { StartMenu }