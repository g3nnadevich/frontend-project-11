import { i18nextInstance } from './i18n.js'
import { subscribe, snapshot } from 'valtio/vanilla'

export default (state, elements) => {
  const { input, feedback, feeds, posts, submitButton } = elements

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
      li.classList.add('list-group-item', 'bg-light', 'border-0', 'd-flex', 'justify-content-between')

      const link = document.createElement('a')
      link.href = post.link
      link.textContent = post.title
      link.target = '_blank'
      link.rel = 'noopener noreferrer'

      const button = document.createElement('button')
      button.classList.add('btn', 'btn-outline-primary')
      button.type = "button"
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
      feedback.textContent = i18nextInstance.t('loaded.load')
      return
    }
    // Ошибка сервера
    if (loadingProcess.status === 'failed') {
      feedback.textContent = i18nextInstance.t(`errors.${loadingProcess.error}`)
      feedback.classList.add('text-danger')
      return
    }
    // Успех
    if (loadingProcess.status === 'success') {
      feedback.textContent = i18nextInstance.t('loaded.success')
      feedback.classList.add('text-success')
      input.value = ''
      input.focus()
    }
  }

  const render = (state) => {
    renderFeedback(state)
    renderFeeds(state)
    renderPosts(state)
  }

  subscribe(state, () => render(state))
  render(state)
}