<template>
    <div class="box">
        <div class="flex-cont top">
            <el-form :inline="true" :model="ruleForm" class="demo-form-inline" ref="ruleForm" size="mini" style="padding-right:10px;padding-left:10px;padding-top:20px;">
                <el-form-item label="上级账号:" prop="user">
                    <el-input v-model="ruleForm.user" placeholder="上级账号"></el-input>
                </el-form-item>
                <el-form-item label="账号:" prop="userXia">
                    <el-input v-model="ruleForm.userXia" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetForm('ruleForm')">清空</el-button>
                    <el-button type="primary" :loading="loading" @click="search(ruleForm.user,ruleForm.userXia)">搜索</el-button>
                    <el-button type="primary" size="mini" @click="getData" style="width:80px;">刷新数据</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-aa">
            <el-table ref="multipleTable" :data="data" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionChange" @row-click="openDetails">
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="this_no" label="编号" show-overflow-tooltip width="80"></el-table-column>
          <el-table-column prop="higher_account" label="上级账号" show-overflow-tooltip width="80"></el-table-column>
          <el-table-column prop="account" label="登陆账号" show-overflow-tooltip width="80"></el-table-column>
          <el-table-column prop="pwd" label="密码" show-overflow-tooltip width="100"></el-table-column>
          <el-table-column prop="is_ban" label="是否禁止登陆" show-overflow-tooltip width="110">
              <template slot-scope="scope">
            <span v-if="scope.row.is_ban">是</span>
            <span v-if="!scope.row.is_ban">否</span>
              </template>
          </el-table-column>
    <el-table-column prop="address" label="收款二维码" show-overflow-tooltip width="95">
        <template slot-scope="scope">
      <span class="seeCode" @click="getCodeImg(scope.row.account_id)" style="font-size:14px;color:rgb(22, 155, 213);cursor: pointer;">查看二维码</span>
        </template>               
    </el-table-column>
    <el-table-column prop="price" label="单价" show-overflow-tooltip width="80"></el-table-column>
    
    <el-table-column prop="direct_finish_num" label="直接完成数" show-overflow-tooltip width="95"></el-table-column>
    <el-table-column prop="low_finish_num" label="下级完成数" show-overflow-tooltip width="95"></el-table-column>
    <el-table-column prop="total_finish_num" label="总完成数" show-overflow-tooltip width="80"></el-table-column>
    <el-table-column prop="clear_before" label="上级未结算总数-清零前" width="170" show-overflow-tooltip></el-table-column>
    <el-table-column prop="clear_newest" label="上级未结算总数-最新" width="160" show-overflow-tooltip></el-table-column>
    <el-table-column prop="lower_no_clear" label="下级未结算总数" width="130" show-overflow-tooltip></el-table-column>
    <el-table-column prop="bank_user_name" label="持卡人" show-overflow-tooltip width="80"></el-table-column>
    <el-table-column prop="bank_type" label="开户银行" show-overflow-tooltip></el-table-column>
    <el-table-column prop="bank_card" label="银行账号" show-overflow-tooltip width="180"></el-table-column>
  </el-table>
        </div>
        <div class="footer">
            <div style="width:10%">
                <el-row style="padding-right:40px;">
                    <el-button type="primary" :loading="banAccounting" @click="getbanAccount" size="mini" style="width:100px;">禁止登陆</el-button>
                </el-row>
                <div style="margin-top:10px">该账号及其下级账号</div>
            </div>
            <div style="width:12%">
                <el-row style="padding-right:40px;">
                    <el-button type="primary" :loading="upbanAccounting" @click="upBanAccount" size="mini" style="width:100px;">取消禁止</el-button>
                </el-row>
                <div style="margin-top:10px">仅对该账号，下级账号不变</div>
            </div>
            <el-row style="padding-right:40px;width:10%">
                <el-button type="primary" :loading="clearLowMoneying" @click="clearLowMoney" size="mini" style="width:160px;">上级未结算总数-清零</el-button>
            </el-row>
            <el-row style="padding-right:40px;">
                <el-button type="primary" @click="revFinish" size="mini" style="width:100px;">修改完成数</el-button>
            </el-row>
            <el-row style="padding-right:40px;">
                <el-button type="primary" @click="price" size="mini" style="width:100px;">修改单价</el-button>
            </el-row>
            <el-row style="padding-right:40px;">
                <el-button type="primary" :loading="respwding" @click="respwd" size="mini" style="width:100px;">重置密码</el-button>
            </el-row>
            <el-row style="padding-right:40px;">
                <el-button type="primary" @click="addDialog=true;" size="mini" style="width:100px;">新建账号</el-button>
            </el-row>
            <div class="block">
                <!-- <span class="demonstration">完整功能</span> -->
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage1"
                :page-sizes="[10,15,20,50]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
                </el-pagination>
            </div>
            <!-- 新建账号弹窗 -->
            <div class="pagebox">
                <el-dialog title="新建账号" :visible.sync="addDialog" width="30%"
                :before-close="handleClose" class="userNew">
                    <span class="tips" v-show="flag1">信息不能为空!</span>
                    <form class="pageform">
                        <label>用户名：</label>
                        <el-input v-model="userinfo.username" placeholder="请输入内容"></el-input>
                        <label>密码：</label>
                        <el-input placeholder="请输入不超过8位数字或者字母或者两者组合" maxlength="8" v-model="userinfo.password" show-password></el-input>
                        <label>单价：</label>
                        <el-input v-model="userinfo.price" onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" placeholder="请输入数字"></el-input>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addList" :loading='load' class="btn1">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
            <!-- 修改完成数弹窗 -->
            <div class="pagebox">
                <el-dialog title="修改完成" :visible.sync="addDialogNum" width="30%"
                :before-close="handleClose" class="userNew">
                    <span class="tips" v-show="flag1">信息不能为空!</span>
                    <form class="pageform">
                        <label>登陆账号：</label>
                        <el-input v-model="userinfo.user" :disabled="true" placeholder="请输入内容"></el-input>
                        <label>旧上级未结算总数-最新：</label>
                        <el-input :disabled="true" v-model="userinfo.befNum"></el-input>
                        <label>新上级未结算总数-最新：</label>
                        <el-input v-model.number="userinfo.newNum" placeholder="请输入数字"></el-input>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="addListNum" :loading="revFinishing" class="btn1">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
            <!-- 修改单价 -->
            <div class="pagebox">
                <el-dialog title="修改单价" :visible.sync="upPrice" width="30%"
                :before-close="handleClose">
                    <span class="tips" v-show="flag">信息不能为空!</span>
                    <form class="pageform">
                        <label>原来的价格：</label>
                        <el-input v-model="priceInfo.upPrice" :disabled="true" placeholder="请输入内容"></el-input>
                        <label>修改的价格：</label>
                        <el-input v-model="priceInfo.newPrice" onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" placeholder="请输入内容"></el-input>
                    </form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="resetPrice" :loading="resetPriceing" class="btn1">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
            
        </div>
        <el-dialog title="查看详情" :visible.sync="seeDialog" width="55%"
        :before-close="handleCode">
            <div class="messageBox">
                <div style="text-align:center;">
                    <!-- <div style="text-align:center;">微信收款二维码</div> -->
                    <div v-if="!codeImg" style="margin-top:100px;">
                        <i class="el-icon-picture" style="font-size:80px;"></i>
                        <div style="margin-top:40px;">该用户还没有上传微信收款二维码</div>
                    </div>
                    <img :src="codeImg" alt="" style="width:68%;height:500px;text-align:center;">
                </div>
            </div>
            <div class="messageBox">
                <div style="text-align:center;">
                    <!-- <div>支付宝收款二维码</div> -->
                    <div v-if="!zfbImg" style="margin-top:100px;">
                        <i class="el-icon-picture" style="font-size:80px;"></i>
                        <div style="margin-top:40px;">该用户还没有上传支付宝收款二维码</div>
                    </div>
                    <img v-else :src="zfbImg" alt="" style="width:68%;height:500px;text-align:center;">
                </div>
                
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    inject: ["reload"],
    data(){
        return {
            currentPage1: 1,
            limit:10,//每页数据条数
            total: null,
            page1: 1,//当前页
            tableData: [],
            list: [],
            data:[],
            is_ban: '',
            addDialog: false,
            addDialogNum: false,
            upPrice: false,
            flag1:false,
            flag:false,
            userinfo:{
                username:'',//登陆账号
                password:'',//密码
                price:'',//单价
                user:'',
                befNum:'',
                newNum:''
            },
            banAccount: [],
            ruleForm: {
                userXia:'',
                user:''
            },
            accountInfo:[],
            pack:"",
            radio: "",
            searchData:'',
            seeDialog: false,
            codeImg: '',
            loading: false,
            load: false,
            banAccounting: false,
            upbanAccounting: false,
            clearLowMoneying: false,
            revFinishing: false,
            resetPriceing: false,
            respwding: false,
            accountid:'',
            priceInfo: {
                upPrice:'',
                newPrice:''
            },
            zfbImg:'',
            selection:[]
        };
    },

    methods: {
        handleSizeChange(val) {// 当每页数量改变
            this.limit = val
            this.getAccountList();
        },
        openDetails(row, event, column){
            this.accountid = row.account_id
            // console.log(this.accountid)
        },
        handleCurrentChange(val) {// 当当前页改变
            this.page1 = val
            console.log(this.page1);
            this.getAccountList();
        },
        handleSelectionChange(val) {
            this.accountInfo = val;
            // console.log(this.accountInfo)
        },
        price(){
            let dataInfo = this.accountInfo
            let thisno = localStorage.this_no
            if(this.accountInfo.length == 0){
                this.$message.error('请先选择账号');
                return
            }
            if(thisno == dataInfo[0].higher_no){
                if(dataInfo.length > 1){
                    this.$message.error('不可以修改多个账号单价');
                }else if(dataInfo.length == 1){
                    this.priceInfo.upPrice = dataInfo[0].price
                    this.upPrice = true
                }else{
                    
                }   
            }else{
                this.$message.error('你不是该账号的上级，无法修改')
            }   
        },
        revFinish(){
            let dataInfo = this.accountInfo
            if(this.accountInfo.length > 1){
                this.$message.error('不可以修改多个账号完成数');
            }else if(this.accountInfo.length == 1){
                this.userinfo.user = dataInfo[0].account
                this.userinfo.befNum = dataInfo[0].clear_newest
                this.addDialogNum = true
            }else if(this.accountInfo.length == 0){
                this.$message.error('请先选择账号');
            }else{
                this.$message.error('错误');
            }
        },
        async addListNum(){
            this.revFinishing = true
            let dataInfo = this.accountInfo
            let params = {
                account_id: dataInfo[0].account_id,
                finsh_num: this.userinfo.newNum
            }
            let res = await this.$api.teaback.setFinshNum(params)
            console.log(res)
            if(res.ret === true){
                this.$message.success('修改成功');
                this.getAccountList();
                this.addDialogNum = false
                this.userinfo.newNum = ''
                this.revFinishing = false
            }else if(res.msg == 'the change is error'){
                this.$message.error('超出修改范围，无法修改');
                this.revFinishing = false
            }else{
                this.$message.error('修改失败');
                this.revFinishing = false
            }
            this.revFinishing = false
        },
        async resetPrice(){//修改单价
            this.resetPriceing = true
            let dataInfo = this.accountInfo
            let params = {
                account_id: localStorage.account_id,
                account_low_id: dataInfo[0].account_id,
                price: this.priceInfo.newPrice
            }
            let res = await this.$api.teaback.resetPrice(params)
            console.log(res)
            if(res.ret === true){
                this.$message.success('修改成功');
                this.getAccountList();
                this.upPrice = false
                this.resetPriceing = false
                this.priceInfo.newPrice = ''
            }else{
                this.resetPriceing = false
                this.$message.error('修改失败');
            }
            this.resetPriceing = false
        },
        async getbanAccount(){//禁止登录
            this.banAccounting = true
            let dataInfo = this.accountInfo
            let sum = 0
            let j = 0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let name = dataInfo[i].name
                    let params = {
                        account:localStorage.account,
                        account_ban: dataInfo[i].account,
                        account_ban_id: dataInfo[i].account_id,
                    }
                    let res = await this.$api.teaback.banAccount(params)
                    // console.log(res)
                    if(res.ret === true){
                        this.banAccounting = false
                        this.getAccountList();
                        sum = sum+1
                    }else if(res.msg == 'do not ban admin'){
                        this.$message.error('不允许对主账号使用该功能！！')
                        this.banAccounting = false
                        return
                    }else{
                        this.banAccounting = false
                        j = j+1
                    }
                }
                if(sum = dataInfo.length){
                    this.$message.success('成功禁止登录了'+sum+'个账号');
                    this.getAccountList();
                }else{
                    this.$message.warning('成功禁止登录了'+sum+'个账号'+','+'禁止失败了'+j+'个账号');
                }
                
            }else{
                this.$message.error('请先选择账号');
            }
            
        },
        async upBanAccount(){//取消禁止
        this.upbanAccounting = true
            let dataInfo = this.accountInfo
            let sum = 0
            let j = 0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let params = {
                        account:localStorage.account,
                        account_ban: dataInfo[i].account,
                        account_ban_id: dataInfo[i].account_id,
                    }
                    let res = await this.$api.teaback.unBanAccount(params)
                    // console.log(res)
                    if(res.ret === true){
                        this.getAccountList();
                        sum = sum+1
                        this.upbanAccounting = false
                    }else if(res.msg == 'account_ban can not is admin'){
                        this.$message.error('不允许对主账号使用该功能！！')
                        this.upbanAccounting = false
                        return
                    }else if(res.msg == 'the account is bound no by you'){
                        this.$message.error('该操作应由该账户上级操作')
                        this.getAccountList();
                        this.upbanAccounting = false
                        return
                    }else if(res.msg == 'the account not is bound'){
                        this.$message.error('该账号没有被禁止')
                        this.upbanAccounting = false
                        return
                    }else{
                        j = j+1
                        this.upbanAccounting = false
                    }
                }
                if(sum == dataInfo.length){
                    this.$message.success('成功解禁登录了'+sum+'个账号');
                    this.getAccountList();
                }else{
                    this.$message.warning('成功解禁登录了'+sum+'个账号'+','+'解禁失败了'+j+'个账号');
                }
                this.upbanAccounting = false
            }else{
                this.$message.error('请先选择账号');
                this.upbanAccounting = false
            }
            this.upbanAccounting = false
        },
        async search(user,userXia) {// 搜索数据
            this.loading = true
            let params = {
                higher_acc:user,
                find_acc:userXia
            }
            let res = await this.$api.teaback.getByHigherAndAccount(params)
            console.log(res)
            if(res.ret === true){
                this.data = res.result
                this.total = res.result.length
                this.loading = false
            }else(
                this.$message.error('没有符合条件的用户')
            )
            this.loading = false
        },
        async getAccountList(){//用户信息列表
            let params = {
                // begin: 1,
                // len: 50
                begin: (this.page1-1)*10,
                len: this.limit
            }
            let res = await this.$api.teaback.getAccountList(params)
            console.log(res)
            // console.table(res.list)
            // let arr = res.list
            this.is_ban = res.list
            this.data = res.list
            this.total = res.accountSum
            
        },
        async respwd(){//重置密码
        this.respwding = true
            let dataInfo = this.accountInfo
            let sum = 0
            let j = 0
            if(dataInfo.length >= 1){
                for(var i =0;i<dataInfo.length;i++){
                    let params = {
                        account_b_id: dataInfo[i].account_id
                    }
                    let res = await this.$api.teaback.resetPassword(params)
                    // console.log(res)
                    if(res.ret === true){
                        this.getAccountList();
                        this.respwding = false
                        sum = sum+1
                    }else{
                        // this.$message.error('重置失败');
                        this.respwding = false
                        j = j+1
                    }
                }
                if(sum = dataInfo.length){
                    this.$message.success('成功重置了'+sum+'个账号');
                    this.getAccountList();
                }else{
                    this.$message.warning('成功重置了'+sum+'个账号'+','+'重置失败了'+j+'个账号');
                    this.getAccountList();
                }
                this.respwding = false
            }else{
                this.$message.error('请先选择账号');
                this.respwding = false
            }
            this.respwding = false
        },
        async clearLowMoney(){//上级清零功能
            this.clearLowMoneying = true
            let list = this.accountInfo
            if(this.accountInfo.length == 0){
                this.$message.error('请先选择账号');
                this.clearLowMoneying = false
                return
            }
            if(list.length == 1){
                let params = {
                    account:list[0].account,
                    account_id: list[0].higher_account_id,
                    account_lower_id: list[0].account_id
                }
                let res = await this.$api.teaback.clearLowMoney(params)
                // console.log(res)
                this.getAccountList();
                if(res.ret === true){
                    this.$message({message: '清零成功',type: 'success'});
                    this.clearLowMoneying = false
                }else if(res.msg == 'you are not direct higher of the account'){
                    this.$message({message: '你不是该账号的上级',type: 'error'})
                    this.clearLowMoneying = false
                }else if(res.msg == 'the newest clear do not need operate'){
                    this.$message({message: '该账户不需要清零',type: 'error'})
                    this.clearLowMoneying = false
                }else{
                    this.$message({message: '清零失败',type: 'error'});
                    this.clearLowMoneying = false
                }
            }else{
                this.$message({message: '只能清零一个账号',type: 'error'});
                this.clearLowMoneying = false
            }
            this.clearLowMoneying = false
        },
        async addList(){
            if(!this.userinfo.username || !this.userinfo.password || !this.userinfo.price){
                this.flag1=true;
            }else{
                this.load = true
                let random = Math.random();
                let params = {
                    account: this.userinfo.username,
                    pwd: this.userinfo.password,
                    price: this.userinfo.price,
                    random: random
                }
                let res = await this.$api.teaback.addAccount(params)
                // console.log(res)
                if(res.ret === true){
                    this.addDialog=false;
                    this.getAccountList();
                    this.load = false
                    this.$message({message: '新建成功',type: 'success'});
                    this.userinfo={
                        username:'',
                        password:'',
                        price:'',
                    }
                }else if(res.msg == 'the account is exist'){
                    this.$message({message: '账号已存在',type: 'error'});
                    this.load = false
                }else{
                    this.$message({message: '创建账号失败',type: 'error'});
                    this.load = false
                }
            }
        },
        handleClose(done) {
            done();
            this.flag=false;
            this.flag1=false;
            this.userinfo={
                username:'',
                password:'',
                price:'',
            }
        },
        handleCode(done) {
            done();
            this.seeDialog = false
            this.codeImg = ''
        },
        async getCodeImg(account_id){
            let params = {
                account_id: account_id
            }
            let res = await this.$api.teaback.getAccountQCcode(params)
            // console.log(res)
            if(res.ret === true){
                if(res.photo.data && res.zfb_photo.data){
                    let bytes = new Uint8Array(res.photo.data);
                    let data = "";
                    let len = bytes.byteLength;
                    for (let i = 0; i < len; i++) {
                    　　data += String.fromCharCode(bytes[i]);
                    }
                    let image = "data:image/png;base64," + window.btoa(data);
                    this.codeImg = image
                    let byte = new Uint8Array(res.zfb_photo.data);
                    let datas = "";
                    let lens = byte.byteLength;
                    for (let i = 0; i < lens; i++) {
                    　　datas += String.fromCharCode(byte[i]);
                    }
                    let images = "data:image/png;base64," + window.btoa(datas);
                    this.zfbImg = images
                    this.seeDialog = true
                }else if(res.zfb_photo.data){
                    let byte = new Uint8Array(res.zfb_photo.data);
                    let datas = "";
                    let lens = byte.byteLength;
                    for (let i = 0; i < lens; i++) {
                    　　datas += String.fromCharCode(byte[i]);
                    }
                    let images = "data:image/png;base64," + window.btoa(datas);
                    
                    this.zfbImg = images
                    this.codeImg = ''
                    this.seeDialog = true
                }else if(res.photo.data){
                    let bytes = new Uint8Array(res.photo.data);
                    let data = "";
                    let len = bytes.byteLength;
                    for (let i = 0; i < len; i++) {
                    　　data += String.fromCharCode(bytes[i]);
                    }
                    let image = "data:image/png;base64," + window.btoa(data);
                    this.codeImg = image
                    this.zfbImg = ''
                    this.seeDialog = true
                }
                
            }else{
                this.$message({message: '该用户还没有上传收款码',type: 'error'});
            }
        },
        getData(){
            this.currentPage1 = 1
            this.page1 = 1
            this.getAccountList();
            this.$message({message: '获取数据成功',type: 'success'})
        },
        resetForm(formName) {//清空
            // this.currentPage4 = 1
            // this.page = 1
            // this.getAccountList();
            this.getData()
            this.$refs[formName].resetFields();
        },
    },
    created(){
        this.getAccountList();
    }
}
</script>

<style lang="stylus" scoped>
.top{
    background-color rgb(228,228,228)
    height 60px
}
/deep/ .el-dialog__body{
    display flex
    width 100%
    justify-content flex-start
    padding 0
}
.flex-cont{
    display flex
    width 100%
    align-items center
    justify-content flex-start
}
.table-aa{
    margin 20px 0 20px 0;
}
.footer{
    display flex
    width 100%
    justify-content space-between
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
.tips {
    position: absolute;
    left: 20px;
    top: 50px;
    color: red;
}
.pageform{
    display flex
    height 200px
    width 100%
    flex-direction column
    padding 0px 20px 0px 20px;
}
.pageform label {
    margin 10px 0
}
.pageform input{
    margin 10px 0 10px 0
    height 30px
    border:1px solid #E4E7ED;
	outline:none;
}
.pageform input:focus{
    border:1px solid #3879d9;
}
.seeCode:hover{
    text-decoration:underline
}
.pageform input::-webkit-input-placeholder{
    color:#ccc;
}
.messageBox{
    width 50%
    margin 0 auto
    // display flex
    // justify-content center
}
/deep/ .el-dialog__header{
    text-align center
    font-weight 800
}
.userNew >>> .el-dialog__footer{
    margin-top 50px
}
</style>