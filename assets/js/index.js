$(function () {
  // 获取用户基本信息
  getUserInfo();
  var { layer } = layui;
  // 退出功能
  $('#btnLogout').click(function (e) {
    e.preventDefault();
    layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      // 清空本地存储中的 token
      localStorage.removeItem('token')
      // 跳转到登录页面
      location.href = '/login.html'
      // 刷新页面,防止回退
      location.reload()
      
      // 关闭 confirm 询问框
      layer.close(index)
    })
  })
})

function getUserInfo() {
  $.ajax({
    method:'get',
    url:'/my/userinfo',
    success:function(res){
      // console.log(res);
      if (res.status !== 0) return layer.msg(res.message)
      renderAvatar(res.data);
    },
    // complete: function (res) {
    //   console.log(res);
    //   if (res.responseJSON.status === 1) {
    //     localStorage.removeItem('token')
    //     location.href = '/login.html'
    //   }
    // }
  })
}
// 渲染用户的头像
function renderAvatar(user) {
  // 获取用户的名称
  var name = user.nickname || user.username
  // 设置欢迎的文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  // 按需渲染用户的头像
  if (user.user_pic) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $(".text-avatar").hide()
  } else {
    // 渲染文字头像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $(".text-avatar").html(first).show()
  }
}