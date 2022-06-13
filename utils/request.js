export default (url, data = {}, method = "GET") => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: "http://192.168.2.194:3000" + url,
			data,
			method,
			header: {
				cookie: uni.getStorageSync('cookies') ? uni.getStorageSync('cookies').find(item => item
					.indexOf('MUSIC_U') !== -1) : ""
			},
			// withCredentials: true,
			success: (res) => {
				if (data.isLogin) {
					uni.setStorage({
						key: 'cookies',
						data: res.cookies
					})
				}
				resolve(res.data);
			},
			fail: (err) => {
				reject(err);
			}
		})
	})
}
