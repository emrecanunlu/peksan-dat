import apiService from '../ApiService'

const getAll = async (isColor = false) => apiService.get('/BarrelSerial/GetGroupedRawMaterialBarrelRemainings', { params: { isColor } })

const getRequestStockCode = async () => apiService.get('/BarrelSerial/RequestStockCode')

const barrelSerialService = {
    getAll,
    getRequestStockCode
}

export default barrelSerialService
