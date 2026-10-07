import React, { useEffect, useState } from 'react'

const CountDown = () => {
  const calculateTimeLeft = () => {
    const difference = new Date('2026-02-02T00:00:00').getTime() - new Date().getTime()

    if (difference <= 0) {
      return {}
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div>
      {Object.keys(timeLeft).length > 0 ? (
        <h3 className="text-[24px] md:text-[28px] font-medium text-[#5a56d6] leading-relaxed">
          {timeLeft.days} days {timeLeft.hours} hours {timeLeft.minutes} minutes {timeLeft.seconds} seconds
        </h3>
      ) : (
        <span className="text-red-500 text-lg font-semibold">Time&apos;s up!</span>
      )}
    </div>
  )
}

export default CountDown
