<template>
    <div class="box">
        <div class="flex-cont top">
            <el-form class="up-code">
                <el-form-item>
                    <el-upload
                        class="upload-demo upload-flex"
                        action="#"
                        ref="upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :http-request="httpRequest"
                        :on-exceed='handlexceed'
                        :file-list="fileList"
                        multiple
                        :on-success="handSuccess"
                        :on-change="handleChange"
                        :data="getUploadList"
                        accept="image/png,image/gif,image/jpg,image/jpeg"
                        :limit="200">
                        <el-button slot="trigger" size="mini" type="primary">选择图片</el-button>
                        <!-- <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload">上传图片</el-button> -->
                    </el-upload>
                </el-form-item>
            </el-form>
            <div style="padding-right:10px;padding-left:10px;width:5%">
                <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" size="mini" style="padding-right:10px;padding-left:10px;padding-top:17px;width:100%">
                    <el-form-item prop="number">
                        <el-input v-model="formInline.number"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <el-row style="padding-right:20px;">
                <el-button type="primary" size="mini" :loading="setPlanFansing" @click="setPlanFans" style="width:115px;">设置拉粉数量</el-button>
            </el-row>
            <el-row style="padding-right:20px;">
                <el-button type="primary" size="mini" :loading="lockGrouping" @click="lockGroup" style="width:100px;">锁定/解锁</el-button>
            </el-row>
            <el-row style="padding-right:20px;">
                <el-button type="primary" size="mini" :loading="addFansing" @click="addFans" style="width:100px;">补粉</el-button>
            </el-row>
            <el-row style="padding-right:20px;">
                <el-button type="primary" size="mini" :loading="delGrouping" @click="delGroup" style="width:100px;">删除</el-button>
            </el-row>
            <el-row style="padding-right:20px;">
                <el-button type="primary" size="mini" @click="getData" style="width:100px;">刷新数据</el-button>
            </el-row>
        </div>
        <div class="table-aa">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionChange" @row-click="openDetails">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="batch_name" label="二维码图片" show-overflow-tooltip>
              <template slot-scope="scope">
              <span class="seeCode" @click="getGroupQCcode(scope.row.name)" style="color:#169BD5;cursor:pointer;">图片点击放大</span>
              </template>
          </el-table-column>
          <el-table-column prop="group_name" label="群名称" show-overflow-tooltip>
            <template slot-scope="scope">
                <el-input v-model="scope.row.group_name" @blur="addGroupName" @input='getName' placeholder="请输入群名"  class="group-inp"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="fan_plan_num" label="预设进粉数" show-overflow-tooltip></el-table-column>
          <el-table-column prop="fan_arranged_num" label="已安排粉量" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">锁定</span>
                    <span v-else-if="scope.row.status == 1">未开始</span>
                    <span v-else-if="scope.row.status == 2">进行中</span>
                    <span v-else-if="scope.row.status == 3">已满</span>
                </template>
            </el-table-column>
            <el-table-column prop="reality_fans" label="实际粉数" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-input v-model="scope.row.reality_fans" @change="updateRealityFansNum" @input='getNum' placeholder="请输入实际粉数" class="group-inp"></el-input>
                </template>
            </el-table-column>
  </el-table>
        </div>
        
        <el-dialog title="查看详情" :visible.sync="seeDialog" width="30%"
                :before-close="handleClose">
                <div class="messageBox">
                    <label>群二维码</label>
                    <br>
                    <div><img :src="codeImg" alt="" style="width:100%;height:470px;"></div>
                </div>
            </el-dialog>
        
    </div>
</template>

<script>
export default {
    data() {
        return {
            data:[],
            radio: '',
            group_id: '',
            codeImg: '',
            formInline: {
                number: '35'
            },
            groupName: '',
            getNums: '',
            value: '',
            fileList: [],
            upfileList: [],
            getUploadList: {},
            seeDialog: false,
            flag:false,
            flag1:false,
            loading: true,
            dataInfo:[],
            namme:'',
            group:false,
            setPlanFansing:false,
            lockGrouping:false,
            addFansing:false,
            delGrouping:false,
        }
    },
    created(){
        this.getGroupList();
    },
    methods: {
        handleSelectionChange(val) {
            this.dataInfo = val
            // console.log(this.dataInfo)
        },
        openDetails(row, event, column){
            this.name = row.name
            // console.log(row)
        },
        async getGroupList(){//群列表
            let res = await this.$api.teaback.getGroupList()
            //  console.log(res)
            this.data = res.list
        },
        async getGroupQCcode(name){//查看二维码图片 
            // console.log(name)
            this.seeDialog = true
            let params = {
                name: name
            }
            let res = await this.$api.teaback.getGroupQCcode(params)
            // console.log(res)
            
            let bytes = new Uint8Array(res.photo.data);
            let data = "";
            let len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
            　　data += String.fromCharCode(bytes[i]);
            }
            let image = "data:image/png;base64," + window.btoa(data);
            this.codeImg = image
            if(res.ret === true){
                // this.seeDialog = true
            }else{
                this.$message.error('二维码图片不存在');
            }
        },
        handleClose(done) {
            done();
            this.seeDialog = false
            this.codeImg = ''
        },
        async addGroupName(){//修改群名
            // console.log(this.groupName)
            let params = {
                name: this.name,
                group_name: this.groupName
            }
            let res = await this.$api.teaback.addGroupName(params)
            // console.log(res)
            if(res.ret === true){
                this.$message.success('修改群名成功');
                this.getGroupList();
                this.groupName = ''
            }else if(res.msg == 'group_name is empty'){
                this.$message.warning('群名没有发生改变');
            }else{
                this.$message.error('修改失败');
            }
        },
        async updateRealityFansNum(){//添加实际粉数
            let params = {
                name: this.name,
                reality_fans: this.getNums
            }
            let res = await this.$api.teaback.updateRealityFansNum(params)
            // console.log(res)
            if(res.ret === true){
                this.$message.success('修改成功');
                this.getGroupList();
                this.getNums = ''
            }else{
                this.$message.error('修改失败');
            }
        },
        async lockGroup(){//绑定或者解绑
            this.lockGrouping = true
            let dataInfo = this.dataInfo
            let sum = 0
            let j = 0
            let sum2 = 0
            let j2 = 0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let status = dataInfo[i].status
                    let name = dataInfo[i].name
                    if(dataInfo[i].status == 0){
                        let params = {
                            name: dataInfo[i].name,
                            status: dataInfo[i].status
                        }
                        let res = await this.$api.teaback.unlockGroup(params)
                        this.getGroupList();
                        if(res.ret === true){
                            this.lockGrouping = false
                            sum += 1
                        }else{
                            this.lockGrouping = false
                            j += 1
                        }
                    }else{
                        let params = {
                            name: dataInfo[i].name,
                            status: dataInfo[i].status
                        }
                        let ress = await this.$api.teaback.lockGroup(params)
                        this.getGroupList(); 
                        if(ress.ret === true){
                            this.lockGrouping = false
                            sum2 += 1
                        }else{
                            this.lockGrouping = false
                            j2 += 1
                        }
                    }
                }
                let num = sum + sum2
                // console.log(num)
                if(num == dataInfo.length){
                    this.$message.success('成功解锁了'+sum+'个群'+','+'成功锁定了'+sum2+'个群');
                }else{
                    this.$message.success('成功解锁了'+sum+'个群'+","+'解锁失败'+j+'个群'+','+'成功锁定了'+sum2+'个群'+','+'锁定失败'+j2+'个群');
                }
            }else{
                this.$message.error('请先选择群');
                this.lockGrouping = false
            }
            
            
        },
        async addFans(){//补粉
            this.addFansing = true
            let dataInfo = this.dataInfo
            let sum = 0
            let j = 0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let params = {
                        name: dataInfo[i].name,
                        reality_fans: dataInfo[i].reality_fans
                    }
                    let res = await this.$api.teaback.addFans(params)
                    console.log(res)
                    if(res.ret === true){
                        this.getGroupList();
                        this.addFansing = false
                        sum += 1
                    }else if(res.msg == 'reality_fans is empty'){
                        this.$message.error('实际粉数错误');
                        this.addFansing = false
                        return
                    }else{
                        this.addFansing = false
                        j += 1
                    }
                }
                if(sum == dataInfo.length){
                    this.$message.success('成功补粉了'+sum+'个群');
                }else{
                    this.$message.warning('成功补粉了'+sum+'个'+','+'补粉失败了'+j+'个群');
                }
            }else{
                this.$message.error('请先选择群');
                this.addFansing = false
            }
        },
        async delGroup(){//删除群
            this.delGrouping = true
            let dataInfo = this.dataInfo
            let sum = 0
            let j = 0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let name = dataInfo[i].name
                    let params = {
                        name: dataInfo[i].name,
                    }
                    let res = await this.$api.teaback.delGroup(params)
                    // console.log(res)
                    if(res.ret === true){
                        this.getGroupList();
                        this.delGrouping = false
                        sum = sum+1
                    }else{
                        this.delGrouping = false
                        j = j+1
                    }
                }
                if(sum = dataInfo.length){
                    this.$message.success('成功删除了'+sum+'个群');
                }else{
                    this.$message.warning('成功删除了'+sum+'个'+','+'删除失败了'+j+'个群');
                }
                
            }else{
                this.$message.error('请先选择群');
                this.delGrouping = false
            }
            
        },
        handleChange(file, fileList) {//上传文件变化时
            this.fileList = fileList
        },
        async httpRequest(param){
            let file = param.file // 相当于input里取得的files
            let fan_plan_num = this.formInline.number
            let formData = new FormData()// FormData 对象
            // console.log(file)
            formData.append('file', file)// 文件对象
            formData.append('fan_plan_num', fan_plan_num)// 文件对象
            let that = this
            that.$axios({
                method: 'post',
                url: `${this.$baseUrl}/admin/addGroupQCCode`,
                // url: 'http://192.168.101.153:9000/admin/addGroupQCCode',
                headers:{'Content-Type': 'multipart/form-data'},
                data: formData
            }).then((response) => {
                // console.log(response)
                if(response.data.ret) {
                    // this.$message.success('上传成功')
                    this.getGroupList();
                }else{
                    this.$message.error(response.data.msg+'失败')
                }
            })
            .catch((e) => {
                this.$message.error('上传失败')
            })
            
        },
        handSuccess(response, file, fileList){//上传成功提示并且清除列表
            this.$message.success('成功添加新数据！');
            this.$refs.upload.clearFiles();
            // this.getGroupList();
        },
        handleRemove(file, fileList) {//文件移除的
            // console.log(file, fileList);
        },
        handlePreview(file) {//点击上传文件的时候的
            // console.log(file);
        },
        handlexceed(files, fileList) {//文件限制超个数
            this.$message.warning(`当前限制选择 200 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        async setPlanFans(){//设置拉分数
            this.setPlanFansing = true
            let dataInfo = this.dataInfo
            let sum = 0
            let j = 0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let params = {
                        name: dataInfo[i].name,
                        fan_plan_num: this.formInline.number
                    }
                    let res = await this.$api.teaback.setPlanFans(params)
                    // console.log(res)
                    if(res.ret === true){
                        this.getGroupList();
                        this.setPlanFansing = false
                        sum += 1
                    }else{
                        this.setPlanFansing = false
                        j += 1
                    } 
                }
                if(sum == dataInfo.length){
                    this.$message.success('设置成功了'+sum+'个群');
                }else{
                    this.$message.warning('设置成功了'+sum+'个'+','+'设置失败了'+j+'个群');
                }
            }else{
                this.$message.error('请先选择群');
                this.setPlanFansing = false
            }
            this.setPlanFansing = false
        },
        getNum(value){
            this.getNums = value
            this.group = true
        },
        getName(value){
            this.groupName = value
        },
        getData(){
            this.getGroupList();
            this.$message({message: '获取数据成功',type: 'success'});
        }
    }
}
</script>

<style lang="stylus" scoped>
.top{
    background-color rgb(228,228,228)
    height 60px
    padding-left 20px
}
.flex-cont{
    display flex
    width 100%
    align-items center
    justify-content flex-start
}
.block{
    float right
}
.table-aa{
    margin 20px 0 20px 0;
}
.user-box{
    display flex
    width 100%
    justify-content space-between
    text-align center
}
table{
    border: 1px solid #E4E7ED;
    border-collapse: collapse; 
}
.user-box th,.user-box td{
    border: 1px solid #E4E7ED;
    padding: 5px;
}
td{
    vertical-align:middle;
    height 25px
    line-height 25px
}
.group-name >>> .el-form-item{
    margin-bottom: 0px;
}
.group-inp >>> .el-input__inner {
    border: 1px solid white;
    width 100%
    font-size:14px;
    height 20px
}
/deep/ .el-upload-list{
    display none
}
.up-code >>> .el-form-item {
    margin-bottom: 0px; 
}
/deep/ .el-table td, .el-table th{
    padding 8px 0
}
.seeCode:hover{
    text-decoration:underline
}
</style>