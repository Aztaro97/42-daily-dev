import { FC, useEffect } from "react"
import { Swap, useTheme } from "react-daisyui"
import { FiMoon, FiSun } from "react-icons/fi"
import { useLocalStorage } from "usehooks-ts"

interface props {
  className?: string
}

const SwitchTheme: FC<props> = ({ className }) => {
  const [theme, setTheme] = useLocalStorage("theme", "night")

  const toggleTheme = () => {
    setTheme(theme === "night" ? "light" : "night")
  }

  useEffect(() => {
    const body = document.documentElement
    body.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <div className={className}>
      <Swap
        dataTheme={theme}
        flip={true}
        rotate={true}
        onElement={<FiMoon onClick={toggleTheme} className="h-6 w-6" />}
        offElement={<FiSun onClick={toggleTheme} className="h-6 w-6" />}
      />
    </div>
  )
}

export default SwitchTheme
