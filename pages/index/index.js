import { findDotInfos , findYuyueProvinces , findYuyueCityByProvinceid , findYuyueAreasByCityid , getCarwashInfo  } from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provinceId: "",
    cityId: "",
    regionId: "",
    titlePor: "请选择省份",
    titleCit: "请选择城市",
    titleReg: "请选择区/县",
    titleCar: "请选择服务名称",
    pageNum: 1,
    pageSize: 15,
    phone: "",
    carwashId: "",
    option1: [],
    option2: [],
    option3: [],
    option4: [],
    loading: false,
    nodeData: false,
    total: "",
    dataList: []
  },
// 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.apiProvince()
    this.ApigetCarwashInfo()
    this.getData()
  },
  getDataList(){
    this.setData({
      pageNum: 1,
      dataList: []
    })
    this.getData()
  },
  async getData(){
    this.setData({
      loading: true
    })
    const data = {}
    const id = wx.getStorageSync('id')
    data.userId = id
    data.pageSize = this.data.pageSize
    data.pageNum = this.data.pageNum
    if(this.data.provinceId){
      data.provinceId = this.data.provinceId
    }
    if(this.data.cityId){
      data.cityId = this.data.cityId
    }
    if(this.data.regionId){
      data.regionId = this.data.regionId
    }
    if(this.data.phone){
      data.storePhone = this.data.phone
    }
    if(this.data.carwashId){
      data.carwashId = this.data.carwashId
    }
    const res = await findDotInfos(data)
    // console.log(res)
    if(res.data && res.code == 200){
      res.data.map(v=>{
        v.mobile = v.mobile.slice(0, 3) + "****" + v.mobile.substr(-4, 4)
      })
      let dataL = this.data.dataList
      this.setData({
        dataList: dataL.concat(res.data),
        nodeData: false,
        loading: false,
        total: res.total
      })
      if(this.data.dataList.length >= res.total){
        this.setData({
          nodeData: true
        })
      }
    }else{
      this.setData({
        nodeData: true,
        loading: false,
      })
      if(res.code !== 200){
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    }
  },
  // 点击网点
  clickNode(e){
    const { id , dotcode } = e.currentTarget.dataset
    // console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/editNode/index?id=" + id + "&dotCode=" + dotcode
    })
  },
  // 省数据
  async apiProvince(){
    const res = await findYuyueProvinces()
    const arr = []
    res.data.map(v=>{
      var obj = {}
      obj.value = v.provinceid
      obj.text = v.province
      arr.push(obj)
    })
    this.setData({
      option1: arr
    })
  },
  // 选中省
  changeProvince(e){
    this.data.option1.forEach(v=>{
      if(v.value === e.detail){
        this.setData({
          titlePor: v.text
        })
      }
    })
    this.setData({
      provinceId: e.detail,
      cityId: "",
      regionId: ""
    })
    findYuyueCityByProvinceid({provinceid: e.detail}).then(res=>{
      const arr = []
      res.data.map(v=>{
        var obj = {}
        obj.value = v.cityid
        obj.text = v.city
        arr.push(obj)
      })
      this.setData({
        option2: arr
      })
    })
  },
  // 选择市
  changeCity(e){
    this.data.option2.forEach(v=>{
      if(v.value === e.detail){
        this.setData({
          titleCit: v.text
        })
      }
    })
    this.setData({
      cityId: e.detail,
      regionId: ""
    })
    findYuyueAreasByCityid({cityid: e.detail}).then(res=>{
      const arr = []
      res.data.map(v=>{
        var obj = {}
        obj.value = v.areaid
        obj.text = v.area
        arr.push(obj)
      })
      this.setData({
        option3: arr
      })
    })
  },
  // 选择区
  changeRegion(e){
    this.data.option3.forEach(v=>{
      if(v.value === e.detail){
        this.setData({
          titleReg: v.text
        })
      }
    })
    this.setData({
      regionId: e.detail
    })
  },
  // 选择服务项
  changeCarwash(e){
    this.data.option4.forEach(v=>{
      if(v.value === e.detail){
        this.setData({
          titleCar: v.text
        })
      }
    })
    this.setData({
      carwashId: e.detail
    })
  },
  // 服务项数据
  async ApigetCarwashInfo(){
    const res = await getCarwashInfo()
    const arr = []
    res.data.map(v=>{
      let obj = {}
      obj.value = v.id
      obj.text = v.dotsType
      arr.push(obj)
    })
    this.setData({
      option4: arr
    })
  },
// 生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },
// 生命周期函数--监听页面显示
  onShow: function () {

  },
  newlyPage(){
    wx.navigateTo({
      url: "/pages/newlyNode/index"
    })
  },
  goUser(){
    wx.navigateTo({
      url: "/pages/user/index"
    })
  },
  goOrder(){
    wx.navigateTo({
      url: "/pages/order/index"
    })
  },
  goReconciliation(){
    wx.navigateTo({
      url: "/pages/reconciliation/index"
    })
  },
  goVerification(){
    wx.navigateTo({
      url: "/pages/verification/index"
    })
  },
  getInputPhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
// 页面上拉触底事件的处理函数
  onReachBottom: function () {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (!this.data.loading && this.data.dataList.length < this.data.total) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.getData()
    }else{
      this.setData({
        nodeData: true
      })
    }
  },
})