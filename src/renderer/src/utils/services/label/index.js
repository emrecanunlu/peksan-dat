import apiService from '../ApiService'

const getUnverifiedLabel = () => apiService.get('/Dogrulama/DogrulanmamisEtiket');
const verifyLabel = (datno) => apiService.post('/Dogrulama/Dogrula', { datno });
const getLabel = (datNo) => apiService.get('/Dogrulama/Etiket?datNo=' + datNo);

export default {
    getUnverifiedLabel,
    verifyLabel,
    getLabel
}