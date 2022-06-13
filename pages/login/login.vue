<template>
	<view class="container">
		<view class="wrapper">
			<view class="left-top-sign">LOGIN</view>
			<view class="welcome">
				欢迎回来！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="text" placeholder="请输入手机号码" v-model="phone" />
				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="password" placeholder="请输入密码" v-model="password" />
				</view>
			</view>
			<button class=" confirm-btn" @tap="login">登录</button>
			<view class="forget-section">
				忘记密码?
			</view>
		</view>
		<view class="register-section">
			还没有账号?
			<text>马上注册</text>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue"
	import request from "@/utils/request.js"


	const phone = ref("");
	const password = ref("");

	async function login() {
		if (!phone.value) {
			uni.showToast({
				title: '手机号不能为空',
				icon: "error"
			})
			return;
		}
		const phoneReg = /^1[3-9][0-9]{9}$/;
		if (!phoneReg.test(phone.value)) {
			uni.showToast({
				title: '手机号格式错误',
				icon: "error"
			})
			return;
		}

		if (!password.value) {
			uni.showToast({
				title: '密码不能为空',
				icon: "error"
			})
			return;
		}

		let result = await request("/login/cellphone", {
			phone: phone.value,
			password: password.value,
			isLogin: true
		})

		if (result.code === 200) {
			uni.showToast({
				title: '登录成功',
			})

			uni.setStorageSync('userInfo', result.profile);

			uni.reLaunch({
				url: '/pages/personal/personal',
			});
		} else if (result.code === 400) {
			uni.showToast({
				title: '手机号错误',
				icon: "error"
			})
		} else if (result.code === 502) {
			uni.showToast({
				title: '密码错误',
				icon: "error"
			})
		} else {
			uni.showToast({
				title: '登录失败',
				icon: "error"
			})
		}

	};
</script>

<style scoped>
	.wrapper {
		position: relative;
		z-index: 90;
		padding-bottom: 40rpx;
	}

	.left-top-sign {
		font-size: 120rpx;
		color: #f8f8f8;
		position: relative;
		left: -16rpx;
	}

	.welcome {
		position: relative;
		left: 50rpx;
		top: -90rpx;
		font-size: 46rpx;
		color: #555;
	}


	.input-content {
		padding: 0 60rpx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30rpx;
		background: #f8f6fc;
		height: 120rpx;
		border-radius: 4px;
		margin-bottom: 50rpx;

	}

	.input-item:last-child {
		margin-bottom: 0;
	}

	.input-item .tit {
		height: 50rpx;
		line-height: 56rpx;
		font-size: 30rpx;
		color: #606266;
	}

	.input-item input {
		height: 60rpx;
		font-size: 30rpx;
		color: #303133;
		width: 100%;
	}

	.confirm-btn {
		width: 630rpx !important;
		height: 76rpx;
		line-height: 76rpx;
		border-radius: 50rpx;
		margin-top: 70rpx;
		background: #d43c33;
		color: #fff;
		font-size: 32rpx;
		padding: 0;
	}

	.confirm-btn2:after {
		border-radius: 100px;
	}

	.forget-section {
		font-size: 28rpx;
		color: #4399fc;
		text-align: center;
		margin-top: 40rpx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50rpx;
		width: 100%;
		font-size: 28rpx;
		color: #606266;
		text-align: center;

	}

	.register-section text {
		color: #4399fc;
		margin-left: 10rpx;
	}
</style>
