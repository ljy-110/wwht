import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index'
import user from '@/components/user'
import improtData from '@/components/improtData'
import analysisData from '@/components/analysisData'
import group from '@/components/group'
import login from '@/pages/login'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/user',
      name: 'user',
      component: user
    },
    {
      path: '/improtData',
      name: 'improtData',
      component: improtData
    },
    {
      path: '/analysisData',
      name: 'analysisData',
      component: analysisData
    },
    {
      path: '/group',
      name: 'group',
      component: group
    }
  ]
})
