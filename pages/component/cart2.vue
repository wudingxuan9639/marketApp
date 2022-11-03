<template>
<!--cart2.wxml-->
<form bindsubmit="submitForm">
<view class="container">
    <view class="user-mes" bindtap="enterAddressPage">
        <view class="user-contact">{{order.addressList.consignee}}{{' '}}{{order.addressList.mobile}}</view>
        <view class="location">
            <view class="address">{{order.addressList.total_address}}</view>
            <view class="pos-icon"></view>
        </view>
        <view class="border-img"><image class="wh100" src="../../../images/tt.png" /></view>
        <view class="update-logistics">
        </view>
    </view>
    <!-- 商品列表 -->
    <view class="order-meg">
        <view class="store-list" wx:for="{{order.storeShippingCartList}}" wx:key="index">
            <view class="store_name"><image src="../../../images/carnew.png"></image>{{item.store_name}}</view>
            <view class="order-detail" wx:for="{{item.cartList}}" wx:key="index">
                <view class="goods-img">
                <image class="wh100" src="{{url}}/api/goods/goodsThumImages?goods_id={{item.goods_id}}&width=100&height=100"></image>
                </view>
                <navigator class="order-cont" url="/pages/goods/goodsInfo/goodsInfo?goods_id={{item.goods_id}}">
                    <view class="goods-name ellipsis-2">{{item.goods_name}}</view>
                    <view class="goods-color ellipsis-1">{{item.spec_key_name}}</view>
                </navigator>
                <view wx:if="{{item.qitian}}" class='information1'>不支持七天无理由退货</view>
                <view wx:else class='information1'>支持七天无理由退货</view>
                <view class="order-num">
                    <view class="co-red">
                        <text class='goods_price'>￥</text>{{item.member_goods_price}}
                        <view class='goods_num'><text>x</text>{{item.goods_num}}</view>
                        
                    </view>
                </view>
            </view>
            <view class='distribution'>配送方式</view>
            <view class="set-mes">

         <view class="use-item selfsubmit" wx:if="{{item.cartList[0]['goods']['is_virtual'] !=2}}">
            <radio-group class="radio-group" bindchange="radioChange">
                <block wx:for="{{items}}">
                    <label class="radio" >
                        <view>
                        <text style='margin-top:10rpx;display:inline-block;'>{{item.name}}</text>        
                            <radio value="{{index}}" color="#ff3b3b" checked="{{item.checked}}"/>
                        </view>
                    </label>
                  <view class="selfsubmit-view line"><text>{{item.value}}</text></view>
                </block>
            </radio-group>
        </view>

         <view class="use-item set-item line"  wx:if="{{item.cartList[0]['goods']['is_virtual'] !=2 && submit}}">
            <view>自提时间</view>
            <view catchtap='showdate' style='width:376rpx;'>
                <text>{{checkTime}}{{submit_datas.submit_text}}</text>                  
                <image class="arrow-rigth"src="../../../images/icon-arrowdown2.png"></image>
            </view>
        </view>

         <view class="use-item set-item line" catchtap='getSubmitAddress'   wx:if="{{item.cartList[0]['goods']['is_virtual'] !=2 && submit}}">
            <view>自提地点</view>
             <text style='padding-right:40rpx'>{{submit_datas.submit_address}}</text>
        <image class="arrow-rigth"src="../../../images/icon-arrowdown2.png"></image>

        </view>

                <view class="set-item line" bindtap="useCoupon" data-idx='{{index}}'>
                    <view class="coupon">
                        <view>优惠券</view>
                        <view class="coupon-num">{{order.couponNum[item.store_id] ? order.couponNum[item.store_id] : 0}}张可用</view>
                    </view>
                    <view class="set-btn">
                        <view wx:if="{{order.couponNum[item.store_id] ? order.couponNum[item.store_id] : 0}}">{{item.useCouponListId?item.useCouponName:'未使用'}}</view>
                         <view wx:else>无可用</view>
                        <image class="arrow-rigth" src="../../../images/icon-arrowdown2.png"></image>
                    </view>
                </view>
                 <view bindtap="showInvoice" class="set-item line">
                    <view class="coupon">
                        <view>发票信息</view>
                    </view>
                     <view class="set-btn">
                         <view>{{text}}</view>
                        <image class="arrow-rigth" src="../../../images/icon-arrowdown2.png"></image>
                    </view>
                 </view>
                    
                <view class="set-item">
                     <view>备注</view>
                     <textarea hidden="{{!show1}}" name="user_note{{item.store_id}}" class="word-box" maxlength="30" placeholder-style='color:#999;' placeholder="选填：对本次交易的说明" bindinput="keyUpChangeNum"/>
                </view>
            </view>
        </view>
    </view>
    <!-- 使用其他支付 -->
    <view class="set-mes">
        <view wx:if="{{order.store_prom}}">
            <icon type="info" size="16" color="#ff3b3b"/>{{order.store_prom}}
        </view>
        <view class="use-item line">
            <view>使用积分</view>
            <view class='jf' style=''>可用积分：{{order.userInfo.pay_points}}({{rate}}积分兑换1元)</view>
            <radio class="use-points" bindtap='usePoints' checked="{{formData.pay_points}}" ></radio>
        </view>
        <view bindtap='coupons' class="use-item">
            <view>优惠劵码</view>
            <image class="arrow-rigth" src="../../../images/icon-arrowdown2.png"></image>
        </view>
    
        <view class="use-item" style="display:{{payWithUserMoney&&payWithPoints?'none':'flex'}}">
            <view>支付密码 : </view>
            <input type="text" name="paypwd" password placeholder="请输入密码" maxlength="20"/>
        </view>
    </view>
    <!-- 价格栏 -->
    <view class="information">
        <view class="item">
            <view>商品总额</view>
            <view class="co-red">￥{{order.storeCartTotalPrice}}元</view>  
        </view>
        <view wx:if="{{orderPrices.shipping_price}}" class="item">
            <view>配送费用</view>
            <view class="co-red">￥{{orderPrices.shipping_price}}元</view>
        </view>
        <view wx:else class="item">
            <view>配送费用</view>
            <view class="co-red">包邮</view>
        </view>
        <view wx:if="{{orderPrices.coupon_price}}" class="item">
            <view>使用优惠券</view>
            <view class="co-red">-￥{{orderPrices.coupon_price}}元</view>  
        </view>
        <view wx:if="{{orderPrices.integral_money}}" class="item">
            <view>使用积分</view>
            <view class="co-red">-￥ {{orderPrices.integral_money}}元</view>  
        </view>
        <view wx:if="{{orderPrices.user_money}}" class="item">
            <view>使用余额</view>
            <view class="co-red">-￥ {{orderPrices.user_money}}元</view>  
        </view>
        <view wx:if="{{orderPrices.order_prom_amount}}" class="item">
            <view>优惠活动</view>
            <view class="co-red">-￥ {{orderPrices.order_prom_amount}}元</view>  
        </view>
    </view>
    <view class="btn-wrap">  
        <button form-type="submit" class="tips-btn" id='submitOrder'>提交订单</button>
        <view class="pay-amount">
            <view class="payable">合计：</view><view class="co-red">￥{{orderPrices.order_amount}}元</view>  
        </view>
        <view wx:for="{{order.storeShippingCartList}}" class='num'>共 {{order.storeShippingCartList[0].cartList[0].goods_num}} 件商品</view>
    </view>
</view>
 <view class='show1 coupons' hidden="{{show1}}">
    <view>
         <view class='use'>优惠券码
            <view bindtap='close_coupons'>
                <image src='../../../images/close.png'></image>
            </view>
        </view>
        <view class='input'>
            输入优惠券码 :
             <input bindinput='inputCouponCode' value="{{couponCode}}"  /> 
        </view>
        <button bindtap='addCouponCode' >确定</button>
    </view> 
</view>
</form>
</template>

<script>
import { render } from "vue";
var app = getApp();
var request = app.request;
var common = require('../../../utils/common.js');
var util = require('../../../utils/util.js');
var md5 = require('../../../utils/md5.js');
const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []
var thisMon = date.getMonth();
var thisDay = date.getDate() + 1;
var thisHours = date.getHours();
var thisMinutes = date.getMinutes();
for (let i = 2017; i <= date.getFullYear() + 1; i++) {
  years.push(i)
}
for (let i = date.getMonth(); i <= 11; i++) {
  var k = i;
  if (0 <= i && i < 9) {
    k = "0" + (i + 1);
  } else {
    k = (i + 1);
  }
  months.push(k)
}
if (0 <= thisMon && thisMon < 9) {
  thisMon = "0" + (thisMon + 1);
} else {
  thisMon = (thisMon + 1);
}
if (0 <= thisDay && thisDay < 10) {
  thisDay = "0" + thisDay;
}

if (thisMinutes < 10) {
  thisMinutes = "0" + thisMinutes;
}

var totalDay = mGetDate(date.getFullYear(), thisMon);
for (let i = 1; i <= 31; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i
  }
  days.push(k)
}

for (let i = 0; i <= 23; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i
  }
  hours.push(k)
}
for (let i = 0; i <= 59; i++) {
  var k = i;
  if (0 <= i && i < 10) {
    k = "0" + i
  }
  minutes.push(k)
}

function mGetDate(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

setup() {
  data: {
    rate: "",
    url: app.globalData.setting.url,
    resourceUrl: app.globalData.setting.resourceUrl,
    goods: null, //立即购买商品参数
    order: null, //请求的订单数据
    orderPrices: null, //请求的订单价格数据
    payWithUserMoney: true, //是否使用余额支付
    payWithPoints: true, //是否使用积分支付
    maxWord: 0,
    enterAddressPage: false,
    firstEnter: true, //是否第一次进入页面
    storeClick: 0, //点击哪家店(下标)
    couponCode: '', //优惠券码
    invoice_desc: '不开发票',
    text: '不开发票',
    items: [{
        name: '快速配送',
        value: '工作日、双休日与节假日均可送货',
        checked: 'true',
    }, ],
    invoice: {
      is_use: false, //是否开发票
      is_person: true, //是否是个人
      contents: ['明细', '耗材', '办公用品', '电脑配件', '食品酒水', '服饰鞋帽', '日用品', '电器数码', '家具建材', '钟表珠宝', '日化用品'],
      content_idx: 0, //发票内容下标
    },
    formData: {
      invoice_title: '',
      pay_points: '',
      user_money: '',
      paypwd: '',
      user_note: '',
    },
    submit: false,
    submit_heigth_css: 240,
    submit_datas: {
      shop_id: '', //自提id
      submit_text: '', //页面展示自提时间
      submit_address: '', //页面展示自提地点
      name: '', //自提人
      mobile: '', //自提联系方式
      time: '', //自提时间
    },
    weekDay: ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    checkTime: date.getFullYear() + "-" + thisMon + "-" + thisDay + " " + thisHours + ":" + thisMinutes,
    //---时间控件参数
    flag: true,
    is_set: false,
    selected: 0,
    years: years,
    year: date.getFullYear(),
    months: months,
    month: thisMon,
    days: days,
    day: thisDay,
    value: [1, 0, thisDay - 1, thisHours, thisMinutes],
    hours: hours,
    hour: thisHours,
    minutes: minutes,
    minute: thisMinutes,
    show1:true,          //优惠券码弹出控制
    click_use_points:false,//是否是点击使用积分按钮
  },

  onLoad: function(options) {
    var that = this;
    var date = this.data.year + "/" + this.data.month + "/" + this.data.day;
    var d = new Date(date);
    var weekDay = this.data.weekDay;
    var day = weekDay[d.getDay()];

    this.setData({
      goods: options,
      'submit_datas.submit_text': ' 【' + day + '】',
      'submit_datas.time': this.data.year + '-' + this.data.month + '-' + this.data.day + ' ' + this.data.hour + ':' + this.data.minute
    });
    app.getConfig(function (config) {
      that.setData({
        order: that.data.order,
        rate: config.config[9].value
      });
    });
    console.log(app.globalData.config)
    that.requestCart2(0);
    that.requestInvoice();
  },

  //重新加载数据
  onShow: function() {
    var that = this
    setTimeout(function(){
      console.log(that.data.order.storeShippingCartList)
    },2000)
    app.getConfig(function (config) {
      that.setData({
        order: that.data.order,
        rate: config.config[9].value
      });
    });
    if (this.data.enterAddressPage) {
      this.data.enterAddressPage = false;
      var addressId = wx.getStorageSync('cart:cart2:address_id');
      if (addressId !== '') {
        wx.removeStorageSync('cart:cart2:address_id');
      } else {
        addressId = (!this.data.order || this.data.order.addressList == null) ? 0 : this.data.order.addressList.address_id;
      }
      this.requestCart2(addressId); //改变地址要重新请求数据
    } else if (!this.data.firstEnter && this.checkAddressList()) {
      var conponUse = wx.getStorageSync('cart:cart2:cid');
      if (conponUse !== '') {
        wx.removeStorageSync('cart:cart2:cid');
        var stores = this.data.order.storeShippingCartList;
        for (var i = 0; i < stores.length; i++) {
          if (stores[i].store_id == conponUse.storeId) {
            stores[i].useCouponListId = conponUse.useCouponListId;
            stores[i].useCouponName = conponUse.useCouponName;
            this.setData({
              'order.storeShippingCartList': stores
            });
            this.calculatePrice();
            break;
          }
        }
      }
    }
    this.data.firstEnter = false;
  },

  requestCart2: function(addressId) {
    var that = this;
    var data;
    console.log(addressId)
    console.log(this.data.goods)
    if (this.data.goods.action) { //商品立即购买跳转
      data = {
        address_id: addressId,
        store_id: this.data.store_id,
        goods_id: this.data.goods.goods_id,
        item_id: this.data.goods.item_id,
        goods_num: this.data.goods.goods_num,
        action: this.data.goods.action,
      };
    } else { //商品购物车跳转
      data = {
        store_id: that.data.goods.store_id,
        address_id: addressId,
      };
    }
    request.get('/api/cart/cart2', {
      failRollback: true,
      data: data,
      success: function(res) {
        var order = res.data.result;
        that.setData({
          order: order
        });
        if (that.checkAddressList()) {
          that.getShopList();
          that.calculatePrice();
        }
      },
      failStatus: function(res) {
        if (res.data.status == 0) {
          wx.showModal({
            title: res.data.msg,
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          });
        } else if (res.data.status == -11) {
          that.setData({
            order: null
          });
          that.checkAddressList();
        }
      }
    });
  },

  /** 检查是否已经选了地址 */
  checkAddressList: function() {
    var that = this;
    if (!this.data.order || this.data.order.addressList == null) {
      wx.showModal({
        title: '请先填写或选择收货地址~',
        success: function(res) {
          if (res.confirm) {
            that.enterAddressPage();
          } else {
            wx.navigateBack();
          }
        },
        fail: function() {
          wx.navigateBack();
        }
      });
      return false;
    }
    return true;
  },

  /** 显示发票信息 */
  setInvoice: function(e) {
    this.setData({
      'invoice.is_use': e.detail.value
    });
  },
    /** 发票 */
    requestInvoice: function () {
        var that = this;
        request.get('/api/cart/invoice', {
            failRollback: false,
            successReload: true,
            success: function (res) {
                if (res.data.result.invoice_title) {
                    var text = res.data.result.invoice_desc == '不开发票' ? '不开发票' : '纸质 ( ' + res.data.result.invoice_title + '-' + res.data.result.invoice_desc + ' )';
                    that.setData({
                        text: text,
                        invoice_title: res.data.result.invoice_title,
                        invoice_desc: res.data.result.invoice_desc,
                        taxpayer: res.data.result.taxpayer,
                    })
                }
            }
        });
    },
  isPersonChange: function(e) {
    if (e.detail.value == 'person') {} else {}
    this.setData({
      'invoice.is_person': e.detail.value == 'person'
    });
  },

  selectInvoiceContent: function(e) {
    this.setData({
      'invoice.content_idx': e.detail.value
    })
  },

  getInvoiceData: function(form) {
    var invoice = this.data.invoice;
    if (!invoice.is_use) {
      return {};
    }
    return {
      invoice_title: invoice.is_person ? '个人' : form.invoice_title,
      taxpayer: invoice.is_person ? '' : form.taxpayer,
      invoice_desc: invoice.contents[invoice.content_idx],
    };
  },

  keyUpChangePay1: function(e) {
    this.setData({
      payWithUserMoney: e.detail.value.length > 0 ? false : true
    });
  },

  keyUpChangePay2: function(e) {
    this.setData({
      payWithPoints: e.detail.value.length > 0 ? false : true
    });
  },

  keyUpChangeNum: function(e) {
    this.setData({
      maxWord: e.detail.value.length
    });
  },

  /** 请求计算价格，无入参则使用已保存的参数 */
  calculatePrice: function(formData, submitOrder) {
    var that = this;
    if (typeof formData == 'undefined' || formData=='') {
      formData = that.data.formData;
    } else {
      that.data.formData = formData;
    }
    var storeData = {
      user_note: {},
      coupon_id: {},
    };
    var stores = that.data.order.storeShippingCartList;
    for (var i = 0; i < stores.length; i++) {
      var s = stores[i];
      storeData.user_note[s.store_id] = formData['user_note' + s.store_id];
      storeData.coupon_id[s.store_id] = s.useCouponListId ? s.useCouponListId : '0';
    }
    var pwd = formData.paypwd ? md5('TPSHOP' + formData.paypwd) : '';
    var postData;
    var submitTime = '';
    if (this.data.submit_datas.time != '') {
      submitTime = this.data.submit_datas.time.replace(/-/g, '/');
      submitTime = Date.parse(new Date(submitTime)) / 1000
    }

    if (this.data.goods.action) {
      postData = {
        store_id: that.data.goods.store_id,
        address_id: that.data.order.addressList.address_id,
        invoice_title: formData.invoice_title ? formData.invoice_title : '',
        invoice_desc: that.data.invoice_desc ? that.data.invoice_desc : '',
        pay_points: formData.pay_points ? formData.pay_points : 0,
        user_money: formData.user_money ? formData.user_money : 0,
        pwd: pwd,
        pay_pwd: pwd,
        act: submitOrder ? 'submit_order' : 'order_price',
        cart_form_data: escape(JSON.stringify(storeData)),
        goods_id: this.data.goods.goods_id,
        item_id: this.data.goods.item_id,
        goods_num: this.data.goods.goods_num,
        action: this.data.goods.action,
        shop_id: this.data.submit ? this.data.submit_datas.shop_id : '',
        consignee: this.data.submit ? this.data.submit_datas.name : '',
        mobile: this.data.submit ? this.data.submit_datas.mobile : '',
        take_time: submitTime,
      };
    } else {
      postData = {
        store_id: that.data.goods.store_id,
        address_id: that.data.order.addressList.address_id,
        invoice_title: formData.invoice_title ? formData.invoice_title : '',
        invoice_desc: that.data.invoice_desc ? that.data.invoice_desc : '',
        pay_points: formData.pay_points ? formData.pay_points : 0,
        user_money: formData.user_money ? formData.user_money : 0,
        pwd: pwd,
        pay_pwd: pwd,
        act: submitOrder ? 'submit_order' : 'order_price',
        cart_form_data: escape(JSON.stringify(storeData)),
        shop_id: this.data.submit ? this.data.submit_datas.shop_id : '',
        consignee: this.data.submit ? this.data.submit_datas.name : '',
        mobile: this.data.submit ? this.data.submit_datas.mobile : '',
        store_id: this.data.goods.store_id ? this.data.goods.store_id : 0,
        take_time: submitTime,
      };
    }

    postData = Object.assign(postData, that.getInvoiceData(formData));
    request.post('/api/cart/cart3', {
      data: postData,
      success: function(res) {
        if (!submitOrder) {
          that.setData({
            orderPrices: res.data.result
          });
          return;
        }
        if (that.data.orderPrices.order_amount <= 0) {
          wx.setStorageSync('order:order_list:update', true);
          wx.redirectTo({
            url: '/pages/payment/payment/payment?master_order_sn=' + res.data.result + '&order_amount=' + that.data.orderPrices.total_amount
          });
          return;
        }
        common.jumpToCart4({
          master_order_sn: res.data.result
        }, 1);
      },
      failStatus: function (res) {
        if (that.data.click_use_points == true) {
          that.setData({
            "formData.pay_points": 0, 'click_use_points': false
          });
        }
      }
    });
  },

  /** 提交订单 */
  submitForm: function(e) {
    var submitOrder = (e.detail.target.id == 'submitOrder') ? true : false;
    this.calculatePrice('', submitOrder);
  },

  /** 使用优惠券 */
  useCoupon: function(e) {
    var store = this.data.order.storeShippingCartList[e.currentTarget.dataset.idx];
    var num = this.data.order.couponNum[store.store_id] ? this.data.order.couponNum[store.store_id] : 0;
    if (num <= 0) {
      return app.showWarning("无可用优惠券");
    }
    var params;
    if (this.data.goods.action) {
      params = {
        lid: store.useCouponListId,
        store_id: store.store_id,
        money: store.store_total_price,
        goods_id: this.data.goods.goods_id,
        item_id: this.data.goods.item_id,
        goods_num: this.data.goods.goods_num,
        action: this.data.goods.action,
      }
    } else {
      params = {
        lid: store.useCouponListId,
        store_id: store.store_id,
        money: store.store_total_price,
      }
    }
    wx.navigateTo({
      url: '/pages/user/checkcoupon/checkcoupon?' + util.Obj2Str(params)
    });
  },
  enterAddressPage: function() {
    this.data.enterAddressPage = true;
    wx.navigateTo({
      url: '/pages/user/address_list/address_list?operate=select'
    });
  },
  inputCouponCode: function(e) {
    this.data.couponCode = e.detail.value;
  },
  addCouponCode: function() {
    var that = this;
    request.post('/api/cart/coupon_exchange', {
      data: {
        coupon_code: this.data.couponCode
      },
      success: function(res) {
        that.requestCart2(that.data.order.addressList.address_id);
        app.confirmBox('兑换成功，限用于' + res.data.result.coupon.limit_store);
      }
    });
  },


  //判断获取预约门店还是获取自提点
  getShopList: function() {
    var that = this;
    wx.authorize({
      scope: 'scope.userLocation',
      success: function(res) {
        wx.getLocation({
          type: 'wgs84',
          success(res2) {
            that.data.order.storeShippingCartList[0]['cartList'][0]['goods']['is_virtual'] == 2 ? that.requestShopList(res2) : that.getSubmitAddressDatas(res2);

          }
        })
      }
    })
  },
  getSubmitAddressDatas: function(res) {
    var that = this;
    var datas = that.data.order.addressList
    request.post('/Home/Api/shop', {
      data: {
        province_id: datas.province,
        store_id: that.data.goods.store_id,
        city_id: datas.city,
        district_id: datas.district,
        shop_address: '', //datas.address
        longitude: res.longitude,
        latitude: res.latitude
      },
      successReload: true,
      success: function(res) {
        var data = res.data.result ? res.data.result : res.data;
        if (data.length > 0) {
          var items = [{
            name: '快速配送',
            value: '工作日、双休日与节假日均可送货',
            checked: 'true'
          }, {
            name: '上门自提',
            value: '选择自提上门点并支付订单>收到提货短信>到自提点提货'
          }]
          that.setData({
            items: items,
            'submit_datas.shop_id': data[0].shop_id,
            'submit_datas.submit_address': data[0].shop_name,
            'submit_datas.name': datas.consignee,
            'submit_datas.mobile': datas.mobile,
            submit_heigth_css: 240
          })
        } else {
          that.setData({
            items: [{
              name: '快速配送',
              value: '工作日、双休日与节假日均可送货',
              checked: 'true'
            }],
            submit_heigth_css: 120,
            submit: false
          })
        }
      }
    });
  },
  radioChange: function(e) {
    if (parseInt(e.detail.value) == 1) {
      this.setData({
        submit: true
      })
      this.calculatePrice();
    } else {
      this.setData({
        submit: false,
        //'submit_datas.shop_id':''
      })
      this.calculatePrice();
    }
  },
  //使用积分
  usePoints:function(){
    let formPoints = this.data.formData.pay_points;
    if (formPoints>0){//取消使用积分
      this.setData({ 'formData.pay_points': 0,'click_use_points':true})
    }else{
      this.setData({ 'formData.pay_points': this.data.order.userInfo.pay_points, 'click_use_points': true })
    }
    this.calculatePrice();
  },

  showdate: function() {
    this.setData({
      flag: false
    })
  },
  getSubmitAddress() {
    wx.navigateTo({
      url: "../../cart/submit_address/submit_address?store_id=" + this.data.goods.store_id + "&selected=" + this.data.selected + '&datas=' + JSON.stringify(this.data.order.addressList),
    })
  },
  /** 日期插件s */
  showModel: function(e) {
    this.setData({
      flag: false
    });
  },
  getTime: function(e) {
    var times = this.data.year + "-" + this.data.month + "-" + this.data.day
    var date_time_picker_mask = times;
    var date = date_time_picker_mask.replace(/-/g, '/');
    var d = new Date(date);

    var weekDay = this.data.weekDay;
    var day = weekDay[d.getDay()];

    this.setData({
      flag: true,
      checkTime: times + " " + this.data.hour + ":" + this.data.minute,
      'submit_datas.submit_text': ' 【' + day + '】',
      'submit_datas.time': times + " " + this.data.hour + ":" + this.data.minute,
    });

  },
  bindChange: function(e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      hour: this.data.hours[val[3]],
      minute: this.data.minutes[val[4]],
    })
    var totalDay = mGetDate(this.data.year, this.data.month);
    var changeDate = [];
    for (let i = 1; i <= totalDay; i++) {
      var k = i;
      if (0 <= i && i < 10) {
        k = "0" + i
      }
      changeDate.push(k)
    }
    this.setData({
      days: changeDate
    })
  },
  /** 日期插件e */
//   使用优惠券码
    coupons:function(e){
        this.setData({
            show1:false,
        })
    },
    close_coupons:function(e){
        this.setData({
            show1: true,
        })
    },
     /** 显示发票信息 */
    showInvoice:function(){
        wx.navigateTo({
            url: '../../cart/invoice/invoice',
        })
    }
	
	return{
		
	};
}
</script>

<style lang="scss" scoped>
/* cart2.wxss */
.container {
   padding-bottom: 100rpx;
   border-top:2rpx solid #f3f3f3;
   overflow-x: hidden;
}
.user-mes{
    position: relative;
    background-color: #fff;
    font-size: 32rpx;
    color: #333;
    padding-top: 24rpx;
}
.user-contact{
    padding: 0 60rpx 24rpx 30rpx;
    color:#333333;
    font-size:30rpx;
    font-weight:500;
}
.location{
    position: relative;
    padding:0 60rpx 26rpx 30rpx;
}
.location .address{
    color: #999999;
    font-size: 26rpx;
    line-height: 40rpx;
    height:40rpx;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.pos-icon{
    position: absolute;
    left: 28rpx;
    top: 4rpx;
    width: 23rpx;
    height: 29rpx;
}
.border-img{
    width: 100%;
    height: 8rpx;
    font-size: 0;
}
.update-logistics{
    position:absolute;
    right:30rpx;
    top:40rpx;
    width:18rpx;
    height:18rpx;
    display:flex;
    align-items:center;
    justify-content:center;
    border-top:3rpx solid #B9B9B9;
    border-right:3rpx solid #B9B9B9;
    transform:rotate(45deg);
}
.update-logistics .arrow-rigth{
    top: 0;
}
.order-meg{
    font-size: 28rpx;
    margin-top: 10rpx;
}
.order-detail{
    padding: 25rpx 0;
    color: #999;
    height: 180rpx;
    position:relative;
    background: #ffffff;
}
.goods-img{
    float: left;
    width: 180rpx;
    height: 180rpx;
    margin:0 30rpx 0 25rpx;
}
.order-cont{
    float: left;
    width: 490rpx;
}
.goods-name{
    overflow: hidden;
    margin-bottom: 10rpx;
    color:#1d1d1d;
    font-size:26rpx;
    -webkit-line-clamp:1;
}
.goods-color{
    font-size: 22rpx;
}
.information1{
    font-size: 22rpx;
    color: #f48a00;
    position:absolute;
    left:230rpx;
    bottom:70rpx;
}
.order-num{
    position:absolute;
    left:230rpx;
    bottom:0;
    width:484rpx;
    font-size:30rpx;
    font-weight:600;
    color:#ff3b3b;
    padding-bottom:24rpx;
}
.order-num .goods_price{
    font-size:22rpx;
}
.order-num .goods_num{
    float:right;
    color:#333333;
    font-size:30rpx;
    font-weight:500;
}
.order-num .goods_num text{
    font-size:26rpx;
}
.distribution{
  width: 750rpx;
	height: 86rpx;
  line-height: 86rpx; 
  color: #666;
  font-size: 30rpx;
  padding-left:25rpx;
	background-color: #ffffff;
  border-bottom: 1px solid #f3f3f3;
  margin-top: 10rpx;
}
.set-mes{
    background-color: #fff;
    padding: 0 25rpx;
    font-size: 26rpx;
    color: #262626;
}
.selfsubmit{
    width:100%;
    height:auto !important;
    padding-top:16rpx;
}
.set-mes>view{
    display: flex;
    align-items: center;
    height: 106rpx;
    position:relative;
}
.use-item .jf{
    color:#666;
    font-size:26rpx;
    float:right;
    position:absolute;
    right:85rpx;

}
.set-item{ 
    justify-content: space-between; 
    font-size: 26rpx; 
    position: relative;
    padding-right: 40rpx;
}
.use-item.set-item{
    padding-right: 0;
}
.store-list .set-item .set-btn{
    width: auto;
}
.invoice{
    padding-right: 0
}
.set-btn{
    display: flex;
    font-size: 24rpx;
    width: 110rpx;
}
.set-mes input{
    width: 380rpx;
    height: 50rpx;
    line-height: 50rpx;
    border:1px solid #f3f3f3;
}
.line{
    border-bottom:2rpx solid #f3f3f3;
}
.show1{
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.7);
    position:fixed;
    top:0;
    bottom:0;
    z-index: 999;
}
.show1>view{
    position:fixed;
    width:750rpx;
    height: 765rpx;
    padding-top: 35rpx;
    bottom:0;
    background:#fff;
    z-index:9;
}
.show1 .use{
    color: #1f1f1f;
    text-align: center;
    font-size: 30rpx;
}
.show1 .use view{
    color:#999;
    font-size:15px;
    float:right;
    margin-right:30rpx;
}
.show1 .use image{
    width:22rpx;
    height:22rpx;
}
.show1 button{
    width: 690rpx;
    height: 66rpx;
    line-height: 66rpx;
    color: #fff;
    margin-left: 30rpx;
    font-size: 26rpx;
    background-color: #ff3b3b;
    text-align: center;
    border-radius:50rpx;
    position: absolute;
    bottom: 106rpx;
}
.show1 input{
    width: 606rpx;
    height: 80rpx;
    margin-top: 28rpx;
    border: 1px solid #f3f3f3;    
    border-radius:50rpx;
    padding:0 20px;
}
.use-btn{
    width: 40rpx;
    height: 40rpx;
    border-radius:50%;
    margin-left: 20rpx;
    line-height: 50rpx;
    text-align: center;
      border:1px solid #f3f3f3;
    color: #fff;
}
.coupon-num{
    height: 36rpx;
    margin-left: 20rpx;
    padding: 0 16rpx;
    line-height: 36rpx;
    text-align: center;
    background-color: #ff3b3b;
    color: #fff;
    font-size: 24rpx;
}
.set-item .word-box{
    position:absolute;
    left:80rpx;
    top:40rpx;
    text-align: right;
    z-index:1;
}
.word-box{
    width: 620rpx;
    height: 40rpx;
    line-height: 40rpx;
}
.information{
    padding:10rpx 25rpx 20rpx;
    background-color: #fff;
    margin-top: 10rpx;
}
.information .item{
    display: flex;
    justify-content: space-between;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 26rpx;
    color: #202020;
}
.information .item .co-red{
    color:ff2c2c;
    font-weight: 600;
}
.btn-wrap{
    height:98rpx;
    background-color:#fff;
    border-top:solid 1px #f3f3f3;
    position:fixed;
    bottom:0;
    width:100%;
    z-index: 100;
}
.remark{
  display: block;
}
.btn-wrap .num{
    color:#252525;
    font-size:26rpx;
    float:left;
    padding-left:25rpx;
    display:flex;
    align-items:center;
    height:98rpx;
}
.tips-btn{
    float:right;
    width:215rpx;
    height:100rpx;
    line-height:100rpx;
    text-align:center;
    font-size:30rpx;
    background-color:#ff4949;
    color:#f7f8f8;
}
.pay-amount{
    float: right;
    display: flex;
    align-items: center;
    height: 100rpx;
    font-size: 30rpx;
    margin-right: 40rpx;
}
.pay-amount .co-red{
    font-weight:600;
    color: #ff3b3b;
}
.payable{
    color: #1e1e1e;
}
/* 物流列表弹框 */
.shipping-modal{
    z-index: 20;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: hidden;
    color: #666666;
    background-color: white;
}
.shipping-nav{
    text-align: center;
    font-size: 35rpx;
    padding-top: 30rpx;
}
.shipping-list{
    padding: 20rpx 30rpx 40rpx;
    font-size: 28rpx;
}
.shipping-item{
    display: block;
    padding: 20rpx 0;
}
.shipping-btn{
    width: 100%;
    color: white;
    background-color: #ff3b3b;
    line-height: 90rpx;
    text-align: center;
    font-size: 40rpx;
}
.store-list{
    margin-bottom: 10rpx;
}
.store-mes{
    height: 34rpx;
    padding: 33rpx 20rpx;
    display: flex;
}
.coupon{
    display: flex;
}
.totle-weight{
    padding-right: 20rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: right;
}
.invoice-wrap{
    margin-top: 20rpx;
    margin-bottom:0rpx;
}
.store-ico{
    height: 34rpx;
    width: 34rpx;
    margin-right: 20rpx;
}

switch .wx-switch-input{
    height: 42rpx;
    border-radius: 4rpx;
}
switch .wx-switch-input::before,switch .wx-switch-input::after{
    height: 40rpx;
    border-radius: 4rpx;
}



.selfsubmit radio{
    float:right;
    transform:scale(0.85);
}
.selfsubmit-view{
  margin-top: 20rpx;
  padding-bottom:30rpx;
  margin-bottom: 10rpx;
  font-size: 24rpx;
  color: #999;
}
.selfsubmit-view text{
    color:#999;
}
.radio-group{
    width:100%;
    font-size: 26rpx;
    color:#262626;
}
.arrow-rigth{
    width: 14rpx;
    height: 25rpx; 
    position:absolute;
    right:0;
    top:42rpx;
}
.use-points{
  width:48rpx;
  position:absolute;
  right:0;
}



/** 日期插件s */

.kouviewList{
    background-color: #F7F7F7;
}
.kouview{
  height:170px;
    margin-top:5px;
 
}
.kouviews{
  height:150px;
    margin-top:5px;
 
}
.time-title{
  float:left;width:20%;text-align:center;color:#45BCE8
}
.picker-text{
  text-align:center;
}
/** 日期插件e */
/* 优惠券码弹窗 */
.coupons .input{
    color: #333333;
    font-size:26rpx;
    margin-left:30rpx;
    margin-top:95rpx;
}
.store_name{
  height: 82rpx;
  border-bottom: 1rpx solid #f3f3f3;
  padding: 0 20rpx;
  line-height: 82rpx;
  background: #fff;
  color: #666;
}
.store_name image{
  width: 32rpx;
  height: 32rpx;
  transform: translate(0,6rpx);
  margin-right: 5rpx;
}
</style>