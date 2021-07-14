
export default{
    methods:{
        // 根据企业名称去查询具体的企业列表
        async GET_ORG_INFO(orgName) {
            let url = `${this.$apiUrl.orguserList}`;
            let response = await this.$http.get(url, { params: {orgName:orgName} })
            if(response.data.status === this.$appConst.status) {
                if(response.data.data.length == 0) return Promise.resolve();
                let orgId = response.data.data[0].orgId;
                return Promise.resolve(orgId);
            }
        },
        // 根据企业的id去查询详情
        async getOrgInfo(params) {
            if (params.orgName) {var orgId = await  this.GET_ORG_INFO(params.orgName);}
            else{
                var orgId = params.orgId;
            }
            if(!orgId) return Promise.resolve({});
            let url = `${this.$apiUrl.orguserDetail}${orgId}`;
            let response = await this.$http.get(url)
            if(response.data.status === this.$appConst.status) {
                let json = response.data.data;
                if (json["status"] === "PENDING" || json["status"] === "CONFIRMED") {
                    return Promise.resolve(response.data.data);
                } else {
                    this.$global.errMsg("企业未通过审核，请通知管理员审核")
                    return
                }
            }
        },
        // 处理执行进度
        async  commonHandleProgress(allIds,everyNumber) {
            var allNumber = Math.ceil(allIds.length/everyNumber);
            for (let i =0;i<allNumber;i++){
                var everyIds = allIds.slice(i * everyNumber,(i+1) * everyNumber); 
                console.log(everyIds,'everyIds');
                if(i === allNumber-1){
                console.log('執行完嘍');
                }
            }
        },
    }
}