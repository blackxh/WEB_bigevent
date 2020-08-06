// 定义一个查询的参数对象，将来请求数据的时候，
// 需要将请求参数对象提交到服务器
var q = {
  pagenum: 1, // 页码值，默认请求第一页的数据
  pagesize: 2, // 每页显示几条数据，默认每页显示2条
  cate_id: '', // 文章的发布状态
  state: ''  // 文章的发布状态
}

// 时间过滤器
template.defaults.imports.dataFormat = function (time) {
  var dt = new Date(time)
  var y = (dt.getFullYear()).toString().padStart(2, '0')
  var m = (dt.getMonth()).toString().padStart(2, '0')
  var d = (dt.getDate()).toString().padStart(2, '0')
  var hh = (dt.getHours()).toString().padStart(2, '0')
  var mm = (dt.getMinutes()).toString().padStart(2, '0')
  var ss = (dt.getSeconds()).toString().padStart(2, '0')
  return y + '-' + m + '-' + d + '  ' + hh + ':' + mm + ':' + ss
}

$(function () {
  initTable();
  initCate();
  // 筛选功能
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    // 获取表单中选中项的值
    var cate_id = $('[name=cate-id]').val()
    var state = $('[name=state]').val()
    console.log(cate_id,state);
    q.cate_id = cate_id
    q.state = state
    initTable();
  })
  // 修改文章分类功能

  // 删除功能
  $('tbody').on('click', '.btn-del', function () {
    var id = $(this).attr('data-id')
    var len = $('.btn-del').length
    console.log(id);
    layer.confirm('确定删除？', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method:'get',
        url:'/my/article/delete/' + id,
        success:function(res){
          if (res.status !== 0) return layer.msg(res.message)
          // console.log(res);
          layer.msg(res.message)
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable();
        }
      })
      layer.close(index)
    })
  })
})

function initTable() {
  $.ajax({
    method:'get',
    url: '/my/article/list',
    data: q,
    success:function(res){
      if (res.status !== 0) return layer.msg(res.message)
      console.log(res);
      // 使用模板引擎渲染页面的数据
      var str = template('tpl-table', res)
      $('tbody').html(str)
      renderPage(res.total)
    }
  })
}

function initCate() {
  $.ajax({
    method:'get',
    url:'/my/article/cates',
    success:function(res){
      if (res.status !== 0) return layer.msg(res.message)
      // console.log(res);
      var str = template('tpl-cate', res)
      $('[name="cate-id"]').html(str)
      // 通过 layui 重新渲染表单区域的UI结构
      layui.form.render()
    }
  })
}
// 定义渲染分页的方法
function renderPage(total) {
  // console.log(total);
  // 调用 laypage.render() 方法来渲染分页结构
  layui.laypage.render({
    elem: 'pageBox',  // 分页容器的Id
    count: total, // 总数据条数
    limit: q.pagesize, // 每页显示几条数据
    curr: q.pagenum,  // 设置默认被选中的分页
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    limits: [2,3,5,10],
    // 分页发生切换的时候，触发 jump 回调
    jump: function (obj, first) {
      // console.log(obj);
      q.pagenum = obj.curr;
      q.pagesize = obj.limit;
      if (!first) {
        initTable()
      }
    }
  })
}


