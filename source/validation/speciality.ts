import Validator from 'validator'
import isEmpty from 'is-empty'

const validateSpecialityInput = (data: any) => {
  let errors: any = {}
  // Convert empty fields to an empty string so we can use validator functions
  data.name_en = !isEmpty(data.name_en) ? data.name_en : ""
  data.name_ar = !isEmpty(data.name_ar) ? data.name_ar : ""
  data.tags = !isEmpty(data.tags) ? data.tags : ""
  data.order = !isEmpty(data.order) ? data.order : ""

  if (Validator.isEmpty(data.name_en)) {
    errors.name_en = "English Name field is required"
  }

  if (Validator.isEmpty(data.name_ar)) {
    errors.name_ar = "Arabic Name field is required"
  }

  if (Validator.isEmpty(data.order)) {
    errors.order = "Order field is required"
  }

  if (Validator.isEmpty(data.tags)) {
    errors.tags = "Tags field is required"
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }
}

export default validateSpecialityInput