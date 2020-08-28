/*
 * @Descripttion:
 * @version:
 * @Author: hengzi
 * @Date: 2019-12-12 14:58:13
 * @LastEditors  : hengzi
 * @LastEditTime : 2020-01-14 10:44:04
 */
import config from '../../../vue.config';
const defaultServerIP = '120.24.148.2';
// const defaultServerIP = '192.168.150.154';
const url = process.env.NODE_ENV === "production" ? "http://120.24.148.2:9000" : "api";
// const url = process.env.NODE_ENV === "production" ? "http://192.168.150.154:9000" : "api";
const baseUrl = config.publicPath + url;
// const baseUrl = config.publicPath

// const  baseUrl = '106.12.119.162:8008'
export default {
    baseUrl: baseUrl,
    //用户消息列表websocket
    ws_host_path_0:'ws://'+defaultServerIP+':63333',
    ws_user_listen:baseUrl+'/chat/ws/user/listen',
    //聊到室监听websocket
    ws_chatroom_listen:baseUrl+'/chat/ws/listen',
    // 图片列表
    photos: baseUrl + '/image/view?img_kind=open&filename=',//图片的地址
    addAccount: baseUrl + '/admin/addAccount',//新建账号
    userLogin: baseUrl + '/admin/login',//登录
    resetPassword: baseUrl + '/admin/resetPwd',//重置密码
    getAccountList: baseUrl + '/admin/accountlist',//获取账号列表
    getAccountQCcode: baseUrl+ '/admin/getAccountQCcode',//查看收款二维码
    getByHigherAndAccount: baseUrl + '/admin/getByHigherAndAccount',//根据上级账号和账号搜索
    banAccount: baseUrl + '/admin/banAccount',//禁止登录
    unBanAccount: baseUrl + '/admin/unBanAccount',//取消禁止
    clearLowMoney: baseUrl + '/admin/clearLowMoney',//上级未结算总数-清零
    getBatchList: baseUrl + '/admin/getBatchList',//获取批次列表
    uploadTxt: baseUrl + '/admin/uploadTxt',//上传数据皮皮
    uploadDataBatch: baseUrl + '/admin/uploadDataBatch',//上传新数据
    setPriority:baseUrl + '/admin/setPriority',//设置优先级
    delBatch: baseUrl + '/admin/delBatch',//删除数据批次
    getPhonelist: baseUrl + '/admin/getPhonelist',//获取号码明细列表
    getPhoneByInfo: baseUrl + '/admin/getPhoneByInfo',//根据信息查找号码
    getPhoneByCondition: baseUrl + '/admin/getPhoneByCondition',//根据条件查找号码
    getGroupList: baseUrl + '/admin/getGroupList',//获取群列表
    addGroupQCCode: baseUrl + '/admin/addGroupQCCode',//上传二维码
    getGroupQCcode:baseUrl + '/admin/getGroupQCcode',//查看群二维码
    addGroupName: baseUrl + '/admin/addGroupName',//输入群名
    setPlanFans: baseUrl + '/admin/setPlanFans',//输入群名
    updateRealityFansNum: baseUrl + '/admin/updateRealityFansNum',//输入实际粉数
    lockGroup: baseUrl + '/admin/lockGroup',//锁定群
    unlockGroup: baseUrl + '/admin/unlockGroup',//解锁群
    addFans: baseUrl + '/admin/addFans',//补粉
    delGroup: baseUrl + '/admin/delGroup',//删除群
    getAccountInfo: baseUrl + '/wxcrm/getAccountInfo',//账号信息
    resetPrice: baseUrl + '/wxcrm/resetPrice',//修改价格
    setFinshNum: baseUrl + '/admin/setFinshNum',//修改完成数
    getPhoneToday: baseUrl + '/admin/getPhoneToday',//修改完成数
    getPhoneNoIsThreeDay: baseUrl + '/admin/getPhoneNoIsThreeDay',//修改完成数
}
