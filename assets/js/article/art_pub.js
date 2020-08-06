$(function () {
  initCate()
  // 初始化富文本编辑器
  initEditor()

  // 1. 初始化图片裁剪器
  var $image = $('#image')
  
  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)

  // 点击显示上传文件区域
  $('#btnchooseImage').on('click', function () {
    $('#coverFile').click()
  })
  // 替换裁剪区域的图片
  $('#coverFile').change(function () {
    if(this.files.length === 0) return layer.msg('请选择图片')
    var imageURL = URL.createObjectURL(this.files[0])
    $image
      .cropper('destroy')
      .attr('src', imageURL)
      .cropper(options)
  })
  
  var state = '已发布'
  $('#btn2').click(function () {
    state = '草稿'
  })

  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    // 基于 form 表单，快速创建一个 FormData 对象
    var fd = new FormData(this)
    console.log(fd.title);
    fd.append('state', state)
    // 将封面裁剪过后的图片，输出为一个文件对象
    $image
    .cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 400,
      height: 280
    })
    .toBlob(function(blob) {
      // 将 Canvas 画布上的内容，转化为文件对象
      // 得到文件对象后，进行后续的操作
      // 5. 将文件对象，存储到 fd 中
      fd.append('cover_img', blob)
      // 6. 发起 ajax 数据请求
      publishArticle(fd)
    })
  })
})

function initCate() {
  $.ajax({
    method:'get',
    url:'/my/article/cates',
    success:function(res){
      if (res.status !== 0) return layer.msg(res.message)
      // console.log(res);
      var str = template('tpl-cate', res)
      $('[name=cate_id]').html(str)
      layui.form.render()
    }
  })
}

function publishArticle(fd) {
  $.ajax({
    method:'post',
    url: '/my/article/add',
    data: fd,
    contentType: false,
    processData: false,
    success:function(res){
      if (res.status !== 0) return layer.msg(res.message)
      layer.msg(res.message)
      // 发布文章成功后，跳转到文章列表页面
      location.href = '/article/art_list.html'  
    }
  })
}