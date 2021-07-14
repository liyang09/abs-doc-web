<template>
	<div>
		<el-table 
			ref="multipleTable" 
			tooltip-effect="dark" 
			stripe 
			class="detailEntry"
			:data="tabData"
			>
			<el-table-column fixed type="index" width="65" center >
		    </el-table-column>

		    <el-table-column 
		    	v-for="(item, key) in formItem" 
		    	:prop="key" 
		    	:column-key="key" 
		    	:label="item" 
		    	align="center" 
		    	:key="key" 
		    	:show-overflow-tooltip="true" 
		    	>
		    	<template slot="header" slot-scope="scope">
			        <div  v-if="key == 'quantity'|| key == 'unitPrice'|| key == 'taxRate'" class="table-head" style="width: 100%;">
			        	<i style="color: #f56c6c;">*</i>
			        	{{item}}
			        </div>
			        <div v-else>
			        	{{item}}
			        </div>
			    </template>
		    	<template slot-scope="scope">
  					<el-input
  						v-if="key !== 'currency'" 
  						v-model="scope.row[key]"
  						class="editInput"
  						:keyVal="key"
  					    :index="scope.$index"
  						:val="scope.row[key]"
  						@blur="handleDetailBlur($event, scope.row, key, scope.$index)"
  						>
  					</el-input>
  					<span v-else>
  						{{scope.row[key]}}
  					</span>
			    </template>
		    </el-table-column>

		     <el-table-column
		      	fixed="right"
		      	label="操作"
		      	width="120">
			    <template slot-scope="scope">
					<i class="el-icon-delete" @click="handleDeleteRow(scope.$index)"  style="cursor:pointer;font-size:18px"></i>
			    </template>
		    </el-table-column>
		</el-table> 
		<div class="detailAdd">
			<span class="redColor" @click="handleDetailAdd()"><i class="el-icon-plus"></i>添加</span>
		</div>
		<!-- 合计 -->
		<div style="float:left;margin-top:20px;overflow:hidden;width:100%;">
            <span>合计：共 <b class="redColor">{{num}}</b> 条</span>
            <span  style="margin-right: 10px; margin-left: 30px;">共 <b class="redColor">{{$appConst.fmoney(amount, 2)}}</b> 元</span>
        </div>
        <div style="text-align:center;">
            <!-- <el-button plain size="small" @click="close()">取消</el-button> -->
            <el-button type="primary" size="small" @click="sure()" class="primaryButton" style="width:236px;height:40px;">确认</el-button>
        </div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
                amount:0,
                tabData:[],
				refEle: [],
                formItem:{
                    skuId: "货品编号",
                    goodsName: "货品名称",
                    remarks: "货品描述",
                    spec: "商品规格",
                    quantity: "数量",
                    unit: "单位",
                    manufacturer: "制造商",
                    unitPrice: "单价",
                    taxRate: "税率(%)",
                    totalAmount: "货品合计（元）"
                }
			}
		},
        computed:{
            num() {
                return this.tabData.length;
            }
		},
		methods: {
			init(){
				this.tabData = [];
				this.amount = 0;
			},
			close() {
					this.$bus.$emit('closeDialog');
			},
			sure() {
				if (!this.handleValidateAll())return;
				this.$emit('getGoods',this.tabData.concat());
				this.$bus.$emit('closeDialog');
			},
			// 添加行
			handleDetailAdd() {
				var json = {};
					for(var key in this.formItem){
						json[key] = '';
					}
				this.tabData.push(json);
			},
		// 删除 行
			handleDeleteRow(index) {
				this.tabData.splice(index,1);
				this.amount = 0;
				if (this.tabData.length > 0) {
						this.tabData.forEach(item => {
								this.amount += item.quantity * item.unitPrice;
						})
				}
			},
		// target
			handleDetailBlur(event, row, key, index) {
				this.refEle = $(event.target);
					if(key === "quantity" || key === "unitPrice" || key === "taxRate") {
						let val = event.target.value;
						this.handleValidate(event.target.value, this.refEle, index)
					}
					this.amount = 0;
					for(var i =0;i<this.tabData.length;i++){
					this.amount+= this.tabData[i].quantity * this.tabData[i].unitPrice;
					this.tabData[i]['totalAmount'] = this.$appConst.fmoney(this.tabData[i].quantity * this.tabData[i].unitPrice, 2);
				}
				if (key === 'unitPrice') {
					row.unitPrice ? row.unitPrice = this.$appConst.fmoney(row.unitPrice, 4) : '';
				}
			},
			handleValidate(val, ele, index) {
				if(!isNaN(Number(val)) && val) {
					$(ele).css("border-color", "#dcdfe6");
					return true
				}else if(isNaN(Number(val)) && val) {
					$(ele).css("border-color", "#f56c6c")
					this.$message.error("只能填写数字，请重新输入！");
					return false;
				}else if(!val) {
					$(ele).css("border-color", "#f56c6c")
					this.$message.error("此项为必填项，请重新输入！");
					return false
				}
			},
			handleValidateAll() {
				var flag = true;
				for(var i =0;i<this.tabData.length;i++){
						if(!this.tabData[i]['quantity'] ||　isNaN(Number(this.tabData[i]['quantity']))) {
								$('.detailEntry input').eq(4+i*10).css("border-color", "#f56c6c");
								flag = false;
								return flag;
						}
						if(!this.tabData[i]['unitPrice'] ||　isNaN(Number(this.tabData[i]['unitPrice']))) {
								$('.detailEntry input').eq(7+i*10).css("border-color", "#f56c6c");
								flag = false;
								return flag;
						}
						if(!this.tabData[i]['taxRate'] ||　isNaN(Number(this.tabData[i]['taxRate']))) {
								$('.detailEntry input').eq(8+i*10).css("border-color", "#f56c6c");
								flag = false;
								return flag;
						}
				}
				return flag;
			}
		},
		mounted() {
			var vm = this;
			vm.$bus.$on('initForm',function() {
				vm.init();
			});
		},
		components: {
			
		}
	}
</script>