'use client'

import { useState } from 'react'
import styles from './TrailerConfigurator.module.css'

const CONFIGURATOR_SRC = 'https://vanclaes.com/product-configurator.php?dealer_cid=104804-e0b5b'
const COOKIE_APPROVE_SRC = 'https://vanclaes.com/safary-cookies-approve.php'

export function TrailerConfigurator() {
  const [started, setStarted] = useState(false)

  function handleStart() {
    // Vanclaes requires their first-party cookies to be set before the
    // configurator will work (notably in Safari, which blocks third-party
    // cookies). Their embed does this by briefly opening a cookie-approval
    // page. The popup must be triggered by a user gesture, so we do it from
    // this click handler, then close the window automatically.
    try {
      const win = window.open(
        COOKIE_APPROVE_SRC,
        '_blank',
        'toolbar=no, scrollbars=no, resizable=no, left=100, top=100, width=120, height=140, menubar=no',
      )
      if (win) window.setTimeout(() => win.close(), 2000)
    } catch {
      // If the popup is blocked the configurator still loads; the user may
      // just be prompted to accept cookies inside the frame instead.
    }
    setStarted(true)
  }

  return (
    <div className={styles.frame}>
      <iframe
        name="vanclaes-configurator"
        src={CONFIGURATOR_SRC}
        title="Vanclaes trailer configurator"
        className={styles.iframe}
        allow="fullscreen"
      />

      {!started && (
        <div className={styles.cover}>
          <div className={styles.coverInner}>
            <span className={styles.eyebrow}>Vanclaes &middot; New Trailers</span>
            <h2 className={styles.coverTitle}>Build your trailer to spec</h2>
            <p className={styles.coverText}>
              Configure a brand-new Vanclaes trailer sized precisely for your boat &mdash; choose the
              model, axle setup, options and finish. We handle supply, fitting and IVA registration
              across the Algarve.
            </p>
            <button type="button" className="btn btn-gold" onClick={handleStart}>
              Start Configuring
            </button>
            <p className={styles.coverNote}>Opens the live Vanclaes configurator in this window.</p>
          </div>
        </div>
      )}
    </div>
  )
}
