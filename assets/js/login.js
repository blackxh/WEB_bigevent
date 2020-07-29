$(function () {
  $('#link_reg,#link_login').click(function () {
    // 切换注册/登录
    $(this).parents('form').hide().siblings('form').show()
  })
  // 自定义规则
  var { form } = layui;
  form.verify({
    pwd: [/^\S{6,12}$/, '密码必须6到12位，且不能出现空格'],
    repwd: function (value) {
      var pwd = $('#reg_form [name="password"]').val()
      if (pwd !== value) {
        return '密码不一致'
      }
    }
  })
  
  var { layer } = layui; 
  // 注册功能
  $('#reg_form').on('submit', function (e) {
    e.preventDefault();
    var username = $('#reg_form [name="username"]').val();
    var password = $('#reg_form [name="password"]').val();
    $.post('/api/reguser', { username, password }, function (res) {
      if(res.status !== 0) return layer.msg(res.message)
      layer.msg(res.message)
      $('#link_login').click()
    })
  })
  
  // 登录功能
  $('#login_form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method:'post',
      url: '/api/login',
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) return layer.msg(res.message)
        layer.msg(res.message)
        localStorage.setItem('token', res.token)
        // 跳转到页面
        location.href = '/index.html'
      }
    })
  })
})