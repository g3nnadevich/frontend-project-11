import * as yup from 'yup'
import { proxy } from 'valtio/vanilla'
import axios from 'axios'

import './style.css'
import initView from './view.js'
import { i18nextPromise, i18nextInstance } from './i18n.js'
import parse from './parser.js'
import validate from './validator.js'

const state = proxy({
  form: {
    status: 'filling', // 'filling' | 'invalid' | 'valid'
    error: null,
  },
  loadingProcess: {
    status: 'idle', // 'idle' | 'loading' | 'success' | 'failed'
    error: null,
  },
  feeds: [],
  posts: [],
})

const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  submitButton: document.querySelector('[data-submit-button]')
}
const { form, input } = elements

// запрос на сервер через прокси
const loadRss = (url) => {
  state.loadingProcess.status = 'loading'
  state.loadingProcess.error = null

  const proxyUrl = 'https://allorigins.hexlet.app/get'

  return axios
    .get(proxyUrl, {
      params: {
        url,
        disableCache: 'true',
      },
    })
    .then(res => {
      state.loadingProcess.status = 'success'
      return res.data.contents
    })
    .catch(err => {
      state.loadingProcess.status = 'failed'
      state.loadingProcess.error = err.message
      throw err
    })
}

const addFeed = (feed, url) => {
  const { title, description, posts } = parse(feed)
  const feedId = crypto.randomUUID()

  state.feeds.push({
    id: feedId,
    url,
    title,
    description,
  })

  posts.forEach(post => {
    state.posts.push({
      id: crypto.randomUUID(),
      feedId,
      title: post.title,
      description: post.description,
      link: post.link,
    })
  })
}

const handleAddFeed = (url) => {
  validate(url, state.feeds)
    .then(() => {
      state.form.status = 'valid'
      state.form.error = null
      return loadRss(url)
    })
    .then((data) => {
      addFeed(data, url)
    })
    .catch((error)=> {
      state.form.status = 'invalid'
      state.form.error = error.message
    }) 
}

//Кнопка "добавить"
form.addEventListener('submit', (e) => {
  e.preventDefault()
  handleAddFeed(input.value)
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
