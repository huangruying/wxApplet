// pages/login/login.js
import { marketingLogin } from '../../api/login'
import { baseUrl } from '../../utils/myAxios'  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    imgCode: "",
    url: "",
    password: "",
    openId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从本地储存里拿到token
    const token = wx.getStorageSync('token')
    // const token = false
    // 如果有token
    if(token){
      wx.reLaunch({
        url: "/pages/index/index"
      })
    }else{
      var tis = this
      wx.login({
        success (res) {
          if (res.code) {
            tis.setData({
              openId: res.code
            })
            tis.getImg()
          } else {
            wx.showToast({
              title: '获取openId失败！',
              icon:"none",
              duration: 2000
            })
          }
        }
      })
    }
  },
  getInputPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  getInputPassword(e){
    this.setData({
      password: e.detail.value
    })
  },
  getInputImgCode(e){
    this.setData({
      imgCode: e.detail.value
    })
  },
  // 获取图形码
  async getImg(){
    // const res = await codoYzm({openid: this.data.openId})
    this.setData({
      url: baseUrl  + "/marketing/login/generateCodeImg" + "?date=" +new Date().valueOf() + "&openid=" + this.data.openId
    })
  },
  // 登录
  async formSubmit(e) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if(!e.detail.value.phone){
      wx.showToast({
        title: '请输入手机号！',
        icon:"none",
        duration: 2000
      })
      return
    }else if(!myreg.test(e.detail.value.phone)){
      wx.showToast({
        title: '手机号格式不正确！',
        icon: "none",
        duration: 2000
      })
      return
    }else if(!e.detail.value.imgCode){
      wx.showToast({
        title: '请输入图形验证码！',
        icon: "none",
        duration: 2000
      })
      return
    }else if(!e.detail.value.password){
      wx.showToast({
        title: '请输入密码！',
        icon: "none",
        duration: 2000
      })
      return
    }else{
      const res = await marketingLogin({
        username: e.detail.value.phone,
        password: e.detail.value.password,
        verCode: e.detail.value.imgCode,
        openid: this.data.openId
      })
      if(res.code == 205){ // 图形验证码错误
        wx.showToast({
          title: res.msg,
          icon:"none",
          duration: 2000
        })
        return
      }else if(res.code == 200){
        // console.log(res)
        wx.setStorage({
          key: "token",
          data: res.data.token
        })
        wx.setStorage({
          key: "username",
          data: res.data.username
        })
        wx.setStorage({
          key: "mobile",
          data: res.data.mobile
        })
        wx.setStorage({
          key: "pic",
          data: res.data.pic
        })
        wx.setStorage({
          key: "id",
          data: res.data.id
        })
        wx.reLaunch({
          url: "/pages/index/index"
        })
        wx.showToast({
          title: "登录成功！",
          duration: 2000
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon:"none",
          duration: 2000
        })
      }
    }
  },
    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideHomeButton()
  },
})