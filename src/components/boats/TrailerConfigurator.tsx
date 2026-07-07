import styles from './TrailerConfigurator.module.css'

const CONFIGURATOR_SRC = 'https://vanclaes.com/product-configurator.php?dealer_cid=104804-e0b5b'

export function TrailerConfigurator() {
  return (
    <div className={styles.frame}>
      <iframe
        name="vanclaes-configurator"
        src={CONFIGURATOR_SRC}
        title="Vanclaes trailer configurator"
        className={styles.iframe}
        allow="fullscreen"
      />
    </div>
  )
}
