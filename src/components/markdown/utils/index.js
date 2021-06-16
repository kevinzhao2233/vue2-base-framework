export function mergeObject(obj1, obj2) {
  for (var p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (obj2[p].constructor === Object) {
        obj1[p] = mergeObject(obj1[p], obj2[p])
      } else {
        obj1[p] = obj2[p]
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p]
    }
  }
  return obj1
}

export function url2Params(str) {
  if (!str) return {}
  const obj = {}
  str.replace(/([^?=&#]+)=([^?=&#]+)/g, (_, key, value) => { obj[key] = value })
  str.replace(/#([^?=&#]+)/g, (_, hash) => { obj.HASH = hash })
  return obj
}
