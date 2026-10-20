
import { useState, useEffect } from 'react'

function App() {
  const [task, setTask] = useState("")
  const [todos, setTodos] = useState([])
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  useEffect(() => {
    // Check if the app is already installed / running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')

    if (isStandalone) {
      setIsInstalled(true)
    }

    // Capture beforeinstallprompt event if supported by the browser
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    // Update state when app is successfully installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
      setShowInstructions(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Trigger the native installation prompt
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
      }
      setDeferredPrompt(null)
    } else {
      // If beforeinstallprompt is not supported (e.g. iOS Safari) or unavailable, show manual instructions
      setShowInstructions((prev) => !prev)
    }
  }

  // Detect iOS devices for specific instructions
  const isIOS =
    typeof navigator !== 'undefined' &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent || '') ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))

  return (
    <div className="app">
      <h1>My Todo App</h1>

      <p>My first React application</p>

      {/* PWA Install Button & Instructions */}
      <div className="install-container">
        <button
          className={`install-btn ${isInstalled ? 'installed' : ''}`}
          onClick={handleInstallClick}
          disabled={isInstalled}
          aria-label={isInstalled ? 'App Installed' : 'Download / Install App'}
        >
          {isInstalled ? '✓ App Installed' : '📲 Download / Install App'}
        </button>

        {!isInstalled && !deferredPrompt && !showInstructions && (
          <small className="install-hint">
            Tap above for install instructions
          </small>
        )}

        {showInstructions && !isInstalled && (
          <div className="install-instructions">
            <div className="instructions-header">
              <strong>How to Install App</strong>
              <button
                type="button"
                className="close-instructions-btn"
                onClick={() => setShowInstructions(false)}
                aria-label="Close instructions"
              >
                ✕
              </button>
            </div>
            {isIOS ? (
              <ol>
                <li>Tap the <strong>Share</strong> button (square with arrow) at the bottom of Safari.</li>
                <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top-right corner.</li>
              </ol>
            ) : (
              <ol>
                <li>Tap the browser menu (<strong>⋮</strong> or <strong>⋯</strong> in the top corner).</li>
                <li>Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
                <li>Confirm to install the app on your device.</li>
              </ol>
            )}
          </div>
        )}
      </div>

      <input
        type="text"
        placeholder="Enter your task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button
        onClick={() => {
          if (task.trim() !== '') {
            setTodos([...todos, task])
            setTask('')
          }
        }}
      >
        Add Todo
      </button>

      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button
              className="delete-btn"
              onClick={() => {
                setTodos(todos.filter((_, i) => i !== index))
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
