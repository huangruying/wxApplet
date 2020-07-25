// 项目的根路径
export const baseUrl = 'http://192.168.0.160:8189/yuyuetrip/wash';

// myAxios 函数，params 发请求时传入的参数
export const myAxios = (params) => {
    // 判断参数的 url 是否有 /login/ 路径，如果没有，就在请求的时候，给请求头添加 token
    if (!(params.url.indexOf('/login/') !== -1)) {
        //  定义一个请求头
        params.header = {}
        // 从本地储存里拿到token
        const token = wx.getStorageSync('token')
        // 如果有token
        if (token) {
            params.header.token = token
        } else {
            // 没有 token ，就去用户中心登录
            wx.reLaunch({
                url: "/pages/login/index"
            })
            // 为了防止报错，返回一个空的params对象
            return new Promise(() => {})
        }
    }
    // 退出登录，后台的傻子逻辑，需要在请求头带token退出，日后复用代码记得删除
    if(params.url.indexOf('/marketingLogOut') !== -1){
         //  定义一个请求头
         params.header = {}
         // 从本地储存里拿到token
         const token = wx.getStorageSync('token')
         // 如果有token
         if (token) {
             params.header.marketingToken = token
         } else {
             // 没有 token ，直接去用户中心登录
             wx.reLaunch({
                 url: "/pages/login/index"
             })
             // 为了防止报错，返回一个空的params对象
             return new Promise(() => {})
         }
    }
    // 显示加载提示框
    wx.showLoading({
        title: '加载中',
    });

    // 函数内部返回 Promise 实例
    return new Promise((resolve, reject) => {
        // 对小程序的 request 请求 API 进行封装
        wx.request({
            // 解构所有参数
            ...params,
            // 把原本的 url，变成 根路径 + 目标路径
            url: baseUrl + params.url,
            // 成功
            success: result => {
                // 对应   .then(res=>{  })
                // resolve(result.data.message)
                resolve(result.data);
            },
            // 失败
            fail: error => {
                // 对应 .catch(err=>{})
                reject(error);
            },
            // 完成 - 不管成功还是失败都触发
            complete: () => {
                // 隐藏提示框
                wx.hideLoading();
                // 停止当前页面的页面的下拉刷新
                wx.stopPullDownRefresh()
                // 请求完毕，关闭导航栏小菊花
                wx.hideNavigationBarLoading();
            }
        });

    });
}

// PS：小程序支持两种方式导出：
//  1. export 
//  2. module.exports