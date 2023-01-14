const request = async (url, method = 'GET', body = null, headers = {}) => {
    try {
      if (body) {
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
      }
      
      const responce = await fetch((process.env.NODE_ENV === 'development' ? 'https://localhost:2690/api/' :  'https://footballcoin.ru:2689/api/')  + url, {
        method,
        body,
        headers,
      })
  
      const data = await responce.json()
  
      if (!responce.ok) {
        throw new Error(data.message || 'Что-то пошло не так')
      }
  
      return data
    } catch (e) {
      throw e
    }
  }
  export default request