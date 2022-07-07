<script setup>
	import {
		ref,
		reactive,
		watch
	} from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import request from "@/utils/request.js"
	import dateFormat from "@/utils/dateFormat.js"
	import {
		useMusicStore
	} from "@/stores/music.js"

	const musicStore = useMusicStore();

	const isPlay = ref(false);
	const song = reactive({});
	const currentTime = ref("00:00");
	const durationTime = ref("03:00");
	const currentWidth = ref(0);

	onLoad((options) => {
		getMusicInfo(options.id)

		// 判断当前页面音乐是否在播放
		if (musicStore.isMusicPlay && musicStore.musicId === options.id) {
			isPlay.value = true;
		}
	})

	// 获取音乐详情
	async function getMusicInfo(ids) {
		let songData = await request("/song/detail", {
			ids
		});

		durationTime.value = dateFormat(songData.songs[0].dt);



		Object.assign(song, songData.songs[0]);

		uni.setNavigationBarTitle({
			title: song.name
		})

		controlMusic(true);
	}

	// 处理音乐播放/暂停按钮
	function handleMusicPlay() {
		isPlay.value = !isPlay.value;
		controlMusic(isPlay.value);
	}

	// 音乐播放/暂停
	const backgroundAudioManager = uni.getBackgroundAudioManager();
	let musicLink;

	async function controlMusic(isPlay) {
		if (isPlay) {
			if (!musicLink) {
				musicLink = await request("/song/url", {
					id: song.id
				});
			}
			backgroundAudioManager.src = musicLink.data[0].url;
			backgroundAudioManager.title = song.name;
		} else {
			backgroundAudioManager.pause();
		}
	}

	backgroundAudioManager.onPlay(() => {
		isPlay.value = true;
		musicStore.play();
		musicStore.setId(song.id);
	});
	backgroundAudioManager.onPause(() => {
		isPlay.value = false;
		musicStore.pause();
	});
	backgroundAudioManager.onStop(() => {
		isPlay.value = false;
		musicStore.pause();
	});
	backgroundAudioManager.onTimeUpdate(() => {
		currentTime.value = dateFormat(backgroundAudioManager.currentTime * 1000);
		currentWidth.value = backgroundAudioManager.currentTime / backgroundAudioManager.duration * 450;
	});
	backgroundAudioManager.onEnded(() => {
		handleSwitchMusic("next");
		currentWidth.value = 0;
		currentTime.value = "00:00";
	});

	// 切换歌曲
	function handleSwitchMusic(type) {
		musicLink = "";
		uni.$emit("switchType", {
			type
		});
	}

	uni.$on("musicId", function(data) {
		controlMusic(true);
		getMusicInfo(data.id);
	});
</script>

<template>
	<view class="container">
		<!-- bug: https://blog.csdn.net/weixin_39818813/article/details/99777266 -->
		<view class="author">{{ song.ar && song.ar[0].name }}</view>
		<view class="circle"></view>
		<image class="needle" :class="{'needle-rotate':isPlay}" src="/static/images/song/needle.png"></image>

		<!-- 磁盘区 -->
		<view class="disc-container" :class="{'disc-animation':isPlay}">
			<image class="disc" src="/static/images/song/disc.png"></image>
			<image class="music-img" :src="song.al&&song.al.picUrl"></image>
		</view>

		<!-- 进度条控制区 -->
		<view class="progress-container">
			<text>{{ currentTime }}</text>
			<view class="bar">
				<view class="current-time-bar" :style="{width:`${currentWidth}rpx`}">
					<view class="audio-circle"></view>
				</view>
			</view>
			<text>{{ durationTime }}</text>
		</view>

		<!-- 底部控制区 -->
		<view class="music-control">
			<text class="iconfont icon-iconsMusicyemianbofangmoshiShuffle"></text>
			<text class="iconfont icon-shangyishou" @tap="handleSwitchMusic('pre')"></text>
			<text @tap="handleMusicPlay" class="iconfont big"
				:class="{'icon-bofang':!isPlay,'icon-zanting':isPlay}"></text>
			<text class="iconfont icon-next" @tap="handleSwitchMusic('next')"></text>
			<text class="iconfont icon-iconsMusicyemianbofangmoshiPlayList"></text>
		</view>
	</view>
</template>

<style scoped>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		background: rgb(0, 0, 0, 0.5);
	}

	/* 摇杆 */
	.circle {
		position: relative;
		z-index: 100;
		width: 60rpx;
		height: 60rpx;
		background: #fff;
		border-radius: 50%;
		margin: 10rpx 0;
	}

	.needle {
		position: relative;
		top: -40rpx;
		left: 60rpx;
		z-index: 99;
		width: 192rpx;
		height: 274rpx;
		transform: rotate(-20deg);
		transform-origin: 40rpx 0;
		transition: transform 1s;
	}

	.needle-rotate {
		transform: rotate(0deg);
	}

	/* 磁盘 */
	.disc-container {
		position: relative;
		top: -170rpx;
		width: 598rpx;
		height: 598rpx;
	}

	.disc-animation {
		animation: disc 4s linear infinite;
		animation-delay: 1s;
	}

	@keyframes disc {
		from {
			transform: rotate(0deg);
		}

		to {
			transform: rotate(360deg);
		}
	}

	.disc {
		width: 598rpx;
		height: 598rpx;
	}

	.music-img {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		width: 370rpx;
		height: 370rpx;
		border-radius: 50%;
	}

	/* 进度条控制区 */
	.progress-container {
		position: absolute;
		bottom: 200rpx;
		width: 640rpx;
		height: 80rpx;
		line-height: 80rpx;
		display: flex;
	}

	.progress-container .bar {
		position: relative;
		width: 450rpx;
		height: 4rpx;
		background: rgb(0, 0, 0, 0.4);
		margin: auto;
	}

	.progress-container .current-time-bar {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
		height: 4rpx;
		background: red;
	}

	.current-time-bar .audio-circle {
		position: absolute;
		right: -12rpx;
		top: -4rpx;
		width: 12rpx;
		height: 12rpx;
		border-radius: 50%;
		background: #fff;
	}

	/* 底部控制区 */
	.music-control {
		position: absolute;
		bottom: 50rpx;
		left: 0;
		display: flex;
		width: 100%;
		border-top: 1px solid #fff;

	}

	.music-control text {
		width: 20%;
		height: 120rpx;
		line-height: 120rpx;
		text-align: center;
		color: #fff;
		font-size: 50rpx;
	}

	.music-control text.big {
		font-size: 80rpx;
	}
</style>
