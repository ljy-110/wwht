<template>
    <div class="box">
        <div class="top">
            <div class="top-now">
                <el-form :model="ruleForm" ref="ruleForm" status-icon label-width="100px" class="demo-ruleForm flex-cont" size="mini">
                    <el-form-item label="数据批次:" prop="data">
                        <el-input v-model="ruleForm.data" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="号码:" prop="number">
                        <el-input v-model="ruleForm.number" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="昵称:" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="微信号:" prop="wxnum">
                        <el-input v-model="ruleForm.wxnum"></el-input>
                    </el-form-item>
                    <el-form-item label="群名称:" prop="group">
                        <el-input v-model="ruleForm.group"></el-input>
                    </el-form-item>
                    <el-form-item label="分配客户:" prop="customer">
                        <el-input v-model="ruleForm.customer" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="进群时间:" prop="time">
                        <div class="block">
                          <el-date-picker class="timeData" v-model="timeData" type="date" placeholder="选择日期" format="yyyy - MM - dd " value-format="yyyy-MM-dd">
                          </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetForm('ruleForm')">清空</el-button>
                        <el-button type="primary" :loading="loading" @click="seachData('ruleForm')">搜索</el-button>
                    </el-form-item>
                </el-form>
                
            </div>
        </div>
        <div class="top" style="margin-top:20px;">
            <div class="select">
                <el-select v-model="value" size='mini' style="width:10%" clearable filterable placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.value"
                    :value="item.label">
                    </el-option>
                </el-select>
                <el-select v-model="value2" size='mini' style="width:10%" clearable filterable placeholder="请选择">
                    <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.value"
                    :value="item.label">
                    </el-option>
                </el-select>
                <el-select v-model="value3" size='mini' style="width:10%" clearable filterable placeholder="请选择">
                    <el-option
                    v-for="item in options3"
                    :key="item.value"
                    :label="item.value"
                    :value="item.label">
                    </el-option>
                </el-select>
                <el-select v-model="value4" size='mini' style="width:10%" clearable filterable placeholder="请选择">
                    <el-option
                    v-for="item in options4"
                    :key="item.value"
                    :label="item.value"
                    :value="item.label">
                    </el-option>
                </el-select>
                <el-select v-model="value5" size='mini' style="width:10%" clearable filterable placeholder="请选择">
                    <el-option
                    v-for="item in options5"
                    :key="item.value"
                    :label="item.value"
                    :value="item.label">
                    </el-option>
                </el-select>
                <div style="width:10%">
                    <span>搜索结果数量：</span>
                    <span :total="total">{{total}}</span>
                    <span>条</span>
                </div>
                <div style="width:5%">
                    <el-button type="primary" size="mini" @click='clear'>清空</el-button>
                </div>
                <div style="width:5%">
                    <el-button type="primary" :loading="loadings" size="mini" @click="seachTWO">搜索</el-button>
                </div>
                <div style="width:9%">
                    <el-button type="primary" :loading="loadings" size="mini" @click="passGroupDay">已通过未拉群(当天)</el-button>
                </div>
                <div style="width:9%">
                    <el-button type="primary" :loading="loadings" size="mini" @click="passGroupSan">已通过未拉群(三天)</el-button>
                </div>
                <div style="width:5%">
                    <el-button type="primary" size="mini" @click="getData">刷新数据</el-button>
                </div>
            </div>
        </div>
        <div class="table-aa">
            <table class="" style="width:100%;">
                   <tr class="user-box">
                        
                        <th style="width:8%">数据批次</th>
                        <th style="width:8%">号码</th>
                        <th style="width:8%">微信昵称</th>
                        <th style="width:8%">微信号</th>
                        <th style="width:8%">进群名称</th>
                        <th style="width:8%">分配客户</th>
                        <th style="width:10%">加粉时间</th>
                        <th style="width:10%">通过时间</th>
                        <th style="width:10%">进群时间</th>
                        <th style="width:8%">是否手动删除</th>
                        <th style="width:8%">是否自动删除</th>
                    </tr>
                    <tr v-for="(item,index) in list" :key="index" class="user-box">
                        <td style="width:8%">{{item.batch_name}}</td>
                        <td style="width:8%">{{item.phone}}</td>
                        <td style="width:8%">{{item.wx_name}}</td>
                        <td style="width:8%">{{item.wx_account}}</td>
                        <td style="width:8%">{{item.group_name}}</td>
                        <td style="width:8%">
                          <span v-if="item.send_user">{{item.send_user}}</span>
                          <span v-else>未分配</span>
                        </td>
                        <td style="width:10%">
                          <span v-if="item.add_fan_time">{{item.add_fan_time | formatDate}}</span>
                          <span v-else>{{item.add_fan_time}}</span>
                        </td>
                        <td style="width:10%">
                          <span v-if="item.pass_time">{{item.pass_time | formatDate}}</span>
                          <span v-else>{{item.pass_time}}</span>
                        </td>
                        <td style="width:10%">
                          <span v-if="item.into_group_time">{{item.into_group_time | formatDate}}</span>
                          <span v-else>{{item.into_group_time}}</span>
                        </td>
                        <td style="width:8%">
                          <span v-if="item.user_del">是</span>
                        </td>
                        <td style="width:8%">
                          <span v-if="item.sys_del">是</span>
                        </td>
                    </tr> 
                </table>
        </div>
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
</template>

<script>
import {formatDate} from '@/common/date.js'
export default {
  filters: {
      formatDate(time) {
        time = time * 1000
        let date = new Date(time)
        // console.log(new Date(time))
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
  data () {
    return {
      currentPage4: 1,
      limit:20,//每页数据条数
      total: null,
      page: 1,//当前页
      list: [],
      data:[],
      radio: "",
      ruleForm: {
        data: null,//数据批次
        number: null,//号码
        name: null,//昵称
        wxnum: null,//微信号
        group: null,//群名称
        customer: null,//分配客户
      },
      loading: false,
      loadings: false,
      options: [{
        label: 2,
        value: '已分配'
      }, {
        label: 1,
        value: '未分配'
      }],
      options2: [{
        label: 2,
        value: '已添加'
      }, {
        label: 1,
        value: '未添加'
      }],
      options3: [{
        label: 2,
        value: '已通过'
      }, {
        label: 1,
        value: '未通过'
      }],
      options4: [{
        label: 2,
        value: '全部已拉群'
      }, {
        label: 3,
        value: '今天已拉群'
      },{
        label: 1,
        value: '未拉群'
      }],
      options5: [{
        label: 2,
        value: '已删除'
      }, {
        label: 1,
        value: '未删除'
      }],
      value: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      timeData:''
    }
  },
  created(){
    this.getPhonelist();
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!')
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getPhonelist();
      this.timeData = ''
      this.currentPage4 = 1
      this.page = 1
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    openDetails(row, event, column){
            this.accountid = row.account_id
            // console.log(this.accountid)
        },
    async getPhonelist(){//获取数据列表
      let res = await this.$api.teaback.getPhonelist();
      console.log(res)
      this.total = res.phoneSum
      this.data = res.list
      this.getList()
    },
    async passGroupDay(){//当天
      let res = await this.$api.teaback.getPhoneToday();
      console.log(res)
      this.total = res.list.length
      this.data = res.list
      this.getList()
    },
    async passGroupSan(){//三天
      let res = await this.$api.teaback.getPhoneNoIsThreeDay();
      console.log(res)
      this.total = res.list.length
      this.data = res.list
      this.getList()
    },
    getList(){
      let fyData = this.data
      this.list = fyData.filter((item, index) =>
          index < this.page * this.limit && index >= this.limit * (this.page - 1)
      )
      this.page = 1
    },
    handleSizeChange(val) {// 当每页数量改变
        this.limit = val
        this.getList()
    },
    handleCurrentChange(val) {// 当当前页改变
        this.page = val
        this.getList();
    },
    async seachData(formName){//根据信息查询
      this.loading = true
      let params = {
        batch_name: this.ruleForm.data,
        phone: this.ruleForm.number,
        wx_name: this.ruleForm.name,
        wx_account: this.ruleForm.wxnum,
        group_name: this.ruleForm.group,
        belong_user: this.ruleForm.customer,
        time_data: this.timeData
      }
      let res = await this.$api.teaback.getPhoneByInfo(params)
      console.log(res)
      if(res.ret === true){
        this.data = res.list
        this.getList();
        this.total = res.list.length 
        this.loading = false
      }else{
        this.$message.error('没有符合条件的用户')
      }
      this.loading = false
    },
    async seachTWO(){//根据条件查询
      this.loadings = true
      let params = {
        is_belong: this.value,
        is_add: this.value2,
        is_pass: this.value3,
        is_into: this.value4,
        is_del: this.value5,
        
      }
      let res = await this.$api.teaback.getPhoneByCondition(params)
      console.log(res)
      if(res.ret === true){
        this.data = res.list
        this.getList()
        this.total = res.list.length 
        this.loading = false
      }else{
        this.$message.error('没有符合条件的用户')
      }
      this.loadings = false
    },
    clear(){
      this.getPhonelist()
      this.currentPage4 = 1
      this.page = 1
      this.value= ''
      this.value2= ''
      this.value3= ''
      this.value4= ''
      this.value5= ''
    },
    getData(){
      this.getPhonelist();
      this.currentPage4 = 1
      this.page = 1
      this.$message({message: '获取数据成功',type: 'success'});
      this.value= '',
      this.value2= '',
      this.value3= '',
      this.value4= '',
      this.value5= '',
      this.loading=false,
      this.loadings=false
    }
  }
}
</script>

<style lang="stylus" scoped>
.top{
    background-color rgb(228,228,228)
}
.flex-cont{
    display flex
    width 100%
    align-items center
    justify-content flex-start
    flex-wrap wrap
}
.top-now{
    padding-top 20px;
}
.select{
    padding 10px 20px
    display flex
    width 100%
    height 30px
    line-height 30px
    justify-content flex-start
}
/deep/ .el-select{
    padding-right 20px
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
.timeData{
  width:179px
}
</style>
