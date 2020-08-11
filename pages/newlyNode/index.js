// pages/newlyNode/index.js
var app = getApp();
import { findYuyueProvinces, findYuyueCityByProvinceid, findYuyueAreasByCityid } from '../../api/index'
import { findMechanismName, findCarwashTypesInfos, saveDot , getProvinceCityArea } from '../../api/newlyNode'
import formatTime from '../../utils/formatTime'
import { baseUrl } from '../../utils/myAxios'
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    formHiddenOne: false,
    formHiddenTwo: true,
    formHiddenThree: true,
    number2: true,
    number3: true,
    provinceId: "",
    cityId: "",
    regionId: "",
    titlePor: "请选择省份",
    titleCit: "请选择城市",
    titleReg: "请选择区/县",
    titleMec: "请选择所属机构",
    titleDot: "请选择网点类型",
    mechanismList: [],
    dotList: [
      {
        value: '0',
        text: "车行"
      },
      {
        value: '1',
        text: "待办机构"
      },
    ],
    option1: [],
    option2: [],
    option3: [],
    timeShow: false,
    time2Show: false,
    popupShow: false,
    timeHours: "08:00",
    timeHours2: "21:00",
    currentDate: new Date().getTime(),
    minDate: new Date(2019, 1, 1).getTime(),
    maxDate: new Date(2050, 1, 1).getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return `${value}日`;
    },
    formOne: {
      dotName: "",
      dotAbbreviation: "",
      mobile: "",
      shopowner: "",
      storePhone: "",
      address: "",
      dotType: "",
      mechanismId: "",
      contractTime: "",
      businessHours: "",
      businessHours2: "",
      lnglat: ""
    },
    formTwo: {
      dotServices: [],
      openingBank: "",
      account: "",
      accountName: ""
    },
    oneData: {},
    result: [],
    storeImages: [],
    receptionImage: [],
    honorImage: [],
    trafficImage: [],
    businessImage: [],
    constructionImage: [],
    priceList: [],
    loadingSubmit: false,
    textarea: false
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    this.apiProvince() 
    this.apiFindMechanismName()
    this.apiFindCarwashTypesInfos()
    this.location()
  },
  location(){
    let self =this;
    self.mapCtx = wx.createMapContext('myMap')
    qqmapsdk = new QQMapWX({
      // key: 'W57BZ-JDB6X-XPA4H-Z76MI-73FF2-24BT4' // 别人的
      key: 'HDABZ-LST33-YMD3M-3QYQI-FAG66-LRFR6' // 老衲的
      // key: 'GTKBZ-FJO3P-CCEDI-LI3OB-3GJ2K-SHFDS' // 凯哥的
      // key: 'UTOBZ-5TZH6-BSHSG-MRKO7-7REOQ-B2B5V' // 凯哥企业端的
    });
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res2) {
            let province = res2.result.address_component.province
            let city = res2.result.address_component.city
            let district = res2.result.address_component.district
            getProvinceCityArea({
              province: province,
              city: city,
              area: district
            }).then(res3=>{
              if(res3.code == 200){
                self.apiCityList(res3.data.provinceid)
                self.apiAreasList(res3.data.cityid)
                self.setData({
                  provinceId: res3.data.provinceid,
                  cityId: res3.data.cityid,
                  regionId: res3.data.areaid,
                  titlePor: province,
                  titleCit: city,
                  titleReg: district
                })
              }else{
                self.toast("获取地理位置失败，请手动选择省市区。")
              }
            })
          },
        });
      }
     })
  },
  // 第一步确认
  formSubmitOne(e) {
    // this.setData({
    //   number2: false,
    //   formHiddenOne: true,
    //   formHiddenTwo: false
    // })  //上面数据记得删除等下
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    const data = this.data
    const formOne = data.formOne
    if(!data.provinceId){
      this.toast('请选择省份！')
      return 
    }else if(!data.cityId){
      this.toast('请选择城市！')
      return 
    }else if(!data.regionId){
      this.toast('请选择区/县！')
      return 
    }else if(!formOne.dotName){
      this.toast('请输入网点名称')
      return 
    }else if(!formOne.dotAbbreviation){
      this.toast('请输入网点简称')
      return
    }else if(!formOne.mobile){
      this.toast('请输入客服电话')
      return
    }else if(!formOne.storePhone){
      this.toast('请输入店长/经理电话')
      return
    }else if(!myreg.test(formOne.storePhone)){
      this.toast('店长/经理电话格式不正确！')
      return
    }else if(!formOne.address){
      this.toast('请输入网点详细地址')
      return
    }else if(!formOne.lnglat){
      this.toast('请选择经纬度')
      return
    }else if(!formOne.dotType){
      this.toast('请选择网点类型')
      return
    }else if(!formOne.contractTime){
      this.toast('请选择合同到期时间')
      return
    }else if(!formOne.businessHours){
      this.toast('请选择营业时间 开始')
      return
    }else if(!formOne.businessHours2){
      this.toast('请选择营业时间 结束')
      return
    }else{
      let oneData = formOne
      oneData.provinceId = data.provinceId
      oneData.cityId = data.cityId
      oneData.regionId = data.regionId
      this.setData({
        oneData: oneData,
        number2: false,
        formHiddenOne: true,
        formHiddenTwo: false
      })
    }
  },
  // 第2步返回上一级
  confirmOne(){
    this.setData({
      number2: true,
      formHiddenOne: false,
      formHiddenTwo: true
    })
  },
  // 第2步确认
  confirmThree(){
    // this.setData({
    //   number3: false,
    //   formHiddenOne: true,
    //   formHiddenTwo: true,
    //   formHiddenThree: false
    // })  //上面数据记得删除等下
    const data = this.data.formTwo
    if(!data.accountName){
      this.toast('请输入户名')
      return
    }else if(!data.account){
      this.toast('请输入账号')
      return
    }else if(!data.openingBank){
      this.toast('请输入开户行')
      return
    }else{
      this.setData({
        number3: false,
        formHiddenOne: true,
        formHiddenTwo: true,
        formHiddenThree: false
      })
    }
  },
  openDropdown(){
    this.setData({
      textarea: true
    })
  },
  closeDropdown(){
    this.setData({
      textarea: false
    })
  },
  // 提交
  submitForm(e){
    if(this.data.loadingSubmit){
      this.toast('正在提交中，请等待~')
      return
    }else{
      this.data.loadingSubmit = true
    }
    const data = this.data
    let obj = Object.assign(data.oneData, data.formTwo)
    var arr1 = [] 
    var arr2 = [] 
    var arr3 = [] 
    var arr4 = [] 
    var arr5 = [] 
    var arr6 = [] 
    data.storeImages.forEach(v=>{
      arr1.push(v.url)
    })
    data.receptionImage.forEach(v=>{
      arr2.push(v.url)
    })
    data.constructionImage.forEach(v=>{
      arr3.push(v.url)
    })
    data.trafficImage.forEach(v=>{
      arr4.push(v.url)
    })
    data.honorImage.forEach(v=>{
      arr5.push(v.url)
    })
    data.businessImage.forEach(v=>{
      arr6.push(v.url)
    })
    obj.storeImages = arr1
    obj.receptionImage = JSON.stringify(arr2) 
    obj.constructionImage = JSON.stringify(arr3) 
    obj.trafficImage = JSON.stringify(arr4) 
    obj.honorImage = JSON.stringify(arr5)
    obj.businessImage = JSON.stringify(arr6)
    var arrlnglat = obj.lnglat.split('/')
    obj.longitude = arrlnglat[0]
    obj.latitude = arrlnglat[1]
    let id = wx.getStorageSync('id')
    obj.userId = id
    // delete obj.lnglat
    saveDot(obj).then(res=>{
      this.setData({
        loadingSubmit: false
      })
      if(res.code == 200){
        wx.redirectTo({
          url: "/pages/index/index"
        })
        wx.showToast({
          title: '新增成功！',
          icon: 'success',
          duration: 2000
        })
      }else{
        this.toast(res.msg)
      }
    }).catch(err=>{
      this.setData({
        loadingSubmit: false
      })
      this.toast('服务器已炸！')
    })
  },
  apiFindMechanismName(){
    findMechanismName().then(res=>{
      const arr = []
      res.data.map(v=>{
        var obj = {}
        obj.value = v.id,
        obj.text = v.mechanismName
        arr.push(obj)
      })
      this.setData({
        mechanismList: arr
      })
    })
  },
  apiFindCarwashTypesInfos(){
    findCarwashTypesInfos().then(res=>{
      this.setData({
        priceList: res.data
      })
      // console.log(res.data)
    })
  },
  // 点击复选按钮组
  onChangeCheckbox(event){
    // console.log(event.detail)
    this.setData({
      result: event.detail,
    })
    this.forListCheck(this.data.result)
  },
  // 循环复选框数据
  forListCheck(result){
    const list = this.data.priceList // 总数据
    var arr = []
    list.forEach(v=>{
      v.carwashsTypes.forEach(i=>{
        result.forEach(t=>{
          if(t == i.id){
            var obj = {}
            obj.carwashId = v.dtId
            obj.carwashsId = i.id
            obj.price = i.price
            arr.push(obj)
          }
        })
      })
    })
    this.setData({
      ['formTwo.dotServices']: arr
    })
  },
  // 价格输入
  inputServices(e){
    let { id } = e.currentTarget.dataset
    const list = this.data.priceList // 总数据
    list.map(v=>{
      v.carwashsTypes.map(i=>{
        if(i.id == id){
          i.price = e.detail.value
        }
      })
    })
    this.setData({
      priceList: list
    })
    this.forListCheck(this.data.result) // 必须调用把值存起来
  },
  // 选择经纬度
  getLnglat(){
    wx.navigateTo({
      url: "/pages/lnglat/index"
    })
  },
  // 文件上传
  afterRead(event){
    const { file } = event.detail;
    const that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/marketing/dotOssUpload', 
      filePath: file[0].path,
      name: 'file',
      // formData: { user: 'test' },
      success(res) {
        const { storeImages = [] } = that.data;
        const data = JSON.parse(res.data)
        storeImages.push({ ...file, url: data.data });
        that.setData({ storeImages })
      },
      fail(err){
        that.toast('图片上传失败！')
      }
    })
  },
  afterReadReception(event){
    const { file } = event.detail;
    const that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/marketing/dotOssUpload', 
      filePath: file.path,
      name: 'file',
      // formData: { user: 'test' },
      success(res) {
        const { receptionImage = [] } = that.data;
        const data = JSON.parse(res.data)
        receptionImage.push({ ...file, url: data.data });
        that.setData({ receptionImage })
      },
      fail(err){
        that.toast('图片上传失败！')
      }
    })
  },
  afterReadHonor(event){
    const { file } = event.detail;
    const that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/marketing/dotOssUpload', 
      filePath: file.path,
      name: 'file',
      // formData: { user: 'test' },
      success(res) {
        const { honorImage = [] } = that.data;
        const data = JSON.parse(res.data)
        honorImage.push({ ...file, url: data.data });
        that.setData({ honorImage })
      },
      fail(err){
        that.toast('图片上传失败！')
      }
    })
  },
  afterReadTraffic(event){
    const { file } = event.detail;
    const that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/marketing/dotOssUpload', 
      filePath: file.path,
      name: 'file',
      // formData: { user: 'test' },
      success(res) {
        const { trafficImage = [] } = that.data;
        const data = JSON.parse(res.data)
        trafficImage.push({ ...file, url: data.data });
        that.setData({ trafficImage })
      },
      fail(err){
        that.toast('图片上传失败！')
      }
    })
  },
  afterReadBusiness(event){
    const { file } = event.detail;
    const that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/marketing/dotOssUpload', 
      filePath: file.path,
      name: 'file',
      // formData: { user: 'test' },
      success(res) {
        const { businessImage = [] } = that.data;
        const data = JSON.parse(res.data)
        businessImage.push({ ...file, url: data.data });
        that.setData({ businessImage })
      },
      fail(err){
        that.toast('图片上传失败！')
      }
    })
  },
  afterReadConstruction(event){
    const { file } = event.detail;
    const that = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: app.globalData.baseUrl + '/marketing/dotOssUpload', 
      filePath: file.path,
      name: 'file',
      // formData: { user: 'test' },
      success(res) {
        const { constructionImage = [] } = that.data;
        const data = JSON.parse(res.data)
        constructionImage.push({ ...file, url: data.data });
        that.setData({ constructionImage })
      },
      fail(err){
        that.toast('图片上传失败！')
      }
    })
  },
  // 以下是删除图片
  deleteStore(e){
    const storeImages = this.data.storeImages
    storeImages.splice(e.detail.index,1)
    // console.log(storeImages)
    this.setData({
      storeImages: storeImages
    })
  },
  deleteReception(e){
    this.setData({
      receptionImage: []
    })
  },
  deleteHonor(){
    this.setData({
      honorImage: []
    })
  },
  deleteTraffic(){
    this.setData({
      trafficImage: []
    })
  },
  deleteBusiness(){
    this.setData({
      businessImage: []
    })
  },
  deleteConstruction(){
    this.setData({
      constructionImage: []
    })
  },
  // 选择时间
  onClose() {
    this.setData({ popupShow: false });
  },
  contractTimeDate(){
    this.setData({
      popupShow: true
    })
  },
  // 确认选中日期
  onDate(event) {
    const time = formatTime(event.detail,'yyyy-mm-dd')
    this.setData({
      popupShow: false,
      ['formOne.contractTime']: time
    });
  },
  onTime2Close(){
    this.setData({
      time2Show: false
    })
  },
  onTimeClose(){
    this.setData({
      timeShow: false
    })
  },
  // 营业时间
  clickHours(){
    this.setData({
      timeShow: true
    })
  },
  clickHours2(){
    this.setData({
      time2Show: true
    })
  },
  onTimeHours(event){
    this.setData({
      timeShow: false,
      ['formOne.businessHours']: event.detail
    })
  },
  onTimeHours2(event){
    this.setData({
      time2Show: false,
      ['formOne.businessHours2']: event.detail
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
      titleCit: "请选择城市",
      titleReg: "请选择区/县",
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
  // 市数据
  apiCityList(id){
    findYuyueCityByProvinceid({provinceid: id}).then(res=>{
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
      titleReg: "请选择区/县",
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
  // 区数据
  apiAreasList(id){
    findYuyueAreasByCityid({cityid: id}).then(res=>{
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
  // 选中所属机构
  mechanismChange(e){
    this.data.mechanismList.forEach(v=>{
      if(v.value === e.detail){
        this.setData({
          titleMec: v.text
        })
      }
    })
    this.setData({
      ['formOne.mechanismId']: e.detail
    })
  },
  // 选中网点类型
  dotChange(e){
    this.data.dotList.forEach(v=>{
      if(v.value == e.detail){
        this.setData({
          titleDot: v.text
        })
      }
    })
    this.setData({
      ['formOne.dotType']: e.detail
    })
  },
// 生命周期函数--监听页面显示
  onShow: function () {
    
  },
// 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {

  },
// 页面上拉触底事件的处理函数
  onReachBottom: function () {

  },
  // 轻提示
  toast(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration: 2000
    })
  },
  // 以下是为了做双向绑定的处理事件，非常的多余，日后请改掉
  alterData1(e){
    this.setData({
      ['formOne.dotName']: e.detail.value
    })
  },
  alterData2(e){
    this.setData({
      ['formOne.dotAbbreviation']: e.detail.value
    })
  },
  alterData3(e){
    this.setData({
      ['formOne.mobile']: e.detail.value
    })
  },
  alterData4(e){
    this.setData({
      ['formOne.shopowner']: e.detail.value
    })
  },
  alterData5(e){
    this.setData({
      ['formOne.storePhone']: e.detail.value
    })
  },
  alterData6(e){
    this.setData({
      ['formOne.address']: e.detail.value
    })
  },
  alterData7(e){
    this.setData({
      ['formTwo.accountName']: e.detail.value
    })
  },
  alterData8(e){
    this.setData({
      ['formTwo.account']: e.detail.value
    })
  },
  alterData9(e){
    this.setData({
      ['formTwo.openingBank']: e.detail.value
    })
  },
})