import { useEffect, useMemo, useState } from 'react'
import './App.css'

const birthDate = new Date(2003, 1, 24)
const specialName = 'Mayesha'

const galleryItems = [
  { title: 'Sweet Smile', image: '/img1.jpg', className: 'large' },
  { title: 'Celebration', image: '/img2.jpg', className: 'small' },
  { title: 'Happy Day', image: '/img3.jpg', className: 'small' },
  { title: 'Best Moments', image: '/img4.jpg', className: 'wide' },
  { title: 'Together', image: '/img5.jpg', className: 'small' },
  { title: 'Golden Lights', image: '/img6.jpg', className: 'small' },
]

function getNextBirthday(referenceDate) {
  const now = referenceDate
  const year = now.getFullYear()
  const next = new Date(year, birthDate.getMonth(), birthDate.getDate())

  if (next < now) {
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
  const [musicOn, setMusicOn] = useState(false)

  const nextBirthday = useMemo(() => getNextBirthday(now), [now])
  const countdown = getCountdownParts(nextBirthday, now)
  const todaysDayOfMonth = now.getDate()
  const todaysMonth = now.getMonth()
  const isBirthdayToday = true || 
    todaysMonth === birthDate.getMonth() && todaysDayOfMonth === birthDate.getDate()

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

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
                  : 'Just wait until your birthday — a massive surprise is coming for you.🎉🎂'}
              </p>
              {isBirthdayToday && (
                <button
                  type="button"
                  className="surprise-button"
                  onClick={() => window.open('https://codewithshamim-bs23.github.io/HappyBirthday/', '_blank', 'noopener,noreferrer')}
                >
                  Click here
                </button>
              )}
            </div>
          )}

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
        </header>

        <section className="content-panel">
          <h2 className="section-title">A Special Message</h2>
          <div className="message-grid">
            <article className="message-card">
              <p>
                💖 May your smile shine brighter than the candles today. Wishing you
                endless joy!
              </p>
            </article>
            <article className="message-card">
              <p>
                ✨ May this birthday bring you moments that make your heart feel full.
              </p>
            </article>
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

          <footer className="footer-note">Made with ❤️ just for you</footer>
        </section>

        <button
          type="button"
          className="music-fab"
          onClick={() => setMusicOn((previous) => !previous)}
          aria-label="Toggle music"
        >
          {musicOn ? '🎵' : '🎶'}
        </button>

        {musicOn && (
          <p className="music-note">Music mode on ♫ (add your favorite song later)</p>
        )}
      </section>
    </main>
  )
}

export default App
