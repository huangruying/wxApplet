// pages/reconciliation/reconciliation.js
import { findMonthlyListByUserId } from '../../api/reconciliation'
import { findDotByUserId } from '../../api/verification'
import tool from "../../utils/tool";
const test = tool.debounce(function(value){
  this.serData(value)
})
Page({
  test,
  data: {
    userId: null,
    pageSize: 15,
    pageNum: 1,
    dataList: [],
    nodeData: false,
    loading: false,
    total: "",
    titleVant: "请选择状态",
    stateId: "",
    stateList: [
      {
        value: '1',
        text: "已确认"
      },
      {
        value: '0',
        text: "未确认"
      }
    ],
    option: [],
    dotId: "",
    dotName: ""
  },
  // 初始化
  onLoad: function (options) {
    
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (!this.data.loading && this.data.dataList.length < this.data.total) {
      this.apiGetData(this.data.pageNum + 1)
    }else{
      this.setData({
        nodeData: true
      })
    }
  },
  // 获取数据
  apiGetData(pageNum){
    this.setData({
      loading: true
    })
    var obj = {}
    obj.userId = this.data.userId
    obj.pageSize = this.data.pageSize
    obj.pageNum = pageNum
    if(this.data.dotId){
      obj.servicerId = this.data.dotId
    }
    if(this.data.stateId){
      obj.status = this.data.stateId
    }
    findMonthlyListByUserId(obj).then(res=>{
      // console.log(res)
      if(res.code == 200 && res.data){
        let data = this.data.dataList
        this.setData({
          dataList: data.concat(res.data),
          nodeData: false,
          loading: false,
          total: res.total
        })
        if(!(this.data.dataList.length < this.data.total)){
          this.setData({
            nodeData: true
          })
        }
      }else{
        this.setData({
          nodeData: true,
          loading: false
        })
      }
    })
  },
  // 去确认
  goDetails(e){
    // console.log(e)
    let { count , servicerid , dotabbreviation } = e.currentTarget.dataset
    // console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: "/pages/checkTheDetails/index?month=" + count + "&servicerId=" + servicerid + "&dotabbreviation=" + dotabbreviation
    })
  },
  getInputDotName(e){
    this.setData({
      dotName: e.detail.value
    })
    this.selectComponent('#dotNameItem').toggle(true) // 打开下拉菜单
    this.test(e.detail.value)
  },
  changeState(e){
    this.data.stateList.forEach(v=>{
      if(v.value === e.detail){
        this.setData({
          titleVant: v.text
        })
      }
    })
    this.setData({
      stateId: e.detail,
      dataList: []
    })
    this.apiGetData(1)
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
      dotId: e.detail,
      dataList: []
    })
    this.apiGetData(1)
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let id = wx.getStorageSync('id')
    this.setData({
      userId: id,
      dataList: []
    })
    this.serData()
    this.apiGetData(1)
    wx.hideHomeButton()
  },
})