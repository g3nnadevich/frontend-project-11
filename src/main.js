import './style.css'
import * as yup from 'yup'
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

  const state = proxy({
      feeds: [],
      form: {
        status: 'await',
        error: null,
      },
  })

const form = document.querySelector('form')
const input = document.querySelector('input')
const message = document.querySelector('.message')

form.addEventListener('submit', (e) => {
  e.preventDefault()

  const schema = yup
  .string()
  .required('Не должно быть пустым')
  .url('Ссылка должна быть валидным URL')
  .notOneOf(state.feeds, 'RSS уже существует')

  schema.validate(input.value)
    .then(() => {
      state.feeds.push(input.value)
      state.form.status = 'valid'
      state.form.error = null
      input.value = ''
    })
    .catch((error)=> {
      state.form.status = 'error'
      state.form.error = error.message
    }) 
})

const render = () => {
  const snap = snapshot(state)

  message.classList.remove('text-success', 'text-danger', 'is-invalid')
  message.textContent = ''
  input.classList.remove('is-invalid')

  if (snap.form.status === 'valid') {
    message.classList.add('text-success')
    message.textContent = 'RSS успешно загружен'
  }

  if (snap.form.status === 'error') {
    message.classList.add('text-danger')
    input.classList.add('is-invalid')
    message.textContent = snap.form.error
  }

  input.focus()
}

subscribe(state, render)

render()