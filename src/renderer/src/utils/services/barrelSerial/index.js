import apiService from '../ApiService'

const getAll = (isColor = false) => apiService.get('/BarrelSerial/GetGroupedRawMaterialBarrelRemainings', { params: { isColor } })

const getRequestStockCode = () => apiService.get('/BarrelSerial/RequestStockCode')
const requestStock = (data) => apiService.post('/BarrelSerial/CreateRPStokSevk', data)

const barrelSerialService = {
    getAll,
    getRequestStockCode,
    requestStock
}

export default barrelSerialService
