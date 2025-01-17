import ToastAlert from '@/components/common/ToastAlert.vue'
import { toast } from 'vue3-toastify'

class SnackbarHelper {
  static showError(title, timeout = 3000) {
    toast(ToastAlert, { contentProps: { type: "error", message: title } })
  }

  static showSuccess(title, timeout = 3000) {
    toast(ToastAlert, { contentProps: { type: "success", message: title } })
  }
}

export default SnackbarHelper
