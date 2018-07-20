// common.js
const util = require('./util.js')
export default {
  data: {
    email: 'genuifx@gmail.com',
  },
  onLoad(q) {

  },
  methods: {
    moveTable: util.throttle(function (e) {
      this.setData({
        topBarPos:e.detail.scrollTop,
        leftBarPos:e.detail.scrollLeft,
      })
    }, 80)
  },
};