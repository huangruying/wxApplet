// pages/user/index.js
import Dialog from '@vant/weapp/dialog/dialog';
import { marketingLogOut , editYyUser } from '../../api/user'
import { baseUrl } from '../../utils/myAxios'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: "",
    id: "",
    mobile: "",
    username: "",
    userimgList: [],
    openId: ""
  },
  onLoad: function (options) {
    let id = wx.getStorageSync('id')
    let pic = wx.getStorageSync('pic')
    let mobile = wx.getStorageSync('mobile')
    let username = wx.getStorageSync('username')
    var tis = this
    wx.login({
      success (res) {
        if (res.code) {
          tis.setData({
            openId: res.code
          })
        } else {
          wx.showToast({
            title: '获取openId失败！',
            icon:"none",
            duration: 2000
          })
        }
      }
    })
    this.setData({
      userimg: pic,
      id: id,
      mobile: mobile,
      username: username
    })
  },
  formSubmit(e) {
    const { mobile , password , username , userpassword } = e.detail.value
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if(!mobile){
      this.toast("请输入手机号！")
      return 
    }else if(!myreg.test(mobile)){
      this.toast("手机号格式不正确！")
      return
    }else if(!password){
      this.toast("请输入新密码！")
      return
    }else if(!userpassword){
      this.toast("请输入旧密码！")
      return
    }else if(!username){
      this.toast("请输入姓名！")
      return
    }
    // var _this = this
    Dialog.confirm({
      title: '确认修改?',
      message: "修改成功后需重新登录。",
    })
      .then(() => {
        var length = this.data.userimgList.length-1
        if(this.data.userimgList.length > 0){
          var pic = this.data.userimgList[length].url
        }else{
          var pic = this.data.userimg
        }
        editYyUser({
          id: this.data.id,
          username: username,
          password: userpassword,
          newPassword: password,
          pic: pic,
          mobile: mobile,
          openid: this.data.openId
        }).then(res=>{
          if(res.code == 200){
            wx.showToast({
              title: "修改成功!",
              duration: 2000
            })
            wx.removeStorageSync('token')
            wx.removeStorageSync('username')
            wx.removeStorageSync('mobile')
            wx.removeStorageSync('pic')
            wx.removeStorageSync('id')
            wx.reLaunch({
                url: "/pages/login/index"
            })
            // this.onLoad()
          }else{
            wx.showToast({
              title: res.msg,
              icon:"none",
              duration: 2000
            })
          }
        })
      })
      .catch(() => {
        // on cancel
      });
  },
  outLogin(){
    Dialog.confirm({
      title: '确认退出当前登录?',
      message: "退出后将返回登录页。",
    }).then(()=>{
      marketingLogOut({openid: this.data.openId}).then(res=>{
        if(res.code == 200){
          wx.showToast({
            title: "退出成功！",
            duration: 2000
          })
          wx.removeStorageSync('token')
          wx.removeStorageSync('username')
          wx.removeStorageSync('mobile')
          wx.removeStorageSync('pic')
          wx.removeStorageSync('id')
          wx.reLaunch({
              url: "/pages/login/index"
          })
        }else{
          this.toast(res.msg)
        }
      })
    }).catch(() => {
        // on cancel
      });
  },
  // 文件上传
  afterRead(event){
    const { file } = event.detail;
    const that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: baseUrl + '/marketing/dotOssUpload', 
      filePath: file.path,
      name: 'file',
      // formData: { user: 'test' },
      success(res) {
        const { userimgList = [] } = that.data;
        const data = JSON.parse(res.data)
        userimgList.push({ ...file, url: data.data });
        that.setData({ userimgList })
      },
    })
  },
  // 删除文件
  deleteUserImg(e){
    const userimgList = this.data.userimgList
    userimgList.splice(e.detail.index,1)
    this.setData({
      userimgList: userimgList
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 轻提示
  toast(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})