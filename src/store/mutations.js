
const mutations = {
    SET_LOADING(state, loading) { // 给列表赋值
        state.loading = loading
    },
    SET_MENULIST(state,value){
        state.menuList = value;
    },
    // SET_MY_ORGINFO(state, data) {
	// 	state.myOrgInfo = data;
    // },
    // SET_MY_ORGNAME_INIT(state) {
    //     state.myOrgInfo = {};
    // }
    // 记录对应的类型的字段。
    SET_DATALIST(state,value){
        state['ASSETSPARAMS'][value.value2] = value.value1;
    },
    // 记录对应的字典
    SET_DICTIONARY(state,value){
        state['DICTIONARY'][value.value2] = value.value1;
    },

    SET_PAGINAOPTION (state, data) {
        state.paginaOption = data
    },
    ADD_PENDINGFILELIST (state, data) {
        state.pendingFileList.push(data)
    },
    SET_PENDINGFILELIST (state, data) {
        state.pendingFileList = data
    },
    SET_CANCELUPLOAD (state, data) {
        state.cancelUpload.push(data)
    },
    SET_ORGINFO (state, data) {
        state.orgInfo = data
    },
    SET_CONFIGSTATUS (state, data) {
        state.configStatus = data
    },
    REDUCE_PENDINGFILELIST (state, data) {
        state.pendingFileList = state.pendingFileList.filter(item => item.uid !== data.uid)
    },
    ADD_FILETOPATH (state, data) {
        state.fileToPath = { ...state.fileToPath, ...data }
    },
    ADD_DIRECTORIESTOASSET (state, data) {
        if (!state.directoriesToAsset.hasOwnProperty(data.id)) { // 防止来回点击数据改变
            state.directoriesToAsset[data.id] = data.assetInfo
        }
    },
    INIT_FILE_DIRECTORIES (state, data) {
        state.fileToPath = {}
        state.directoriesToAsset = {}
        state.timer = 0
        state.oldAssetId = ''
        state.oldAsset = {}
    },
    CHANGE_DIRECTORIES (state, data) {
        const { path, asset, fileResponse } = data
        let directories = state.directoriesToAsset[asset.id].directories
        if (!directories || !directories.length) {
            state.directoriesToAsset[asset.id].directories = state.defaultDirectories
            directories = state.directoriesToAsset[asset.id].directories
        }
        let tem = []
        for (let i = 0; i < path.length; i++) {
            if (i > 0) {
                for (let j = 0; j < tem.subDirectories.length; j++) {
                    if (tem.subDirectories[j].name === path[i]) {
                        tem = tem.subDirectories[j]
                    }
                }
            } else {
                for (let k = 0; k < directories.length; k++) {
                    if (directories[k].name === path[i]) {
                        tem = directories[k]
                    }
                }
            }
        }
        tem.attachments.push(fileResponse)
    },
    CHANGE_OLDASSETID (state, data) {
        state.oldAssetId = data.oldAssetId
        state.oldAsset = data.oldAsset
    },
    CHANGE_TIMER (state, data) {
        state.timer = data.timer
    },
    DIRECTORIES_REMOVEFILE (state, data) {
        state.directoriesToAsset[data.assetInfo.id].directories = data.directories
    },
    INIT_DEFAULT_DIRECTORIES (state, data) {
        state.defaultDirectories = data.directories
    },
    PACKINGIDSMAP_CHANGE (state, params) {
        const { assetIdentification, assetIdentificationData } = params
        state.packingIdsMap[assetIdentification] = assetIdentificationData
    },
    TIMER_CHANGE (state, params) {
        const { assetIdentification, timer, timer1 } = params
        state.packingIdsMap[assetIdentification].timer = timer
        state.packingIdsMap[assetIdentification].timer1 = timer1
    },
}

export default mutations
