<template>
	<div>
		<el-form :model="ruleForm" ref="ruleForm" size="small">
		<el-table 
			ref="multipleTable" 
			tooltip-effect="dark" 
			stripe 
			class="detailEntry"
			:data="ruleForm.tabData"
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
					<el-form-item v-if="key !== 'currency'" 
						:prop="'tabData.' + scope.$index + '.'+key"
                        :rules="rules[key]">
						<el-input   v-model="scope.row[key]" class="specialInput" :disabled="!isShow"></el-input>
					</el-form-item>

  					<!-- <el-input
  						v-if="key !== 'currency'" 
  						v-model="scope.row[key]"
  						class="editInput"
  						:keyVal="key"
  					    :index="scope.$index"
  						:val="scope.row[key]"
  						@blur="handleDetailBlur($event, scope.row, key, scope.$index)"
  						>
  					</el-input> -->
  					<span v-else>
  						{{scope.row[key]}}
  					</span>
			    </template>
		    </el-table-column>

		     <el-table-column
		      	fixed="right"
		      	label="操作"
		      	width="120" v-if="isShow">
			    <template slot-scope="scope">
					<i class="el-icon-delete" @click="handleDeleteRow(scope.$index)"  style="cursor:pointer;font-size:18px" ></i>
			    </template>
		    </el-table-column>
		</el-table> 
		</el-form>
		<div class="detailAdd">
			<span class="redColor" @click="handleDetailAdd()" v-show="isShow"><i class="el-icon-plus"></i>添加</span>
		</div>
		<!-- 合计 -->
		<div style="margin-top:20px;overflow:hidden;width:100%;">
            <span>合计：共 <b class="redColor">{{num}}</b> 条</span>
            <span  style="margin-right: 10px; margin-left: 30px;">共 <b class="redColor">{{$appConst.fmoney(amount, 2)}}</b> 元</span>
        </div>
        <div style="text-align:center;">
            <!-- <el-button plain size="small" @click="close()">取消</el-button> -->
            <el-button type="primary" size="small" @click="sure()" class="primaryButton" style="width:236px;height:40px;" v-show="isShow">确认</el-button>
        </div>
	</div>
</template>
<script>
	export default {
		data() {
			var validateCount = (rule, value, callback) => {
				var index = rule.field.split('.')[1];
				var amount = 0;
				for(let i =0;i<this.ruleForm.tabData.length;i++){
					var number2 = Number(this.ruleForm.tabData[i].quantity * String(this.ruleForm.tabData[i].unitPrice).replace(/,/g, ''));
					amount+= number2;
					console.log(number2,amount);
				}
				this.amount = amount;
                if (value) {
					this.ruleForm.tabData[index]['totalAmount'] = this.$appConst.fmoney(this.ruleForm.tabData[index].quantity * String(this.ruleForm.tabData[index].unitPrice).replace(/,/g, ''), 2);
					this.ruleForm.tabData[index]['unitPrice'] = this.ruleForm.tabData[index]['unitPrice'] ? this.$appConst.fmoney(this.ruleForm.tabData[index]['unitPrice'], 2) : '';
					callback();
				}
				callback()
			}
			return {
				isShow:true,
                amount:0,
                ruleForm:{
					tabData:[],
				},
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
				},
				rules: {
					quantity:[
						{required: true, message: '不能为空', trigger: 'blur' },
						{pattern:/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/,message:"只能输入数字和最多两位小数",trigger:"blur"},
						{ validator: validateCount, trigger: 'blur' }
					],
					unitPrice:[
						{required: true, message: '不能为空', trigger: 'blur' },
						{pattern:/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/,message:"只能输入数字和最多两位小数",trigger:"blur"},
						{ validator: validateCount, trigger: 'blur' }
					],
					taxRate:[
						{required: true, message: '不能为空', trigger: 'blur' },
						{pattern:/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/,message:"只能输入数字和最多两位小数",trigger:"blur"}
					],
				},
			}
		},
        computed:{
            num() {
                return this.ruleForm.tabData.length;
            }
		},
		methods: {
			init(){
				this.ruleForm.tabData = [];
				this.amount = 0;
				this.isShow = true;
			},
			close() {
					this.$bus.$emit('closeDialog');
			},
			sure() {
				var vm = this;
				this.$refs['ruleForm'].validate( valid => {
					if(valid) {
						this.$emit('getGoods',this.ruleForm.tabData.concat(),this.amount);
						this.$bus.$emit('closeDialog');
					} else {
						this.$message.warning('检查所填写的数据!');
					}
				})
			},
			setGoods(goods,ifEdit){
				this.ruleForm.tabData = JSON.parse(JSON.stringify(goods));
				this.isShow = ifEdit;
				this.getAmount();
			},
			// 添加行
			handleDetailAdd() {
				var json = {};
					for(var key in this.formItem){
						json[key] = '';
					}
				this.ruleForm.tabData.push(json);
			},
			getAmount(){
				this.amount = 0;
				if (this.ruleForm.tabData.length > 0) {
					this.ruleForm.tabData.forEach(item => {
						this.amount += item.quantity * String(item.unitPrice).replace(/,/g, '');
					})
				}
			},
		// 删除 行
			handleDeleteRow(index) {
				this.ruleForm.tabData.splice(index,1);
				this.getAmount();
			},
		},
		mounted() {
			var vm = this;
			vm.isShow = true;
			vm.$bus.$on('initForm',function() {
				vm.init();
			});
		},
		components: {
			
		}
	}
</script>