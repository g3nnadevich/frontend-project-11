export default (data) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(data, 'application/xml')
  
  const title = doc.querySelector('channel > title').textContent
  const description = doc.querySelector('channel > description').textContent
  
  const items = doc.querySelectorAll('item')
  const posts = [...items].map((item) => {
    const title = item.querySelector('title').textContent
    const description = item.querySelector('description').textContent
    const link = item.querySelector('link').textContent

    return {
      title,
      description,
      link,
    }
  })

  return {
    title,
    description,
    posts,
  }
}