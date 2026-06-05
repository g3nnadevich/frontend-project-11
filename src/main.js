import * as yup from 'yup'
import { proxy } from 'valtio/vanilla'
import axios from 'axios'
import _ from 'lodash'

import './style.css'
import initView from './view.js'
import { i18nextPromise, i18nextInstance } from './i18n.js'
import parse from './parser.js'
import validate from './validator.js'
// State
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
  modal: {
    postId: null,
  },
  ui: {
    seenPosts: new Set(),
  },
})
// DOM эл-ты
const elements = {
  form: document.querySelector('form'),
  input: document.querySelector('input'),
  feedback: document.querySelector('.feedback'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
  submitButton: document.querySelector('[data-submit-button]'),
  modal: document.querySelector('.modal'),
  modalTitle: document.querySelector('.modal-title'),
  modalBody: document.querySelector('.modal-body'),
  modalLink: document.querySelector('.modal-footer a'),
}
const { form, input, posts } = elements
// запрос на сервер через прокси
const loadRss = (url) => {
  const proxyUrl = 'https://allorigins.hexlet.app/get'
  return axios
    .get(proxyUrl, {
      params: {
        url,
        disableCache: 'true',
      },
    })
    .then(res => res.data.contents)
}
// Добавить распарсенный RSS в state
const addFeed = (data, url) => {
  const { title, description, posts } = data
  const feedId = _.uniqueId()

  state.feeds.push({
    id: feedId,
    url,
    title,
    description,
  })

  posts.forEach(post => {
    state.posts.push({
      id: _.uniqueId(),
      feedId,
      title: post.title,
      description: post.description,
      link: post.link,
    })
  })
}
// Обработка ошибок загрузки
const getLoadingProcessError = (error) => {
  if (error.message === 'parseError') {
    return 'parseError'
  }
  if (error.isAxiosError) {
    return 'loadError'
  }
  return 'unknownError'
}
// Обработка добавления фида через форму
const handleAddFeed = (url) => {
  validate(url, state.feeds)
    .then(() => {
      state.form.status = 'valid'
      state.loadingProcess.status = 'loading'
      state.loadingProcess.error = null
      return loadRss(url)
    })
    .then((data) => {
      const parsed = parse(data)
      addFeed(parsed, url)
      state.loadingProcess.status = 'success'
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        state.form.status = 'invalid'
        state.form.error = error.message
        state.loadingProcess.status = 'idle'
        return
      }
      state.loadingProcess.status = 'failed'
      state.loadingProcess.error = getLoadingProcessError(error)
    })
}
// Обновление постов
const startUpdatingPosts = () => {
  const promises = state.feeds.map(feed => {
    return loadRss(feed.url)
      .then(parse)
      .then(data => {
        const newPosts = data.posts.filter(post => !state.posts.some(p => p.link === post.link))
        newPosts.forEach(post => {
          state.posts.unshift({
            id: crypto.randomUUID(),
            feedId: feed.id,
            title: post.title,
            description: post.description,
            link: post.link,
          })
        })
      })
      .catch(err => {
        console.error(feed.url, err)
      })
  })
  Promise.all(promises)
    .finally(() => setTimeout(startUpdatingPosts, 5000))
}
// Отправка формы
form.addEventListener('submit', (e) => {
  e.preventDefault()
  handleAddFeed(input.value)
})
// Предпросмотр поста в модальном окне
posts.addEventListener('click', (e) => {
  const button = e.target.closest('button[data-id]')
  if (!button) return

  const id = button.dataset.id
  state.modal.postId = id
  state.ui.seenPosts.add(id)
})
// Запуск приложения
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
    startUpdatingPosts()
  })
