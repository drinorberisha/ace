import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { SunIcon } from "../SunIcon";
import { MoonIcon } from "../MoonIcon";
import { useEffect, useState } from "react";

export default function DarkModeButton(){
    const {resolvedTheme,setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(()=> setMounted(true), [])

    if(!mounted)
    return null

    return(
    
    <Switch
    defaultSelected
    onClick={()=> setTheme(resolvedTheme === 'dark'? 'light':'dark')}
    size="lg"
    color="success"
    startContent={<SunIcon />}
    endContent={<MoonIcon />}
    >
    </Switch>

)}