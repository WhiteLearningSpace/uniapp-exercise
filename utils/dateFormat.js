export default (dt) => {
	let minute = 0; // 分
	let second = 0; // 秒
	let result = ""; // 结果
	const totalSecond = parseInt(dt / 1000);
	if (totalSecond > 59) {
		minute = parseInt(totalSecond / 60);
		second = parseInt(totalSecond % 60);
	} else {
		second = totalSecond;
	}
	result = minute < 10 ? "0" : "";
	result += minute;
	result += second < 10 ? ":0" : ":";
	result += second;
	return result;
}
