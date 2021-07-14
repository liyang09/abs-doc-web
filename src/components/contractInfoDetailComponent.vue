<template>
	<div>
		<div class="contractDetail">
		<div class="title">
			<protle-title-component>
				<span>合同基本信息</span>
			</protle-title-component>
		</div>
		<div class="baseInfo" style="padding:20px;">
			<el-col 
				class="inner" 
				:span="12" 
				v-for="(item, key) in contractInfo" 
				:key="item+key">
				<el-col :span="24" class="elCol" style="margin-bottom:10px;">
					<el-col class="elLable" :span="7" style="text-align:right; padding-right:5px; color:#48576a; ">
						{{item}}：
					</el-col>
					<el-col :span="15">
						<div class="elInput" style="border-bottom: 1px dashed #ddd; height: 18px; padding-left: 10px;">
							{{diaComData[key]}}
						</div>
					</el-col>
				</el-col>
			</el-col>
			<div style="clear:both;"></div>
		</div>
		<div>
			<el-col class="orgInfo" :span="12">
				<div>
					<protle-title-component><span>买方企业信息</span></protle-title-component>
				</div>
				<div style="padding-top: 20px; padding-bottom:20px;">
					<el-col 
						:span="24" 
						class="elCol" 
						v-for="(item, key) in orgInfo" 
						:key="key"
						style="margin-bottom:10px!important;">
						<el-col class="elLable" :span="6" style="text-align:right; padding-right:5px; color:#48576a;">
							{{item}}：
						</el-col>
						<el-col :span="17">
							<div class="elInput" style="border-bottom: 1px dashed #ddd; height: 18px; padding-left: 10px;">
								{{buyerOrgInfo[key]}}
							</div>
						</el-col>
					</el-col>
				</div>
			</el-col>
			<el-col class="orgInfo" :span="12">
				<div>
					<protle-title-component><span>卖方企业信息</span></protle-title-component>
				</div>
				<div style="padding-top: 20px; padding-bottom:20px;">
					<el-col 
						:span="24" 
						class="elCol" 
						v-for="(item, key) in orgInfo" 
						:key="key"
						style="margin-bottom:10px!important;">
						<el-col 
							class="elLable" 
							:span="6" 
							style="text-align:right; padding-right:5px; color:#48576a;">
							{{item}}：
						</el-col>
						<el-col :span="17">
							<div 
								class="elInput" 
								style="border-bottom: 1px dashed #ddd; height: 18px; padding-left: 10px;">
								{{sellerOrgInfo[key]}}
							</div>
						</el-col>
					</el-col>
				</div>
			</el-col>
			<!-- 合同附件 -->
			<el-col class="orgInfo" :span="24">
				<div>
					<protle-title-component><span>合同电子版及附件</span></protle-title-component>
				</div>
				<div style="min-height:10px; padding-top: 20px; padding-bottom:20px;">
					<ul>
						<li 
							v-for="item in diaComData.attachments"
							:key="item.fileId" 
							@click="handleGoAttDetail(item)">
							<i class="el-icon-document"></i>
							<a href="javascript:;">{{item.fileName}}</a>
						</li>
					</ul>
				</div>
			</el-col>
			<div style="clear:both;"></div>
		</div>
		</div>
		<div class="dialog-footer" v-show="showCancel">
			<el-button plain  @click="close()" size="medium">取消</el-button>
		</div>
		<show-file-detail ref="showFileDetail"></show-file-detail>
	</div>
</template>
<script>
	import{mapState} from 'vuex';
	import appConst from "@/assets/js/appConst";
	import global from "@/assets/js/global";
	import showFileDetail from './showFileDetail'
	import protleTitleComponent from './protleTitleComponent'
	import mixin from '@/assets/js/mixin.js'

	export default {
		mixins:[mixin],
		props: ['showCancel'],
		computed: {
			...mapState(['DICTIONARY']),
		},
		data() {
			return {
				diaComData: {},
				contractInfo: {
					name: "合同名称",
                    entityNo: "合同编号",
					buzType: "业务类型",
					type: "合同类型",
					buyer: "买方",
					seller: "卖方",
					totalAmount: "合同金额(元)",
					signingDate: "合同签署时间",
					startDate: "合同生效日期",
					endDate: "合同到期日期",
					contractContent: "合同内容",
				},
				orgInfo: {
					orgFullName: "企业全名",
					addr: "企业住所",
					legalPerson: "单位负责人",
					creditCode: "统一社会信用码"
				},
				sellerOrgInfo: {},
				buyerOrgInfo: {}
			}
		},
		methods: {
			close() {
				this.$bus.$emit('closeDialog');
			},
			async handleGetOrgInfo(row, detailForm) {
				// this.contractInfo = Object.assign({},detailForm);
				// 合同信息从当前行传过来的值获取。
				this.diaComData = Object.assign({},row);
				this.diaComData["type"] = this.DICTIONARY[this.$appConst.dictionaryType.contractType][this.diaComData["type"]];
				this.diaComData["buzType"] = this.DICTIONARY[this.$appConst.dictionaryType.buzType][this.diaComData["buzType"]];
				this.diaComData["signingDate"] = this.$appConst.handleSetTime(this.diaComData["signingDate"]);
				this.diaComData["startDate"] = this.$appConst.handleSetTime(this.diaComData["startDate"]);
				this.diaComData["endDate"] = this.$appConst.handleSetTime(this.diaComData["endDate"]);
				this.diaComData["totalAmount"] = this.diaComData["totalAmount"] ? this.$appConst.fmoney(this.diaComData["totalAmount"], 2) : 0;
				// 获取卖方信息
				this.sellerOrgInfo = await this.getOrgInfo({orgId:row.sellerId});
				// 获取买方信息
				this.buyerOrgInfo = await this.getOrgInfo({orgId:row.buyerId});
			},
			handleGoAttDetail(val) {
				this.$refs.showFileDetail.showFile(val);
			}
		},
		components: {
			protleTitleComponent,
			showFileDetail
		},
		mounted() {
			
		},
		beforeDestroy() {
			this.sellerOrgInfo = {};
			this.buyerOrgInfo = {};
		}
	}
</script>
<style scoped>
.contractDetail {
	border: 1px solid #eef1f5;
	padding:10px;
}
</style>


