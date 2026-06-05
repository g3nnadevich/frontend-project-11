import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { i18nextInstance } from './i18n.js'
import { subscribe, snapshot } from 'valtio/vanilla'

export default (state, elements) => {
  const { input, feedback, feeds, posts, submitButton } = elements
  // рендер фидов
  const renderFeeds = (state) => {
    if (state.feeds.length === 0) {
      feeds.innerHTML = ''
      return
    }
    // карточка
    const card = document.createElement('div')
    card.classList.add('card', 'bg-light', 'shadow-sm')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    // заголовок
    const title = document.createElement('h2')
    title.classList.add('card-title', 'h4', 'mb-3', 'text-center')
    title.textContent = i18nextInstance.t('feeds')
    // контейнер списка
    const feedsList = document.createElement('ul')
    feedsList.classList.add('list-group', 'list-group-flush')
    // фиды с описанием
    const feedItems = state.feeds.map(feed => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'bg-light', 'm-1', 'border-0')

      const feedTitle = document.createElement('h3')
      feedTitle.classList.add('h6', 'm-0')
      feedTitle.textContent = feed.title

      const feedDescription = document.createElement('p')
      feedDescription.classList.add('text-black-50', 'small')
      feedDescription.textContent = feed.description
      
      li.append(feedTitle, feedDescription)
      return li
    })
    // сборка
    feedsList.append(...feedItems)
    cardBody.append(title, feedsList)
    card.append(cardBody)
    feeds.innerHTML = ''
    feeds.append(card)
  }
  // рендер постов
  const renderPosts = (state) => {
    if (state.posts.length === 0) {
      posts.innerHTML = ''
      return
    }
    // карточка
    const card = document.createElement('div')
    card.classList.add('card', 'bg-light', 'shadow-sm')
    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    // заголовок
    const title = document.createElement('h2')
    title.classList.add('card-title', 'h4', 'mb-3', 'text-center')
    title.textContent = i18nextInstance.t('posts')
    // контейнер списка постов
    const postList = document.createElement('ul')
    postList.classList.add('list-group', 'list-group-flush')
    // посты
    const postItems = state.posts.map(post => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'bg-light', 'border-0', 'border-end-0', 'd-flex', 'justify-content-between', 'align-items-start')
      // ссылка
      const link = document.createElement('a')
      link.href = post.link
      link.textContent = post.title
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      const isRead = state.ui.seenPosts.has(post.id)
      const className = isRead
      ? ['fw-normal', 'link-secondary']
      : ['fw-bold']
      link.classList.add(...className)
      link.dataset.id = post.id
      // кнопка
      const button = document.createElement('button')
      button.type = "button"
      button.classList.add('btn', 'btn-outline-primary')
      button.dataset.id = post.id
      button.dataset.bsToggle = 'modal'
      button.dataset.bsTarget = '#modal'
      button.textContent = i18nextInstance.t('button')
      
      li.append(link, button)
      return li
    })
    // сборка
    postList.append(...postItems)
    cardBody.append(title, postList)
    card.append(cardBody)
    posts.innerHTML = ''
    posts.append(card)
  }
  //рендер статусов и ошибок
  const renderFeedback = (state) => {
    const { form, loadingProcess } = state

    feedback.textContent = ''
    feedback.classList.remove('text-danger', 'text-success')
    input.classList.remove('is-invalid')

    // Ошибки валидации
    if (form.status === 'invalid') {
      feedback.textContent = form.error
      feedback.classList.add('text-danger')
      input.classList.add('is-invalid')
      return
    }
    // Загрузка
    if (loadingProcess.status === 'loading') {
      submitButton.disabled = true
      input.readOnly = true
      feedback.textContent = i18nextInstance.t('loaded.load')
      return
    }
    // Ошибка сервера
    if (loadingProcess.status === 'failed') {
      submitButton.disabled = false
      input.readOnly = false
      feedback.textContent = i18nextInstance.t(`errors.${loadingProcess.error}`)
      feedback.classList.add('text-danger')
      return
    }
    // Успех
    if (loadingProcess.status === 'success') {
      submitButton.disabled = false
      input.readOnly = false
      feedback.textContent = i18nextInstance.t('loaded.success')
      feedback.classList.add('text-success')
      input.value = ''
      input.focus()
    }
  }
  //модальное окно
  const renderModal = (state) => {
    const post = state.posts.find(post => post.id === state.modal.postId)
    if(!post) {
      return
    }
    elements.modalTitle.textContent = post.title
    elements.modalBody.textContent = post.description
    elements.modalLink.href = post.link
  }
  // рендер страницы
  const render = (state) => {
    renderFeedback(state)
    renderFeeds(state)
    renderPosts(state)
    renderModal(state)
  }
  // обновление страницы
  subscribe(state, () => render(snapshot(state)))
  render(state)
}