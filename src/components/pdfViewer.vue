<template>
    <div>
        <div class="center" @click="pdfclick" v-loading="loading">
          <canvas id="the-canvas" class="canvasstyle" />
        </div>
      <pdfDialog v-if="dialogVisible" :pdfurl="pdfurl"></pdfDialog>
    </div>
</template>

<script>
import PDFJS from 'pdfjs-dist'
// import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'
import pdfDialog from './pdfViewerDialog.vue'

export default {
  components: {
    pdfDialog
  },
  props: { pdfurl: String },
  data () {
    return {
      pdfDoc: null, // pdfjs 生成的对象
      pageNum: 1, //
      pageRendering: false,
      pageNumPending: null,
      scale: 1, // 放大倍数
      page_num: 0, // 当前页数
      page_count: 0, // 总页数
      dialogVisible: false,
      loading: false
    }
  },
  computed: {
    ctx () {
      const id = document.getElementById('the-canvas')
      return id.getContext('2d')
    }
  },
  watch: {
    pdfurl () {
      this.init()
    }
  },
  methods: {
    init () {
      this.loading = true
      let obj = {
        url: this.pdfurl,
        // CMapReaderFactory
      }
      let _this = this
      // 初始化pdf
      PDFJS.getDocument(obj).then((pdfDoc_) => {
        _this.pdfDoc = pdfDoc_
        _this.page_count = _this.pdfDoc.numPages
        _this.renderPage(_this.pageNum)
      })
    },
    renderPage (num) {
      // 渲染pdf
      const vm = this
      this.pageRendering = true
      const canvas = document.getElementById('the-canvas')
      // Using promise to fetch the page
      this.pdfDoc.getPage(num).then((page) => {
        var viewport = page.getViewport(vm.scale)
        // alert(vm.canvas.height)
        canvas.height = viewport.height
        vm.pdfWidth = canvas.width = viewport.width
        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: vm.ctx,
          viewport: viewport
        }
        var renderTask = page.render(renderContext)
        // Wait for rendering to finish
        renderTask.promise.then(() => {
          vm.pageRendering = false
          if (vm.pageNumPending !== null) {
            // New page rendering is pending
            vm.renderPage(vm.pageNumPending)
            vm.pageNumPending = null
          }
        })
      })
      this.loading = false
      vm.page_num = vm.pageNum
    },
    queueRenderPage (num) {
      if (this.pageRendering) {
        this.pageNumPending = num
      } else {
        this.renderPage(num)
      }
    },
    pdfclick () {
      this.dialogVisible = true
    },
    handleClose () {
      this.currentPage = 1
      this.dialogVisible = false
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.center{
  text-align: center;
  height: 100%;
}
</style>
