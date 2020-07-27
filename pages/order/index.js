// pages/order/index.js
import { findDotByUserId, findServiceOrder } from '../../api/order'
import tool from "../../utils/tool";
 /*函数防抖*/
 function throttle(fn, interval) {
  var timer;
  var gapTime = interval || 800; //间隔时间，如果interval不传，则默认1000ms
  return function() {
    clearTimeout(timer);
    var context = this;
    var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function() {
      fn.call(context,args)
    }, gapTime)
  };
}

const test = throttle(function(value){
  // console.log(value)
  this.serData(value)
})
Page({
  data: {
    minDate: new Date(2020, 0, 1).getTime(),
    defaultDate: [],
    maxDate: 0,
    showCalendar: false,
    start: "",
    end: "",
    userId: null,
    pageSize: 15,
    pageNum: 1,
    dataList: [],
    nodeData: false,
    loading: false,
    total: "",
    totalPrice: "",
    dotName: "",
    dotId: "",
    option: []
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
     //今天的时间
     var day = new Date();
     day.setTime(day.getTime());
     var data = this.formatDate(day)
    //  let str = day.getMonth() + 1
    //  if(String(str).length === 1){
    //   str = "0" + str
    //  }
    var defaultDate1 = new Date(data)
    var defaultDate2 = new Date(`${day.getFullYear()}-${day.getMonth() + 1}-01`)
    var time1 = defaultDate1.getTime()
    var time2 = defaultDate2.getTime()
     this.setData({
      end: data,
      start: `${day.getFullYear()}-${day.getMonth() + 1}-01`,
      defaultDate: [time1,time2]
     })
    let id = wx.getStorageSync('id')
    this.setData({
      userId: id
    })
    this.serData()
    this.apiGetData(1)
  },
  // 获取日期
  getDate(){
    this.setData({
      showCalendar: true
    })
  },
  onClose() {
    this.setData({ showCalendar: false });
  },
  // 选择时间段
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      showCalendar: false,
      dataList: [],
      start: this.formatDate(start),
      end: this.formatDate(end)
    })
    this.apiGetData(1)
  },
  // 格式化时间
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  getList(){
    this.setData({
      dataList: []
    })
    this.apiGetData(1)
  },
  // 获取数据
  apiGetData(pageNum){
    this.setData({
      loading: true
    })
    var obj = {
      userId: this.data.userId,
      pageSize: this.data.pageSize,
      pageNum: pageNum,
      startTime: this.data.start,
      endTime: this.data.end
    }
    if(this.data.dotId){
      obj.servicerId = this.data.dotId
    }
    findServiceOrder(obj).then(res=>{
      if(res.code == 200 && res.data){
        res.data.map(v=>{
          v.createTime = v.createTime.split(" ")[0]
        })
        let data = this.data.dataList
        this.setData({
          dataList: data.concat(res.data),
          nodeData: false,
          loading: false,
          total: res.total,
          totalPrice: res.totalPrice
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
// 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

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
  serData(value){
    const data = {}
    data.userId = this.data.userId
    if(value){
      // for( var v in value){
      //   console.log(value[v])
      // }
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
    const str = this.trim(e.detail.value)
    this.setData({
      dotName: e.detail.value
    })
    if(!str){
      this.setData({
        dotId: ""
      })
    }
    this.selectComponent('#dotNameItem').toggle(true) // 打开下拉菜单
    this.test(e.detail.value)
    // this.setDataList(e.detail.value)
    // const _this = this
    // this.throttle(()=>{
    //   _this.setDataList(e.detail.value)
    // })()
  },
  setDataList(value){
    this.serData(value)
    // const _this = this
    // this.throttle(function() {
    //   _this.serData(value)
    // })()
  },
  /*函数防抖*/
  throttle(fn, interval) {
    var timer;
    var gapTime = interval || 3000; //间隔时间，如果interval不传，则默认1000ms
    return function() {
      clearTimeout(timer);
      var context = this;
      var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
      timer = setTimeout(function() {
        fn.call(context,args)
        // console.log("9999999")
      }, gapTime)
    };
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
  test
})