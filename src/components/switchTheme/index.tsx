import {useEffect} from "react";
import { useLocalStorage } from "usehooks-ts";
import { FiMoon, FiSun } from "react-icons/fi";
import {Swap, useTheme} from "react-daisyui";

export default function SwitchTheme() {
  const [theme, setTheme] = useLocalStorage("theme", "night");
//   const {theme,setTheme } = useTheme("night");

  
  const toggleTheme = () => {
    setTheme(theme === 'night' ? 'light' : 'night');
  };

  useEffect(() => {
	const body = document.documentElement;
	body.setAttribute("data-theme", theme)
  }, [theme])

  return (
	<Swap  dataTheme={theme} flip={true} rotate={true} onElement={<FiMoon onClick={toggleTheme} className="h-6 w-6" />} offElement={<FiSun onClick={toggleTheme} className="h-6 w-6" />} />
  );
}
