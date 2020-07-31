$(function () {
  var { form } = layui;
  form.verify({
    pwd: [/^\S{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function (value) {
      if(value === $('[name=oldPwd]').val()) return '新旧密码不能相同！'
    },
    rePwd: function (value) {
      if(value !== $('[name=newPwd]').val()) return '两次密码不一致！'
    }
  })

  // 提交功能
  $('.layui-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'post',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function (res) {
        if(res.status !== 0) return layer.msg(res.message)
        console.log(res);
        layer.msg(res.message)
        setTimeout(() => {
          localStorage.removeItem('token')
          window.parent.location.href = '/login.html'
        }, 2000)
      }
    })
  })
})