<template>
    <ul @click.stop='handleOperClick'>
        <li class='textCenter' v-if='type === "folder"' data-val='reset' >重命名</li>
        <li class='textCenter' v-if='(fileType === "folder") || fileType === "file"' data-val='delete'>删除</li>
    </ul>
</template>
<script>
    export default {
        props: {
            type: String
        },
        computed: {
            fileType () {
                return this.type
            }
        },
        methods: {
            handleOperClick (e) {
                e.stopPropagation()
                this.$emit('handleOperClick', e.target.dataset.val, e)
            }
        }
    }
</script>
<style scoped lang='less'>
    @import './index.less';
</style>
