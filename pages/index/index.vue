<script setup>
	import request from "@/utils/request.js"
	import {
		reactive,
		onBeforeMount
	} from "vue"

	const bannerList = reactive([]);
	const recommendList = reactive([]);
	const rankList = reactive([]);

	onBeforeMount(async () => {
		let bannerData = await request("/banner", {
			type: 2
		});
		bannerList.push(...bannerData.banners);

		let recommendData = await request("/personalized", {
			limit: 10
		});
		recommendList.push(...recommendData.result);


		let index = 0;

		while (index < 5) {
			let rankListData = await request("/top/list", {
				idx: index++
			});
			let rankListItem = {
				name: rankListData.playlist.name,
				tracks: rankListData.playlist.tracks.slice(0, 3)
			};
			rankList.push(rankListItem);
		}
	})
</script>

<template>
	<view>
		<!-- 轮播图 -->
		<swiper class="banners" indicator-dots indicator-color="ivory" indicator-active-color="#d43c33">
			<swiper-item v-for="item in bannerList" :key="item.bannerId">
				<image :src="item.pic"></image>
			</swiper-item>
		</swiper>
		<!-- 导航 -->
		<view class="nav-container">
			<view class="nav-item">
				<text class="iconfont icon-meirituijian"></text>
				<text>每日推荐</text>
			</view>
			<view class="nav-item">
				<text class="iconfont icon-gedan1"></text>
				<text>歌单</text>
			</view>
			<view class="nav-item">
				<text class="iconfont icon-icon-ranking"></text>
				<text>排行榜</text>
			</view>
			<view class="nav-item">
				<text class="iconfont icon-diantai"></text>
				<text>电台</text>
			</view>
			<view class="nav-item">
				<text class="iconfont icon-zhiboguankanliangbofangsheyingshexiangjixianxing"></text>
				<text>直播</text>
			</view>
		</view>
		<!-- 推荐歌曲 -->
		<view class="recommend-container">
			<!-- 头部 -->
			<NavHeader title="推荐歌曲" desc="为你精心推荐"></NavHeader>
			<!-- 内容 -->
			<scroll-view class="recommend-scroll" enable-flex scroll-x>
				<view class="scroll-item" v-for="item in recommendList" :key="item.id">
					<image :src="item.picUrl"></image>
					<text>{{item.name}}</text>
				</view>
			</scroll-view>
		</view>
		<!-- 排行榜 -->
		<view class="rank-list">
			<!-- 头部 -->
			<NavHeader title="排行榜" desc="热歌风向标"></NavHeader>
			<!-- 内容 -->
			<swiper class="rank-list-swiper" circular next-margin="50rpx">
				<swiper-item v-for="item in rankList" :key="item.name">
					<view class="swiper-item">
						<view class="title">{{item.name}}</view>
						<view class="music-item" v-for="(musicItem,index) in item.tracks" :key="item.id">
							<image :src="musicItem.al.picUrl"></image>
							<text class="count">{{index+1}}</text>
							<text class="music-name">{{musicItem.name}}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<style scoped>
	/* 轮播图 */
	.banners {
		width: 100%;
		height: 300rpx;
	}

	.banners image {
		width: 100%;
		height: 100%;
	}

	/* 导航 */
	.nav-container {
		display: flex;
	}

	.nav-container .nav-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 20%;
	}

	.nav-item .iconfont {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		text-align: center;
		line-height: 100rpx;
		background: rgb(240, 19, 19);
		font-size: 50rpx;
		color: #fff;
		margin: 20rpx 0;
	}

	.nav-item text {
		font-size: 26rpx;
	}

	/* 推荐歌曲 */
	.recommend-container {
		padding: 20rpx;
	}

	/* 推荐歌曲内容 */
	.recommend-scroll {
		display: flex;
		white-space: nowrap;
		height: 300rpx;
	}

	.scroll-item {
		display: inline-block;
		width: 200rpx;
		margin-right: 20rpx;
	}

	.scroll-item image {
		width: 200rpx;
		height: 200rpx;
		border-radius: 10rpx;
	}

	.scroll-item text {
		font-size: 26rpx;
		/* 单行文本溢出省略号隐藏 */
		/* display: block;
	  white-space: nowrap;
	  overflow: hidden;
	  text-overflow: ellipsis; */

		/* 多行文本溢出省略号隐藏 */
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		white-space: normal;
		/* 设置对齐模式 */
		-webkit-box-orient: vertical;
		/* 设置多行的行数 */
		-webkit-line-clamp: 2;
	}

	/* 排行榜 */
	.rank-list {
		padding: 20rpx;
	}

	.rank-list-swiper {
		height: 400rpx;
	}

	.swiper-item {
		width: 96%;
		background: #fbfbfb;
	}

	.swiper-item .title {
		font-size: 30rpx;
		line-height: 80rpx;
	}

	.music-item {
		display: flex;
		margin-bottom: 20rpx;
	}

	.music-item image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 6rpx;
	}

	.music-item .count {
		width: 100rpx;
		height: 100rpx;
		text-align: center;
		line-height: 100rpx;
	}

	.music-item .music-name {
		height: 100rpx;
		line-height: 100rpx;
		max-width: 400rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
