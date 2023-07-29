import { useEffect, useRef, useState } from "react"
import type { LottiePlayer } from "lottie-web"

export const LottieFile = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [lottie, setLottie] = useState<LottiePlayer | null>(null)

  useEffect(() => {
    import("lottie-web").then((Lottie) => setLottie(Lottie.default))
  }, [])

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lottie/ghost-animation.json",
      })

      return () => animation.destroy()
    }
  }, [lottie])

  return <div ref={ref} className="h-56" />
}
