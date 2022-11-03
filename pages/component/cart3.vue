<template>
<view class="order-list pd-bg-fff">
  <view class="order-price">
    <view>订单金额</view>
    <view class="co-red">￥{{order.order_amount}}</view>
  </view>
  <view class="order-id">
    <view>订单编号</view>
    <view class="id">{{order.master_order_sn ? order.master_order_sn : order.order_sn}}</view>
  </view>
</view>
<view class="pay-way pd-bg-fff">
  <view class="title">支付方式</view>

  <view class="pay-item" wx:for="{{pay_method}}" data-method="{{item.method}}" bindtap="checkPayWay">
     <label >
        <view>                          
            <radio class='ico-check' value="{{index}}" data-code="{{item.pay_code}}" checked="{{item.method==checkMethod}}"/>
        </view>
    </label>
    <view class="pay-img">
      <image class="wh100" src="{{item.img}}"></image>
    </view>
    <view style="display: flex;">
        <view>{{item.name}}</view>
        <view class="balace" wx:if="{{index == 0}}">( 余额：¥ {{userInfo.user_money}} )</view>
    </view>
  </view>
  <view class="pay-now" bindtap="payment">立即支付</view>
</view>
<!-- 输入密码弹窗 -->
<view class='show1' hidden="{{!isShowBalanceBox}}">
  <view>
    <view class='use'>输入支付密码
      <view class='close' bindtap='close_coupons'>
          <image src='../../../images/close.png'></image>
      </view>
    </view>
    <view class='bot'>
      <input unselectable="on" color="#fff" class='input' cursor-spacing="56" bindinput='getBalancePwd' confirm-hold="true" maxlength="6" value="{{balance_pwd}}"  type='number' auto-focus focus="{{focus}}"/>
      <view class='password'>
         <input value='{{input[0]}}' type='password' maxlength="1" readonly="" />
         <input value='{{input[1]}}' type='password' maxlength="1" readonly="" />
         <input value='{{input[2]}}' type='password' maxlength="1" readonly="" />
         <input value='{{input[3]}}' type='password' maxlength="1" readonly="" />
         <input value='{{input[4]}}' type='password' maxlength="1" readonly="" />
         <input value='{{input[5]}}' type='password' maxlength="1" readonly="" style='border-right:none;'/>
      </view>
    </view>
    <navigator class="forget" url="/pages/user/userinfo/userinfo">忘记密码？</navigator>
  </view>
</view>
</template>

<script>
var app = getApp();
var request = app.request;
var pay = require('../../../utils/pay.js');
var util = require('../../../utils/util.js');
var md5 = require('../../../utils/md5.js');

export default{
	setup() {
	  data: {
	    url: app.globalData.setting.url,
	    resourceUrl: app.globalData.setting.resourceUrl,
	    order: {},
	      userInfo: {
	          user_money: 0
	      },
	      pay_type: [
	          { 'name': '余额支付', 'checked': true, 'logo': '../../../images/balace_pay.png', 'pay_code': '' },
	          { 'name': '微信支付', 'checked': false, 'logo': '../../../images/wx-pay.png', 'pay_code': '' }
	      ],
	    pay_method: [{
	      'name': '余额支付',
	      'checked': true,
	      'method': 'balance_pay',
	      'img': '../../../images/balance.png',
	      'pay_code': ''
	    }, {
	      'name': '微信支付',
	      'method': 'wx_pay',
	      'checked': false,
	      'img': '../../../images/wx-pay.png',
	        'pay_code': ''
	    }], //支付方式列表
	    checkMethod: 'wx_pay', //当前选中的支付方式，默认为余额支付
	    balance_pwd: '', //余额支付密码
	    isShowBalanceBox: false, //是否显示余额密码框
	    focus: false,            //是否获得焦点
	    input:['','','','','','']              //6个密码框的值
	  },
	  onLoad: function(options) {
	      app.getUserInfo(function (userInfo) {
	          that.setData({ userInfo: userInfo });
	      }, true, false); 
	    var that = this;
	    if (!options.master_order_sn || options.master_order_sn=='undefined') {
	      options.master_order_sn = 0
	    }
	    if (!options.order_sn || options.order_sn == 'undefined') {
	      options.order_sn = 0
	    }
	    this.data.order.is_virtual = options.is_virtual;
	    if (options.master_order_sn) {
	      request.get('/api/cart/cart4', {
	        data: {
	          master_order_sn: options.master_order_sn
	        },
	        failRollback: true,
	        success: function(res) {
	          var order_amount = res.data.result;
	          if (parseFloat(order_amount) < 0.01) {
	            that.jumpSuccess();
	          }
	          that.setData({
	            order: {
	              master_order_sn: options.master_order_sn,
	              //order_sn: options.master_order_sn,
	              order_sn: options.order_sn,
	              order_amount: order_amount
	            }
	          });
	        }
	      });
	    } else {
	      if (parseFloat(options.order_amount) < 0.01) {
	        this.jumpSuccess();
	      }
	      this.setData({
	        order: options
	      });
	    }
	  },
	  checkPayWay: function(e) {
	    this.setData({
	      checkMethod: e.currentTarget.dataset.method
	    });
	  },
	  payment: function() {
	    var that = this;
	    if (this.data.order && parseFloat(this.data.order.order_amount) < 0.01) {
	      this.jumpSuccess();
	      return;
	    }
	    if (that.data.checkMethod == 'wx_pay') {
	      //微信支付
	        pay.pay(this.data.order.order_sn != 0 ? this.data.order.order_sn : this.data.order.master_order_sn, function() {
	        that.jumpPaymentPage();
	      });
	    } else if (that.data.checkMethod == 'balance_pay') {
	      //余额支付 1弹出输入密码框  2 带参请求API
	        if (that.data.userInfo.user_money - that.data.order.order_amount < 0) {
	            return app.showTextWarining('余额不足,请充值!');
	        } else {
	            that.setData({
	                'isShowBalanceBox': true,
	                'focus':true
	            })
	        }     
	      return;
	    } else {
	      //货到付款
	      request.post('/api/payment/pay_arrival', {
	        data: {
	          order_id: that.data.orderId
	        },
	        success: function(res) {
	          that.jumpsuccess();
	        }
	      });
	    }
	  },
	  jumpSuccess: function() {
	    var that = this;
	    app.showSuccess('下单成功', function() {
	      var pages = getCurrentPages();
	      if (that.data.order.is_virtual) {
	        if (pages[pages.length - 2].route == 'pages/goods/goodsInfo/goodsInfo') {
	          //前一个页面是商品详情页，则跳到待发货页
	          wx.redirectTo({
	            url: '/pages/virtual/virtual_list/virtual_list?type=2'
	          });
	        } else {
	          wx.setStorageSync('virtual:virtual_list:update', true);
	          wx.setStorageSync('order:order_detail:update', true);
	          wx.navigateBack();
	        }
	      } else {
	        if (pages[pages.length - 2].route == 'pages/cart/cart/cart') {
	          //前一个页面是购物车页，则跳到待发货页
	          wx.redirectTo({
	            url: '/pages/user/order_list/order_list?type=2'
	          });
	        } else {
	          wx.setStorageSync('order:order_list:update', true);
	          wx.setStorageSync('order:order_detail:update', true);
	          wx.navigateBack();
	        }
	      }
	
	    });
	  },
	  jumpPaymentPage: function() {
	    wx.setStorageSync('order:order_list:update', true);
	    wx.redirectTo({
	      url: '/pages/payment/payment/payment?order_sn=' + this.data.order.order_sn + '&order_amount=' + this.data.order.order_amount + '&master_order_sn=' + this.data.order.master_order_sn
	    });
	  },
	  //获取支付密码
	  getBalancePwd: function(e) {
	      this.data.balance_pwd = e.detail.value;
	      var balance_pwd = this.data.balance_pwd;
	      var input = e.detail.value.split('');// 转对象
	      this.setData({
	          input:input
	      })
	      if (balance_pwd.length==6){
	          this.BalancePay();
	          this.setData({
	              focus: false,
	          })
	      }
	  },
	  //关闭输入密码框
	  close_coupons: function(e) {
	    this.setData({
	      isShowBalanceBox: false,
	      focus: false
	    })
	  },
	  //余额支付请求
	  BalancePay: function() {
	    var that = this;
	    request.post('/api/Payment/balancePay', {
	      data: {
	        order_sn: that.data.order.order_sn,
	        master_order_sn: that.data.order.master_order_sn,
	        password: that.data.balance_pwd ? md5('TPSHOP' + that.data.balance_pwd) : ''
	      },
	      success: function(res) {
	        that.jumpPaymentPage();
	        that.setData({
	          isShowBalanceBox: false,
	        })
	      },
	      fail:function(res){
	          that.setData({
	              balance_pwd:'',
	              input:'',
	          })
	      },
	    });
	      that.setData({
	          balance_pwd: '',
	          input: '',
	          focus: true,
	      })
	  }	
	}
}
</script>

<style lang="scss" scoped>
.wx-radio-input{
   border-radius: 50%;/* 圆角 */
} 
radio .wx-radio-input.wx-radio-input-checked{
   border: none;
   background-color: red!important;
}
radio .wx-radio-input.wx-radio-input-checked::before{
   border-radius: 50%;/* 圆角 */
   width: 30rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
   height: 30rpx; /* 选中后对勾大小，不要超过背景的尺寸 */
   line-height: 30rpx;
   text-align: center;
   font-size:30rpx; /* 对勾大小 30rpx */
   color:#ffffff; /* 对勾颜色 白色 */
   background: transparent;
   transform:translate(-50%, -50%) scale(1);
   -webkit-transform:translate(-50%, -50%) scale(1);
}

.order-list{
    border-bottom:20rpx solid #eee;
}
.order-price{
    border-bottom:2rpx solid #f3f3f3;
}
.order-price .co-red{
     font-size: 36rpx;
     font-weight: 600;
     color: #fa4949;
}
.order-id .id{
    font-size: 36rpx;
    color: #333;
}
.order-list>view{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 102rpx;
    font-size: 30rpx;
    color: #3c3c3c;
}
.title{
    height: 100rpx;
    line-height: 100rpx;
    font-size: 30rpx;
    color: #333;
    font-weight:600;
}
.pay-way{
    padding-bottom: 30rpx;
}
.pay-item{
    display: flex;
    height: 100rpx;
    align-items: center;
    font-size: 28rpx;
    color: #1a1a1a;
}
.ico-check{
    transform: scale(.8);
    box-sizing: border-box;
    border: 2rpx solid #fff;
    width:60rpx;
}
.balace{
    font-size: 24rpx;
    color: #666;
    margin-left:25rpx;
    margin-top:6rpx;
}
.close{
    float: right;
    padding-right:30rpx;
}
.close image{
    width:22rpx;
    height:22rpx;
}
.pay-img{
    width: 68rpx;
    height: 68rpx;
    margin: 0 20rpx;
}
.pay-now{
    width: 690rpx;
    height: 84rpx;
    line-height: 84rpx;
    text-align: center;
    margin: 150rpx auto 0;
    background-color:#fa4949;
    color: #fff;
    border-radius: 10rpx;
    font-size: 30rpx;
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
.word-box{
    width: 600rpx;
    height: 40rpx;
    line-height: 40rpx;
    position:absolute;
    left:80rpx;
    top:37rpx;
}
.information{
    padding: 0 20rpx;
    background-color: #fff;
    margin: 20rpx 0;
}
.information .item{
    display: flex;
    justify-content: space-between;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 26rpx;
    color: #666;
}
.btn-wrap{
    height: 100rpx;
    background-color: #fff;
}
.tips-btn{
    float: right;
    width: 200rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    font-size: 30rpx;
    color: #fff;
    background-color: #ff3b3b;
}
.pay-amount{
    float: right;
    display: flex;
    align-items: center;
    height: 100rpx;
    font-size: 26rpx;
    margin-right: 40rpx;
}
.payable{
    color: #333;
    margin-right: 20rpx;
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
    background-color: #fff;
    margin-bottom: 20rpx;
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
    transform:scale(0.7);
}
.selfsubmit-view{
  margin-top: 30rpx;
  padding-bottom:20rpx;
  margin-bottom: 10rpx;
  border-bottom:1px solid #f3f3f3;
}
.selfsubmit-view text{
    color:#666;
}
.radio-group{
    width:100%;
    font-size: 26rpx;
}
.arrow-rigth{
    width: 32rpx;
    height: 32rpx; 
    position:absolute;
    right:0;
    top:33rpx;

}
.use-points{
  padding-left: 10rpx;
}

/* 输入密码弹窗 */
.show1{
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.3);
    position:fixed;
    top:0;
    bottom:0;
}
.show1 .bot{
    width:660rpx;
    color: #333333;
    font-size:26rpx;
    margin-left:45rpx;
    height:110rpx;
    border:2rpx solid #f3f3f3;
    margin-top:50rpx;
}
.show1>view{
    position:absolute;
    width:750rpx;
    height: 300rpx;
    padding-top: 35rpx;
    top: 50%;
    transform: translate(0,-50%);
    background:#fff;
}
.show1 .use{
    color: #1f1f1f;
    text-align: center;
    font-size: 30rpx;
}
.show1 .use text{
    color:#999;
    font-size:15px;
    float:right;
    margin-right:30rpx;
}
.show1 button{
    width: 690rpx;
    height: 70rpx;
    line-height: 70rpx;
    color: #fff;
    margin-left: 30rpx;
    margin-top: 150rpx;
    font-size: 30rpx;
    background-color: #ff4343;
    text-align: center;
    border-radius:50rpx;
}
.show1 .input{
    width: 890rpx;
    height: 110rpx;
    border-radius:5rpx;
    z-index: 5;
    opacity:0;
    color: transparent;
    position:absolute;
    left: -200rpx;
    letter-spacing: 50rpx;
    font-size: 0;
}
.password input{
    width:108rpx;
    height:110rpx;
    border-right:2rpx solid #f3f3f3;
    float:left;
    text-align:center;
}
.forget{
  display: block;
  float: right;
  margin-right: 20rpx;
  font-size: 26rpx;
  margin-top: 10rpx;
}
</style>