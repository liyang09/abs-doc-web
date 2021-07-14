
let state = {
  // myOrgInfo: {},
  loading: false,
  menuList:[],
  ASSETSPARAMS:{},
  DICTIONARY: {},

  cancelUpload: [],
  pendingFileList: [],
  orgInfo: {},
  configStatus: {}, // 配置是否有改动
  fileToPath: {},
  directoriesToAsset: {},
  /* action中更新资产用 */
  oldAssetId: '',
  oldAsset: {},
  timer: 0,
  defaultDirectories: [],
  packingIdsMap: {}
}

export default state
