// pages/checkTheDetails/index.js
import { findServiceOrderByMonth } from '../../api/checkTheDetails'
import Dialog from '@vant/weapp/dialog/dialog';
Page({
  data: {
    year: "",
    month: "",
    addMonth: "",
    subMonth: "",
    servicerId: "",
    dotabbreviation: "",
    userId: null,
    totalPrice: "",
    text: "已对账",
    pageNum: 1,
    pageSize: 15,
    loading: false,
    nodeData: false,
    status: true,
    total: "",
    dataList: [],
  },
// 生命周期函数--监听页面加载
  onLoad: function (options) {
    let userId = wx.getStorageSync('id')
    this.setData({
      userId: userId
    })
    let date = options.month
    let servicerId = options.servicerId
    let dotabbreviation = options.dotabbreviation
    // console.log(options)
    let date2 = date.split("-")
    var add = Number(date2[1])
    var sub = Number(date2[1])
    if(add + 1 > 12){
      add = "0" + 1
    }else{
      add = add+1
      if(String(add).length === 1){
        add = "0" + add
      }
    }
    if(sub - 1 === 0){
      sub = 12
    }else{
      sub = sub-1
      if(String(sub).length === 1){
        sub = "0" + sub
      }
    }
    this.setData({
      year: date2[0],
      month: date2[1],
      dataList: [],
      addMonth: add,
      subMonth: sub,
      servicerId,
      dotabbreviation
    })
    this.getData(1)
  },
  // 上一个月
  subClick(event){
    let { sub } = event.currentTarget.dataset
    let { year, month } = this.data
    let add = month = sub
    if(Number(sub) - 1 === 0){
      sub = 12
      year = Number(year) - 1
    }else{
      sub = Number(sub)-1
      if(String(sub).length === 1){
        sub = "0" + sub
      }
    }
    if(Number(add) + 1 > 12){
      add = "0" + 1
    }else{
      add = Number(add)+1
      if(String(add).length === 1){
        add = "0" + add
      }
    }
    this.setData({
      dataList: [],
      year: year,
      month: month,
      addMonth: add,
      subMonth: sub
    })
    this.getData(1)
  },
  // 下一个月
  addClick(e){
    let { add } = e.currentTarget.dataset
    let { year, month } = this.data
    let sub = month = add
    if(Number(sub) - 1 === 0){
      sub = 12
    }else{
      sub = Number(sub)-1
      if(String(sub).length === 1){
        sub = "0" + sub
      }
    }
    if(Number(add) + 1 > 12){
      add = 1
      year = Number(year)+1
    }else{
      add = Number(add)+1
      if(String(add).length === 1){
        add = "0" + add
      }
    }
    this.setData({
      dataList: [],
      year: year,
      month: month,
      addMonth: add,
      subMonth: sub
    })
    this.getData(1)
  },
  // 获取数据
  getData(pageNum){
    this.setData({
      loading: true
    })
    findServiceOrderByMonth({
      userId: this.data.userId,
      pageSize: this.data.pageSize,
      pageNum: pageNum,
      servicerId: this.data.servicerId,
      month: this.data.year + "-" + this.data.month
    }).then(res=>{
      // console.log(res)
      if(res.code == 200 && res.data){
        res.data.map(v=>{
          v.createTime = v.createTime.split(" ")[0]
        })
        let data = this.data.dataList
        if(res.status == 0){
          var status = true
        }else{
          var status = false
        }
        this.setData({
          dataList: data.concat(res.data),
          nodeData: false,
          loading: false,
          total: res.total,
          totalPrice: res.totalPrice,
          status: status
        })
        if(!(this.data.dataList.length < this.data.total)){
          this.setData({
            nodeData: true
          })
        }
      }else{
        if(res.status){
          if(res.status == 0){
            var status = true
          }else{
            var status = false
          }
        }else{
          var status = false
        }
        if(res.totalPrice){
          var totalPrice = res.totalPrice
        }else{
          var totalPrice = 0
        }
        this.setData({
          nodeData: true,
          loading: false,
          status: status,
          totalPrice: totalPrice
        })
      }
    }).catch(err=>{
      // console.log(err)
    })
  },
  // 对账
  confirm(){
    Dialog.confirm({
      title: '确认对账?',
      message: this.data.year + "-" + this.data.month,
    })
      .then(() => {
        confirmReconciliation({
          userId: this.data.userId,
          month: this.data.year + "-" + this.data.month
        }).then(res=>{
          if(res.code == 200){
            wx.showToast({
              title: "对账成功!",
              duration: 2000
            })
            var timerName = setTimeout(()=> {
              this.setData({
                dataList: [],
              })
              this.getData(1)
              clearTimeout(timerName)
              //循环代码
            }, 1700)
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 下拉触底，先判断是否有请求正在进行中
    // 以及检查当前请求页数是不是小于数据总页数，如符合条件，则发送请求
    if (!this.data.loading && this.data.dataList.length < this.data.total) {
      this.getData(this.data.pageNum + 1)
      this.setData({
        pageNum: this.data.pageNum + 1
      })
    }else{
      this.setData({
        nodeData: true
      })
    }
  },
})