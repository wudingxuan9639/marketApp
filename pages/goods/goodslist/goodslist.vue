<template>
	<view class="content">
		<view class="co-search-relative">
		    <view class="box">
		        <input class="box_input" type="text" model:value="{{searchContentVale}}" placeholder="请时输入关键词" />
		        <text class="box_text" @click="searchBtnG">搜索</text>
		    </view>
		</view>
		  <!-- <view class="choice_list">
		        <view  v-for="{{DataObject.requestData.goods_list}}" :key="index">
		            <navigator class="choice_item" url="../tabbar-2/tabbar-2.vue" style="display: inline-block;">
		                <view class="scenery">
		                    <view class="sctopimg">
		                        <image src="{{url}}/api/goods/goodsThumImages?goods_id={{item.goods_id}}&width=400&height=400"></image>
		                    </view>
		                    <view class="sctitle">
		                        <view class="scwhat">
		                            {{item.goods_name}}
		                        </view>
		                    </view>
		                </view>
		            </navigator>
		        </view>
		    </view> -->
		<!-- 
		    <view class="no-data" v-if="{{!requestData.goods_list || requestData.goods_list.length == 0}}">
		        <image src="" class="cart-image" />
		        <view class="no-data-title">没有相关的数据</view>
		        <navigator url="../tabbar-5/tabbar-5.vue" class="lookat" open-type="navigate"> 去逛逛 </navigator>
		    </view> -->
	</view>
</template>

<script>
const app = getApp();
// import LoadMore from '../../../utils/LoadMore.js'
// const load = new LoadMore;
// const common = require('../../../utils/common.js');
// const util = require('../../../utils/util.js');
// const request = app.request;

import { reactive } from "vue";
import sendPostRequest from "../../../utils/sendPostRequest.js";
import rout from "../../../utils/route.js"

export default {
  setup() {
	const DataObject = reactive({
        currentPage: 1,
        requestData: null, //请求的数据
        allData: null, //第一次请求到的所有数据，用于恢复筛选数据
        openFilterModal: false, //打开筛选弹框
        goodsInputNum: 1, //选中的商品件数
        openSpecModal: false, //是否打开规格弹窗
        specSelect: 0, //选中的组合规格数组spec_goods_price下标
        data: null, //请求的商品详情数据
        defaultMenu: true, //默认底部菜单显示状态
        select: { //选择的(规格)商品的参数，用于显示
            price: 0,
            stock: 0,
            spec_img: '',
            specName: '',
            activity: null,
        },
        searchContentVale:'', //搜索value
        isSearchGoodsShow:false, //搜索显示列表
        searchNavinfoGoods:[], //搜索列表
    })
	
    const changeTab = (e)=> {
        resetData();
        requestGoodsList(e.currentTarget.dataset.href);
    }

    const requestGoodsList = (requestUrl) =>{
        const that = this;
        DataObject.requestUrl = requestUrl;
        this.setData({
          requestUrl: requestUrl
        })
		
        requestUrl += (requestUrl.indexOf('?') > 0 ? '&' : '?') + 'p=' + that.data.currentPage;
        load.request(requestUrl, function (res) {
            that.data.currentPage++;
            if (that.data.allData == null) {
                that.data.allData = Object.assign({}, res.data.result);
            }
            wx.stopPullDownRefresh();
        });
    }

    const onReachBottom = () =>{
        if (load.canloadMore()) {
            requestGoodsList(DataObject.requestUrl);
        }
    }

    const onPullDownRefresh = () =>{
        resetData();
        requestGoodsList(DataObject.requestUrl);
    }

    const openFilterModal = () =>{
        // setData({ openFilterModal: true });
		DataObject.openFilterModal = true;
    }

    const closeFilterModal = () =>{
        // this.setData({ openFilterModal: false });
		DataObject.openFilterModal = false;
    }

    /** 商品筛选 */
    const filterGoods = (e) =>{
        resetData();
        requestGoodsList(e.currentTarget.dataset.href);
        closeFilterModal();
    }

    /** 重置数据 */
    const resetData = () =>{
        load.resetConfig();
        DataObject.requestData = null;
        DataObject.currentPage = 1;
    }
    const topages = (e) =>{
        const idx = e.currentTarget.dataset.idx;
        // console.log(idx,app.globalData.menu_index)
        app.globalData.menu_index = idx;
        common.defaultTotabar(idx, 1);
    }
    const restoreData = () =>{
		DataObject.requestData = DataObject.allData;
    }
    /** 初始化数据，注意顺序 */
    const initData = (data) =>{
        //检查商品
        initCheckGoods(data);
        //检查一下购物的数量，可能无库存
        checkCartNum(DataObject.goodsInputNum);
    }

    /** 检查商品 */
    const initCheckGoods = (data) =>{
        const item_id = data.spec_goods_price.length > 0 ? data.spec_goods_price[0]['item_id'] : '';
        if (DataObject.optionItemId) {
            item_id = DataObject.optionItemId;
        }
        request.get('/api/goods/activity', {
            data: {
                goods_id: data.goods.goods_id,
                item_id: item_id,
            },
            success: function (res) {
                //初始化规格
                if (res.data.result.goods.activity_is_on == 1) {
                    data.activity = res.data.result.goods
                    initSpecsPrice(data);
                } else {
                    data.goods.prom_type = 0;
                    initSpecsPrice(data);
                }
            }
        });
    }
    /** 初始化所有规格 */
    const initSpecsPrice = (data) =>{
        const specSelect = 0; //初始化选中第一个规格
        const specs = data.spec_goods_price;
        if (specs.length == 0) { //没有规格
            this.initActivity(data.activity);
            return;
        }
        //第一次请求的总数据中的activity默认是第一种规格的,可减少一次请求
        specs[0].activity = data.activity;
        if (DataObject.optionItemId) { //指定规格
            for (const i = 0; i < specs.length; i++) {
                if (specs[i].item_id == DataObject.optionItemId) {
                    specSelect = i;
                    break;
                }
            }
        } else { //初始化选库存不为0的规格
            for (const i = 0; i < specs.length; i++) {
                if (specs[i].store_count <= 0) {
                    continue;
                }
                specSelect = i;
                break;
            }
        }
        //生成子规格组(goods_spec_list)的各自选中项
        const specIds = specs[specSelect].key.split("_");
        const list = data.goods_spec_list;
        for (const i = 0; i < list.length; i++) {
            for (const j = 0; j < list[i].spec_list.length; j++) {
                if (util.inArray(list[i].spec_list[j].item_id, specIds)) {
                    list[i].selectItemId = list[i].spec_list[j].item_id;
                    break;
                }
            }
        }
		DataObject.specSelect = specSelect;
		DataObject.goods_spec_list = list ;
		DataObject.spec_goods_price = specs;
        initSelectSpecGoods();
    }
    /** 关闭规格弹窗 */
    const closeSpecModal = () =>{
		DataObject.openSpecModal = false;
    }
    /** 打开规格弹窗 */
    const openSpecModel = (e) =>{
        const that = this;
        request.get('/api/goods/goodsInfo', {
            data: { id: e.currentTarget.dataset.goods_id },
            failRollback: true,
            success: function (res) {
				DataObject.data = res.data.result;
				DataObject.openSpecModal = true;
				DataObject.isSeparate = true;
                initData(res.data.result);
            }
        });

    }
    /** 减少购买的商品数量 */
    const subCartNum = () =>{
        checkCartNum(DataObject.goodsInputNum - 1);
    }
    /** 增加购买的商品数量 */
    const addCartNum = () =>{
        checkCartNum(DataObject.goodsInputNum + 1);
    }
    /** 输入购买的数量 */
    const inputCartNum = (e) =>{
        checkCartNum(Number(e.detail.value));
    }
    /** 检查购买的数量 */
    const checkCartNum = (num) =>{
        const stock = DataObject.select.stock;
        if (DataObject.data.spec_goods_price.length > 0) {
            stock = DataObject.data.spec_goods_price[DataObject.specSelect].store_count;
        }
        if (num > stock || stock == 0) {
            num = stock;
        } else if (num < 1) {
            num = 1;
        }
        this.setData({
            goodsInputNum: num
        });
    }
    /** 初始化选中的规格商品 */
    const initSelectSpecGoods = () =>{
        const specSelect = DataObject.specSelect;
        const specs = DataObject.data.spec_goods_price;

        const itemId = specs[specSelect].item_id;

        if (specs[specSelect].prom_type == 0) {
            const noActivity = { prom_type: 0 };
            specs[specSelect].activity = noActivity;
            initActivity(noActivity);
        } else if (typeof specs[specSelect].activity != 'undefined') {
            initActivity(specs[specSelect].activity);
        } else {
            requestSpecInfo(specSelect);
        }
    }
    /** 请求规格商品的活动信息 */
    const requestSpecInfo = (specSelect) =>{
        const specs = DataObject.data.spec_goods_price;
        request.get('/api/goods/activity', {
            data: {
                goods_id: DataObject.data.goods.goods_id,
                item_id: specs.length > 0 ? specs[specSelect].item_id : '',
            },
            success: function (res) {
                if (res.data.result.goods.activity_is_on == 1) {
                    initActivity(res.data.result.goods);
                }
            }
        });
    }
    /** 初始化选中的（规格）商品的显示参数 */
    const initSelectedData = () =>{
        const goods = DataObject.data.goods;
        const activity = DataObject.select.activity;
        const specs = DataObject.data.spec_goods_price;
        const specSelect = DataObject.specSelect;
        const stock = 0;
        const price = 0;
        if (activity.prom_type == 1 || activity.prom_type == 2) {
            price = activity.shop_price;
            stock = activity.store_count;
        } else if (activity.prom_type == 3) {
            price = activity.shop_price;
            stock = activity.store_count;
        } else if (activity.prom_type == 4) {
            price = activity.shop_price;
            stock = activity.store_count;
        }
        else if (activity.prom_type == 8 && !DataObject.isBragain) {
            price = activity.end_price ? activity.end_price : activity.shop_price;
            stock = activity.store_count;
            this.setData({
                'select.bargain_price': price,
            });
        }
        else if (specs.length > 0) {
            price = specs[specSelect].price;
            stock = specs[specSelect].store_count;
        } else {
            price = goods.shop_price;
            stock = goods.store_count;
        }
        price = price.toString().split('.')
		DataObject.select.price = price;
		DataObject.select.stock = stock;
		DataObject.select.specName = specs.length > 0 ? specs[specSelect].key_name : '';
        if (DataObject.isBragain) {
			DataObject.isBragain = false;
        }
    }
    /** 点击规格按钮的回调函数 */
    const selectSpec = (e) =>{
        //对商品数量进行判断，对库存进行判断
        const itemId = e.currentTarget.dataset.itemid;
        const listIdx = e.currentTarget.dataset.listidx;
        const list = DataObject.data.goods_spec_list;
        if (list[listIdx].selectItemId == itemId) {
            return;
        }
        list[listIdx].selectItemId = itemId;
        const newSpecKeys = [];
        for (const i = 0; i < list.length; i++) {
            newSpecKeys[i] = list[i].selectItemId;
        }
        //item排序,生成key
        newSpecKeys = util.sortSize(newSpecKeys).join('_');
        const newSpecSelect = 0;
        const specs = DataObject.data.spec_goods_price;
        for (const i = 0; i < specs.length; i++) {
            if (specs[i].key == newSpecKeys) {
                newSpecSelect = i;
                break;
            }
        }
        // this.setData({
        //     specSelect: newSpecSelect,
        //     'data.goods_spec_list': list
        // });
		DataObject.specSelect = newSpecSelect;
		DataObject.data.goods_spec_list = list; 
        initSelectSpecGoods();
        checkCartNum(DataObject.goodsInputNum);
    }
    /** 初始化显示的活动信息 */
    const initActivity = (activity) =>{
        if (activity.prom_type && activity.prom_type != 6) {
            const startTime = (new Date()).getTime();
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
                activity.countName = '预售商品';
            } else if (activity.prom_type == 8) { //砍价
                !DataObject.isBragain ? activity.priceName = '砍价享' : activity.priceName = ''
                !DataObject.isBragain ? activity.countName = '砍价活动' : activity.countName = ''
            }

            activity.countTime = '--天--时--分--秒';
            if (!activity.diffTime) {
                activity.diffTime = (new Date()).getTime() - activity.on_time * 1000;
            }
        } else if (activity.prom_type == 6) {
            activity.countName = '该商品正在参与拼团';
            activity.goods_id = activity.goods_id;
            activity.team_id = activity.prom_id ? activity.prom_id : 0;
            activity.item_id = activity.item_id ? activity.item_id : 0;
        }
        // this.setData({ 'select.activity': activity });
		DataObject.select.activity = activity;
        destroyActivityTimer();
        createActivityTimer();
        initSelectedData();
    }

    /** 检查是否倒计时是否结束 */
    const checkActivityTime = () =>{
        const activity = DataObjectD.select.activity;
        const remainTime = activity.end_time * 1000 - (new Date()).getTime() + activity.diffTime;
        if (remainTime > 0) {
            remainTime = util.remainTime(remainTime);
            // that.setData({ 'select.activity.countTime': remainTime });
			DataObject.select.activity.countTime = remainTime;
        } else {
            requestSpecInfo(DataObject.specSelect);
            return;
        }
    }

    /** 创建活动倒计时定时器 */
    const createActivityTimer = () =>{
        const activity = DataObject.select.activity;
        if (!activity.prom_type || activity.prom_type == 6 || DataObject.isBragain) {
            return;
        }
        DataObject.timer = setInterval(function () {
            checkActivityTime();
        }, 1000);
    }

    /** 销毁活动倒计时定时器 */
    const destroyActivityTimer = () =>{
        if (DataObject.timer) {
            clearInterval(DataObject.timer);
            DataObject.timer = null;
        }
    }
    /** 购买虚拟商品 */
    const buyVirtualGoods = (data) =>{
        //检查用户是否登录方可操作立即购买
        if (!app.auth.isAuth()) {
            app.showLoading(null, 1500);
            app.getUserInfo();
            return;
        }
        Object.assign(data, {
            goods_name: DataObject.data.goods.goods_name,
            spec_name: DataObject.select.specName,
            price: DataObject.select.price,
        });
        uni.navigateTo({
            url: '/pages/virtual/buy_step/buy_step?' + util.Obj2Str(data)//虚拟商品页面？？？
        });
    }
    /** 加入购物车 */
    const addCart = (e) =>{
        const that = this;
        const itemId = 0;
        const specs = DataObject.data.spec_goods_price;
        //区分有规格和无规格
        if (specs.length > 0) {
            if (specs[DataObject.specSelect].store_count <= 0) {
                return app.showWarning("库存已为空！");
            }
            itemId = specs[DataObject.specSelect].item_id;
        } else {
            if (DataObject.data.goods.store_count <= 0) {
                return app.showWarning("库存已为空！");
            }
        }
        if (DataObject.goodsInputNum <= 0) {
            return app.showWarning("商品数量不能为0");
        }
        const data = {
            goods_id: DataObject.data.goods.goods_id,
            goods_num: DataObject.goodsInputNum,
            item_id: itemId,
            form: 1
        };
        if (DataObject.data.goods.is_virtual) {
            return buyVirtualGoods(data);
        }
        //检查用户是否登录方可操作立即购买
        if (!app.auth.isAuth()) {
            app.showLoading(null, 1500);
            app.getUserInfo();
            return;
        }

        if (e.currentTarget.dataset.action == 'add') { //加入购物车
            if (DataObject.shippingCost < 0 || DataObject.select.stock <= 0) {
                return;
            }
            request.post('/api/cart/addCart', {
                data: data,
                success: function (res) {
                    uni.showModal({
                        title: '添加成功！',
                        cancelText: '去购物车',
                        confirmText: '再逛逛',
                        success: function (res) {
                            if (res.cancel) {
                                uni.reLaunch({
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
            this.exchange(data); //这个函数从哪里来的？？？
        } else { //立即购买
            buyNow(data);
        }
    }
    /** 立即购买 */
    const buyNow = (data) =>{
        //检查用户是否登录方可操作立即购买
        if (!app.auth.isAuth()) {
            app.showLoading(null, 1500);
            app.getUserInfo();
            return;
        }
        if (DataObject.shippingCost < 0 || DataObject.select.stock <= 0) {
            return;
        }
        Object.assign(data, {
            action: 'buy_now',
        });
        uni.navigateTo({
            url: '/pages/cart/cart2/cart2?' + util.Obj2Str(data)
        });
    }
    // /* 点击搜索事件 */
	const data = {
	}
	console.log("route",rout.goodslist)
    const searchBtnG = () =>{
        // console.log(JSON.stringify(self.data.requestUrl)+'-----------');
        sendPostRequest(rout.goodslist,{},
		{
		  success(res) {
			  // console.log("result",res)
		   //  if (res.message === "success") {
		   //    operateData(res.data);
		   //  }
		  },
		  fail() {},
		},
		true
		)
        
    }
    return {
		DataObject,
		searchBtnG,
    };
  },
};
</script>

<style scoped lang="scss">
.content {
	background-color: #f1f1f1;
}
.box{
      display: flex;
      justify-content: space-between;
	  
	  .box_input{
	  		  height: 50rpx;
	  		  line-height: 50rpx;
	  		  overflow: hidden;
	  		  width: 80%;
	  }
	  
	  .box_text{
	  	      height: 50rpx;
	  	      line-height: 50rpx;
	  	      overflow: hidden;
	  	      width: 20%;
	  	      text-align: center;
	  	      background-color: #999;
	  	      border-radius: 5rpx;
	  	      color: #fff;
	  }
  }

  .choice_list{
    padding: 0 15rpx;
    display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;
  }
  .top {
    width: 100%;
    font-size: 32rpx;
    text-align: center;
    color: #333333;
    font-weight: 600;
    margin-top: 20rpx;
  }
  .sctitle {
    padding: 23rpx;
  }
  .sctitle image {
    width: 15rpx;
    height: 22rpx;
    margin-right: 10rpx;
    border-radius: 10rpx 0;
  }
  .middle {
    display: flex;
    flex-wrap: wrap;
  }
  
  .scenery {
    width: 352rpx;
    height: 500rpx;
    flex-direction: column;
    background-color: #ffffff;
    margin-top: 20rpx;
    border-radius: 10rpx;
  }
  
  .sctopimg {
    width: 360rpx;
  }
  
  .sctopimg image {
    width: 352rpx;
    height: 352rpx;
    border-radius: 10rpx 10rpx 0 0;
  }
  
  .scwhere {
    color: #606060;
    font-size: 22rpx;
  }
  .scwhat {
    color: #F95594;
    font-size: 30rpx;
  }
  .scEngwhat {
    color: #F95594;
    font-size: 18rpx;
    font-family: OpenSans-Bold;
    letter-spacing: 0rpx;
    margin-bottom: 20rpx;
  }
  .shape image {
    width: 36rpx;
    height: 15rpx;
  }
  .tiyan {
    font-size: 22rpx;
    color: #606060;
    font-family: AlibabaPuHuiTi-Regular;
    font-weight: Regular;
  }

.co-search-relative{
margin: 80rpx 20rpx 0 20rpx;
}
</style>
