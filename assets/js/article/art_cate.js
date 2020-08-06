$(function () {
  initArtCateList();

  var indexAdd = null
  // 为添加类别按钮绑定点击事件
  $('#btnAddCate').on('click', function () {
    // 弹出一个添加文章类别信息的层
    indexAdd = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 添加文章类别功能
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      method:'post',
      url:'/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if(res.status !== 0) return layer.msg(res.message)
        // console.log(res);
        layer.msg(res.message)
        initArtCateList();
        layer.close(indexAdd)
      }
    })
  })

  var indexEdit = null
  // 编辑功能
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layui.layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    var id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'get',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res);
        layui.form.val('form-edit', res.data)
      }
    })
  })
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method:'post',
      url:'/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if(res.status !== 0) return layer.msg(res.message)
        // console.log(res);
        layer.msg(res.message)
        initArtCateList();
        layer.close(indexEdit)
      }
    })
  })

  // 删除功能
  $('tbody').on('click', '.btn-delete', function () {
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method:'get',
        url:'/my/article/deletecate/' + id,
        success:function(res){
          if (res.status !== 0) return layer.msg(res.message)
          layer.msg(res.message)
          layer.close(index)
          initArtCateList();
        }
      })
    })
  })

})



function initArtCateList() {
  $.ajax({
    method:'get',
    url:'/my/article/cates',
    success:function(res){
      // console.log(res);
      var str = template('tpl', res)
      $('tbody').html(str)
    }
  })
}