import React, { useEffect, useRef, useState } from "react"
import styled from "@emotion/styled"
import { Howl } from "howler"
import ReactHowler from "react-howler"

// const AudioPlayer = () => {
// 	const [isPlaying, setIsPlaying] = useState<boolean>(false);
// 	const [currentTime, setCurrentTime] = useState<number>(0);
//   const [duration, setDuration] = useState<number>(0);
// 	const audioRef = useRef(null);

// 	const togglePlay = () => {
// 		setIsPlaying(!isPlaying);
// 	  };

// 	  const handleTimeUpdate = e => {
// 		setCurrentTime(e.target.currentTime);
// 	  };

// 	  const formatTime = time => {
// 		const minutes = Math.floor(time / 60);
// 		const seconds = Math.floor(time % 60);
// 		return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
// 	  };

// 	useEffect(() => {
// 		if (!audioRef.current)
// 			return;
// 		console.log("audioRef", audioRef)
// 	},[audioRef])
//   return (
// 	<>
// 	<ReactHowler
// 	src='http://goldfirestudios.com/proj/howlerjs/sound.ogg'
// 	playing={isPlaying}
// 	onPlay={() => setIsPlaying(true)}
// 	ref={audioRef}
//   />
//    <CircleButton onClick={togglePlay}>
//     {isPlaying ? 'Pause' : 'Play'}
//   </CircleButton>
//   <TimingCircle>
//     {formatTime(currentTime)} / {formatTime(duration)}
//   </TimingCircle>
// 	</>
//   )
// }
const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"

const AudioPlayer = ({ src }: { src: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<any>(null)
  const circleRef = useRef<any>(null)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      audioRef.current.play()
      circleRef.current.classList.add("animate-spin")
    } else {
      audioRef.current.pause()
      circleRef.current.classList.remove("animate-spin")
    }
  }

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleCircleClick = (e: any) => {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const circle = circleRef.current
    const radius = circle.offsetWidth / 2
    const circumference = radius * 2 * Math.PI
    const progress = Math.max(0, Math.min(1, (x - radius) / radius))
    const time = progress * audioRef.current.duration
    setCurrentTime(time)
    console.log(time)
    audioRef.current.currentTime = time
    circle.style.strokeDasharray = `${
      progress * circumference
    } ${circumference}`
  }

  const duration = audioRef.current ? audioRef.current.duration : 0
  const currentTimePercentage = (currentTime / duration) * 100 || 0

  return (
    <div className="relative w-full h-full">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      <div
        className="absolute flex items-center justify-center w-24 h-24 -translate-x-1/2 -translate-y-1/2 bg-blue-300 rounded-full top-1/2 left-1/2"
        onClick={handleCircleClick}
      >
        <svg
          className="absolute top-0 left-0 w-full h-full transform rotate-90"
          viewBox="0 0 24 24"
        >
          <circle
            ref={circleRef}
            className="text-blue-500 stroke-current stroke-4/24"
            cx="12"
            cy="12"
            r="9"
            fill="none"
            strokeWidth="4"
            strokeDasharray="0 56.548667764616276"
          />
        </svg>
        {isPlaying ? (
          <div className="w-10 h-10 text-blue-500"></div>
        ) : (
          <div className="w-10 h-10 text-blue-500"></div>
        )}
      </div>
      <div className="absolute bottom-0 left-0 w-full h-16 bg-blue-300">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${currentTimePercentage}%` }}
        />
      </div>
    </div>
  )
}

const CircleButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  font-size: 20px;
`

const TimingCircle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`

export default AudioPlayer
