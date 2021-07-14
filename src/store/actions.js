
import appConst from '@/assets/js/appConst'
import http from '@/assets/js/http'
import { apiUrl } from '@/assets/js/apiUrl'
import global from '@/assets/js/global'

// 通过orgName 获取orgId
// export const GET_ORG_INFO = async function({ commit, state }, params) {
// 	let url = `${apiUrl.orguserList}`;
// 	let response = await http.get(url, { params: {orgName: params.orgName} })
// 	if(response.data.status === appConst.status) {
//         let orgId = {orgId: response.data.data[0].orgId}
//         return getOrgInfo(orgId, {commit, state})
// 	}
// }


// async function getOrgInfo(params, commit) {
// 	let url = `${apiUrl.orguserDetail}${params.orgId}`;
// 	let response = await http.get(url, {params})
// 	if(response.data.status === appConst.status) {
// 		let json = response.data.data;
// 		if (json["status"] === "PENDING" || json["status"] === "CONFIRMED") {
// 			commit.commit("SET_MY_ORGINFO", response.data.data)
//         } else {
//             global.errMsg("企业未通过审核，请通知管理员审核")
//             return
//         }
// 	}
// }

import bus from '@/views/eventBus/eventBus'
import Axios from 'axios'
const axios = Axios.create()
axios.interceptors.request.use(
  config => {
      config.headers = {
      'Authorization': sessionStorage.getItem('token'),
      'org_id': sessionStorage.getItem('orgId')
      }
      let currentDataSource = sessionStorage.getItem('currentDataSource')
      if (currentDataSource) {
          config.headers.tenantName = currentDataSource
      }
      return config
  }
)

// 文件上传成功更新资产
const updateAssetInfo = async ({ commit, state }, data) => {
  const fileResponse = data.response.data[0]
  const path = state.fileToPath[data.file.uid].savePath
  const type = state.fileToPath[data.file.uid].type
  const asset = state.directoriesToAsset[(state.fileToPath[data.file.uid].assetInfo.id)]
  await commit('CHANGE_DIRECTORIES', { path, asset, fileResponse })
  if (state.oldAssetId === asset.entityUuid) {
    window.clearTimeout(state.timer)
    const temTimer = setTimeout(async () => {
      const url = `${appConst.edocUrl}/biz/v1.0/asset-type/${type}/assets/${asset.entityUuid}`
      const params = {
        directories: asset.directories
      }
      bus.$emit('updateFolderPage', { entityUuid: asset.entityUuid, directories: asset.directories, path })
      axios.put(url, params)
      .then(res => {
        const newAsset = res.data.data
        bus.$emit('updateAssetDirectoriesSuccess', { entityUuid: asset.entityUuid, directories: asset.directories, newAsset })
        })
      window.clearTimeout(state.timer)
    }, 1000)
    commit('CHANGE_TIMER', { timer: temTimer })
  } else {
    let temId = state.oldAssetId
    if (!state.oldAssetId) {
      commit('CHANGE_OLDASSETID', { oldAssetId: asset.entityUuid, oldAsset: asset })
      temId = asset.entityUuid
    }
    const url = `${appConst.edocUrl}/biz/v1.0/asset-type/${type}/assets/${temId}`
    const params = {
      directories: state.oldAsset.directories
    }
    axios.put(`${appConst.edocUrl}/biz/v1.0/asset-type/${type}/assets/${asset.entityUuid}`, { directories: asset.directories })
    if (state.oldAsset.id) {
      bus.$emit('updateFolderPage', { entityUuid: asset.entityUuid, directories: asset.directories, path })
      axios.put(url, params)
      .then(res => {
        const newAsset = res.data.data
        bus.$emit('updateAssetDirectoriesSuccess', { entityUuid: temId, directories: state.oldAsset.directories, newAsset })
      })
    }
    commit('CHANGE_OLDASSETID', { oldAssetId: asset.entityUuid, oldAsset: asset })
  }
}

// 批量下载
const packingFile = async ({ commit, state }, data) => {
  const { asset, directories } = data
  const url = `${appConst.uosUrl}/utility/packaging`
  let params = []
  directories.map(item => {
    params.push({
      objectKey: asset['entityUuid'] + '/' + item,
      objectType: 'FOLDER'
    })
  })
  if (!params.length) {
    params.push({
      objectKey: asset['entityUuid'],
      objectType: 'FOLDER'
    })
  }
  let packingId = null
  // 打包
  await axios({
    method: 'post',
    url: url,
    data: params
    }).then(res => {
      if (res.data.data) {
        packingId = res.data.data
      } else {
        this.$message.error('打包失败，请稍后再试')
      }
    }).catch(err => {
      console.log(err, err.response)
    })
  if (!packingId) {
    return
  }
  let assetIdentification = asset['entityUuid']
  let downloadName = asset[appConst.assetIdentification] || asset['companyName']
  if (state.packingIdsMap[assetIdentification]) {
    clearInterval(state.packingIdsMap[assetIdentification].timer)
  }
  let assetIdentificationData = {
    assetIdentification: assetIdentification,
    packingStatus: '',
    packingId: packingId,
    timer: null,
    timer1: null,
    getPackingStatus: function () {
      const url = `${appConst.uosUrl}/utility/packaging/task/${packingId}/status`
      this.timer = setInterval(() => {
        axios.get(url)
          .then(res => {
            const { status, objectKey, fileId, backendObjectKey } = res.data.data
            if (status === 'SUCCESS') {
              clearInterval(this.timer)
              const url = `${appConst.uosUrl}/uos/${objectKey}?operation=DOWNLOAD&expireInSeconds=3600`
              axios({
                method: 'GET',
                url: url,
                responseType: 'blob'
              }).then(response => {
                let blob = new Blob([response.data], { type: 'application/zip' })
                let url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = downloadName || '附件'
                link.click()
                URL.revokeObjectURL(url)
              }).catch(error => {
                let blob = new Blob([error.response.data], { type: 'application/json;charset=utf-8' })
                const reader = new FileReader()
                reader.readAsText(blob, 'utf-8')
                let errMessage = ''
                reader.onload = () => {
                  errMessage = JSON.parse(reader.result).message
                  this.$message.error(errMessage || '附件下载失败，请稍后再试')
                }
              })
            } else if (status === 'FAILED') {
              clearInterval(this.timer)
              this.$message.error('打包失败，请稍后再试')
            }
          })
      }, 2500)
      this.timer1 = setTimeout(() => {
        clearInterval(this.timer)
        clearTimeout(this.timer1)
      }, 1000 * 60 * 2)
      commit('TIMER_CHANGE', { assetIdentification: this.assetIdentification, timer: this.timer, timer1: this.timer1 })
    }
  }
  commit('PACKINGIDSMAP_CHANGE', { assetIdentification, assetIdentificationData })

  state.packingIdsMap[assetIdentification].getPackingStatus()
}

export { updateAssetInfo, packingFile }

