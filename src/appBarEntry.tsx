import { FC } from "react"
import './appBarEntry.scss'

type AppBarProps = {
    name: string,
    id:number,
    onClick: (pID:number) => void,
    focused: boolean,

}

const AppBarEntry: FC<AppBarProps> = (
    {
        name,
        id,
        onClick,
        focused,
    }
) => {

    function handleClick(event: React.MouseEvent<HTMLDivElement>){
        onClick(id);
    }

    let classname:string;
    if(focused){
        classname = "appBarSlot focused";
    }
    else{
        classname = "appBarSlot";
    }
    return (<div className={classname} onClick={handleClick}>{name}</div>)
}

export { AppBarEntry };