import axios from 'axios'
import SnackbarHelper from '../helpers/SnackbarHelper'

const apiService = axios.create({
  baseURL: ''
})

apiService.interceptors.request.use(
  async function (config) {
    const apiUrl = await window.api.get('apiUrl')

    config.baseURL = apiUrl + '/api'

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

function getErrorMessage(status) {
  switch (status) {
    case 400:
      return `${status} - Geçersiz istek! Lütfen verilerinizi kontrol edin.`
    case 401:
      return `${status} - Yetkisiz erişim! Lütfen giriş yapın.`
    case 403:
      return `${status} - Erişim engellendi! Bu işlemi gerçekleştirme yetkiniz yok.`
    case 404:
      return `${status} - Kaynak bulunamadı! Lütfen adresi kontrol edin.`
    case 500:
      return `${status} - Sunucu hatası! Lütfen daha sonra tekrar deneyin.`
    default:
      return 'Bilinmeyen bir hata meydana geldi!'
  }
}

apiService.interceptors.response.use(
  function (response) {
    return response
  },
  function (err) {
    let errorMessage = 'Hata meydana geldi!'

    if (err?.response) {
      errorMessage = err.response.data?.message ?? getErrorMessage(err.response.status)
    } else if (err?.request) {
      errorMessage = getErrorMessage(err.request.status)
    } else {
      errorMessage = err.message
    }

    SnackbarHelper.showError(errorMessage)

    return Promise.reject(err)
  }
)

export default apiService
