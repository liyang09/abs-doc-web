<template>
    <div class='doc boxSizing'
        @click.stop='handleBlankClick'
        @contextmenu.prevent.stop='handleBlankClickContextmenu'>
        <div
            v-for='(item, index) in newTreeData'
            :key='item.id'
            :class='["treeItem treeItemFolder boxSizing cursor clearfix treeItem" + item.id, { active: item.opened || item.selected || selectFolder[item.id]}]'
            @click.stop='handleTreeItemClick(item, "folder")'
            @contextmenu.prevent.stop='(event) => handleTreeItemContextmenu(item, index, event, "folder")'>
            <el-tooltip :disabled='handleShowTooltip(item.name, "folder")' class="item clearfix" effect="dark" :content="item.name" placement="right">
                <div>

                    <img class='folderImg fl' :src='$global.imgUrl.folder' alt='folderImg' />

                    <span v-if='item.status !== "edit"' class='fl ellipsis' style='max-width: 56%;'
                        @click.stop='(e) => handleFolderNameClick(item, index)'>
                        {{item.name}}
                    </span>

                    <el-input
                        v-model='item.name'
                        v-else
                        class='treeItemEdit'
                        @click.stop.native="handleInputFocus"
                        @blur.stop='(event) => handleInputBlur(event, item, index)'>
                    </el-input>

                    <i class='triangle iconfont icontriangle fr' :style='{"display": item.subDirectories.length || item.attachments.length ? "unset" : "none"}'></i>
                    <span class='fr' style="display: inline-block; width: 60px;">
                        <el-input
                            @focus='(e) => handleWeightInputFocus(e, item)'
                            @blur='handleWeightInputBlur(item)'
                            class='weightInput'
                            v-model.number='item.weight'
                            style='width: 28px; display: inline-block;'>
                        </el-input> %
                    </span>
                </div>
            </el-tooltip>
            <operList
                v-show='item.operShow'
                :type='"folder"'
                class='operList'
                @handleOperClick='handleOperClick'>
            </operList>
        </div>

        <div
            v-if="(newTreeData.length || attachments.length) && !level"
            class='addFolder cursor textCenter'
            @click.stop='handleAddFolder'>
            <i class='iconfont iconplus'></i>
            新建文件夹1
        </div>

        <div v-if='!newTreeData.length && !attachments.length'
            class='emptyWrap'>
            <div
                class='cursor emptyBtn textCenter'
                @click.stop='handleAddFolder'>
                新建文件夹2
            </div>
        </div>

        <div
            v-show='blankContextmenu'
            class='cursor emptyBtn textCenter contextMenuNew'
            style='margin: unset; position: fixed;'
            @click.stop='handleAddFolder'>
            新建文件夹3
        </div>
    </div>
</template>
<script>
    import operList from './operList'
    export default {
        name: 'tree-item',
        props: {
            treeData: Array,
            // subArr: Array
            attachmentsData: Array,
            level: Number,
            selectFolder: Object
        },
        data () {
            return {
                subArr: {},
                checkedAll: false,
                blankContextmenu: false
            }
        },
        computed: {
            newTreeData () {
                let arr = []
                arr = this.treeData && this.treeData.length ? arr = this.treeData : arr = []
                return arr
            },
            attachments () {
                return this.attachmentsData
            }
        },
        watch: {
            selectFolder: {
                handler () {
                    let arr = Object.keys(this.selectFolder)
                    let n = 0
                    arr.map(v => {
                        if (this.selectFolder[v]) {
                            n++
                        }
                    })
                    if (n === arr.length) {
                        this.checkedAll = true
                    } else {
                        this.checkedAll = false
                    }
                },
                deep: true
            }
        },
        methods: {
            init () {
                this.handleDocumentClick()
            },
            handleGetSelectFolderSelected () {
                let selectFolder = Object.keys(this.selectFolder)
                let has = selectFolder.filter(key => this.selectFolder[key])
                return has.length
            },
            // 点击空白
            handleBlankClick (e) {
                this.blankContextmenu = false
                this.$emit('handleBlankClick', e, this.level)
            },
            // 空白区域 右键
            handleBlankClickContextmenu (e) {
                this.$emit('handleBlankClickContextmenu', this.level)
                let x = e.x; let y = e.y
                this.blankContextmenu = true
                this.$nextTick(() => {
                    $('.contextMenuNew').css({
                        'left': x + 'px',
                        'top': y + 'px'
                    })
                })
            },
            handleFolderNameClick (item, index) {
                if (item.selected || item.opened) {
                    this.$emit('handleFolderNameClick', item, index, this.level)
                } else {
                    this.handleTreeItemClick(item, 'folder')
                }
            },
            handleOperClick (type, e) {
                this.$parent.handleOperTypeClick(type, this.level, e)
            },
            handleAddFolder () {
                this.blankContextmenu = false
                this.$parent.handleAddFolder(this.level)
            },
            handleTreeItemContextmenu (item, index, event, isAttr) {
                this.blankContextmenu = false
                this.$emit('handleTreeItemContextmenu', item, index, event, this.level, isAttr)
            },
            handleInputFocus (event) { event.stopPropagation() },
            handleInputBlur (event, item, index) {
                this.$parent.handleInputBlur(event, item, index, this.level)
            },
            handleTreeItemClick (item, type) {
                this.$emit('handleTreeItemClick', item, type, this.level)
            },
            handleWeightInputFocus (event, item) {
                $('.weightInput').removeClass('active')
                $(event.target).parents('.weightInput').addClass('active')
                item.selected = true
            },
            handleFolderNameInputFocus () {
                $('.folderName').removeClass('active')
                $(event.target).parents('.folderName').addClass('active')
            },
            handleWeightInputBlur (item) {
                $('.weightInput').removeClass('active')
                this.$parent.handleWeightInputBlur(item, this.level)
            },
            handleShowTooltip (cont, type) {
                let flag = true
                if (type === 'folder') {
                    if ((cont.length * 14) > (237 * 56 / 100)) {
                        flag = false
                    }
                }
                if (type === 'file') {
                    if (cont && (cont.length * 14) > (237)) {
                        flag = false
                    }
                }
                return flag
            },
            handleDocumentClick () {
                $('.el-container').click((e) => {
                    if (!$(e.target).hasClass('contextMenuUpload') &&
                     !$(e.target).hasClass('uploadButton')) {
                        this.handleBlankClick(e, this.level)
                    }
                })
            }
        },
        mounted () {
            this.init()
        },
        components: {
            operList
        }
    }
</script>
<style lang='less' scoped>
    @import './index.less';
</style>
