import apiService from '../ApiService'

const getBarrels = async () => await apiService.get('/rawMaterial/barrels')
const getMaterials = async (workOrder, barrelKg, isColor) =>
  await apiService.get(
    `/rawMaterial?workOrder=${workOrder}&barrelKg=${isColor ? 0 : barrelKg}&isColor=${isColor}`
  )
const getSeries = (stockCode, { page = 1, offset = 10, search = '' }) => {
  const searchParams = new URLSearchParams()
  searchParams.append('stockCode', stockCode)
  searchParams.append('search', search)
  searchParams.append('pageNumber', page)
  searchParams.append('pageSize', offset)
  return apiService.get("/rawMaterial/stockSerial?" + searchParams.toString())
}
const getFractureSeries = async () => await apiService.get('/rawMaterial/fracture')
const getRatios = async () => await apiService.get('/rawMaterial/ratios')
const transfer = async (data) => await apiService.post('/rawMaterial', data)

const rawMaterialService = {
  getBarrels,
  getMaterials,
  getSeries,
  getFractureSeries,
  getRatios,
  transfer
}

export default rawMaterialService
