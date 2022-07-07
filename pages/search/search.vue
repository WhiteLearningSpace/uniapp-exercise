<template>
	<view class="search-container">
		<!-- 头部 -->
		<view class="header">
			<view class="search-input">
				<text class="iconfont icon-search1 search-icon"></text>
				<input type="text" :placeholder="placeholderContent" placeholder-class="placeholder"
					v-model="searchContent">
			</view>
			<view class="cancel" @tap="clearInput">取消</view>
		</view>

		<template v-if="searchList.length">
			<!-- 搜索内容展示 -->
			<view class="show-search-content">
				<view class="search-content">搜索内容:{{searchContent}}</view>
				<view class="search-list">
					<view class="search-item" v-for="item in searchList" :key="item.id">
						<text class="iconfont icon-search1"></text>
						<text class="content">{{item.name}}</text>
					</view>
				</view>
			</view>
		</template>


		<template v-else>
			<!-- 搜索历史 -->
			<view class="history" v-if="historyList.length">
				<view class="title">历史</view>
				<view class="history-item" v-for="item in historyList" :key="item">
					{{item}}
				</view>
				<text class="iconfont icon-shanchu" @tap="clearHistoryList"></text>
			</view>
			<!-- 热搜榜 -->
			<view class="hot-container">
				<view class="title">热搜榜</view>
				<!-- 热搜列表 -->
				<view class="hot-list">
					<view class="hot-item" v-for="(item,index) in hotList" :key="item.searchWord">
						<text class="order">{{index+1}}</text>
						<text>{{item.searchWord}}</text>
						<image class="icon-img" :src="item.iconUrl" mode=""></image>
					</view>
				</view>
			</view>
		</template>

	</view>
</template>
<script setup>
	import {
		reactive,
		ref,
		watch
	} from "vue";
	import request from "@/utils/request.js";

	const placeholderContent = ref("");
	const searchContent = ref("");
	const hotList = reactive([]);
	const searchList = reactive([]);
	const historyList = reactive([]);

	// 获取本地搜索历史记录
	historyList.push(...uni.getStorageSync("historyList"));

	// 监听搜索内容变化
	watch(searchContent, (value) => {
		getSearchList(value.trim());
	});

	// 防抖
	let timer = null;
	// 获取搜索内容
	function getSearchList(content) {
		// 防抖
		clearTimeout(timer);
		timer = setTimeout(async () => {
			if (!content) {
				searchList.length = 0;
				return;
			}
			let searchListData = await request("/search", {
				keywords: content,
				limit: 10
			});
			// 添加本地搜索历史记录
			if (historyList.indexOf(content) !== -1) {
				historyList.splice(historyList.indexOf(content), 1)
			}
			historyList.unshift(content);
			uni.setStorageSync("historyList", historyList);

			searchList.length = 0;
			searchList.push(...searchListData.result.songs);
		}, 300)
	};


	// 获取 placeholder 的内容
	getPlaceholderData();
	async function getPlaceholderData() {
		let placeholderData = await request("/search/default");
		placeholderContent.value = placeholderData.data.showKeyword;
	};

	// 获取 热搜榜 的内容
	getHotListData();
	async function getHotListData() {
		let hotListData = await request("/search/hot/detail");
		hotList.push(...hotListData.data);
	};

	// 清空搜索框的事件
	function clearInput() {
		searchContent.value = "";
	};
	// 清空搜索历史记录事件
	function clearHistoryList() {
		uni.showModal({
			content: "确认删除吗？",
			success(res) {
				if (res.confirm) {
					historyList.length = 0;
					uni.removeStorageSync("historyList");
				}
			}
		})
	};
</script>

<style scoped>
	.search-container {
		padding: 0 20rpx;
	}

	/* 头部 */
	.header {
		display: flex;
		height: 60rpx;
		line-height: 60rpx;
	}

	.search-input {
		position: relative;
		flex: 1;
		background-color: rgba(237, 237, 237, 0.3);
		border-radius: 30rpx;
	}

	.search-input input {
		margin-left: 50rpx;
		height: 60rpx;
	}

	/deep/.placeholder {
		font-size: 28rpx;
	}

	.search-icon {
		position: absolute;
		left: 15rpx;
	}

	.cancel {
		width: 100rpx;
		text-align: center;
	}

	/* 搜索内容展示 */
	.search-content {
		color: #d43c33;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		border-bottom: 1rpx solid #d43c33;
	}

	.search-item {
		height: 80rpx;
		line-height: 80rpx;
		display: flex;

	}

	.search-item .content {
		flex: 1;
		margin-left: 20rpx;
		border-bottom: 1rpx solid #eee;
		font-size: 26rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* 搜索历史 */
	.history {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx 0;
	}

	.history .title {
		font-size: 28rpx;
		height: 50rpx;
		line-height: 50rpx;
	}

	.history .history-item {
		height: 50rpx;
		line-height: 50rpx;
		font-size: 26rpx;
		background: #ededed;
		margin-left: 20rpx;
		padding: 0 30rpx;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
	}

	.history .icon-shanchu {
		margin-left: auto;
		font-size: 36rpx;
	}

	/* 热搜榜 */
	.hot-container .title {
		font-size: 28rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-bottom: 1rpx solid #eee;
	}

	.hot-list {
		display: flex;
		flex-wrap: wrap;
	}

	.hot-item {
		width: 50%;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 26rpx;
	}

	.hot-item .order {
		margin: 0 10rpx;
	}

	.hot-item .icon-img {
		width: 35rpx;
		height: 25rpx;
		margin-left: 10rpx;
	}
</style>
