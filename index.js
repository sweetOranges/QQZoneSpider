var http = require('http');
var qs = require('querystring');
var zlib = require('zlib');
/*请填写你的cookie值*/
var $Cookie = '';
/*获取指定的cookie值*/
var cookie = function(name){
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=$Cookie.match(reg))
    return unescape(arr[2]);
  else
  return null;
};
/*获取腾讯加密g_tk值算法实现*/
var getGTK = function () {
      var tmpSkey = null,
      tmpToken = null;
      return function () {
        var skey = cookie('p_skey') || cookie('skey') || '',
        hash = 5381,
        token = tmpToken;
        if (skey) {
          if (skey !==
          tmpSkey) {
            tmpSkey = skey;
            var i = 0,
            l = skey.length;
            for (; i < l; ++i) hash += (hash << 5) + skey.charAt(i).charCodeAt();
            tmpToken = token = hash & 2147483647
          }
        } else tmpToken = token = null;
        return token
      }
}();
/*获取说说*/
var postData = {
  g_tk:getGTK(),
  format:'json',
  list_type:'shuoshuo',
  action:0,
  res_uin:951773099,
  count:1000
};

var content = qs.stringify(postData);

var options = {
  hostname:'mobile.qzone.qq.com',
  port:80,
  path:'/list?'+content,
  method:'get',
  headers:{
    'accept':'application/json',
    'accept-encoding':'gzip, deflate, sdch, br',
    'accept-language':'zh-CN,zh;q=0.8',
    'cache-control':'no-cache',
    'cookie':$Cookie,
    'origin':'https://h5.qzone.qq.com',
    'pragma':'no-cache',
    'Host':'mobile.qzone.qq.com',
    'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1'
   }
};
var req = http.request(options, function (res) {  
    var response = '';
    /*由于返回的gzip格式的数据，对其进行解压*/
    res.pipe(zlib.createGunzip()).on('data', function (chunk) {  
      response += chunk;
    }).on('end',function(){
      
      console.dir(JSON.parse(response));  
    });  
});  
  
req.on('error', function (e) {  
    console.log('problem with request: ' + e.message);  
});    

req.end();  