import apiService from '../ApiService'

const getAll = (isColor = false) => apiService.get('/BarrelSerial/GetGroupedRawMaterialBarrelRemainings', { params: { isColor } })

const getRequestStockCode = () => apiService.get('/BarrelSerial/RequestStockCode')
const requestStock = (data) => apiService.post('/BarrelSerial/CreateRPStokSevk', data)
const requestStockList = (params) => apiService.get('/BarrelSerial/RequestStockV2', { params })

const barrelSerialService = {
    getAll,
    getRequestStockCode,
    requestStock,
    requestStockList
}

export default barrelSerialService
