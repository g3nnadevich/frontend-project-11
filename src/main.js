import * as yup from 'yup'
import { proxy } from 'valtio/vanilla'
import axios from 'axios'

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
  feeds: document.querySelector('.feeds'),
}

const { form, input } = elements

const createSchema = () => {
  return yup
    .string()
    .required()
    .url()
    .notOneOf(state.feeds.map(feed => feed.url))
}

const validate = (url) => {
  return createSchema().validate(url)
}

const loadRss = (url) => {
  return axios
    .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((res) => res.data.contents)
}

const addFeed = (url) => {
  validate(url)
    .then(() => loadRss(url))
    .then((data) => {
      state.feeds.push({
        url: url,
        text: data,
      })
      state.form.status = 'valid'
      state.form.error = null
      input.value = ''
    })
    .catch((error)=> {
      state.form.status = 'error'
      state.form.error = error.message
    }) 
}

//Кнопка "добавить"
form.addEventListener('submit', (e) => {
  e.preventDefault()
  addFeed(input.value)
})

//Запуск приложения
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
