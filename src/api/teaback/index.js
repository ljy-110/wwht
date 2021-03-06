/*
 * @Descripttion:
 * @version:
 * @Author: hengzi
 * @Date: 2019-12-12 14:58:07
 * @LastEditors  : hengzi
 * @LastEditTime : 2020-01-14 10:44:55
 */
import api from '../index'
import urls from './url'
let config = {
    headers: {
        'Content-Type':'multipart/form-data'
    }
       
  };

let uinfoLocks = {}; 
let user_keepalive_funcs = [];
let user_keepalive =0;
let websock = null;
let newMsgObjFunc = {};

function notice_user_ws_status(status)
{
    user_keepalive = status;
    for(let i=0;i<user_keepalive_funcs.length;i++)
    {
        // console.log('user_keepalive_funcs:'+user_keepalive_funcs[i])
        user_keepalive_funcs[i](user_keepalive)
    }
}

const restart_time = 1000;
async function initWebSocket(){
    // console.log('into initWebSocket function')
    if(websock)
	{
        notice_user_ws_status(user_keepalive)
        return ;
    }
    if(typeof(WebSocket) === "undefined"){
        console.error("您的浏览器不支持WebSocket")
        return false
    }

    try{
        let params = {user_id:localStorage.user_id,s_id:localStorage.s_id};
        let tokenRet = await api.post(urls.ws_user_listen,params,{'Content-Type': 'application/x-www-form-urlencoded'});//token
		// console.log(tokenRet)
        if(tokenRet && tokenRet.ret && tokenRet.listen_token)
        {
            let wsuri = urls.ws_host_path_0+'/userchatlist/ws/svr?token='+tokenRet.listen_token;
            websock = new WebSocket(wsuri)
            websock.onopen = websocketonopen
            websock.onmessage = websocketonmessage
            websock.onerror = websocketonerror
            websock.onclose = websocketclose
        }else{
            // console.log('initWebSocket-get-ws-token failed:'+JSON.stringify(tokenRet))
            websock  = null;
            setTimeout(initWebSocket,restart_time);
        }   
    }catch(ex){
        // console.log('start websocket-exception:'+ex)
        setTimeout(initWebSocket,restart_time);
    }
}
let keepalive_id = null;
function callKeepAlive()
{
    killKeepAlive();
    keepalive_id = setInterval(function(){
        if(websock) websock.send('keepalive')
    },9000)

    if(websock) websock.send('keepalive')
}
function killKeepAlive()
{
    if(keepalive_id) clearInterval(keepalive_id)
    keepalive_id = null;
}
//连接成功
function websocketonopen(){ 
    console.log('WebSocket连接成功')
    user_keepalive = 1;
    notice_user_ws_status(user_keepalive)
    callKeepAlive();

}
//接收后端返回的数据
function websocketonmessage(e){ 
    let data = e.data;
    // console.log('websocketonmessage:'+data)

    user_keepalive = 1;
    notice_user_ws_status(user_keepalive)

    let dataJson = null;
    try{
        dataJson = JSON.parse(data)
    }catch(ex){
        // console.log('dataJson parse failed:'+ex)
    }

    // console.log('dataJSON:'+JSON.stringify(dataJson))
    if(newMsgObjFunc) newMsgObjFunc(dataJson)

    // 在这里使用后端返回的数据，对数据进行处理渲染
}
//连接建立失败重连
function websocketonerror(e){
    console.log(`连接失败的信息：`, e)
    //this.initWebSocket() // 连接失败后尝试重新连接
    user_keepalive = 0;
    notice_user_ws_status(user_keepalive)
    websock  = null;
    setTimeout(initWebSocket,restart_time);
    killKeepAlive();
}
//关闭连接
function websocketclose(e){ 
    console.log('断开连接',e)
    websock  = null;
    user_keepalive = 0;
    notice_user_ws_status(user_keepalive)
    setTimeout(initWebSocket,restart_time);
    killKeepAlive();
}


let total_unread_num_func = null;
export default {
    setTotalUnreadNum(func)
    {
        total_unread_num_func = func;
    },
    updateTotalUnreadNum(){
        if(total_unread_num_func) total_unread_num_func();
    },
    addUserKeepAliveStatusFunc(func)
    {
        if(func) user_keepalive_funcs.push(func)
    },
    async startWebSocket(){
        initWebSocket();
    },
      setNewMsgObjFunc(func)
      {
        newMsgObjFunc = func;
      },
    //uinfoLocks为加锁操作
    async s_queryUserInfo(dst_user_id,callback)
    {
        // console.log('s_queryUserInfo:'+dst_user_id)

        // console.log('user_keepalive_funcs:'+user_keepalive_funcs)
    
        let userInfoStr = localStorage.getItem('userinfo_cache_'+dst_user_id);
        // console.log('userinfo_cache_'+dst_user_id+':'+userInfoStr)
        let userInfo = null;
        if(userInfoStr) {
            try{
                userInfo = JSON.parse(userInfoStr)   
                callback(userInfo)
                return userInfo;
            }catch(ex)
            {
                // console.log(JSON.stringify(ex))
            }
        }

        //使用网络请求拿到值
        console.log('uinfoLocks-'+dst_user_id+':'+uinfoLocks[dst_user_id])
        if(!uinfoLocks[dst_user_id])
        {
            uinfoLocks[dst_user_id] = true;
            let user_id = localStorage.user_id
            let param = {user_id,s_id:localStorage.s_id,random:Math.random(),dst_user_id}
            api.post(urls.UserInfoto,param,{'Content-Type': 'application/x-www-form-urlencoded'}).then(res=>
            {
                if(res && res.ret)
                {
                    userInfo = res;
                    localStorage.setItem('userinfo_cache_'+dst_user_id,JSON.stringify(res));
                }else{
                    userInfo = null;
                }

                uinfoLocks[dst_user_id] = false;

                //回调得到结果
                if(callback) callback(res)
            })
        }

        return null;
    },
    getChatRoomWebSocketListenToken(param) {
        return api.post(urls.ws_chatroom_listen,param,{'Content-Type': 'application/x-www-form-urlencoded'});//获取chatroom-ws-listen-token
    },
    createWSChatListenUrl(token)
    {
        return urls.ws_host_path_0+'/groupchat/ws/svr?token='+token;
    },
    OTCorder(params) {
        return api.get(urls.OTCorder,params,"");//
    },
    getTest(params){
        return api.get(urls.sendTest,params,"");
    },
    sendSms(params){
        return api.post(urls.sendSms,params,{'Content-Type': 'application/x-www-form-urlencoded'});//获取验证码
    },
    changePassword(params){
        return api.post(urls.changePassword,params,{'Content-Type': 'application/x-www-form-urlencoded'});
    },
    addAccount(params){
        return api.get(urls.addAccount,params,"");//新建账号
    },
    userLogin(params){
        return api.get(urls.userLogin,params,{'Content-Type': 'application/x-www-form-urlencoded'});//登录
    },
    resetPassword(params){
        return api.get(urls.resetPassword,params,"");//重置密码
    },
    getAccountList(params){
        return api.get(urls.getAccountList,params,"");//获取账号列表
    },
    getByHigherAndAccount(params){
        return api.get(urls.getByHigherAndAccount,params,"");//根据上级账号和账号搜索
    },
    getAccountQCcode(params){
        return api.get(urls.getAccountQCcode,params,"");//查看收款二维码
    },
    banAccount(params){
        return api.get(urls.banAccount,params,"");//禁止登录
    },
    unBanAccount(params){
        return api.get(urls.unBanAccount,params,"");//取消禁止
    },
    clearLowMoney(params){
        return api.get(urls.clearLowMoney,params,"");//上级未结算总数-清零
    },
    getBatchList(params){
        return api.get(urls.getBatchList,params,"");//获取批次列表
    },
    uploadTxt(params){
        return api.post(urls.uploadTxt,params,{'Content-Type': 'multipart/form-data'});//上传数据皮皮
    },
    uploadDataBatch(params){
        return api.get(urls.uploadDataBatch,params,"");//上传新数据
    },
    setPriority(params){
        return api.get(urls.setPriority,params,"");//设置优先级 
    },
    delBatch(params){
        return api.get(urls.delBatch,params,"");//删除数据批次
    },
    getPhonelist(params){
        return api.get(urls.getPhonelist,params,"");//获取号码明细列表
    },
    getPhoneByInfo(params){
        return api.get(urls.getPhoneByInfo,params,"");//根据信息查找号码
    },
    getPhoneByCondition(params){
        return api.get(urls.getPhoneByCondition,params,"");//根据条件查找号码
    },
    getGroupList(params){
        return api.get(urls.getGroupList,params,"");//获取群列表
    },
    addGroupQCCode(params){
        return api.post(urls.addGroupQCCode,params,"");//上传二维码
    },
    getGroupQCcode(params){
        return api.get(urls.getGroupQCcode,params,"");//查看群二维码
    },
    addGroupName(params){
        return api.get(urls.addGroupName,params,"");//输入群名
    },
    setPlanFans(params){
        return api.get(urls.setPlanFans,params,"");//输入群名
    },
    updateRealityFansNum(params){
        return api.get(urls.updateRealityFansNum,params,"");//输入实际粉数
    },
    lockGroup(params){
        return api.get(urls.lockGroup,params,"");//锁定群
    },
	unlockGroup(params){
	    return api.get(urls.unlockGroup,params,"");//解锁群
	},
	addFans(params){
	    return api.get(urls.addFans,params,"");//补粉
	},
	delGroup(params){
	    return api.get(urls.delGroup,params,"");//删除群
    },
    getAccountInfo(params){
        return api.get(urls.getAccountInfo,params,"");//获取个人信息
    },
    resetPrice(params){
        return api.get(urls.resetPrice,params,"");//修改单价
    },
    setFinshNum(params){
        return api.get(urls.setFinshNum,params,"");//修改完成数
    },
    getPhoneNoIsThreeDay(params){
        return api.get(urls.getPhoneNoIsThreeDay,params,"");//修改完成数
    },
    getPhoneToday(params){
        return api.get(urls.getPhoneToday,params,"");//修改完成数
    }
}


