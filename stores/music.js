import {
	defineStore
} from 'pinia';

export const useMusicStore = defineStore('music', {
	state: () => ({
		isMusicPlay: false,
		musicId: ""
	}),
	actions: {
		play() {
			this.isMusicPlay = true;
		},
		pause() {
			this.isMusicPlay = false;
		},
		setId(id) {
			this.musicId = String(id);
		}
	},
});
