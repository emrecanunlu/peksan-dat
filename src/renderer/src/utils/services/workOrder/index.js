import apiService from '../ApiService'

const getById = async (machineId) => await apiService.get(`/workOrder?machineId=${machineId}`)
const getProductionInformation = (machineId) => apiService.get(`/workOrder/to-be-produced?machineId=${machineId}`)

const workOrderService = {
  getById,
  getProductionInformation
}

export default workOrderService
