<template>
	<view class="content">
		<view class="type-navbar">
		    <view class="type-box" wx:for="{{categories}}" wx:key="index">
		        <view id="{{item.id}}" class="type-navbar-item {{activeCategoryId == item.id ? 'type-item-on' : ''}}" bindtap="tabClick">
		            {{item.name}}
		        </view>
		    </view>
		</view>
		
		<view class="goods-detail">
		    <!-- 商品首页 -->
		    <view class="goods-info" hidden="{{activeCategoryId==0?false:true}}">
		        <swiper class="swiper_box" indicator-dots="{{true}}" vertical="{{false}}"
		                autoplay="{{true}}" interval="{{3000}}" duration="{{1000}}">
		            <block wx:for="{{data.gallery}}" wx:key="index">
		                <swiper-item>
		                    <image class="wh100" src="{{item.image_url}}" />
		                </swiper-item>
		            </block>
		        </swiper>
		        <view class="goods-title pd-bg-fff">
		            <view class="goods-name ellipsis-2">{{data.goods.goods_name}}</view>
		            <view class='share-btn' catchtap='catchShare' hidden='{{!showStore}}'>
		                <image src='../../../images/icon-share.png'></image>
		                <view>分享</view>
		            </view>
		        </view>
		        <view class="goods-price pd-bg-fff">
		            <view class="price co-red" wx:if="{{data.goods.exchange_integral}}"><text>{{select.activity.priceName}}</text>
		                <text style='font-size:22rpx;' class='mon'>￥</text >
		                <text style='font-size:44rpx;' >{{select.price[0]}}</text>
		                <text style='font-size:22rpx;' class='mon'>.{{select.price[1]}}</text> 
		                <text style='font-size:34rpx;'>  + {{data.goods.exchange_integral}}积分</text>
		            </view>
		           <view class="price co-red" wx:else ><text>{{select.activity.priceName}}</text>
		                <view wx:if="{{select.activity.prom_type  && select.activity.prom_type != 6}}"><text class='mon'>￥</text>{{data.goods.shop_price}}</view>
		                <block wx:else>
		                     <text class='mon'>￥</text>{{select.price[0]}}<text class='mon'>.{{select.price[1]}}</text>
		                </block>
		                               
		            </view>
		            <view class="prom-info" wx:if="{{select.activity.prom_type  && select.activity.prom_type != 6}}">
		                <text class="prom-type">{{select.activity.countName}}</text>
		                <text>{{select.activity.countTime}}</text>
		            </view>
		              <navigator class="prom-info" wx:if="{{select.activity.prom_type == 6}}" url="../../team/team_info/team_info?goods_id={{select.activity.goods_id}}&team_id={{select.activity.team_id}}&item_id={{select.activity.item_id}}">
		                <text class="prom-type">{{select.activity.countName}}</text>
		                <view style="display:inline-block;" >点击前往</view >
		            </navigator>
		            <view class="market-price">市场价<view class='line'>￥{{data.goods.market_price}}</view>
		                 <view class="goods-num" wx:if="{{select.activity.prom_type!=2}}">
		                        <view class="sales">销量：{{(data.goods.sales_sum + data.goods.virtual_sales_sum)>0?(data.goods.sales_sum + data.goods.virtual_sales_sum):0}}</view>
		                         <view class="stock">库存：{{select.stock>0?select.stock:0}}</view>
		                </view>
		            </view>
		            <view wx:if="{{select.activity.prom_type==2}}">{{select.activity.virtual_num}}人已参团</view>
		           
		        </view>
		         <view wx:if="{{cardList.length>0 && data.goods.is_virtual == 0}}" class="logistics-list pd-bg-fff coupons" bindtap="getCardList">
		             <view class="logistics-item">
		                <view class="item-title">优惠券</view>
		                <view class="promotion-item-mes-card">
		                      <block wx:for="{{cardList}}" wx:key="{{index}}">
		                          <view wx:if="{{index<3}}"><text class="promotion-item-mes-cardborder">满{{item.condition}}减{{item.money}}</text></view>
		                      </block>
		                     
		                </view>
		                <view class="item-img"><image class="wh100" src="../../../images/icon-arrowdown.png" ></image></view>
		            </view>
		        </view>
		        <view class="logistics-list pd-bg-fff activity" wx:if="{{data.activity.data[0] && data.goods.is_virtual == 0}}">
		            <view class='hd_item'>
		                <view class="item-title">活动</view>
		                <view class='containter'>
		                    <view class='event'>
		                    <view class='man' wx:for="{{data.activity.data}}" wx:if="{{index < 5}}"  wx:key="{{index}}" >
		                        <text class="text">{{item.title}}</text><text class='item_content'>{{item.content}}</text>
		                    </view>
		                   
		                 </view>
		                 
		                </view>
		                
		            </view>
		        </view>
		        <view class="logistics-list pd-bg-fff specifications">
		             <view class="logistics-item" bindtap="openSpecModel">
		                <view class="item-title">规格</view>
		                <view style='font-weight:600;' class="item-mes">{{select.specName}} {{goodsInputNum}}件</view>
		                <view class="item-img"><image class="wh100" src="../../../images/icon-arrowdown.png" ></image></view>
		            </view>
		        </view>
		
		        <view class="logistics-list pd-bg-fff address">
		            <view class="logistics-item" bindtap='enterAddress'>
		                <view class="item-title ellipsis-1">地址</view>
		                <view class="item-mes">
		                <image class='loc' src='../../../images/loc.png'></image>
		                {{address.address ? address.address:'请选择配送地址'}}</view>
		                <view class="item-img"><image class="wh100" src="../../../images/icon-arrowdown.png" ></image></view>
		            </view>
		            <view class="logistics-item">
		                <view class="item-title">运费</view>
		                <view style='width:600rpx;' class="item-mes">{{shipping}}</view>
		            
		            </view>
		            <view class="logistics-item">
		                <view class="item-title">服务</view>
		                <view style='width:604rpx;' class="item-mes ellipsis-1">由{{data.store.store_name}}提供服务</view>
		            </view>
		        
		        </view>
		        <view class="user-comment logistics-item pd-bg-fff">
		            <view class='evaluation'>用户评价<text>({{data.statistics.total_sum}})</text></view>
		            <view bindtap="tabComment" class="good-comment">
		               好评<view class="co-red">{{data.goods.goodCommentRate}}%</view>
		                <view class="item-img"><image class="wh100" src="../../../images/icon-arrowdown.png" ></image></view>
		            </view>
		        </view>
		        <!-- 评论s -->
		        <view class='estimate'  wx:for="{{data.comment}}" wx:for-index="cIdx" wx:key="{{cIdx}}">
		            <image class='user_img' src='{{item.is_anonymous ? defaultAvatar : item.head_pic ? item.head_pic : defaultAvatar}}'></image>
		            <view class='user'>
		                <view class='id'>
		                    <view class='star_on'>
		                        <text>{{item.is_anonymous ? '匿名用户' : item.nickname}}</text>
		                        <block wx:for="{{item.goods_rank_new}}" >
		                          <image src='../../../images/stars-{{item}}.png' ></image>
		                        </block>
		                        <text class='time'>{{item.addTimeFormat}}</text>
		                    </view>
		                </view>
		             <text class='estimate_content'>{{item.content}}</text>
		                <view class='estimate_img' wx:if="{{item.img[0]}}" >
		                    <image mode='aspectFill' wx:for="{{item.img}}" wx:for-item="img" src='{{url}}{{img}}'></image>
		                </view>
		            </view>
		        </view>
		       
		        <!-- 评论e -->
		        <!-- 店铺信息 -->
		        <!-- <view class="shops-mes" hidden="{{!showStore}}" >
		            <view class="shops-info" >
		                <view class="shops-pic"><image class="wh100" src="{{url + data.store.store_logo}}"></image></view>
		                <view class="shops-name">
		                    <view class="ellipsis-1">{{data.store.store_name}}</view>
		                    <view class="store-desc ellipsis-1">
		                        <text>关注人数:{{data.store.store_collect}}</text>
		                        <text>商品数量:{{data.store.goods_count}}</text>
		                    </view>
		                </view>
		                <navigator class="baguette" url="/pages/store/index/index?store_id={{data.store.store_id}}">
		                     <view>进店逛逛</view>
		                 </navigator>
		            </view>
		            <view class="scores-list">
		                <view class="scores-item">
		                    <view class="scores-title">
		                    商品评价 <view class="co-red">{{data.store.store_desccredit}}
		                                <text class="{{data.store.store_desccredit < 4.5 ? 'low' :data.store.store_desccredit < 4.8?'middle':''}}"> {{data.store.descScoreDesc}}</text>
		                            </view>
		                    </view>
		                </view>
		                <view class="scores-item">
		                    <view class="scores-title">
		                        服务评价<view class="co-red">{{data.store.store_servicecredit}}
		                                <text class="{{data.store.store_servicecredit < 4.5 ? 'low' :data.store.store_servicecredit < 4.8?'middle':''}}">{{data.store.serviceScoreDesc}}</text>
		                        </view>
		                    </view>
		                </view>
		                <view class="scores-item">
		                    <view class="scores-title">
		                        物流评价<view class="co-red">{{data.store.store_deliverycredit}}
		                            <text class="{{data.store.store_deliverycredit < 4.5 ? 'low' :data.store.store_deliverycredit < 4.8?'middle':''}}">{{data.store.deliveryScoreDesc}}</text>
		                        </view>
		                    </view>
		                </view>  
		            </view>
		        </view> -->
		                    <view class="recommend">
		            <view class="recommend-title">为你推荐</view>
		            <view class="recommend-ul">
		                <navigator wx:for="{{data.recommend_goods}}" wx:if="{{index < 6}}"  wx:key="{{index}}" class="li" url="/pages/goods/goodsInfo/goodsInfo?goods_id={{item.goods_id}}" open-type='redirect'>
		                    <view class="li-img">
		                        <image class="wh100" src="{{url}}/api/goods/goodsThumImages?goods_id={{item.goods_id}}&width=200&height=200"></image>
		                    </view>
		                    <view class="li-title ellipsis-2">{{item.goods_name}}</view>
		                    <view class='color'><text>￥</text>{{item.price_new[0]}}<text>.{{item.price_new[1]}}</text></view>
		                </navigator>
		            </view>
		        </view>
		       
		    </view>
		    <!-- 商品详情 -->
		    <view wx:if="{{goods_norms}}" class="goods-norms" hidden="{{activeCategoryId!=2?false:true}}">
		         <view class="type-navbar2">
		            <view class="type-box2" wx:for="{{categories2}}"  wx:key="{{index}}">
		                <view id="{{item.id}}" class="{{activeCategoryId2 == item.id ? 'type-item2-on' : ''}}" bindtap="tabClick2">
		                    {{item.name}}
		                </view>
		            </view>
		        </view>
		        <view hidden="{{activeCategoryId2==0?false:true}}" class="wxParse">
		            <template is="wxParse" data="{{wxParseData:content.nodes}}"/>
		        </view>
		        <view class="parameter" hidden="{{activeCategoryId2==1?false:true}}">
		            <view class="table">
		                <view class="th-thitle tb">主体</view>
		                <view class="td-cont tb" wx:for="{{goodsAttrs}}" wx:key="index">
		                    <view class="td-title">{{item.attr_name}}</view>
		                    <view class="td-text">{{item.attr_value}}</view>
		                </view>
		            </view>
		        </view>
		    </view>
		    <!-- 商品评论 -->
		    <view class="goods-comment" hidden="{{activeCategoryId==2?false:true}}">
		        <view class="type-navbar3">
		            <view class="type-box3" wx:for="{{categories3}}"  wx:key="{{index}}">
		                <view id="{{item.id}}" class="{{activeCategoryId3 == item.id ? 'type-item3-on' : ''}}" bindtap="tabClick3">
		                    {{item.name}}({{item.num}})
		                </view>
		            </view>
		        </view>
		        <view class="comment-list">
		            <view class="comment-item" wx:for="{{comments}}" wx:key="{{cIdx}}" wx:for-index="cIdx">
		                <view class="comment-title">
		                    <view class="user-name">
		                        <view class="user-pic"><image class="wh100" src="{{item.is_anonymous ? defaultAvatar : item.head_pic ? url + item.head_pic : defaultAvatar}}"></image></view>
		                        <view class="user-word">{{item.is_anonymous ? '匿名用户' : item.nickname}}</view>
		                    </view>
		                    <view>{{item.addTimeFormat}}</view>
		                </view>
		                <view class="comment-cont">
		                    <view>
		                        <view class="stars">
		                            <view class="stars-checked">
		                                <image class="star" src="../../../images/star-red.png" wx:for="{{item.goods_rank}}"  wx:key="{{index}}"></image>
		                            </view>
		                            <view class="stars-unchecked">
		                                <image class="star" src="../../../images/star-gray.png" wx:for="{{5-item.goods_rank}}" wx:key="{{index}}"></image>
		                            </view>
		                        </view>
		                        <view class="state-spec ellipsis-1">{{item.spec_key_name?item.spec_key_name:''}}</view>
		                    </view>
		                    <view class="comment-mes">{{item.content}}</view>
		                    <view class="img-ul">
		                         <view class="img-li" wx:for="{{item.img}}"  wx:key="{{index}}">
		                            <image class="wh100" src="{{item}}" bindtap="previewCommentImgs" data-cidx="{{cIdx}}" data-id="{{index}}"></image>
		                         </view>
		                    </view>
		                </view>
		            </view>
		        </view>
		    </view>
		</view>
		<!-- 返回顶部按钮  -->
		<view class="toTop" bindtap="doScrollTop" wx:if="{{supportPageScroll}}">
		    <image class="wh100" src="../../../images/topup.png"></image>
		</view>
		<!-- 加入购物车栏  -->
		<view class="join-cart">
		    <view class='flex_bottom'>
		        <view class="custom-service cart-ico"  >
		            <button wx:if="{{imChoose==1}}" open-type="contact" class='cs-button'  session-from="wechat|{{userInfo.user_id}}|{{userInfo.nickname}}|{{userInfo.head_pic}}|{{data.store.store_id}}">
		                <image class="cs-img cs-img-kf" src="../../../images/custom-service.png"></image> 
		                <view class='cs-ing-name'>客服</view>
		            </button>
		            <view wx:elif="{{imChoose==0}}" class='cs-button' bindtap='contactService'>
		                <image class="cs-img cs-img-kf" src="../../../images/custom-service.png"></image> 
		                <view class='cs-ing-name'>客服</view>
		            </view>
		            <view wx:else class='cs-button'>
		                <image class="cs-img cs-img-kf" src="../../../images/custom-service.png"></image> 
		                <view class='cs-ing-name'>客服</view>
		            </view>
		         </view>
		        <view class="goods-collect" bindtap="collectGoods">
		            <view class="collect-img">
		                <image hidden="{{data.goods.is_collect}}" class="wh100" src="../../../images/heart.png"></image>
		                <image hidden="{{!data.goods.is_collect}}"  class="wh100" src="../../../images/heart-h.png"></image>
		            </view>
		            <view class="collect-des">收藏</view>
		        </view>
		        <view class="shopping-cart cart-ico">
		            <navigator url="/pages/cart/cart/cart" open-type="navigate">
		                <image class="sc-img" src="../../../images/shopping-cart.png"></image>
		                <view wx:if='{{cartGoodsNum}}' class="cart-num ellipsis-1"> {{cartGoodsNum}} </view>
		                <view class='shopping_cart'>购物车</view>        
		            </navigator>
		        </view>
		    </view>
		    <view wx:if="{{data.goods.is_virtual}}" class="buy-btn cart-btn cart-btn-lg" bindtap="openSpecModel">立即购买</view>
		    <view wx:elif="{{data.goods.prom_type == 4 }}" class="buy-btn cart-btn cart-btn-lg" bindtap="openSpecModel" data-index="{{false}}">立即预定</view> 
		    <block wx:elif="{{data.goods.exchange_integral <= 0}}">
		        <view class="join-btn cart-btn" bindtap="openSpecModel" data-index="{{true}}" >加入购物车</view>
		        <view class="buy-btn cart-btn" bindtap="openSpecModel" data-index="{{false}}" >立即购买</view>
		    </block>
		    <view wx:else="{{data.goods.exchange_integral > 0}}" class="buy-btn cart-btn cart-btn-lg" bindtap="openSpecModel">立即兑换</view>
		</view>
		<!-- 规格弹框  -->
		<view hidden="{{!openSpecModal}}">
		    <view class="cover-layer" bindtap="closeSpecModal"></view>
		    <view animation="{{ani}}" class="spec-model">
		        <icon type="cancel" color="gray" size="22" class="modal-close" bindtap="closeSpecModal"/>
		        <view class="spec-goods">
		                <image  class="wh100 spec-img" src="{{select.spec_img}}"></image>
		            <view class="spec-goods-info">
		                <view class="spec-goods-name">{{data.goods.goods_name}}</view>
		                <view wx:if="{{select.activity.prom_type  && select.activity.prom_type != 6}}" class="spec-goods-price"><text>￥</text>{{data.goods.shop_price}}
		                        <view class="spec-goods-stock">剩余库存:{{select.stock}}</view>
		                </view>
		                <view wx:else class="spec-goods-price"><text>￥</text>{{select.price[0]}}.{{select.price[1]}}
		                        <view class="spec-goods-stock">剩余库存:{{select.stock}}</view>
		                </view>
		            </view>
		        </view>
		        <block wx:for="{{data.goods_spec_list}}" wx:key="{{index}}" wx:for-index="listIdx">
		            <view class="spec-name">{{item.spec_name}}</view>
		            <view wx:for="{{item.spec_list}}" wx:for-item='spec' wx:key="{{index}}" class="spec-btn {{item.selectItemId==spec.item_id?'spec-btn-click':''}}" bindtap="selectSpec" data-listidx="{{listIdx}}" data-itemid="{{spec.item_id}}">{{spec.item}}</view>
		        </block>
		         <view class="spec-name number">
		            数量
		            <view class="count">
		                <view class="sub" bindtap="subCartNum">-</view>
		                <input type="number" value="{{goodsInputNum}}" bindblur="inputCartNum"/>
		                <view class="add" bindtap="addCartNum">+</view>
		            </view>
		        </view>
		        <view class="spec-cart-btns">
		            <view wx:if="{{data.goods.is_virtual}}" class="spec-cart-btn spec-buy spec-cart-btn-lg {{select.stock<=0||shippingCost<0?'spec-cart-disable':''}}" data-action='buy' bindtap="addCart">立即购买</view>
		            <block wx:elif="{{data.goods.exchange_integral <= 0}}">
		                <view wx:if="{{judge}}" class="spec-cart-btn spec-add-cart {{select.stock<=0||shippingCost<0?'spec-cart-disable':''}}" data-action='add' bindtap="addCart">确定</view>
		                <view wx:if="{{!judge}}" class="spec-cart-btn spec-buy {{select.stock<=0||shippingCost<0?'spec-cart-disable':''}}" data-action='buy' bindtap="addCart">确定</view>
		            </block>
		            <view wx:else class="spec-cart-btn spec-buy spec-cart-btn-lg {{select.stock<=0||shippingCost<0?'spec-cart-disable':''}}"data-action='exchange' bindtap="addCart">立即兑换</view>
		        </view>
		    </view>
		</view>
		<!-- 优惠信息弹框  -->
		<view hidden="{{!openPromModal}}">
		    <view class="cover-layer" bindtap="closePromModal"></view>
		    <view class="prom-model">
		        <icon type="cancel" color="gray" size="22" class="modal-close" bindtap="closePromModal"/>
		        <view class="prom-title">优惠信息</view>
		        <view class="logistics-item" wx:for="{{select.activity.data}}" wx:key="{{index}}">
		            <view class="item-title"><text class="prom-item">{{item.title}}</text></view>
		            <view class="item-mes ellipsis-1">{{item.content}}</view>
		        </view>
		    </view>
		</view>
	</view>
</template>

<script>
	export default {
		setup(){
			onLoad: function(options) {
			  if (options.scene) {
			    var scene = decodeURIComponent(options.scene)
			    var data = scene.split('&')
			    options.goods_id = data[0].split('=')[1]
			    options.item_id = data[1].split('=')[1]
			    options.first_leader = data[2].split('=')[1]
			  }
			  var that = this;
			  if (options.first_leader) {
			    wx.setStorageSync('first_leader', options.first_leader);
			  }
			  var userInfo = wx.getStorageSync('app:userInfo');
			  this.setData({
			    userInfo: userInfo
			  });
			  var that = this;
			  app.getConfig(function(res) {
			    var im_choose = common.getConfigByName(res.config, 'im_choose');
			    that.setData({
			      imChoose: im_choose
			    });
			  });
			  this.data.optionItemId = typeof options.item_id == 'undefined' ? 0 : options.item_id;
			  request.get('/api/goods/goodsInfo', {
			    data: {
			      id: options.goods_id,
			      store_id: options.store_id
			    },
			    failRollback: true,
			    success: function(res) {
			      var recommend_goods = res.data.result.recommend_goods;
			      for (var i in recommend_goods){
			          recommend_goods[i].price_new = recommend_goods[i].shop_price.split(".");
			      }
			      that.initData(res.data.result);
			      that.setData({
			        result: res.data.result
			      });
			      that.requestGoodsContent();
			      that.refreshDispatch(res.data.result);
			      that.requestCardList(); 
			    }
			  });
			  this.requestCardNum();
			  //是否支持返回按钮
			  if (wx.pageScrollTo) {
			    this.setData({
			      supportPageScroll: true
			    });
			  }
			  //小程序嵌套不能超过5层
			  var pages = getCurrentPages();
			  if (pages.length < 5) {
			    this.setData({
			      showStore: true
			    });
			  }
			  this.mini_status();
			},
		
			//重新刷新物流数据
			onShow: function() {
			  if (this.data.enterAddressPage) {
			    this.data.enterAddressPage = false;
			    this.refreshDispatch(this.data.result);
			  }
			  
			},
			mini_status: function() {
			  var that = this;
			  //获取是不是在审核隐藏一些功能
			  request.get(that.data.url + '/api/app/mini_app', {
			      isShowLoading: false,
			    success: function(res) {
			      if (res.data.result.status == 1) {
			        that.setData({
			          showStore: false
			        });
			      } else {
			        that.setData({
			          showStore: true
			        });
			      }
			    }
			  });
			},
			/**查询商品物流 */
			refreshDispatch: function(result) {
			  var that = this;
			  //地址为0，没有地址时候先默认给1，提交订单再选择地址
			  if (consigneeAddress) {
			    consigneeAddress.district = consigneeAddress.district ? consigneeAddress.district : 1;
			  }
			  var consigneeAddress = wx.getStorageSync('goodsInfo:goodsInfo:address') ? wx.getStorageSync('goodsInfo:goodsInfo:address') : result.consignee;
			  that.setData({
			    'address.address': consigneeAddress.address,
			    'address.district': consigneeAddress.district,
			  });
			  request.get('/api/goods/dispatching', {
			    data: {
			      goods_id: result.goods.goods_id,
			      region_id: consigneeAddress.district,
			    },
			      isShowLoading: false,
			    success: function(res) {
			      var shippinginfo;
			      if (res.data.result > 0) {
			        shippinginfo = '￥' + res.data.result;
			      } else if (res.data.result == 0) {
			        shippinginfo = '包邮';
			      } else {
			        shippinginfo = res.data.msg;
			      }
			      if (consigneeAddress.district > 0) {
			        that.setData({
			          shippingCost: res.data.result
			        });
			      }
			      that.setData({
			        shipping: shippinginfo
			      });
			    },
			  });
			},
		
			enterAddress: function() {
			  //检查用户是否登录方可操作立即购买
			  if (!app.auth.isAuth()) {
			    app.showLoading(null, 1500);
			    app.getUserInfo();
			    return;
			  }
			  this.data.enterAddressPage = true;
			  wx.navigateTo({
			    url: '/pages/user/address_list/address_list?operate=selectAddress'
			  });
			},
		
			onUnload: function() {
			  this.destroyActivityTimer();
			},
		
			/** 初始化数据，注意顺序 */
			initData: function(data) {
			  //初始化评论
			  this.initComment(data);
			  //初始化规格
			  //this.initSpecsPrice(data);
			  this.initCheckGoods(data);
			  //初始化店铺
			  this.initStore(data);
			  //检查一下购物的数量，可能无库存
			  this.checkCartNum(this.data.goodsInputNum);
			},
		
			/** 检查商品 */
			initCheckGoods: function(data) {
			  var that = this;
			  var item_id = data.spec_goods_price.length > 0 ? data.spec_goods_price[0]['item_id'] : '';
			  if (that.data.optionItemId) {
			    item_id = that.data.optionItemId;
			  }
			  request.get('/api/goods/activity', {
			    data: {
			      goods_id: data.goods.goods_id,
			      item_id: item_id,
			    },
			      isShowLoading: false,
			    success: function(res) {
			      //初始化规格
			      if (res.data.result.goods.activity_is_on == 1) {
			        data.activity = res.data.result.goods
			        that.initSpecsPrice(data);
			      } else {
			        data.goods.prom_type = 0;
			        that.initSpecsPrice(data);
			      }
			    }
			  });
			},
		
		
			/** 初始化店铺 */
			initStore: function(data) {
			  var s = data.store;
			  s.avgScore = (s.store_desccredit / 3 + s.store_servicecredit / 3 + s.store_deliverycredit / 3).toFixed(2);
			  s.descScoreDesc = common.getStoreScoreDecs(s.store_desccredit);
			  s.serviceScoreDesc = common.getStoreScoreDecs(s.store_servicecredit);
			  s.deliveryScoreDesc = common.getStoreScoreDecs(s.store_deliverycredit);
			  this.setData({
			    'data.store': s
			  });
			},
		
			/** 初始化评论相关 */
			initComment: function(data) {
			  //好评率
			  data.goods.goodCommentRate = data.statistics.high_rate;
			  //评论日期格式化
			  for (var i = 0; i < data.comment.length; i++) {
			    data.comment[i].addTimeFormat = util.formatTime(data.comment[i].add_time, false);
			    //设置5颗星s
			    var on = 'on';
			    var half = 'half';
			    var off = 'off';
			    var goods_rank_new = [];
			    for (var ii = 1; ii <= 5; ii++) {
			      if (data.comment[i].goods_rank >= ii) {
			        goods_rank_new.push(on);
			      } else {
			        if (ii - 1 < data.comment[i].goods_rank && data.comment[i].goods_rank < ii) {
			          goods_rank_new.push(half);
			        } else {
			          goods_rank_new.push(off);
			        }
			      }
			    }
			    data.comment[i].goods_rank_new = goods_rank_new;
			    //设置5颗星
			    data.comment[i].goods_rank = parseInt(data.comment[i].goods_rank);
		
			  }
			  //评论数
			  this.data.categories3[0].num = data.statistics.total_sum;
			  this.data.categories3[1].num = data.statistics.high_sum;
			  this.data.categories3[2].num = data.statistics.center_sum;
			  this.data.categories3[3].num = data.statistics.low_sum;
			  this.data.categories3[4].num = data.statistics.img_sum;
			  //渲染视图
			  this.setData({
			    categories3: this.data.categories3,
			    data: data
			  });
			},
		
			/** 初始化所有规格 */
			initSpecsPrice: function(data) {
			  var specSelect = 0; //初始化选中第一个规格
			  var specs = data.spec_goods_price;
			  if (specs.length == 0) { //没有规格
			    this.initActivity(data.activity);
			    return;
			  }
			  //第一次请求的总数据中的activity默认是第一种规格的,可减少一次请求
			  specs[0].activity = data.activity;
			  if (this.data.optionItemId) { //指定规格
			    for (var i = 0; i < specs.length; i++) {
			      if (specs[i].item_id == this.data.optionItemId) {
			        specSelect = i;
			        break;
			      }
			    }
			  } else { //初始化选库存不为0的规格
			    for (var i = 0; i < specs.length; i++) {
			      if (specs[i].store_count <= 0) {
			        continue;
			      }
			      specSelect = i;
			      break;
			    }
			  }
			  //生成子规格组(goods_spec_list)的各自选中项
			  var specIds = specs[specSelect].key.split("_");
			  var list = data.goods_spec_list;
			  for (var i = 0; i < list.length; i++) {
			    for (var j = 0; j < list[i].spec_list.length; j++) {
			      if (util.inArray(list[i].spec_list[j].item_id, specIds)) {
			        list[i].selectItemId = list[i].spec_list[j].item_id;
			        break;
			      }
			    }
			  }
			  this.setData({
			    specSelect: specSelect,
			    'data.goods_spec_list': list,
			    'data.spec_goods_price': specs
			  });
			  this.initSelectSpecGoods();
			},
		
			/** 初始化选中的规格商品 */
			initSelectSpecGoods: function() {
			  var specSelect = this.data.specSelect;
			  var specs = this.data.data.spec_goods_price;
			  var itemId = specs[specSelect].item_id;
			  if (specs[specSelect].prom_type == 0) {
			    var noActivity = {
			      prom_type: 0
			    };
			    specs[specSelect].activity = noActivity;
			    this.initActivity(noActivity);
			  } else if (typeof specs[specSelect].activity != 'undefined') {
			    this.initActivity(specs[specSelect].activity);
			  } else {
			    this.requestSpecInfo(specSelect);
			  }
			},
		
			/** 请求规格商品的活动信息 */
			requestSpecInfo: function(specSelect) {
			  var that = this;
			  var specs = this.data.data.spec_goods_price;
			  request.get('/api/goods/activity', {
			    data: {
			      goods_id: this.data.data.goods.goods_id,
			      item_id: specs[specSelect].item_id
			    },
			      isShowLoading: false,
			    success: function(res) {
			      specs[specSelect].activity = res.data.result.goods;
			      that.initActivity(res.data.result.goods);
			    }
			  });
			},
		
			/** 初始化显示的活动信息 */
			initActivity: function(activity) {
			  if (activity.prom_type && activity.prom_type != 6) {
			    var startTime = (new Date()).getTime();
			    if (activity.prom_type == 1) { //抢购
			      activity.priceName = '抢购价';
			      activity.countName = '限时抢购';
		
			    } else if (activity.prom_type == 2) { //团购
			      activity.priceName = '团购价';
			      activity.countName = '限时团购';
			     
			    } else if (activity.prom_type == 3) { //促销
			      activity.countName = '优惠促销';
			    } else if (activity.prom_type == 4) { //预售
			      activity.priceName = '预售价';
			      activity.countName = '预售';
			      
			    }
			    this.setData({
			      'data.goods.shop_price': activity.shop_price,
			    });
			    activity.countTime = '--天--时--分--秒';
			  } else if (activity.prom_type == 6) {
		
			    activity.countName = '该商品正在参与拼团';
			    activity.goods_id = activity.goods_id;
			    activity.team_id = activity.prom_id ? activity.prom_id : 0;
			    activity.item_id = activity.item_id ? activity.item_id : 0;
			  }
			  this.setData({
			    'select.activity': activity,
			  });
			  this.destroyActivityTimer();
			  this.createActivityTimer();
			  this.initSelectedData();
			},
		
			/** 初始化选中的（规格）商品的显示参数 */
			initSelectedData: function() {
			  var goods = this.data.data.goods;
			  var activity = this.data.select.activity;
			  var specs = this.data.data.spec_goods_price;
			  var specSelect = this.data.specSelect;
			  var stock = 0;
			  var price = 0;
			  var item_id = 0;
			  var active_item_id = 0;
			  var specImg = "/api/goods/goodsThumImages?goods_id=" + this.data.data.goods.goods_id + "&width=200&height=200";
			  if (activity.prom_type == 1 || activity.prom_type == 2) {
			    price = activity.shop_price;
			    //处理参与活动的数量为0的库存错误展示
			    item_id = typeof(activity.item_id) != 'undefined' ? specs[specSelect].item_id : 0;
			    active_item_id = typeof(activity.item_id) != 'undefined' ? activity.item_id : 0;
			    if (item_id == active_item_id) {
			      stock = activity.store_count;
			    } else if (specs.length == 0) {
			      stock = activity.store_count;
			    } else {
			      stock = specs[specSelect].store_count;
			    }
			  } else if (activity.prom_type == 3) {
			    price = activity.prom_price;
			    stock = specs.length > 0 ? specs[specSelect].store_count : goods.store_count;
			  } else if (specs.length > 0) {
			    price = specs[specSelect].price;
			    stock = specs[specSelect].store_count;
			  } else {
			    price = goods.shop_price;
			    stock = goods.store_count;
			  }
			  if (specs.length > 0) {
			    specImg = specs[specSelect].spec_img;
			    if (!specImg) {
			      specImg = "/api/goods/goodsThumImages?goods_id=" + this.data.data.goods.goods_id + "&width=200&height=200";
			    }
			  }
			    if (specImg.indexOf('http') < 0 && specImg.indexOf('https') < 0) {
			        specImg = this.data.url + specImg;
			    }
			  if (goods.exchange_integral > 0) {
			    price = price - goods.exchange_integral / parseInt(goods.point_rate);
			    price = price.toFixed(2);
			  }
			  if (this.data.select.activity.prom_type && this.data.select.activity.prom_type != 6){
			      this.setData({
			          'select.stock': stock,
			          'select.spec_img': specImg,
			          'select.specName': specs.length > 0 ? specs[specSelect].key_name : '',
			      });
			      return false;
			      
			  }else{
			      this.setData({
			          'select.price': price.split('.'),
			          'select.stock': stock,
			          'select.spec_img': specImg,
			          'select.specName': specs.length > 0 ? specs[specSelect].key_name : '',
			      });
			  }
			},
		
			/** 创建活动倒计时定时器 */
			createActivityTimer: function() {
			  var activity = this.data.select.activity;
			  if (!activity.prom_type) {
			    return;
			  }
			  var that = this;
			  this.data.timer = setInterval(function() {
			    var remainTime = activity.end_time * 1000 - (new Date()).getTime();
			    remainTime = util.remainTime(remainTime);
			    that.setData({
			      'select.activity.countTime': remainTime
			    });
			  }, 1000);
			},
		
			/** 销毁活动倒计时定时器 */
			destroyActivityTimer: function() {
			  if (this.data.timer) {
			    clearInterval(this.data.timer);
			    this.data.timer = null;
			  }
			},
		
			/** 商品首页 */
			tabClick: function(e) {
			  var typeId = e.currentTarget.id;
			  this.setData({
			    activeCategoryId: typeId
			  });
			  if (typeId == 1) {
			    this.tabGoodsContent();
			    this.setData({
			      loading: true,//加载动画的显示
			      goods_norms: 1,
			    })
			  } else if (typeId == 2) {
			    this.tabComment();
			  }
			},
		
			/** 商品详情页 */
			tabClick2: function(e) {
			  this.setData({
			    activeCategoryId2: e.currentTarget.id
			  });
			},
		
			/** 评论页 */
			tabClick3: function(e) {
			  if (e.currentTarget.id == this.data.activeCategoryId3) {
			    return;
			  }
			  this.setData({
			    activeCategoryId3: e.currentTarget.id
			  });
			  this.requestComments(this.data.data.goods.goods_id, e.currentTarget.id);
			},
		
			/** 请求评论数据 */
			requestComments: function(goodsId, commentType) {
			  var that = this;
			  commentType++;
			  var requestUrl = that.data.url + '/api/goods/getGoodsComment?goods_id=' + goodsId + '&type=' + commentType;
			  request.get(requestUrl, {
			      isShowLoading: false,
			    success: function(res) {
			      var comments = res.data.result;
			      for (var i = 0; i < comments.length; i++) {
			        comments[i].addTimeFormat = util.formatTime(comments[i].add_time);
			        comments[i].goods_rank = parseInt(comments[i].goods_rank);
			      }
			        isShowLoading: false,
			      that.setData({
			        comments: comments
			      });
			    }
			  });
			},
		
			/** 返回顶部 */
			doScrollTop: function() {
			  wx.pageScrollTo({
			    scrollTop: 0
			  });
			},
		
			/** 打开评论页 */
			tabComment: function() {
			  this.setData({
			    activeCategoryId: 2
			  });
			  if (!this.data.comments) {
			    this.requestComments(this.data.data.goods.goods_id, this.data.activeCategoryId3);
			  }
			},
		
			/** 打开商品内容页 */
			tabGoodsContent: function() {
			  this.setData({
			    activeCategoryId: 1
			  });
			},
		
			/** 请求商品详情页嵌入的html内容 */
			requestGoodsContent: function() {
			  var that = this;
			  request.get('/api/goods/goodsContent', {
			    data: {
			      id: this.data.data.goods.goods_id
			    },
			    isShowLoading:false,
			    success: function(res) {
			      WxParse.wxParse('content', 'html', res.data.result.goods_content, that, 6);
			      //网页中的图片加上域名
			      common.wxParseAddFullImageUrl(that, 'content');
			      that.setData({
			        goodsAttrs: res.data.result.goods_attr_list
			      });
			    },
			  });
			},
			/** 获取可领券的优惠券 */
			requestCardList: function () {
			  var that = this;
			  request.get('/api/activity/coupon_center', {
			    data: {
			      cat_id: that.data.result.goods.cat_id3,
			      goods_id: that.data.result.goods.goods_id,
			    },
			    isShowLoading: false,
			    success: function (res) {
			      for (let i in res.data.result){
			        res.data.result[i].condition = parseInt(res.data.result[i].condition);
			        res.data.result[i].money = parseInt(res.data.result[i].money);
			      }
			      that.setData({ cardList: res.data.result || [] })
			    }
			  });
			},
			/** 领取卡券 */
			getCardList: function () {
			  wx.navigateTo({
			    url: '../../activity/coupon_list/coupon_list?type=goodsinfo',
			  })
			},
		
			/** 点击规格按钮的回调函数 */
			selectSpec: function(e) {
			  //对商品数量进行判断，对库存进行判断
			  var itemId = e.currentTarget.dataset.itemid;
			  var listIdx = e.currentTarget.dataset.listidx;
			  var list = this.data.data.goods_spec_list;
			  if (list[listIdx].selectItemId == itemId) {
			    return;
			  }
			  list[listIdx].selectItemId = itemId;
			  var newSpecKeys = [];
			  for (var i = 0; i < list.length; i++) {
			    newSpecKeys[i] = list[i].selectItemId;
			  }
			  //item排序,生成key
			  var newSpecKeys = util.sortSize(newSpecKeys).join('_');
			  var newSpecSelect = 0;
			  var specs = this.data.data.spec_goods_price;
			  for (var i = 0; i < specs.length; i++) {
			    if (specs[i].key == newSpecKeys) {
			      newSpecSelect = i;
			      break;
			    }
			  }
			  this.setData({
			    specSelect: newSpecSelect,
			    'data.goods_spec_list': list
			  });
			  this.initSelectSpecGoods();
			  this.checkCartNum(this.data.goodsInputNum);
			},
		
			/** 加入购物车 */
			addCart: function(e) {
			  var that = this;
			  var itemId = 0;
			  var specs = this.data.data.spec_goods_price;
			  //区分有规格和无规格
			  if (specs.length > 0) {
			    if (specs[this.data.specSelect].store_count <= 0) {
			      return app.showWarning("库存已为空！");
			    }
			    itemId = specs[this.data.specSelect].item_id;
			  } else {
			    if (this.data.data.goods.store_count <= 0) {
			      return app.showWarning("库存已为空！");
			    }
			  }
			  if (this.data.goodsInputNum <= 0) {
			    return app.showWarning("商品数量不能为0");
			  }
			  var data = {
			    goods_id: this.data.data.goods.goods_id,
			    goods_num: this.data.goodsInputNum,
			    item_id: itemId,
			    form:1
			  };
			  if (this.data.data.goods.is_virtual) {
			    return this.buyVirtualGoods(data);
			  }
			  //检查用户是否登录方可操作立即购买
			  if (!app.auth.isAuth()) {
			    app.showLoading(null, 1500);
			    app.getUserInfo();
			    return;
			  }
			  if (e.currentTarget.dataset.action == 'add') { //加入购物车
			    if (this.data.shippingCost < 0 || this.data.select.stock <= 0) {
			      return;
			    }
			    request.post('/api/cart/addCart', {
			      data: data,
			      success: function(res) {
			        wx.showModal({
			          title: '添加成功！',
			          cancelText: '去购物车',
			          confirmText: '再逛逛',
			          success: function(res) {
			            if (res.cancel) {
			              wx.reLaunch({
			                url: '/pages/cart/cart/cart'
			              });
			            } else {
			              that.requestCardNum();
			            }
			          }
			        });
			      }
			    });
			  } else if (e.currentTarget.dataset.action == 'exchange') { //立即兑换
			    this.exchange(data);
			  } else { //立即购买
			    this.buyNow(data);
			  }
			},
		
			/** 购买虚拟商品 */
			buyVirtualGoods: function(data) {
			  //检查用户是否登录方可操作立即购买
			  if (!app.auth.isAuth()) {
			    app.showLoading(null, 1500);
			    app.getUserInfo();
			    return;
			  }
			  Object.assign(data, {
			    goods_name: this.data.data.goods.goods_name,
			    spec_name: this.data.select.specName,
			    price: this.data.select.price,
			  });
			  wx.navigateTo({
			    url: '/pages/virtual/buy_step/buy_step?' + util.Obj2Str(data)
			  });
			},
		
			/** 立即兑换 */
			exchange: function(data) {
			  //检查用户是否登录方可操作立即购买
			  if (!app.auth.isAuth()) {
			    app.showLoading(null, 1500);
			    app.getUserInfo();
			    return;
			  }
			  if (this.data.shippingCost < 0 || this.data.select.stock <= 0) {
			    return;
			  }
			  wx.navigateTo({
			    url: '/pages/cart/integral/integral?' + util.Obj2Str(data)
			  });
			},
		
			/** 立即购买 */
			buyNow: function(data) {
			  //检查用户是否登录方可操作立即购买
			  if (!app.auth.isAuth()) {
			    app.showLoading(null, 1500);
			    app.getUserInfo();
			    return;
			  }
			  if (this.data.shippingCost < 0 || this.data.select.stock <= 0) {
			    return;
			  }
			  Object.assign(data, {
			    action: 'buy_now',
			  });
			  wx.navigateTo({
			    url: '/pages/cart/cart2/cart2?' + util.Obj2Str(data)
			  });
			},
		
			/** 增加购买的商品数量 */
			addCartNum: function(e) {
			  this.checkCartNum(this.data.goodsInputNum + 1);
			},
		
			/** 减少购买的商品数量 */
			subCartNum: function(e) {
			  this.checkCartNum(this.data.goodsInputNum - 1);
			},
		
			/** 输入购买的数量 */
			inputCartNum: function(e) {
			  this.checkCartNum(Number(e.detail.value));
			},
		
			/** 检查购买的数量 */
			checkCartNum: function(num) {
			  var stock = this.data.data.goods.store_count;
			  if (this.data.data.spec_goods_price.length > 0) {
			    stock = this.data.data.spec_goods_price[this.data.specSelect].store_count;
			  }
			  if (num > stock || stock == 0) {
			    num = stock;
			  } else if (num < 1) {
			    num = 1;
			  }
			  this.setData({
			    goodsInputNum: num
			  });
			},
		
			/** 关闭规格弹窗 */
			closeSpecModal: function(e) {
			  var query = wx.createSelectorQuery();
			  //选择class
			  var that = this;
			  var height = 0;
			  query.select('.spec-model').boundingClientRect(function (rect) {
			    // console.log(rect.width)
			    height = rect.height
			    var animation = wx.createAnimation({
			      duration: 200,
			      timingFunction: 'ease'
			    });
			    console.log(height)
			    animation.translate(0, height).step()
			    that.setData({
			      ani: animation.export(),
			    })
			    setTimeout(function(){
			      that.setData({
			        openSpecModal: false,
			      })
			    },200)
			  }).exec();
			},
		
			/** 打开规格弹窗 */
			openSpecModel: function(e) {
			    var a = e.currentTarget.dataset.index;
			    a = a==undefined?false:a
			  this.setData({
			    openSpecModal: true,
			    judge: a
			  });
			  var query = wx.createSelectorQuery();
			  //选择class
			  var that = this;
			  var height = 0;
			  query.select('.spec-model').boundingClientRect(function (rect) {
			    // console.log(rect.width)
			    height = rect.height
			    var animation = wx.createAnimation({
			      duration: 200,
			      timingFunction: 'ease'
			    });
			    console.log(height)
			    animation.translate(0,-height).step()
			    that.setData({
			      ani: animation.export()
			    })
			  }).exec();
			},
		
			collectGoods: function() {
			  var that = this;
			  request.post('/api/goods/collectGoodsOrNo', {
			    data: {
			      goods_id: that.data.data.goods.goods_id
			    },
			      isShowLoading: false,
			    success: function(res) {
			      that.setData({
			        'data.goods.is_collect': !that.data.data.goods.is_collect
			      });
			    }
			  });
			},
		
			/** 联系客服 */
			contactService: function() {
			  app.confirmBox('请联系客服：' + this.data.data.store.store_phone);
			},
		
			/** 请求购物车数量 */
			requestCardNum: function() {
			  var that = this;
			  request.get('/api/cart/cartList', {
			      isShowLoading: false,
			    success: function(res) {
			      var cartGoodsNum = 0;
			      var list = res.data.result.storeList;
			      if (!list) {
			        return;
			      }
			      for (var i = 0; i < list.length; i++) {
			        for (var j = 0; j < list[i].cartList.length; j++) {
			          cartGoodsNum += list[i].cartList[j].goods_num;
			        }
			      }
			      that.setData({
			        cartGoodsNum: cartGoodsNum
			      });
			    }
			  });
			},
		
			/** 预览图片 */
			previewCommentImgs: function(e) {
			  var imgs = this.data.comments[e.currentTarget.dataset.cidx].img;
			  wx.previewImage({
			    current: imgs[e.currentTarget.dataset.id],
			    urls: imgs
			  });
			},
		
			/** 预览图片 */
			previewGoodsCommentImgs: function(e) {
			  var that = this;
			  var imgs = this.data.data.comment[e.currentTarget.dataset.cidx].img;
			  imgs = imgs.map(function(val) {
			    return that.data.url + val;
			  });
			  wx.previewImage({
			    current: imgs[e.currentTarget.dataset.id],
			    urls: imgs
			  });
			},
			/** 关闭优惠信息弹窗 */
			closePromModal: function() {
			  this.setData({
			    openPromModal: false
			  });
			},
		
			/** 打开优惠信息弹窗 */
			openPromModal: function() {
			  this.setData({
			    openPromModal: true
			  });
			},
		
			/**
			 * 转发按钮
			 */
			// onShareAppMessage: function (res) {
			//     return setting.share;
			// },
			/**
			 * 转发按钮
			 */
			onShareAppMessage: function(res) {
			  var that = this
			  var goods = that.data.data.goods;
			  var url = that.data.url;
			  var original_img = goods.original_img;
			  if (!original_img) {
			    original_img = goods.spec_goods_price[0].spec_img;
			  }
			  if (original_img.indexOf('http') < 0 && original_img.indexOf('https') < 0) {
			    original_img = url + original_img
			  }
			  return {
			    title: goods.goods_name, //自定义转发标题
			    path: '/pages/goods/goodsInfo/goodsInfo?goods_id=' + goods.goods_id + '&item_id=' + that.data.optionItemId + '&first_leader=' + wx.getStorageSync('app:userInfo')['user_id'],
			    // imageUrl: goods.original_img ? url + goods.original_img : url + goods.spec_goods_price[0].spec_img
			    imageUrl: original_img
			  }
			},
			/** 商品分享海报s */
			catchShare: function() {
			  this.setData({
			    actionSheetHidden: false
			  })
		
			},
		
			listenerActionSheet: function(e) {
			  this.setData({
			    actionSheetHidden: !this.data.actionSheetHidden
			  })
			},
		
			/**
			 * 获取商品分享海报
			 */
			getSharePic: function() {
			  var that = this
		
			  that.setData({
			    actionSheetHidden: !this.data.actionSheetHidden
			  })
			  wx.showLoading({
			    title: '正在生成',
			    mask: true,
			  })
		
			  var item_id = (that.data.data.spec_goods_price.length) > 0 ? that.data.data.spec_goods_price[that.data.specSelect].item_id : 0
		
			  wx.getImageInfo({
			    src: that.data.url + '/api/goods/goodsSharePoster?id=' + that.data.data.goods.goods_id +
			      '&item_id=' + item_id +
			      '&prom_id=' + that.data.data.goods.prom_id +
			      '&store_id=' + that.data.data.goods.store_id +
			      '&prom_type=' + that.data.data.goods.prom_type +
			      '&leader_id=' + wx.getStorageSync('app:userInfo')['user_id'],
			      isShowLoading: false,
			    success: function(res) {
			      that.setData({
			        share_btn: true,
			        share_pic: res.path
			      })
			    },
			    complete: function(res) {
			      wx.hideLoading()
			    }
			  })
			},
		
			closeShareModal: function() {
			  this.setData({
			    share_btn: false
			  })
		
			},
		
			saveSharePic: function() {
			  var that = this
			  wx.authorize({
			    scope: 'scope.writePhotosAlbum',
			    success: function(res) {
			      wx.saveImageToPhotosAlbum({
			        filePath: that.data.share_pic,
			        success: function(res) {
			          that.setData({
			            share_btn: false
			          })
			          wx.showToast({
			            title: '保存成功',
			            duration: 2000
			          })
			        }
			      })
			    },
			    fail: function(res) {
			      common.checkAuthorize('scope.writePhotosAlbum')
			    }
			  })
		
			},
		
			previewSharePic: function() {
			  wx.previewImage({
			    urls: [this.data.share_pic],
			  })
			},
			/** 商品分享海报e */
			  /** 领取卡券 */
			  getCardList: function () {
			      wx.navigateTo({
			          url: '../../activity/coupon_list/coupon_list?type=goodsinfo',
			      })
			  },
			  // 页面上拉触底事件的处理函数
			  onReachBottom: function () {
			      if (load.canloadMore()) {
			          this.setData({
			              loading: true,//加载动画的显示
			              goods_norms: 1,
			          })
			      }
			  }
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		margin-bottom: 20rpx;
		overflow-x: hidden;
		padding-top: 80rpx;
	}
	.image{
	    vertical-align: top;
	}
	.type-navbar{
	    display: flex;
	    justify-content: center;
	    width: 100%;
	    height:80rpx;
	    background-color: #fff;
	    position: fixed;
	    left: 0;
	    top: 0;
	    z-index: 999;
	}
	.type-box{
	    width:25%;
	    box-sizing: border-box;
	    font-size: 28rpx;
	    line-height: 76rpx;
	    padding: 0 20rpx;
	    text-align: center;
	    display: inline-block;
	    overflow: hidden;
	}
	.type-navbar-item{
	    border-bottom: 4rpx solid #fff;
	}
	.type-item-on{
	    color: #ff3b3b;
	    border-bottom: 4rpx solid #ff3b3b;
	}
	.swiper_box {
	    width: 100%;
	    height: 750rpx;
	}
	.goods-title{
	    display: flex;
	    justify-content: space-between;
	    height: 108rpx;
	    position: relative;
	    padding: 0 20rpx;
	}
	.goods-name{
	    width: 704rpx;
	    height: 82rpx;
	    margin: 20rpx 0;
	    line-height: 40rpx;
	    font-size: 30rpx;
	    color: #1d1d1d;
	    font-weight: 600;
	}
	.goods-collect{
	    width: 112rpx;
	    padding-top: 12rpx;
	}
	.collect-img{
	    width: 48rpx;
	    height: 48rpx;
	    margin: 0 auto;
	    overflow: hidden;
	}
	.collect-des{
	    text-align: center;
	    font-size: 22rpx;
	    color: #666;
	}
	.pd-bg-fff{
	    padding: 0 20rpx;
	}
	.cs-ing-name{
	    margin-top: -4rpx;
	}
	.coupons{
	    margin-top: 16rpx;
	    border-bottom:2rpx solid #f3f3f3;
	}
	.specifications{
	    margin-top: 16rpx;
	}
	.goods-price{
	    font-size: 30rpx;
	    padding:20rpx 20rpx; 
	    line-height: 40rpx;
	    color: #999;
	    border-bottom: 1px solid #f3f3f3;
	}
	.prom-info{
	    margin: 10rpx 0;
	    color: #ff3b3b;
	}
	.prom-info>.prom-type{
	    color: white;
	    background-color: #ff3b3b;
	    margin-right: 14rpx;
	    padding: 2rpx 8rpx;
	    border-radius: 4rpx;
	}
	.market-price{
	    display: flex;
	    font-size: 22rpx;
	    color: #999;
	   position: relative;
	   margin-top: 10rpx;
	}
	.market-price .line{
	    text-decoration: line-through;
	}
	.goods-num{
	    display: flex;
	    position: absolute;
	    right: 0;
	    width: 370rpx;
	}
	.logistics-item{
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    height: 90rpx;
	    font-size: 26rpx;
	    color: #666;
	}
	.hd_item{
	    display: flex;
	    font-size: 26rpx;
	    color: #666;
	}
	.activity .event{
	    width:580rpx;
	}
	.activity{
	    padding-top: 20rpx;
	}
	.activity .logistics-item{
	    position: relative;
	}
	.activity .man {
	    font-size:22rpx;
	    color: #666;
	}
	.activity .man .text{
	    background-color:#ff3b3b;
	    border-radius:4rpx;
	    color:#fff;
	    padding:5rpx 8rpx;
	    display:inline-block;
	    margin-right:20rpx;
	    margin-bottom:30rpx;
	}
	.activity .man .item_content{
	    white-space:nowrap;
	    text-overflow:ellipsis;
	    overflow:hidden;
	    width: 450rpx;
	    display: inline-block;
	    height:24rpx;
	    line-height:28rpx;
	}
	.address{
	    margin-top: 16rpx;
	}
	.address .logistics-item{
	    height: 70rpx;
	}
	.goods-num .stock{
	    position: absolute;
	    right: 0;
	}
	.good-comment .co-red{
	    padding-left: 10rpx;
	}
	.item-title{
	    width: 120rpx;
	}
	.item-mes{
	    color: #1f1f1f;
	    width: 570rpx;
	    height: 70rpx;
	    line-height: 74rpx;
	}
	.item-img{
	    width: 28rpx;
	    height: 28rpx;
	    margin-top: 4rpx;
	}
	.price.co-red{
	    font-size: 56rpx;
	    font-weight: 600;
	}
	.price.co-red>text{
	    font-size:36rpx;
	    padding-bottom:16rpx;
	    display:inline-block;
	}
	.price .mon{
	    font-size: 30rpx;
	}
	.prom-item {
	    color: #ff3b3b;
	    border: 1px solid #ff3b3b;
	    border-radius: 18rpx;
	    line-height: 40rpx;
	    height: 40rpx;
	    padding: 2rpx 8rpx;
	}
	.promotion-item-mes-card{
	    width:500rpx;
	    overflow:hidden;
	    white-space:nowrap;
	    height:70rpx;
	    line-height:70rpx;
	    margin-right:66rpx;
	}
	.promotion-item-mes-card view{
	    display: inline-block;
	    margin-right: 10rpx;
	}
	.promotion-item-mes-cardborder{
	    border:1rpx solid #ff3b3b;
	    color:#ff3b3b;
	    border-radius: 10rpx;
	    font-size: 20rpx;
	    height: 28rpx;
	    padding: 4rpx 8rpx;
	}
	.guarantee{
	    justify-content:flex-start;
	}
	.ico-item{
	    width: 32rpx;
	    height: 32rpx;
	    margin-right: 10rpx;
	}
	.guarantee>view{
	    display: flex;
	    align-items: center;
	    height: 32rpx;
	    color: #666;
	    width: 33.333333%;
	}
	.user-comment{
	    margin:16rpx 0 0 0;
	    font-size: 28rpx;
	}
	.good-comment,.comment-num{
	    display: flex;
	}
	.recommend{
	    background-color: #fff;
	    border-bottom: 1px solid #f3f3f3;
	    padding-bottom: 20rpx;
	}
	.recommend-title{
	    height: 80rpx;
	    line-height: 90rpx;
	    font-size: 30rpx;
	    padding: 0 22rpx;
	    color: #333333;
	    font-weight: 600;
	}
	.recommend-ul{
	  padding: 0 10rpx;
	}
	.recommend-ul .li{
	    width: 230rpx;
	    box-sizing: border-box;
	    font-size: 28rpx;
	    color: #333;
	    display: inline-block;
	    margin-left:10rpx;
	    border: 2rpx solid #fff;
	    margin-bottom: 10rpx;
	    overflow: hidden;
	}
	.recommend-ul .li .color{
	    color: #ff3b3b; 
	    font-size: 26rpx;
	    padding-left: 10rpx;
	    font-weight: 600;
	    height: 40rpx;
	    line-height: 40rpx;
	}
	.recommend-ul .li text{
	    font-size: 20rpx;
	    margin-right:2rpx;
	}
	.shops-mes{
	    position: relative;
	    margin: 16rpx 0 0 0;
	    padding: 20rpx 22rpx 0 20rpx;
	    background-color: #fff;
	}
	.shops-info{
	    display: flex;
	    height: 100rpx;
	}
	.shops-name .ellipsis-1{
	    color: #1d1d1d;
	    font-size: 28rpx;
	}
	.shops-pic{
	    width: 100rpx;
	    height: 100rpx;
	    margin-right: 20rpx;
	    border: 1px solid #f3f3f3; 
	}
	.shops-name{
	    height: 100rpx;
	    width: 420rpx;
	    line-height: 50rpx;
	    font-size: 30rpx;
	}
	.store-desc{
	    font-size: 22rpx !important;
	    color: #999 !important;
	}
	.store-desc text:nth-child(1){
	    margin-right: 24rpx;
	}
	.baguette{
	    width: 124rpx;
		height: 48rpx;
	    line-height: 48rpx;
	    text-align: center;
		background-image: linear-gradient(90deg, 
			#ff7019 0%, 
			#ff3b3b 100%), 
		linear-gradient(
			#ffc019, 
			#ffc019);
		background-blend-mode: normal, 
			normal;
		border-radius: 24px;
	    font-size: 20rpx;
	    color: #fff;
	    position: absolute;
	    right: 22rpx;
	    top:58rpx;
	}
	.scores-common{
	    position: absolute;
	    right: 30rpx;
	    top: 80rpx;
	    font-size: 28rpx;
	    line-height: 1; 
	    color:#333;
	}
	.scores-list{
	    display: flex;
	    height: 40rpx;
	    line-height: 40rpx;
	    padding:30rpx 0; 
	    justify-content: space-between;
	    border-bottom:2rpx solid #f3f3f3;
	}
	.scores-item{
	    font-size: 22rpx;
	    color:#999;
	    text-align: center;
	    line-height: 40rpx;
	    justify-content: space-between;
	}
	.scores-item .co-red{
	    display: inline-block;
	    padding-left: 6rpx;
	}
	.scores-item .co-red text{
	    width: 30rpx;
	    height:30rpx;
	    line-height: 32rpx;
	    background: #ececec;
	    font-size: 18rpx;
	    color: #ff3c3c;
	    display: inline-block;
	    border-radius: 50%;
	}
	.scores-item .co-red .middle{
	    color: #ff8b03;
	}
	.scores-item .co-red .low{
	    color: #999;
	}
	.scores-btns{
	    height: 64rpx;
	}
	.scores-btns-item{
	    float: left;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 330rpx;
	    height: 60rpx;
	    border:1px solid #f3f3f3;
	    font-size: 28rpx;
	    color: #666;
	}
	.scores-btns-item:first-child{
	    margin-right: 20rpx;
	}
	.scores-btns-pic{
	    width:40rpx;
	    height:37rpx;
	    margin:0 10rpx;
	}
	.li-img{
	    width: 230rpx;
	    height: 230rpx;
	    margin: 0 auto;
	}
	.li-img .wh100{
	    width: 226rpx;
	}
	.li-title{
	    color: #333333;
	    line-height: 30rpx;
	    margin: 10rpx 10rpx;
	    -webkit-line-clamp:1;
	    font-size: 22rpx;
	}
	.comment-item{
	    background-color: #fff;
	    font-size: 28rpx;
	    width: 710rpx;
	    border-radius: 10rpx;
	    margin: 0 auto;
	    margin-bottom: 20rpx;
	}
	.comment-title{
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    height: 102rpx;
	    margin:0 30rpx;
	    color: #333;
	    border-bottom: 1px solid #f3f3f3;
	}
	.user-name{
	    display: flex;
	    align-items: center;
	}
	.user-pic{
	    width: 54rpx;
	    height: 54rpx;
	    margin-right: 10rpx;
	    border-radius:50%;
	    overflow: hidden;
	}
	.user-word{
	    display: inline-block;
	    max-width: 310rpx;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	}
	.stars{
	    float: left;
	    display: flex;
	    height: 42rpx;
	    line-height: 42rpx;
	    margin:15rpx 0; 
	    width: 200rpx;
	}
	.star{
	    width: 30rpx;
	    height: 28rpx;   
	}
	.state-spec{
	    margin:15rpx 0; 
	    float: right;
	    font-size: 24rpx;
	    color: #666;
	    width: 460rpx;
	    text-align: right;
	}
	.comment-cont{
	    padding: 0 30rpx 30rpx;
	    border-bottom: 1px solid #f3f3f3;
	}
	.comment-cont view{
	    overflow: hidden;
	}
	.comment-mes{
	    line-height: 42rpx;
	}
	.img-ul{
	    display: flex;
	    flex-wrap: wrap;
	}
	.img-li{
	    width: 120rpx;
	    height: 120rpx;
	    margin: 8rpx;
	}
	.comment-btn{
	    height: 60rpx;
	    padding: 20rpx 30rpx;
	}
	.comment-btn .btn{
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    height: 60rpx;
	    width: 45%;
	    border: 1px solid #f3f3f3;
	}
	.comment-btn .btn-img{
	    width: 30rpx;
	    height: 28rpx;
	    margin: 0 10rpx;
	}
	.reply-ul{
	    margin-top: 20rpx;
	}
	.reply-li{
	    color: #aaa;
	}
	.flex_bottom{
	    display:flex;
	    justify-content: space-around;
	    width: 270rpx;
	    padding: 0 30rpx;
	}
	.estimate .star_on image{
	    width: 18rpx;
	    height:18rpx;
	    margin-right: 8rpx;
	    margin-top: 8rpx;
	}
	.estimate{
	    padding:10rpx 20rpx 20rpx 20rpx;
	    background: #fff;
	    position: relative;
	}
	.estimate .user_img{
	    width: 76rpx;
	    height:76rpx;
	    position: absolute;
	    border-radius:50%;
	}
	.estimate .user{
	    padding-left: 110rpx;
	}
	.estimate .star_on text{
	    color: #333;
	    font-size: 26rpx;
	}
	.estimate .star_on text:nth-child(1){
	    margin-right: 22rpx;
	    max-width:220rpx;
	    display:inline-block;
	    white-space:nowrap;
	    text-overflow:ellipsis;
	    overflow:hidden;
	}
	.estimate .star_on .time{
	    font-size: 24rpx;
	    color:#999;
	    float: right;
	    margin-top: 10rpx;
	}
	.estimate_img image{
	    width: 110rpx;
	    height:110rpx;
	    margin-right: 16rpx;
	}
	.estimate_content{
	    font-size: 24rpx;
	    color:#333;
	    line-height: 36rpx;
	    display: inline-block;
	    margin-top: 10rpx;
	}
	.estimate .user{
	    border-bottom: 2rpx solid #f3f3f3;
	    padding-bottom: 27rpx;
	}
	.estimate .estimate_img{
	    margin-top: 20rpx;
	}
	.evaluation{
	    font-size: 30rpx;
	    color:#333;
	    font-weight: 600;
	}
	.evaluation text{
	    font-size: 22rpx;
	    color: #999;
	    font-weight: 500;
	    margin-left: 16rpx;
	}
	.good-comment{
	    line-height: 22rpx;
	    color:#999;
	    font-size: 22rpx;    
	}
	.good-comment .item-img{
	    width: 22rpx;
	    height: 22rpx;
	    padding-left: 8rpx;
	    margin-top: 0;
	}
	.item-mes .loc{
	    width: 22rpx;
	    height:26rpx;
	    margin-top: 22rpx;
	}
	.join-cart{
	    position: fixed;
	    left: 0;
	    bottom: 0;
	    display: flex;
	    width: 100%;
	    height: 100rpx;
	    background-color: #fff;
	    text-align: center;
	}
	.cart-ico{
	    font-size: 24rpx;
	    color: #333;
	}
	.shopping-cart{
	    position: relative;
	}
	.cs-img{
	    width: 48rpx;
	    height: 48rpx;
	    margin-top: 16rpx;
	}
	.cs-button{
	    font-size: 22rpx;
	    border: 1rpx solid #fff;
	    line-height: 45rpx; 
	    color: #666;
	}
	
	.cs-button::after{ border: none; } 
	.sc-img{
	    width: 48rpx;
	    height: 48rpx;
	    margin-top: 14rpx;
	    font-size: 22rpx;
	    color: #666;
	}
	.cs-img-kf{
	    margin-top: 8rpx
	}
	.cart-num{
	    position: absolute;
	    left: 50%;
	    top: 4rpx;
	    width: 40rpx;
	    height: 40rpx;
	    line-height: 40rpx;
	    text-align: center;
	    border-radius: 50%;
	    color: #fff;
	    background-color: rgba(217,81,99,0.9);
	}
	.shopping_cart{
	    font-size: 22rpx;
	    color: #666;
	}
	.cart-btn{
	    font-size: 28rpx;
	    color: #fff;
	    line-height: 100rpx;
	}
	.join-btn{
	    background-color: #ffb03f;
	    width: 210rpx;
	}
	.buy-btn{
	    background-color: #ff3b3b;
	    width: 210rpx;
	}
	view.cart-btn-lg{
	    width: 420rpx;
	}
	.toTop{
	    position: fixed;
	    z-index: 3;
	    right: 20rpx;
	    bottom: 160rpx;
	    width: 68rpx;
	    height: 68rpx;
	    border:1px solid #f3f3f3;
	    border-radius: 50%;
	    overflow: hidden;
	    cursor: pointer;
	}
	.comment-more{
	    height: 56rpx;
	    line-height: 56rpx;
	    font-size: 26rpx;
	    color: #666;
	    text-align: center;
	    background-color: #fff;
	}
	.goods-more{
	    background-color: #fff;
	}
	/* 详情 */
	.goods-norms{
	    background-color: #fff;
	}
	.type-navbar2{
	    display: flex;
	    height: 72rpx;
	    border-bottom:1px solid #f3f3f3;
	}
	.type-box2{
	    width:50%;
	    font-size: 26rpx;
	    line-height: 72rpx;
	    text-align: center;
	    overflow: hidden;
	}
	.type-item2-on{
	    color: #ff3b3b;
	}
	.parameter{
	    padding: 40rpx 0;
	}
	.table{
	    width: 698rpx;
	    margin: 0 auto;
	    border:1px solid #f3f3f3;
	    border-bottom: none;
	}
	.tb{
	    width: 100%;
	    min-height: 69rpx;
	    line-height: 69rpx;
	    border-bottom:1px solid #f3f3f3;
	    font-size: 28rpx;
	    text-align:center; 
	    color: #333;
	}
	.th-thitle{
	    font-weight: bold;
	    background-color:#f5fafe; 
	}
	.td-cont{
	    display: flex;
	}
	.td-title{
	    width: 259rpx;
	    background-color:#f5fafe; 
	    border-right:1px solid #f3f3f3; 
	}   
	.td-text{
	    width: 439rpx;
	}
	
	.type-navbar3{
	    display: flex;
	    height: 88rpx;
	    border-top:1px solid #ddd;
	    border-bottom:1px solid #f3f3f3;
	    background: #fff;
	    margin-bottom: 20rpx;
	}
	.type-box3{
	    background: #fff;
	    font-size: 24rpx;
	    line-height: 44rpx;
	    height: 44rpx;
	    overflow: hidden;
	    border-radius: 6rpx;
	    border: 1px solid #ff3b3b;
	    color: #333;
	    margin: 20rpx 10rpx;
	}
	.type-box3 view{
	  padding: 0 10rpx;
	}
	.type-item3-on{
	    background: #ff3b3b;
	    color: #fff;
	}
	/* 规格弹框 */
	.spec-model{
	    position: fixed;
	    top: 100vh;
	    z-index: 20;
	    background: white;
	    width: 100%;
	    padding: 0 30rpx;
	    font-size: 32rpx;
	    box-sizing: border-box;
	    overflow-x: hidden;
	}
	.spec-goods{
	    padding: 15rpx 0 20rpx;
	    float: left;
	    width: 100%;
	    border-bottom: 1px solid #f3f3f3;
	}
	.spec-img{
	    float: left;
	    height: 180rpx;
	    width: 180rpx;
	    margin-top:6rpx;
	}
	.spec-goods-info{
	    float: left;
	    padding: 0 20rpx; 
	    width: 442rpx;
	}
	.spec-goods-name{
	    color: #333333;
	    font-size: 28rpx;
	    line-height: 36rpx;
	    height: 75rpx;
	    margin: 10rpx 0 45rpx 0;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display:-webkit-box;
	    -webkit-box-orient:vertical;
	    -webkit-line-clamp:2;
	}
	.spec-goods-price{
	    color: #ff3b3b;
	    font-size: 36rpx;
	    font-weight: bold;
	    line-height: 50rpx;
	    position:relative;
	}
	.spec-goods-price text{
	    font-size: 22rpx;
	} 
	.spec-goods-stock{
	    font-size: 24rpx;
	    color: #999999;
	    display:inline-block;
	    font-weight:500;
	    margin-left:40rpx;
	    position:absolute;
	    top:0rpx;
	}
	.spec-name{
	    clear: both;
	    padding: 20rpx 0;
	    font-size: 30rpx;
	}
	.spec-name.number{
	    padding-top: 40rpx;
	}
	.count{
	    float: right;
	    width: 184rpx;
	    height: 50rpx;
	    font-size: 28rpx;
	    font-weight:600;
	}
	.count>view,.count>input{
	    float: left;
	    width: 60rpx;
	    height: 50rpx;
	    line-height: 50rpx;
	    text-align: center;
	}
	.spec-btn{
	    color: black;
	    background-color: white;
	    padding: 6rpx 14rpx;
	    font-size: 22rpx;
	    line-height: 28rpx;
	    float: left;
	    border: 1rpx solid #f3f3f3;
	    margin: 4rpx 12rpx 10rpx 0;
	    border-radius: 50rpx;
	}
	.spec-btn-click{
	    color: white;
	    background-color: #ff3b3b;
	    border: 1rpx solid #ff3b3b;
	}
	.spec-cart-btns{
	    margin:20rpx -30rpx 0;
	    padding: 20rpx 34rpx;
	    float: left;
	    width: 100%;
	    line-height: 80rpx;
	}
	.spec-cart-btn{
	    float: left;
	    width: 690rpx;
	    font-size: 30rpx;
	    text-align: center;
	    color: white;
	    border-radius: 50rpx;
	    background-color: #ff3b3b;
	}
	.spec-cart-disable{
	    background: #bbbbbb;
	}
	.spec-cart-btn-lg{
	    width: 690rpx;
	}
	/* 优惠信息弹框 */
	.prom-model{
	    position: fixed;
	    bottom: 0;
	    z-index: 20;
	    background: white;
	    width: 100%;
	    padding: 0 30rpx 30rpx;
	    font-size: 32rpx;
	    box-sizing: border-box;
	    overflow-x: hidden;
	}
	.prom-model .prom-title{
	    text-align: center;
	    margin: 30rpx 0;
	}
	.prom-model .logistics-item{
	    border: 0;
	}
	.logistics-item .item-mes{
	    color: #1f1f1f;
	    font-size: 26rpx;
	    overflow:hidden;
	    text-overflow:ellipsis;
	    white-space:nowrap;
	}
	.prom-model .item-mes{
	    width: 500rpx;
	}
	
	/* 商品海报分享s*/
	
	.share-btn {
	    display: inline-block;
	    margin-top: 12rpx;
	    margin-left: 12rpx;
	    height: 44rpx;
	    width: 44rpx;
	    color: #666;
	    font-size: 20rpx;
	    position: absolute;
	    right: 22rpx;
	    top:84rpx;
	}
	
	.share-btn image{
	    width: 44rpx;
	    height: 44rpx;
	}
	
	.share-save-btns{
	    background-color: #fff;
	    width: 100%;
	    line-height: 80rpx;
	}
	
	.share-save-btn {
	    width: 80%;
	    height: 80rpx;
	    text-align: center;
	    margin: 0px auto;
	    background-color: #ff3b3b;
	    color: #fff;
	    border-radius: 10rpx;
	}
	
	.share-pic {
	    width: 270rpx;
	    height: 480rpx;
	    margin: 20rpx auto ;
	    background-color: #999;
	    box-shadow: 0rpx 5rpx 5rpx 5rpx #cccccc
	}
	
	.share-tips {
	    font-size: 9pt;
	    color: #999;
	    display: block;
	    margin-top: 10rpx;
	    width: 100%;
	    text-align: center;
	}
	
	.action-sheet-btn{
	    width: 100%;
	    height: 100%;
	    margin: -10px 0;
	    font-size: 18px;
	}
	
	.action-sheet-btn::after{   
	    border: none;   
	}
	.bargin_head_pic{
	    width: 1rem;
	    height:1rem;
	    margin-left: -15rpx;
	    border-radius: 50%;
	    border:4px #fff solid 
	}
	.bargin_headpic{
	    margin-top:32rpx;
	}
	
	.classname{
	    margin-top:-18px;
	    font-size:.6777rem;
	    color:#fff;
	}
	.wxParse-p image{
	  width: 100%!important;
	}
	.co-red-price{
	  font-size: 33rpx;
	  font-weight: bold;
	  float: left;
	}
	
</style>
