import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

const birthDate = new Date(2003, 1, 24) // February 24, 2003
const specialName = 'Mayesha'
const assetBase = import.meta.env.BASE_URL

const galleryClassPattern = ['large', 'small', 'small', 'wide', 'small', 'small']
const galleryImagePool = Array.from(
  { length: 18 },
  (_, index) => `${assetBase}img${index + 1}.jpg`
)

function createSeededRandom(seedString) {
  let hash = 2166136261
  for (let index = 0; index < seedString.length; index += 1) {
    hash ^= seedString.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  let seed = hash >>> 0

  return () => {
    seed = (seed + 0x6D2B79F5) >>> 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function getHourlyRandomGalleryItems(referenceDate) {
  const hourSeed = `${referenceDate.getFullYear()}-${referenceDate.getMonth()}-${referenceDate.getDate()}-${referenceDate.getHours()}`
  const random = createSeededRandom(hourSeed)
  const images = [...galleryImagePool]

  for (let index = images.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1))
    const temp = images[index]
    images[index] = images[randomIndex]
    images[randomIndex] = temp
  }

  return images.slice(0, galleryClassPattern.length).map((image, index) => ({
    title: `Memory ${index + 1}`,
    image,
    className: galleryClassPattern[index],
  }))
}

const wishMessages = [
  '💖 May your smile shine brighter than the candles today. Wishing you endless joy!',
  '✨ May this birthday bring you moments that make your heart feel full.',
  '🌸 May every new morning bring you peace, happiness, and sweet surprises.',
  '🎉 Keep shining, keep dreaming, and keep being wonderfully you.',
  '🌟 May your path be filled with love, laughter, and beautiful memories.',
  '💫 Wishing you strength, success, and smiles in every step ahead.',
  '🕊️ May your heart stay light and your days stay bright all year long.',
  '🎂 You deserve all the happiness in the world today and always.',
]

function isSameMonthDay(leftDate, rightDate) {
  return (
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  )
}

function getNextBirthday(referenceDate) {
  const now = referenceDate
  const year = now.getFullYear()
  const next = new Date(year, birthDate.getMonth(), birthDate.getDate())

  if (next < now && !isSameMonthDay(now, birthDate)) {
    next.setFullYear(year + 1)
  }

  return next
}

function getCountdownParts(targetDate, referenceDate) {
  const total = Math.max(0, targetDate - referenceDate)
  const days = Math.floor(total / (1000 * 60 * 60 * 24))
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((total / (1000 * 60)) % 60)
  const seconds = Math.floor((total / 1000) % 60)

  return { days, hours, minutes, seconds }
}

function formatCounter(value) {
  return String(value).padStart(2, '0')
}

function App() {
  const [now, setNow] = useState(new Date())
  const [showSurprise, setShowSurprise] = useState(false)
  const [candlesLit, setCandlesLit] = useState(false)
  const [musicOn, setMusicOn] = useState(true)
  const [needsMusicTap, setNeedsMusicTap] = useState(false)
  const audioRef = useRef(null)

  const nextBirthday = useMemo(() => getNextBirthday(now), [now])
  const countdown = getCountdownParts(nextBirthday, now)
  const todaysDayOfMonth = now.getDate()
  const todaysMonth = now.getMonth()
  const isBirthdayToday =
    todaysMonth === birthDate.getMonth() && todaysDayOfMonth === birthDate.getDate()
  const dayNumber = Math.floor(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / (1000 * 60 * 60 * 24)
  )
  const cycleDayIndex = ((dayNumber % 4) + 4) % 4
  const todayWishes = wishMessages.slice(cycleDayIndex * 2, cycleDayIndex * 2 + 2)
  const galleryItems = useMemo(() => getHourlyRandomGalleryItems(now), [
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours(),
  ])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) {
      return
    }

    audio.volume = 0.7

    if (musicOn) {
      const playPromise = audio.play()
      if (playPromise?.then) {
        playPromise
          .then(() => setNeedsMusicTap(false))
          .catch(() => setNeedsMusicTap(true))
      }
    } else {
      audio.pause()
    }
  }, [musicOn])

  useEffect(() => {
    if (!musicOn || !needsMusicTap) {
      return
    }

    const resumeAudio = () => {
      const audio = audioRef.current
      if (!audio) {
        return
      }

      audio.play().then(() => {
        setNeedsMusicTap(false)
      }).catch(() => {})
    }

    window.addEventListener('pointerdown', resumeAudio, { once: true })
    window.addEventListener('keydown', resumeAudio, { once: true })

    return () => {
      window.removeEventListener('pointerdown', resumeAudio)
      window.removeEventListener('keydown', resumeAudio)
    }
  }, [musicOn, needsMusicTap])

  return (
    <main className="birthday-theme">
      <div className="overlay-sparkles" />
      <section className="birthday-wrapper">
        <header className="hero-panel">
          <span className="balloon balloon-left" />
          <span className="balloon balloon-right" />
          <h1>
            Happy Birthday
            <br />
            <span className="heart">❤️ </span>
            <span>
              {specialName}
              <span className="heart">❤️</span>
            </span>
          </h1>

          <button
            type="button"
            className="surprise-button"
            onClick={() => setShowSurprise((previous) => !previous)}
          >
            🎁 Open Surprise
          </button>

          {showSurprise && (
            <div className="surprise-panel">
              <p>
                {isBirthdayToday
                  ? 'Surprise is ready now for you 🎉🎁'
                  : 'Just wait until your birthday —  surprise is coming for you.🎉🎂'}
              </p>
              {isBirthdayToday && (
                <button
                  type="button"
                  className="surprise-button"
                  onClick={() => {
                    window.location.href = 'https://codewithshamim-bs23.github.io/HappyBirthday/'
                  }}
                >
                  Click here
                </button>
              )}
            </div>
          )}

          <p className="countdown-title">Countdown to your special day ✨</p>
          <div className="counter-strip">
            <article>
              <strong>{formatCounter(countdown.days)}</strong>
              <span>Days</span>
            </article>
            <article>
              <strong>{formatCounter(countdown.hours)}</strong>
              <span>Hrs</span>
            </article>
            <article>
              <strong>{formatCounter(countdown.minutes)}</strong>
              <span>Min</span>
            </article>
            <article>
              <strong>{formatCounter(countdown.seconds)}</strong>
              <span>Sec</span>
            </article>
          </div>
          {isBirthdayToday && (
            <p className="countdown-title">Surprise is ready for you. Click Open Surprise 🎉🎁</p>
          )}
        </header>

        <section className="content-panel">
          <h2 className="section-title">A Special Message</h2>
          <div className="message-grid">
            {todayWishes.map((wish) => (
              <article key={wish} className="message-card">
                <p>{wish}</p>
              </article>
            ))}
          </div>

          <h2 className="section-title">Photo Gallery</h2>
          <div className="gallery-grid">
            {galleryItems.map((item) => (
              <figure key={item.title} className={`gallery-card ${item.className}`}>
                <img src={item.image} alt={item.title} />
              </figure>
            ))}
          </div>

          <h2 className="section-title">Make a Wish</h2>
          <article className="wish-panel">
            <div className="cake">{candlesLit ? '🎂✨' : '🎂'}</div>
            <p>Close your eyes and smile...</p>
            <button
              type="button"
              className="surprise-button"
              onClick={() => setCandlesLit((previous) => !previous)}
            >
              {candlesLit ? 'Candles Are Glowing ✨' : 'Light Candles 🕯️'}
            </button>
          </article>

          <footer className="footer-note">Made by a mad man, just for you ❤️</footer>
        </section>

        <button
          type="button"
          className="music-fab"
          onClick={() => setMusicOn((previous) => !previous)}
          aria-label="Toggle music"
        >
          {musicOn ? '🎵' : '🎶'}
        </button>

        {musicOn && needsMusicTap && (
          <p className="music-note">Tap once to start music</p>
        )}

        <audio ref={audioRef} src={`${assetBase}hbd.mp3`} loop preload="auto" />
      </section>
    </main>
  )
}

export default App
