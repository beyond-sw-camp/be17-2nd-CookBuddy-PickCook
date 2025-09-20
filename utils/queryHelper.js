export function cleanQuery(obj) {
  const query = {}
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      query[key] = obj[key]
    }
  })
  return query
}
