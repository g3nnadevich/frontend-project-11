import * as yup from 'yup'
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

import './style.css'
import initView from './view.js'
import { i18nextPromise, i18nextInstance } from './i18n.js'

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

const createSchema = () => {
  return yup
    .string()
    .required()
    .url()
    .notOneOf(state.feeds)
}

form.addEventListener('submit', (e) => {
  e.preventDefault()

  createSchema().validate(input.value)
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

i18nextPromise
  .then(() => {
    yup.setLocale({
      mixed: {
        required: () => i18nextInstance.t('errors.required'),
        notOneOf: () => i18nextInstance.t('errors.duplicate')
      },
      string: {
        url: () => i18nextInstance.t('errors.invalidUrl'),
      },
    })
    initView(state, elements)
  })
