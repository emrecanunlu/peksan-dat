import apiService from '../ApiService'

const getAll = async (isColor = false) => apiService.get('/BarrelSerial/GetGroupedRawMaterialBarrelRemainings', { params: { isColor } })

const barrelSerialService = {
    getAll
}

export default barrelSerialService
