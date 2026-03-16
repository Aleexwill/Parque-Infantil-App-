import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ message = 'Cargando KidSpark...' }) {
  return (
    <div className={styles.root}>
      <div className={styles.blob1} /><div className={styles.blob2} />
      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <span className={styles.star}>🌟</span>
          <div className={styles.ring} />
        </div>
        <p className={styles.appName}>KidSpark</p>
        <p className={styles.message}>{message}</p>
        <div className={styles.dots}>
          <span /><span /><span />
        </div>
      </div>
    </div>
  )
}
