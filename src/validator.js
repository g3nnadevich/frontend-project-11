import * as yup from 'yup'

const createSchema = (feeds) => {
  return yup
    .string()
    .required()
    .url()
    .notOneOf(feeds.map(feed => feed.url))
}

export default (url, feeds) => {
  return createSchema(feeds).validate(url)
}