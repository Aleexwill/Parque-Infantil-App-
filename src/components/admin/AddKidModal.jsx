import { useState } from 'react'
import { useApp } from '@/lib/AppContext'
import styles from './AddKidModal.module.css'

const AVATARS = ['🧒','👦','👧','🧑','👶','🦸','🧙','🧚','🐣','🦊']
const COLORS  = ['#4FC3F7','#AB47BC','#66BB6A','#FF7043','#FFD54F','#EC407A','#26C6DA','#7E57C2']

export default function AddKidModal({ onClose }) {
  const { addKid } = useApp()
  const [form,   setForm]   = useState({ name: '', age: '', avatar: '🧒', color: '#4FC3F7' })
  const [errors, setErrors] = useState({})
  const [busy,   setBusy]   = useState(false)
  const [done,   setDone]   = useState(false)

  function field(key, val) {
    setForm(f => ({ ...f, [key]: val }))
    setErrors(e => ({ ...e, [key]: null }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())         e.name = 'El nombre es requerido'
    else if (form.name.length > 30) e.name = 'Máximo 30 caracteres'
    const age = parseInt(form.age)
    if (!form.age)                  e.age  = 'La edad es requerida'
    else if (isNaN(age) || age < 2 || age > 17) e.age = 'Edad entre 2 y 17 años'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    try {
      await addKid({ name: form.name.trim(), age: parseInt(form.age), avatar: form.avatar, color: form.color })
      setDone(true)
      setTimeout(onClose, 900)
    } catch (err) {
      setErrors({ submit: err.message || 'Error al crear perfil' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>👶 Agregar niño</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {done ? (
          <div className={styles.success}>
            <span>✅</span>
            <p>¡Perfil creado!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {/* Avatar picker */}
            <div className={styles.section}>
              <label className={styles.label}>Avatar</label>
              <div className={styles.avatarGrid}>
                {AVATARS.map(av => (
                  <button type="button" key={av}
                    className={`${styles.avatarBtn} ${form.avatar === av ? styles.avatarBtnActive : ''}`}
                    onClick={() => field('avatar', av)}>
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div className={styles.section}>
              <label className={styles.label}>Color</label>
              <div className={styles.colorRow}>
                {COLORS.map(c => (
                  <button type="button" key={c}
                    className={`${styles.colorDot} ${form.color === c ? styles.colorDotActive : ''}`}
                    style={{ background: c }}
                    onClick={() => field('color', c)}
                  />
                ))}
              </div>
            </div>

            {/* Name */}
            <div className={styles.section}>
              <label className={styles.label}>📝 Nombre</label>
              <input
                type="text" placeholder="Ej: Sofía"
                value={form.name} onChange={e => field('name', e.target.value)}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                maxLength={30} autoFocus
              />
              {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
            </div>

            {/* Age */}
            <div className={styles.section}>
              <label className={styles.label}>🎂 Edad</label>
              <input
                type="number" placeholder="Ej: 7" min={2} max={17}
                value={form.age} onChange={e => field('age', e.target.value)}
                className={`${styles.input} ${styles.inputSmall} ${errors.age ? styles.inputError : ''}`}
              />
              {errors.age && <span className={styles.errMsg}>{errors.age}</span>}
            </div>

            {/* Preview */}
            <div className={styles.preview} style={{ '--kid-color': form.color }}>
              <div className={styles.previewAvatar} style={{ background: form.color + '22' }}>
                {form.avatar}
              </div>
              <div>
                <div className={styles.previewName}>{form.name || 'Sin nombre'}</div>
                <div className={styles.previewAge}>{form.age ? `${form.age} años` : '— años'}</div>
              </div>
            </div>

            {errors.submit && <div className={styles.errBanner}>{errors.submit}</div>}

            <div className={styles.actions}>
              <button type="button" className={styles.btnCancel} onClick={onClose}>Cancelar</button>
              <button type="submit" className={styles.btnSave} disabled={busy}>
                {busy ? <span className={styles.spinner} /> : '✨ Crear perfil'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
