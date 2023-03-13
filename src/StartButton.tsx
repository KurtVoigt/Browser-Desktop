import './StartButton.scss';
import {FC} from "react";

type StartButtonprops = {
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    startMenuOpen: boolean;
}

const StartButton: FC<StartButtonprops> = (
    {
        onClick,
        startMenuOpen
    }
) => {

    let classname:string;
    if(startMenuOpen){
        classname ="startButton active";
    }
    else{
        classname = "startButton";
    }

    const clicked = (event: React.MouseEvent<HTMLButtonElement>)=>{
        event.stopPropagation();
        onClick(event);
    }

    return(
        <button type='button' className={classname} onClick={clicked}>
            Start
        </button>
    )
}

export {StartButton};