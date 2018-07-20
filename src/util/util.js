function throttle(fn, gapTime) {
  // if (gapTime == null || gapTime == undefined) {
  //   gapTime = 1500
  // }
  //
  // let _lastTime = null
  //
  // // 返回新的函数
  // return function () {
  //   console.log('函数节流');
  //   let _nowTime = + new Date()
  //   if (_nowTime - _lastTime > gapTime || !_lastTime) {
  //     fn.apply(this, arguments)   //将this和参数传给原函数
  //     _lastTime = _nowTime
  //   }
  // }

  let timer = null
  return function() {
    const context = this
    const args = arguments
    if(timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, gapTime)
  }
}

module.exports = {
  throttle: throttle
}