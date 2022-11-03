<template>
<view class="container" wx:if="{{carts.storeList.length > 0}}">
    <view class="login-in">
        <view class="store-list" wx:for="{{carts.storeList}}" wx:for-index="sidx" wx:key="index">
            <view class="store-mes">
                <view class="go-store">
                    <!-- <icon type="success" size="16" wx:if="{{item.selected}}" data-sidx='{{sidx}}' bindtap="selectStore" color="red" />
                    <view wx:if="{{!item.selected}}" style="margin-right: 20rpx;" data-sidx='{{sidx}}' bindtap="selectStore" class="choosebox"></view> -->
            <view bindtap="selectStore" data-sidx='{{sidx}}' class="choosebox  storebox">
              <image wx:if="{{item.selected}}" src="../../../images/ischeck.png"></image>
              <image wx:if="{{!item.selected}}"src="../../../images/nocheck.png"></image>
            </view>
                    <view class="store-ico"><image class="wh100" src="../../../images/carnew.png"></image></view>
                    <navigator class="store-name" url='/pages/store/index/index?store_id={{item.store_id}}'>{{item.store_name}}</navigator>
                    <!-- <view class="store-arrow"><image class="wh100" src="../../../images/icon-arrowdown.png"></image></view> -->
                </view>
            </view>
            <view class="order-item" wx:for="{{item.cartList}}" wx:for-index="cidx" wx:key="index">
                <view class="goods-ico" bindtap="selectGoods" data-check="item.selected" data-sidx="{{sidx}}" data-cidx="{{cidx}}">
                    <!-- <icon type="success" size="16" wx:if="{{item.selected}}" color="red" /> -->
            <view bindtap="selectGoods" data-cidx="{{cidx}}" class="choosebox  storebox">
              <image wx:if="{{item.selected}}" src="../../../images/ischeck.png"></image>
              <image wx:if="{{!item.selected}}"src="../../../images/nocheck.png"></image>
            </view>
          </view>   
                <navigator class="goods-img" url="/pages/goods/goodsInfo/goodsInfo?goods_id={{item.goods_id}}">
                    <image class="wh100" src="{{url}}/api/goods/goodsThumImages?goods_id={{item.goods_id}}&width=200&height=200"></image>
                </navigator>
                <view class="goods-cont">
                    <navigator class="goods-name ellipsis-2" url="/pages/goods/goodsInfo/goodsInfo?goods_id={{item.goods_id}}">{{item.goods_name}}</navigator>
                    <view class="goods-attribute">{{item.spec_key_name}}</view>
                    <view class="goods-price"><text class="co-red">￥{{item.member_goods_price}}</text><text class="market">￥{{item.market_price}}</text></view>
                    <view class="btn-del" bindtap="deleteItem" data-sidx="{{sidx}}" data-cidx="{{cidx}}">
                        <image class="wh100" src="../../../images/dele.png"></image>
                    </view>
                    <view class="count">
                        <view class="sub" bindtap="subNum" data-sidx="{{sidx}}" data-cidx="{{cidx}}">一</view>
                        <input type="number" value="{{item.goods_num}}" data-sidx="{{sidx}}" data-cidx="{{cidx}}" bindblur="valueToNum" />
                        <view class="add" bindtap="addNum" data-sidx="{{sidx}}" data-cidx="{{cidx}}">+</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
    <view class="pay-for">
        <label class="checkbox" bindtap="selectAll">
            <view class="choosebox allbox">
              <image wx:if="{{checkAllToggle}}" src="../../../images/ischeck.png"></image>
              <image wx:if="{{!checkAllToggle}}"src="../../../images/nocheck.png"></image>
            </view>
            <!-- <icon class="ico-check" type="success" size="20" color="{{checkAllToggle?'red':'gray'}}" /> -->
            全选
        </label>
        <button class="pay-btn" bindtap="checkout">立即购买</button>
        <view class="consumer">
            <view class="total">总计 : <text class="co-red">{{carts.total_price.total_fee}}</text></view>
            <text class="tips">不包含运费</text>
        </view>
    </view>
</view>

<view class="no-data" wx:if="{{!carts.storeList || carts.storeList.length == 0}}">

    <image src="../../../images/cart-null_1.png" class="shopcar-image" />
  <view class="no-word">你的购物车空空如也~</view>
  <navigator catchtap='gohome' class="lookbtn"> 去逛逛 </navigator>
</view>
</template>

<script>
	var app = getApp();
	var request = app.request;
	var common = require('../../../utils/common.js');
	
	setup() {
		/** 返回的时候刷新 */
		onShow: function () {
		    this.getCardList();
	
		    if (app.globalData.menu_model.length == 0) {
		        app.globalData.menu_index = 3
		    } else {
		        //遍历自定义底部，该页面在哪个位置
		        for (var i in app.globalData.menu_model) {
		            if (app.globalData.menu_model[i].app_url.indexOf('Cart') != -1) {
		                app.globalData.menu_index = i;
		            }
		        }
		    }
	
		    this.setData({
		        defaultMenu: app.globalData.defaultMenu,
		        menu_index: app.globalData.menu_index,
		        menu_model: app.globalData.menu_model,
		    })  
		},
		gohome(){
		    wx.reLaunch({
		        url: '/pages/index/index/index',
		    })
		},
		/** 跳转模式 自定义页面 || 自定义菜单 || 自定义控件控件*/
		topage(e) {
		    //自定义菜单
		    var idx = e.currentTarget.dataset.idx;
		    app.globalData.menu_index = idx;
		    var page_type = this.data.menu_model[idx].url_type
		    var id = this.data.menu_model[idx].app_url
		    //判断跳转的类型  0 = 外部网址,1 = 小程序页面，2 = 分类商品，3 = 商品详情 ，4 = 自定义页面
		    if (page_type == 1) {
		        //要访问的页面idx，当前页面menu_index
		        common.totabar(idx, this.data.menu_index, this.data.menu_model);
		    } else if (page_type == 2) {
		        wx.navigateTo({ url: '/pages/goods/goodsList/goodsList?cat_id=' + id });
		    } else if (page_type == 3) {
		        wx.navigateTo({ url: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + id });
		    } else if (page_type == 0) {
		        this.setData({ webUrl: id });
		        wx.navigateTo({ url: '/pages/index/webview/webview' });
		    } else {
		        wx.reLaunch({
		            url: '../../index/customPage/customPage?id=' + this.data.menu_model[idx].app_url,
		        })
		    }
		},
		/** 默认菜单 */
		topages: function (e) {
		    var idx = e.currentTarget.dataset.idx;
		    app.globalData.menu_index = idx;
		    common.defaultTotabar(idx, 3);
		},
		/** 删除一商品 */
		deleteItem:function (e) {
		    var that = this;
		    wx.showModal({
		        title: '确定删除',
		        success: function (res) {
		            if (!res.confirm) {
		                return;
		            }
		            var sidx = e.currentTarget.dataset.sidx;
		            var cidx = e.currentTarget.dataset.cidx;
		            var id = that.data.carts.storeList[sidx].cartList[cidx].id;
		            request.post('/api/cart/delCart?ids=' + id, {
		                success: function (res) {
		                    that.getCardList();
		                }
		            });
		        }
		    })
		},
	
		/** 输入购买数量 */
		valueToNum:function (e) {
		    var goodsNum;
		    var sidx = e.currentTarget.dataset.sidx;
		    var cidx = e.currentTarget.dataset.cidx;
		    var cart = this.data.carts.storeList[sidx].cartList[cidx];
		    if (isNaN(e.detail.value) || e.detail.value < 1){
		        goodsNum = 1;
		    } else {
		        goodsNum = parseInt(e.detail.value);
		    }
		    if (goodsNum > cart.store_count) {
		        goodsNum = cart.store_count;
		    }
		    if (cart.goods_num == goodsNum) {
		        return;
		    }
		    var postData = JSON.stringify([{
		        goodsNum: goodsNum,
		        selected: cart.selected,
		        cartID: cart.id,
		    }]);
		    this.postCardList(postData);
		},
	
		/** 数量加1 */
		addNum:function (e) {
		    var sidx = e.currentTarget.dataset.sidx;
		    var cidx = e.currentTarget.dataset.cidx;
		    var cart = this.data.carts.storeList[sidx].cartList[cidx];
		    if (cart.goods_num >= cart.store_count) {
		        return;
		    }
		    var postData = JSON.stringify([{
		        goodsNum: cart.goods_num + 1,
		        selected: cart.selected,
		        cartID: cart.id,
		    }]);
		    this.postCardList(postData);
		},
	
		/** 数量减1 */
		subNum:function (e) {
		    var sidx = e.currentTarget.dataset.sidx;
		    var cidx = e.currentTarget.dataset.cidx;
		    var cart = this.data.carts.storeList[sidx].cartList[cidx];
		    if (cart.goods_num == 1) {
		        return;
		    }
		    var postData = JSON.stringify([{
		        goodsNum: cart.goods_num - 1,
		        selected: cart.selected,
		        cartID: cart.id,
		    }]);
		    this.postCardList(postData);
		},
	
		/** 选择所有商品 */
		selectAll:function(){
		    var checkAll = !this.data.checkAllToggle;
		    var postCardList = [];
		    var storeList = this.data.carts.storeList;
		    for (var i = 0; i < storeList.length; i++) {
		        for (var j = 0; j < storeList[i].cartList.length; j++){
		            postCardList.push({
		                goodsNum: storeList[i].cartList[j].goods_num,
		                selected: checkAll,
		                cartID: storeList[i].cartList[j].id,
		            })
		        }
		    }
		    var postData = JSON.stringify(postCardList);
		    this.postCardList(postData);
		},
	
		/** 选择单一商品 */
		selectGoods: function (e) {
		    var sidx = e.currentTarget.dataset.sidx;
		    var cidx = e.currentTarget.dataset.cidx;
		    var cart = this.data.carts.storeList[sidx].cartList[cidx];
		    var postData = JSON.stringify([{
		        goodsNum: cart.goods_num,
		        selected: Number(!cart.selected),
		        cartID: cart.id,
		    }]);
		    this.postCardList(postData);
		},
	
		/** 选择一店铺下所有商品 */
		selectStore: function (e) {
		    var sidx = e.currentTarget.dataset.sidx;
		    var store = this.data.carts.storeList[sidx];
		    var postData = [];
		    for (var i = 0; i < store.cartList.length; i++) {
		        postData.push({
		            goodsNum: store.cartList[i].goods_num,
		            selected: Number(!store.selected),
		            cartID: store.cartList[i].id,
		        });
		    }
		    this.postCardList(JSON.stringify(postData));
		},
	
		/** 对获取的数据进行选择检查 */
		doCheckAll: function (data) {
		    var storeList = data.storeList;
		    if (!storeList || !storeList.length) {
		        this.setData({
		            carts: null,
		            checkAllToggle: false
		        });
		        return;
		    }
		    var checkAllToggle = true;
		    for (var i = 0; i < storeList.length; i++) {
		        storeList[i].selected = true;
		        for (var j = 0; j < storeList[i].cartList.length; j++) {
		          console.log(storeList[i].cartList[j])
		            if (!storeList[i].cartList[j].selected) {
		                storeList[i].selected = false;
		                checkAllToggle = false;
		                break;
		            }
		        };
		    }
		    this.setData({ 
		        carts: data,
		        checkAllToggle: checkAllToggle 
		    });
		},
	
		/** 提交购物车数据 */
		postCardList: function (postData) {
		    var that = this;
		    request.post('/api/cart/cartList', {
		        data: { cart_form_data: postData },
		        success: function (res) {
		            that.doCheckAll(res.data.result);
		        }
		    });
		},
	
		/** 获取购物车列表 */
		getCardList: function () {
		    var that = this;
		    request.get('/api/cart/cartList', {
		        success: function (res) {
		            that.doCheckAll(res.data.result);
		            wx.stopPullDownRefresh();
		        }
		    });
		},
	
		onPullDownRefresh: function (e) {
		    this.getCardList();
		},
	
		/** 去结算 */
		checkout: function () {
		    var hasAnySelected = false;
		    var storeList = this.data.carts.storeList;
		    for (var i = 0; i < storeList.length; i++) {
		        for (var j = 0; j < storeList[i].cartList.length; j++) {
		            if (storeList[i].cartList[j].selected) {
		                hasAnySelected = true;
		                break;
		            }
		        }
		    }
		    if (!hasAnySelected) {
		        app.showWarning('还没有选中商品');
		        return;
		    }
		    wx.navigateTo({ url: '/pages/cart/cart2/cart2' });
		}
	}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    height: 100%;
    align-items: center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    background-color: #fff; 
}
.login-in{
    position: fixed;
    top: 0;
    bottom: 100rpx;
    overflow-x: hidden;
    padding-bottom: 50rpx;
    width: 100%;
    box-sizing: border-box;
    border-top: 1rpx solid #f3f3f3;
}
.order-item{
    display: flex;
    justify-content: space-between;
    height: 200rpx;
    padding: 20rpx 30rpx;
    border-bottom:1px solid #f3f3f3;
    background-color: #fff;
}
.goods-ico{
    display: flex;
    align-items: center;
}
.goods-img{
    width: 180rpx;
    height: 180rpx;
    font-size: 0;
    margin-top: 10rpx;
}
.goods-cont{
    position: relative;
    width: 430rpx;
    height: 200rpx;
    font-size: 26rpx;
}
.goods-name{
    width: 430rpx;
    height: 64rpx;
    margin: 8rpx 0;
    line-height: 32rpx;
    color: #333;
}
.goods-attribute{
    height: 26rpx;
    line-height: 26rpx;
    font-size: 24rpx;
    color:#999;
    width: 380rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 22rpx;
}
.goods-price{
    height: 40rpx;
    line-height: 40rpx;
    width: 280rpx;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999;
    margin-top: 35rpx;
    display: block;
}
.btn-del{
    position: absolute;
    right: 5rpx;
    top:88rpx;
    width: 32rpx;
    height: 32rpx;
}
.count{
    position: absolute;
    right: 0;
    bottom: 5rpx;
    width: 156rpx;
    height: 45rpx;
    font-size: 24rpx;
}
.count>view,.count>input{
    float: left;
    width: 50rpx;
    height: 45rpx;
    line-height: 45rpx;
    text-align: center;
}
.sub{
    border-right: 1px solid #f3f3f3;
    background: #f5f5f5;
    color: #999;
    font-weight: bold;
}
.add{
    border-left: 1px solid #f3f3f3;
    background: #f5f5f5;
    font-size: 36rpx;
    color: #999;
}
.pay-for{
    width: 100%;
    height: 100rpx;
    position: fixed;
    left: 0;
    bottom: 100rpx;
    font-size: 28rpx;
    color: #666;
    background-color:#fff;
}
.pay-for .pay-btn{
    float: right;
    width: 200rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    background-color: #ff3b3b;
    color: #fff;
    border-radius:0;
}
.pay-for .consumer{
    float: right;
    margin-right: 20rpx;
    line-height: 50rpx;  
}
.pay-for .checkbox{
    float: left;
    padding-left: 40rpx;
    line-height: 100rpx;
    display: flex;
    align-items: center;
}
.pay-for .ico-check{
   display: flex;
   align-items: center;
   margin-right: 20rpx;
}
.store-mes{
    height: 32rpx;
    padding:28rpx 30rpx;
    background-color: #fff;
}
.store-mes icon{
    margin-right: 20rpx;
}
.go-store{
    float: left;
    display: flex;
    height: 32rpx;
}
.store-ico,.store-arrow{
    width: 32rpx;
    height: 32rpx;
}
.store-name{
    font-size: 30rpx;
    padding: 0 10rpx;
    font-weight: bold;
    margin-top: -3px;
}
.coupon{
    float: right;
    font-size: 28rpx;
    line-height: 32rpx;
    color:#ff3b3b;
}
.shopcar-image{
  margin-top: 100rpx;
  width: 562rpx;
  height: 270rpx;
}
.lookbtn{
  width:200rpx;
  height:60rpx;
  background:rgba(255,76,76,1);
  border-radius: 10rpx;
  font-size:24rpx;
  line-height:60rpx;
  color: #ffffff;
  margin: 0 auto;
  margin-top: 40rpx;
}
.no-word{
  font-size:24rpx;
  font-weight:400;
  color:rgba(153,153,153,1);
}
.store-list{
  margin-bottom: 10rpx;
}
.allbox{
  margin-right: 5rpx;
}
.storebox{
  margin-right: 10rpx;
  position: relative;
  top: -3rpx;
}
.market{
  color: #999;
  text-decoration:line-through;
  font-size: 22rpx;
  margin-left: 10rpx;
}
</style>