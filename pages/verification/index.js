// pages/index/index.js
import Dialog from '@vant/weapp/dialog/dialog';
import { cardTitle, letter } from '../../utils/plateNumber'
import tool from "../../utils/tool";
import { findDotByUserId , codeWriteOff } from '../../api/verification'
const test = tool.debounce(function(value){
  this.serData(value)
})
Page({
  test,
  /**
   * 页面的初始数据
   */
  data: {
    storeImages: "",
    dotAbbreviation: "",
    username: "",
    redeemCode: "",
    plateNumber: "",
    phone: "",
    userName: "",
    showPopup: false,
    plate: "粤",
    columns: [
      // 第一列
      {
          values: cardTitle,
          defaultIndex: 0, // 默认选中
        },
        // 第二列
        // {
        //   values: letter,
        //   defaultIndex: 0,
        // }
    ],
    dotId: "",
    userId: null,
    option: [],
    dotName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let username = wx.getStorageSync('username')
      let dotAbbreviation = wx.getStorageSync('dotAbbreviation')
      let pic = wx.getStorageSync('pic')
      this.setData({
        username: username,
        dotAbbreviation: dotAbbreviation,
        storeImages: pic
      })
      let id = wx.getStorageSync('id')
      this.setData({
        userId: id
      })
      this.serData()
  },
  serData(value){
    const data = {}
    data.userId = this.data.userId
    if(value){
      data.dotName = value[0]
    }
    findDotByUserId(data).then(res=>{
      if(res.data && res.code == 200 && res.data.length>0){
         var arr = []
         res.data.map(v=>{
          var obj = {}
          obj.value = v.id
          obj.text = v.dotName
          arr.push(obj)
         })
         this.setData({
          option: arr
         })
      }else{
        this.setData({
          option: []
         })
      }
    })
  },
  trim(str){ //删除左右两端的空格
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  getInputDotName(e){
    this.setData({
      dotName: e.detail.value
    })
    const str = this.trim(e.detail.value)
    if(!str){
      this.setData({
        dotId: ""
      })
    }
    this.selectComponent('#dotNameItem').toggle(true) // 打开下拉菜单
    this.test(e.detail.value)
  },
  changeDropdown(e){
    this.data.option.forEach(v=>{
      if(v.value === e.detail){
        this.setData({
          dotName: v.text
        })
      }
    })
    this.setData({
      dotId: e.detail
    })
  },
  platePopup(){
    this.setData({
      showPopup: true
    })
  },
  onCancel(){
    this.setData({
      showPopup: false
    })
  },
  // 选择车牌
  onConfirm(event){
    const { value, index } = event.detail;
    // console.log(value)
    this.setData({
      showPopup: false,
      // plate: value[0]  + value[1]
      plate: value[0]
    })
  },
  // 扫一扫
  scanCode(){
    const thx = this
    wx.scanCode({
      success (res) {
        thx.setData({
          redeemCode: res.result
        })
      }
    })
  },
  // 核销
  async submit(){
    const data = this.data
    const obj = {}
    if(data.redeemCode){
      obj.couponCode = data.redeemCode
    }else{
      wx.showToast({
        title: "请扫码识别券码号或手动输入券码！",
        icon:"none",
        duration: 2000
      })
      return
    }
    if(data.dotId){
      obj.servicerId = data.dotId
    }else{
      if(data.option.length === 0 || !data.dotId){
        wx.showToast({
          title: "找不到网点信息！",
          icon:"none",
          duration: 2000
        })
        return
      }
    }
    if(data.phone){
      obj.phone = data.phone
    }
    if(data.plateNumber){
      obj.licensePlate = data.plate + data.plateNumber
    }
    if(data.userName){
      obj.name = data.userName
    }
    let id = wx.getStorageSync('id')
    // obj.id = id
    const res = await codeWriteOff(obj)
    if(res.code == 200){
      this.setData({
        redeemCode: "",
        plateNumber: "",
        phone: "",
        userName: "",
        dotId: "",
        dotName: ""
      })
      wx.showToast({
        title: "核销成功！",
        duration: 3000
      })
    }else{
      wx.showToast({
        title: res.msg,
        icon:"none",
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },
  inputCode(e){
    this.setData({
      redeemCode: e.detail
    })
  },
  inputNumber(e){
    this.setData({
      plateNumber: e.detail
    })
  },
  inputPhone(e){
    this.setData({
      phone: e.detail
    })
  },
  inputUserName(e){
    this.setData({
      userName: e.detail
    })
  }
})