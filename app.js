//app.js

const WXBizDataCrypt = require('utils/WXBizDataCrypt.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var appId = 'wx8174f411e9ee8e2d';
    var secret = 'd578eb87a504ec37d99cd627b9853aff';

    var sessionKey = '';
    

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        var code = res.code; //返回code
        console.log(code);
        
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'json'
          },
          success: function (res) {
            var openid = res.data.openid; //返回openid
            sessionKey = res.data.session_key;
          }
        })
        console.info('sk0' + sessionKey)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              var encryptedData = res.encryptedData;
              var iv = res.iv;
              var pc = new WXBizDataCrypt(appId, sessionKey);

              console.info('sk1'+sessionKey);
              var data = pc.decryptData(encryptedData, iv);

              // console.info(data);



              this.globalData.userInfo = res.userInfo
              console.info(res)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})