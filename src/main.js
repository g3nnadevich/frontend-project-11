import './style.css'
import * as yup from 'yup'
import { proxy, subscribe, snapshot } from 'valtio/vanilla'
import initView from './view.js'

const state = proxy({
    feeds: [],
    form: {
      status: null,
      error: null,
    },
})

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
  feedback: document.querySelector('.feedback'),
}

const { form, input } = elements

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

initView(state, elements)