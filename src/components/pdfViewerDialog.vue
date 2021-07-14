<template>
  <div>
    <el-dialog
      v-loading="loading"
      class="pdf-viewer"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="100%"
      top="0"
      :before-close="handleClose"
      @mousewheel.native="mousewheel"
      @mousedown.native="onmousedown"
      @mousemove.native="onmousemove"
      @mouseup.native="onmouseup"
    >
      <div class="center">
        <div class="contor">
          <button type="primary" size="mini" @click="prev" >上一页</button>
          <span>
            <span v-text="page_num" /> /
            <span v-text="page_count" />
          </span>
          <button type="primary" size="mini" @click="next" >下一页</button>
          <button type="primary" size="mini" @click="addscale" >放大</button>
          <button type="primary" size="mini" @click="minus" >缩小</button>
          <button type="primary" size="mini" @click="rotateL" ><i class="el-icon-refresh-left"></i></button>
          <button type="primary" size="mini" @click="rotateR" ><i class="el-icon-refresh-right"></i></button>
        </div>
        <canvas id="dialog-canvas" class="canvasstyle" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import PDFJS from 'pdfjs-dist'
// import CMapReaderFactory from 'vue-pdf/src/CMapReaderFactory.js'

export default {
  props: { pdfurl: String },
    data () {
      return {
        pdfUrl: '',
        pdfDoc: null, // pdfjs 生成的对象
        pageNum: 1, //
        pageRendering: false,
        pageNumPending: null,
        scale: 1, // 放大倍数
        page_num: 0, // 当前页数
        page_count: 0, // 总页数
        maxscale: 3, // 最大放大倍数
        minscale: 0.3, // 最小放大倍数,
        rotation: 0, // 旋转角度
        dialogVisible: false,
        loading: false,
        isDrag: false
      }
    },
    computed: {
      dialogCtx () {
        const id = document.getElementById('dialog-canvas')
        return id.getContext('2d')
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
        // PDFJS.getDocument(obj).then((pdfDoc_) => {
        //   _this.pdfDoc = pdfDoc_
        //   _this.page_count = _this.pdfDoc.numPages
        //   _this.renderPage(_this.pageNum)
        // }).catch(() => {
        //   this.loading = false
        //   this.$message.error('附件加载失败，请稍后再试')
        // })
      },
      renderPage (num) {
        // 渲染pdf
        const vm = this
        this.pageRendering = true
        const canvas = document.getElementById('dialog-canvas')
        // Using promise to fetch the page
        this.pdfDoc.getPage(num).then((page) => {
          var viewport = page.getViewport({ scale: vm.scale, rotation: vm.rotation })
          // alert(vm.canvas.height)
          canvas.height = viewport.height
          vm.pdfWidth = canvas.width = viewport.width
          // Render PDF page into canvas context
          var renderContext = {
            canvasContext: vm.dialogCtx,
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
      addscale () {
        // 放大
        if (this.scale >= this.maxscale) {
          return
        }
        this.scale += 0.1
        this.queueRenderPage(this.pageNum)
      },
      minus () {
        // 缩小
        if (this.scale <= this.minscale) {
          return
        }
        this.scale -= 0.1
        this.queueRenderPage(this.pageNum)
      },
      prev () {
        // 上一页
        const vm = this
        if (vm.pageNum <= 1) {
          return
        }
        vm.pageNum--
        vm.queueRenderPage(vm.pageNum)
      },
      next () {
        // 下一页
        const vm = this
        if (vm.pageNum >= vm.page_count) {
          return
        }
        vm.pageNum++
        vm.queueRenderPage(vm.pageNum)
      },
      rotateL () {
        this.rotation -= 90
        this.queueRenderPage(this.pageNum)
      },
      rotateR () {
        this.rotation += 90
        this.queueRenderPage(this.pageNum)
      },
      queueRenderPage (num) {
        if (this.pageRendering) {
          this.pageNumPending = num
        } else {
          this.renderPage(num)
        }
      },
      pdfclick () {
        this.pageNum = 1
        this.dialogVisible = true
        this.init()
      },
      handleClose () {
        this.$parent.handleClose()
      },
      mousewheel (e) {
        if (e.wheelDelta > 0) {
          this.addscale()
        } else {
          this.minus()
        }
      },
      // 鼠标按下时
    onmousedown (e) {
      this.isDrag = true
      console.log($('#dialog-canvas'))
      $('#dialog-canvas')[0].style.cursor = 'move'
      var x = e.clientX
      var y = e.clientY
      // 鼠标相对于图片的位置
      this.disX = x - $('#dialog-canvas')[0].offsetLeft
      this.disY = y - $('#dialog-canvas')[0].offsetTop
    },

    // 鼠标移动时
    onmousemove (e) {
      if (!this.isDrag) {
        return
      }
      e = e || window.event// 兼容性写法
      // 鼠标位置
      var x = e.clientX
      var y = e.clientY
      // 修改图片位置
      $('#dialog-canvas')[0].style.left = x - this.disX + 'px'
      $('#dialog-canvas')[0].style.top = y - this.disY + 'px'
    },

    // 鼠标抬起时
    onmouseup () {
      this.isDrag = false
      $('#dialog-canvas')[0].style.cursor = 'default'
      }
    },
    created () {
      this.pageNum = 1
      this.dialogVisible = true
      $(document).keydown((event) => {
        if (event.keyCode === 37) {
          this.prev()
        } else if (event.keyCode === 39) {
          this.next()
        }
      })
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
.contor{
  position: fixed;
  display: flex;
  width: 400px;
  z-index: 100;
  color: #fff;
  line-height: 44px;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  width: 282px;
  height: 44px;
  padding: 0 20px;
  background-color: #606266;
  border-color: #fff;
  border-radius: 22px;
  button {
    text-align: center;
    flex: 1;
    background: unset;
    border: unset;
    color: #fff;
    outline: unset;
    cursor: pointer;
  }
}
#dialog-canvas{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
