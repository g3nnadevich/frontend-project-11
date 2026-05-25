import i18next from 'i18next'
import ru from './locales/ru.js'

const i18nextInstance = i18next.createInstance()

const i18nextPromise = i18nextInstance.init({
  lng: 'ru',
    resources: { ru },
})

export { i18nextPromise, i18nextInstance }