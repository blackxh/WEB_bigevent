$.ajaxPrefilter(function (options) {
  if (options.url.startsWith('/my/')) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  // http://ajax.frontend.itheima.net
  options.url = 'http://ajax.frontend.itheima.net' + options.url;

  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 强制清空 token
      localStorage.removeItem('token')
      // 强制跳转到登录页面
      location.href = '/login.html'
    }
  }
})