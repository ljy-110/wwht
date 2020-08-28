<template>
    <div class="box">
        <div class="flex-cont top">
            <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline" size="mini" style="padding-right:10px;padding-left:10px;padding-top:20px;">
                <el-form-item label="数据批次:" prop="bacth">
                    <el-input v-model="formInline.bacth" placeholder="数据批次"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload
                        class="upload-demo upload-flex"
                        ref="upload"
                        action="#"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :http-request="httpRequest"
                        :file-list="fileList"
                        :on-success="handSuccess"
                        :on-change="handleChange"
                        :on-exceed='handleExceed'
                        :before-remove='beforeRemove'
                        :data="getUploadList"
                        :auto-upload="false"
                        accept=".txt"
                        :limit="1">
                        <el-button slot="trigger" size="mini" type="primary">选择文件</el-button>
                        <el-button style="margin-left: 10px;" size="mini" type="success" @click="submitUpload">上传新数据</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传txt文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <div class="flex-cont top" style="margin-top:20px;">
            <div style="padding-right:40px;padding-left:10px;">
                <span>优先级：</span>
                <template>
                    <el-select v-model="value" size='mini' style="width:100px" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </div>
            <el-row style="padding-right:40px;">
                <el-button type="primary" :loading="setPrioritying" @click="setPriority" size="mini" style="width:100px;">设置优先级</el-button>
            </el-row>
            <el-row style="padding-right:40px;">
                <el-button type="primary" :loading="delBatching" @click="delBatch" size="mini" style="width:100px;">整批删除</el-button>
            </el-row>
            <el-row style="padding-right:20px;">
                <el-button type="primary" @click="getData" size="mini" style="width:100px;">刷新数据</el-button>
            </el-row>
        </div>
        <div class="table-aa">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionChange" @row-click="openDetails">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="batch_name" label="数据批次" show-overflow-tooltip></el-table-column>
          <el-table-column prop="all_num" label="数量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="send_num" label="已用数量" show-overflow-tooltip></el-table-column>
          <el-table-column prop="pass_num" label="通过数量" show-overflow-tooltip></el-table-column>
          <el-table-column label="通过率" show-overflow-tooltip>
              <template slot-scope="scope">
                    <span>{{scope.row.pass_rate}}</span>
              </template>
          </el-table-column>
            <el-table-column prop="priority" label="优先级" show-overflow-tooltip></el-table-column>
  </el-table>
            <!-- <table class="" style="width:100%;">
                   <tr class="user-box">
                        <th style="width:4%">勾选</th>
                        <th style="width:16%">数据批次</th>
                        <th style="width:16%">数量</th>
                        <th style="width:16%">已用数量</th>
                        <th style="width:16%">通过数量</th>
                        <th style="width:16%">通过率</th>
                        <th style="width:16%">优先级</th>
                    </tr>
                    <tr v-for="item in data" :key="item.batch_id" class="user-box">
                        <td style="width:4%">
                            <el-checkbox @change="handleSelectionChange(item.batch_id)"></el-checkbox>
                        </td>
                        <td style="width:16%">{{item.batch_name}}</td>
                        <td style="width:16%">{{item.all_num}}</td>
                        <td style="width:16%">{{item.send_num}}</td>
                        <td style="width:16%">{{item.pass_num}}</td>
                        <td style="width:16%">
                            <span v-if="item.pass_num == 0">0</span>
                            <span v-else>{{item.pass_num/item.send_num | numFilter}}%</span>
                        </td>
                        <td style="width:16%">{{item.priority}}</td>
                    </tr> 
                </table> -->
        </div>
        <div class="footer">
            <div class="block">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage4"
                :page-sizes="[10,20, 50]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
        </div>
        <div class="chuli" v-if='chuliShow'>
            <i class="el-icon-success"></i>
            <span>正在处理中，请稍后</span>
        </div>
    </div>
</template>

<script>
export default {
    filters: {
        numFilter(value) {
            let realVal = Number(value*100).toFixed(1)
            return Number(realVal)
        }
    },
    data() {
      return {
        options: [
            {value: '1',label: '1'}, 
            {value: '2',label: '2'}, 
            {value: '3',label: '3'}, 
            {value: '4',label: '4'}, 
            {value: '5',label: '5'},
            {value: '6',label: '6'},
            {value: '7',label: '7'},
            {value: '8',label: '8'},
            {value: '9',label: '9'}
        ],
        value: '',
        currentPage4: 1,
        limit:20,//每页数据条数
        total: null,
        page: 1,//当前页
        tableData: [],
        list: [],
        data:[],
        batch_id: [],
        formInline: {
          bacth: '',
        },
        radio: "",
        fileList: [],
        upfileList: [],
        getUploadList: {},
        chuliShow:false,
        batchInfo:[],
        batchid:'',
        setPrioritying:false,
        delBatching:false,
      }
    },
    created(){
        this.getBatchList();
    },
    methods: {
        openDetails(row, event, column){
            this.batchid = row.batch_id
            // console.log(this.batchid)
        },
        handleSelectionChange(val) {
            this.batchInfo = val;
            // console.log(this.batchInfo)
        },
        onSubmit() {
            // console.log('submit!');
        },
        handleSizeChange(val) {// 当每页数量改变
            this.limit = val
            this.getBatchList();
        },
        handleCurrentChange(val) {// 当当前页改变
            this.page = val
            this.getBatchList();
        },
        async getBatchList(){//获取数据批次列表
            let params = {
                begin: (this.page-1)*20,
                len: this.limit
            }
            let res =await this.$api.teaback.getBatchList(params)
            console.log(res)
            this.data = res.list
            this.total = res.batchSum
        },
        async setPriority(){//设置优先级
            this.setPrioritying = true
            let dataInfo = this.batchInfo
            let sum = 0
            let j =0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let params = {
                        batch_id: dataInfo[i].batch_id,
                        priority: this.value
                    }
                    let res = await this.$api.teaback.setPriority(params)
                    // console.log(res)
                    if(res.ret === true){
                        this.getBatchList();
                        this.setPrioritying = false
                        sum = sum+1
                    }else{
                        // this.$message.error('设置失败');
                        this.setPrioritying = false
                        j = j+1
                    }
                }
                if(sum = dataInfo.length){
                    this.$message.success('成功设置了'+sum+'个批次');
                    this.getBatchList();
                    this.value = ''
                }else{
                    this.$message.warning('成功设置了'+sum+'个批次'+','+'设置失败了'+j+'个批次');
                    this.getBatchList();
                }
                
            }else{
                this.$message.error('请先选择批次');
                this.setPrioritying = false
            }
        },
        async delBatch(){//整批删除
            this.delBatching = true
            let dataInfo = this.batchInfo
            let sum = 0
            let j =0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let params = {
                        batch_id: dataInfo[i].batch_id,
                        batch_name: dataInfo[i].batch_name,
                        priority: dataInfo[i].priority
                    }
                    let res = await this.$api.teaback.delBatch(params)
                    // console.log(res)
                    if(res.ret === true){
                        this.getBatchList();
                        this.delBatching = false
                        sum = sum+1
                    }else{
                        this.delBatching = false
                        j = j+1
                    }
                }
                if(sum = dataInfo.length){
                    this.$message.success('成功删除了'+sum+'个批次');
                    this.getBatchList();
                }else{
                    this.$message.warning('成功删除了'+sum+'个批次'+','+'删除失败了'+j+'个批次');
                    this.getBatchList();
                }
                
            }else{
                this.$message.error('请先选择批次');
                this.delBatching = false
            }
        },
        submitUpload(data) {//点击上传
            if(!this.formInline.bacth){
                this.$message.error('数据批次不能为空')
                return
            }
            this.$refs.upload.submit(data);
        },
        handleChange(file, fileList) {//上传文件变化时
            this.fileList = fileList
        },
        async httpRequest(param){
            let file = param.file // 相当于input里取得的files
            let batch_name = this.formInline.bacth
            // console.log(file)
            
            let formData = new FormData()// FormData 对象
            formData.append('file', file)// 文件对象
            formData.append('batch_name', batch_name)
            let that = this;
            that.$axios({
                method: 'POST',
                url: `${this.$baseUrl}/admin/uploadTxt`, 
                // url: 'http://192.168.101.153:9000/admin/uploadTxt',
                headers:{'Content-Type': 'multipart/form-data'},
                data: formData
            }).then((response) => {
                // console.log(response)
                if(response.data.ret) {
                    this.getBatchList();
                    this.$message.success('上传成功')
                    this.chuliShow = false
                }else{
                    this.$message.error(response.data.msg+'失败')
                    this.chuliShow = false
                }
            })
            .catch((e) => {
                this.$message.error('上传失败')
                this.chuliShow = false
            })
            
        },
        handSuccess(response, file, fileList){//上传成功提示并且清除列表
            this.chuliShow = true
            this.$refs.upload.clearFiles();
            this.formInline.bacth=''
            // console.log(response, file, fileList);
        },
        handleRemove(file, fileList) {//文件移除的
            // console.log(file, fileList);
        },
        handlePreview(file) {//点击上传文件的时候的
            // console.log(file);
        },
        handleExceed(files, fileList) {//文件限制超个数
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {//删除
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        getData(){
            this.getBatchList();
            this.currentPage4 = 1
            this.page = 1
            this.$message({message: '获取数据成功',type: 'success'});
        }
    },
}
</script>

<style lang="stylus" scoped>
.box{
    position relative
}
.top{
    background-color rgb(228,228,228)
    height 60px
}
.flex-cont{
    display flex
    width 100%
    align-items center
    justify-content flex-start
}
/deep/ .el-button--mini{
    padding 7px 7px;
}
.table-aa{
    margin 20px 0 20px 0;
}
.block{
    float right
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
/deep/ .el-upload-list__item:first-child {
    margin-top: 0px;
    margin-left 15px
}
.upload-flex{
    display flex
    justify-content flex-start
}
/deep/ .el-upload__tip{
    margin-top 0
    margin-left 15px
}
.chuli{
    position absolute
    left 38%
    top 1%
    display block
    width 18%
    height 40px
    line-height 40px
    padding-left 20px
    border-radius 10px
    color rgb(103,194,58)
    background-color rgb(240,249,235)
}
</style>