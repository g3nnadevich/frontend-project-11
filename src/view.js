import { i18nextInstance } from './i18n.js'
import { subscribe, snapshot } from 'valtio/vanilla'

const render = (state, elements) => {
  const { input, feedback } = elements
  const snap = snapshot(state)

  feedback.classList.remove('text-success', 'text-danger')
  feedback.textContent = ''
  input.classList.remove('is-invalid')

  if (snap.form.status === 'valid') {
    feedback.classList.add('text-success')
    feedback.textContent = i18nextInstance.t('loaded.success')
  }

  if (snap.form.status === 'error') {
    feedback.classList.add('text-danger')
    input.classList.add('is-invalid')
    feedback.textContent = snap.form.error
  }

  input.focus()
}

export default (state, elements) => {
  subscribe(state, () => render(state, elements))
  render(state, elements)
}