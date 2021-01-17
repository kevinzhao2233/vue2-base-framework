import request from '@/utils/request'

export function searchSong(params) {
  return request({
    url: `/api/search`,
    params
  })
}

export function test(params) {
  return request({
    url: `http://10.22.22.22`,
    params
  })
}
