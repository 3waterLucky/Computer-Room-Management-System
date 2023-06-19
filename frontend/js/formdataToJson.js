export function formdataToJson(formdata) {
  let obj = {}
  for (const key of formdata.keys()) {
    obj[key] = formdata.get(key)
  }
  return obj
}