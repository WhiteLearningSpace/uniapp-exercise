<template>
	<view class="recommend-container">
		<!-- 头部 -->
		<view class="header">
			<image src="/static/images/recommendSong/recommendSong.jpg"></image>
			<view class="date">
				<text class="day">{{day}} / </text>
				<text class="month">{{month}}</text>
			</view>
		</view>
		<!-- 列表区 -->
		<view class="list-container">
			<view class="list-header">
				<text>播放全部</text>
				<text>全选</text>
			</view>
			<!-- 内容区 -->
			<scroll-view class="list-scroll" scroll-y>
				<view class="scroll-item" v-for="item in recommendList" :key="item.id" @tap="toSongDetail(item.id)">
					<image :src="item.album.picUrl"></image>
					<view class="music-info">
						<text class="music-name">{{item.name}}</text>
						<text class="author">{{item.artists[0].name}}</text>
					</view>
					<text class="iconfont icon-gengduo"></text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
	import request from "@/utils/request.js";
	import {
		reactive,
		ref
	} from "vue";

	const recommendList = reactive([]);
	let index = 0;

	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth() + 1;

	const userInfo = uni.getStorageSync("userInfo");
	if (!userInfo) {
		uni.showToast({
			title: "先登录",
			icon: "error",
			success: () => {
				uni.reLaunch({
					url: "/pages/login/login"
				})
			}
		})
	}

	getRecommendList();

	// 获取用户每日推荐
	async function getRecommendList() {
		const recommendListData = await request("/recommend/songs");
		recommendList.push(...recommendListData.recommend);
	}

	// 跳转songDetail
	function toSongDetail(songId) {
		uni.navigateTo({
			url: "/pages/songDetail/songDetail?id=" + songId
		});
		index = recommendList.findIndex(item => item.id === songId);
	}

	uni.$on("switchType", function(data) {
		if (data.type === "pre") {
			(index === 0) && (index = recommendList.length);
			index--;
		} else {
			(index === recommendList.length - 1) && (index = -1);
			index++;
		}
		uni.$emit("musicId", {
			id: recommendList[index].id
		});
	})
</script>

<style scoped>
	.recommend-container .header {
		position: relative;
		width: 100%;
		height: 300rpx;
	}

	.recommend-container .header image {
		width: 100%;
		height: 100%;
	}

	.recommend-container .header .date {
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 300rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
		color: white;
	}

	.recommend-container .header .day {
		font-size: 38rpx
	}

	.list-container {
		position: relative;
		top: -20rpx;
		padding: 0 20rpx;
		border-radius: 30rpx;
		background: #fff;
	}

	.list-header {
		height: 80rpx;
		line-height: 80rpx;
	}

	.list-container .list-header {
		display: flex;
		justify-content: space-between;
	}

	.list-scroll {
		height: calc(100vh - 380rpx);
	}

	.scroll-item {
		position: relative;
		display: flex;
		margin-bottom: 20rpx;
	}

	.scroll-item image {
		width: 80rpx;
		height: 80rpx;
		border: 8rpx;
	}

	.scroll-item .iconfont {
		position: absolute;
		right: 0;
		width: 80rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: right;
	}

	.music-info {
		display: flex;
		flex-direction: column;
		margin-left: 20rpx;
	}

	.music-info text {
		height: 40rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		max-width: 500rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
