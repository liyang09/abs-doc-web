<template>
    <div style='height: 100%; display: flex;'> <!-- class='clearfix' -->
        <div
            v-for='(item, index) in subArr'
            :key='index'
            style='height: 100%;'>
            <v-tree
                :treeData='item'
                :attachmentsData='attrArr[index]'
                :level='Number(index)'
                :selectFolder='selectFolder'
                @handleTreeItemClick='handleTreeItemClick'
                @handleTreeItemContextmenu='handleTreeItemContextmenu'
                @handleBlankClickContextmenu="handleBlankClickContextmenu"
                @handleBlankClick='handleBlankClick'
                @handleFolderNameClick='handleFolderNameClick'
                />
        </div>
    </div>
</template>
<script>
    import vTree from './vTree'
    import { mapGetters } from 'vuex'
    let newFolder = {
        name: '未命名文件夹',
        weight: 0,
        attachments: [],
        subDirectories: [],
        id: Math.ceil(Math.random(0, 10000) * (1000000)),
        status: '',
        selected: false,
        opened: false,
        operShow: false
    }
    export default {
        props: {
            type: String,
            treeData: Array
        },
        name: 'treeComponent',
        data () {
            return {
                subArr: {},
                attrArr: {},
                operItem: {},
                separatelyUpload: false,
                selectFolder: {}, // 选择 下载
                savePath: []
            }
        },
        watch: {
            treeData () {
                console.log(this.treeData, '87777666666')
                if (this.treeData) {
                    this.$set(this.subArr, 0, this.treeData)
                    this.$set(this.attrArr, 0, [])
                    this.treeData.map(v => {
                        this.$set(this.selectFolder, v.id, false)
                    })
                }
            }
        },
        methods: {
            handleBlankClickContextmenu (level) {
                this.savePath.splice(level)
            },
            handleTreeItemClick (item, type, level) {
                if (type === 'folder') {
                    this.savePath.splice(level)
                    this.savePath.push(item.name)
                }
                this.handleSetTreeDataOperHide(this.subArr[level])
                this.handleSetTreeDataSelected(this.subArr[level], item, level)
                this.handleSetTreeDataSelected(this.attrArr[level], item, level)

                if (!item.hasOwnProperty('fileName')) { // 是文件夹
                    this.handleSetTreeDataOpen(this.subArr[level], item, type, level)
                }
            },
            // 右键 操作
            handleTreeItemContextmenu (item, index, event, level, isAttr) {
                this.savePath.splice(level)
                if (isAttr === 'folder') {
                    this.savePath.push(item.name)
                }
                this.handleSetTreeDataSelected(this.subArr[level], item, level, 'focusFolder')
                this.$set(this.operItem, 'item', item)
                this.$set(this.operItem, 'level', level)
                if (isAttr === 'attr') {
                    this.$set(this.operItem, 'index', -1)
                    this.attrArr[level][index]['selected'] = true
                    this.attrArr[level][index]['operShow'] = true
                } else {
                    this.$set(this.operItem, 'index', index)

                    this.$set(this.subArr[level][index], 'operShow', true)
                    this.subArr[level][index]['operShow'] = true
                    this.subArr[level][index]['selected'] = true
                }
            },
            handleOperItemTypeClick (arr, type, level) {
                for (let i = 0; i < arr.length; i++) {
                    let findIndex = arr[i]['attachments'].findIndex(v => v.selected && v.id === this.operItem.item.id)
                    if (findIndex > -1) {
                        arr[i]['attachments'].splice(findIndex, 1)
                        // this.handleDeleteTreeItem(this.subArr[level])
                        break
                    }
                }
            },
            handleFolderNameClick (item, index, level) {
                this.$set(this.operItem, 'item', item)
                this.$set(this.operItem, 'level', level)
                this.$set(this.operItem, 'index', index)
                // this.handleTreeItemClick(item, 'folder', level)
                this.handleSetTreeDataSelected(this.subArr[level], item, level, 'focusFolder')
                item.selected = true
                this.handleOperTypeClick('reset', level)
                this.$nextTick(() => {
                    $('.treeItemEdit .el-input__inner').trigger('focus')
                })
            },
            handleOperTypeClick (type, level, e) {
                let n = 0
                this.operItem.item.operShow = false
                if (this.operItem.item.hasOwnProperty('fileName')) {
                    return
                }
                this.subArr[level].map(v => {
                    if (v.selected) {
                        if (type === 'reset') {
                            v.status = 'edit'
                            this.$nextTick(() => {
                                $('.treeItemEdit').find('.el-input__inner').trigger('focus')
                            })
                        } else if (type === 'newFolder') {
                            let newFolderJson = JSON.parse(JSON.stringify(newFolder))
                            newFolderJson.id = Math.ceil(Math.random(0, 10000) * 100000)

                            if (this.subArr.hasOwnProperty(level + 1)) {
                                this.subArr[level + 1].push(newFolderJson)
                            } else {
                                this.$set(this.subArr, level + 1, v.subDirectories)
                                this.subArr[level + 1].push(newFolderJson)
                            }
                        } else if (type === 'delete') {
                            if (v.hasOwnProperty('fileName')) {
                                let findIndex = this.attrArr.findIndex(i => i.id === this.operItem.id)
                                this.attrArr[level].splice(findIndex, 1)
                            } else {
                                this.handleDeleteTreeItem(this.subArr[level], level)
                            }
                        }
                        v.operShow = false
                    } else {
                        v.operShow = false
                        v.selected = false
                        n++
                    }
                })
                if (n === this.subArr[level].length) {
                    this.handleOperItemTypeClick(this.subArr[level], type, level)
                }
            },
            // delete treeItem
            handleDeleteTreeItem (arr, level) {
                let n = 0
                let levelArr = Object.keys(this.subArr)

                if (this.operItem.item.selected ||
                this.operItem.item.opened ||
                this.operItem.item.operShow) {
                    for (let i = levelArr.length - 1; i > level; i--) {
                        if (i > level && i > 0) {
                            this.subArr[i] = []
                            this.attrArr[i] = []
                            delete this.subArr[i]
                            delete this.attrArr[i]
                        }
                    }
                }

                for (let i = 0; i < arr.length; i++) {
                    if (arr[i]['id'] === this.operItem.item.id) {
                        arr.splice(i, 1)
                        break
                    } else {
                        n++
                    }
                }
            },
            // 当前项  是 选中状态
            handleSetTreeDataSelected (arr, item, level, isFocusFolder) {
                let levelArr = Object.keys(this.subArr)
                if (!isFocusFolder) {
                    for (let i = levelArr.length - 1; i > -1; i--) {
                        if (i > level && i > 0) {
                            this.subArr[i] = []
                            this.attrArr[i] = []
                            delete this.subArr[i]
                            delete this.attrArr[i]
                        }
                    }
                }

                if (arr) {
                    arr.map(v => {
                        if (v.id === item.id) {
                            if (!isFocusFolder) {
                                v.opened = !v.opened
                            }
                            v.selected = !!v.selected
                            v.operShow = false
                        } else {
                            v.opened = false
                            v.selected = false
                            v.operShow = false

                            if (v.subDirectories && v.subDirectories.length) {
                                let hasArr = v.subDirectories.filter(i => i.id === item.id || (i.subDirectories && i.subDirectories.length))
                                if (hasArr.length) {
                                    this.handleSetTreeDataSelected(hasArr, item, level)
                                }
                            }
                            if (v.attachments && v.attachments.length) {
                                let hasArr = v.attachments.filter(i => i.id === item.id || (i.attachments && i.attachments.length))
                                if (hasArr.length) {
                                    this.handleSetTreeDataSelected(hasArr, item, level)
                                }
                            }
                        }
                    })
                }
            },
            // 添加 新 folder
            handleAddFolder (level) {
                this.handleResetTreeNonEditable(this.treeData)
                let newFolderJson = JSON.parse(JSON.stringify(newFolder))
                newFolderJson.id = Math.ceil(Math.random(0, 10000) * (1000000))
                if (level === 0) {
                    this.treeData.push(newFolderJson)
                } else {
                    this.subArr[level].push(newFolderJson)
                }
            },
            // 初始 不可编辑
            handleResetTreeNonEditable (arr) {
                arr.map(v => {
                    v.status = ''
                    if (v.subDirectories && v.subDirectories.length) {
                        let has = v.subDirectories.filter(i => i.status === 'edit')
                        if (has.length) {
                            this.handleResetTreeNonEditable(v.subDirectories)
                        }
                    }
                })
            },
            handleInputBlur (event, item, index, level) {
                this.subArr[level][index]['operShow'] = false
                this.subArr[level][index]['status'] = ''
                if (!event.target.value) {
                    this.subArr[level][index]['name'] = '未命名文件夹'
                }
            },
            // 操作 list hide
            handleSetTreeDataOperHide (arr) {
                arr.map(v => {
                    v.operShow = false
                    v.selected = false
                    if (v.hasOwnProperty('fileName')) {
                        v.opened = false
                    }
                    if (v.subDirectories && v.subDirectories.length) {
                        this.handleSetTreeDataOperHide(v.subDirectories)
                    }
                    if (v.attachments && v.attachments.length) {
                        this.handleSetTreeDataOperHide(v.attachments)
                    }
                })
            },
            // treeItem 添加 selected  或者 open
            handleSetTreeDataOpen (arr, item, type, level) {
                let _this = this
                function closeSub (subArr, level, attrArr) {
                    let levelArr = Object.keys(subArr)
                    for (let i = levelArr.length - 1; i > -1; i--) {
                        if (i > level && i > 0) {
                            subArr[i] = []
                            attrArr[i] = []
                            this.handleSetTreeDataSelected(subArr[i], item, level)
                            delete attrArr[i]
                            delete subArr[i]
                        }
                    }
                }

                for (let i = 0; i < arr.length; i++) {
                    let v = arr[i]
                    v.opened = !!v.opened
                    v.operShow = false
                    v.selected = false

                    if (v.id === item.id) { // 开关
                        if (!v.opened && type) { // 关
                            closeSub(this.subArr, level, this.attrArr)
                        } else if (v.opened && type) { // 开
                            if (this.subArr.hasOwnProperty(level) && level !== 0) {
                                closeSub(this.subArr, level, this.attrArr)
                                this.handleSetSubArr(item)
                            } else if (this.subArr.hasOwnProperty(level) && level === 0) {
                                closeSub(this.subArr, level, this.attrArr)
                                this.handleSetSubArr(item)
                            } else {
                                this.handleSetSubArr(item)
                            }
                        } else {
                            closeSub(this.subArr, level, this.attrArr)
                        }
                        break
                    } else {
                        // v.opened = false
                        if (v.attachments && v.attachments.length) {
                            let hasArr = v.attachments.filter(i => i.id === item.id || (i.attachments && i.attachments.length))
                            if (hasArr.length) {
                                this.handleSetTreeDataOpen(hasArr, item, type, level)
                            }
                        }
                        if (v.subDirectories && v.subDirectories.length) {
                            let hasArr = v.subDirectories.filter(i => i.id === item.id || (i.subDirectories && i.subDirectories.length))
                            if (hasArr.length) {
                                this.handleSetTreeDataOpen(v.subDirectories, item, type, level)
                            }
                        }
                    }
                }
            },
            handleSetSubArr (item) {
                function removeSelected (arr) {
                    arr.map(v => {
                        v.selected = false
                        v.opened = false
                        v.operShow = false
                    })
                }
                removeSelected(item.attachments)
                removeSelected(item.subDirectories)
                this.$set(this.attrArr, Object.keys(this.subArr).length, item.attachments)
                this.$set(this.subArr, Object.keys(this.subArr).length, item.subDirectories)
            },
            // 点击空白
            handleBlankClick (e, level) {
                let levelArr = Object.keys(this.subArr)
                for (let i = levelArr.length - 1; i > -1; i--) {
                    if (i > level && i > 0) {
                        this.subArr[i] = []
                        this.attrArr[i] = []
                        delete this.subArr[i]
                        delete this.attrArr[i]
                    }
                }
                if (!level) {
                    let selectFolder = Object.keys(this.selectFolder)
                    selectFolder.map(key => {
                        this.selectFolder[key] = false
                    })
                }
                this.handleSetTreeDataSelected(this.subArr[level], {}, level)
                if (this.attrArr && this.attrArr[level] && this.attrArr[level].length) {
                    this.handleSetTreeDataSelected(this.attrArr[level], {}, level)
                }
            },
            handleWeightInputBlur (item, level) {
                let arr = this.subArr[level]; let n = 0; let i = 0
                arr.map(v => {
                    if (v.id !== item.id) {
                        i += v.weight
                    }
                    n += v.weight
                })
                if (n > 100) {
                    item.weight = 100 - i
                    this.$global.errMsg('权重总合计不能超过100%！')
                }
            }
        },
        mounted () {
        },
        components: {
            vTree
        }
    }
</script>
