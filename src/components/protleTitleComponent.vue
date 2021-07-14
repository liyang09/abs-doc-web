<template>
	<div>
		<div>
			<div class="portlet-title">
			    <div class="caption">
			        <i class="el-icon-edit"></i>
			        <span id="wizard-top" class="caption-subject font-purple bold uppercase">
			        	<slot></slot>
			            <span class="step-title"></span>
			        </span>
			    </div>
			</div>
		</div>
	</div>
</template>
<style scoped>
	.portlet-title {
		border-bottom: 1px solid #eef1f5;
	    padding: 0;
	    height: 58px;
	}
	.portlet-title > .caption {
	    color: #8E44AD;
	    line-height:58px;
	}
	.portlet-title > .caption > .caption-subject {
	    font-size: 16px;
	}
</style>