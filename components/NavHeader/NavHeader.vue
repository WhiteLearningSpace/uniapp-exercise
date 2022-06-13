<template>
	<view class="header">
		<text class="title">{{title}}</text>
		<view class="content">
			<text>{{desc}}</text>
			<text class="more">查看更多</text>
		</view>
	</view>
</template>

<script setup>
	defineProps({
		title: {
			type: String,
		},
		desc: {
			type: String,
		}
	})
</script>

<style>
	.header {
		margin-bottom: 20rpx;
	}

	.header .title {
		font-style: 32rpx;
		line-height: 80rpx;
		color: #666;
	}

	.header .content {
		display: flex;
		justify-content: space-between;
	}

	.header .more {
		border: 1rpx solid #333;
		border-radius: 30rpx;
		font-size: 24rpx;
		padding: 10rpx 20rpx;
	}
</style>
