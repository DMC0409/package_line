let baseURL = ''
baseURL = uni.getStorageSync('API') ? uni.getStorageSync('API') : 'https://qly.info'
module.exports = {
	baseURL
}