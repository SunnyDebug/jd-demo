// 文件名：jd_bridge.js

(function(window) {
    // --- 1. 安全检查 (只保留时间锁，防止报错) ---
    try {
        // 设置演示截止日期 (2026年1月24日)
        var EXPIRY_DATE = new Date('2026-01-24 23:59:59').getTime();
        if (Date.now() > EXPIRY_DATE) {
            alert("演示授权已过期。");
            throw new Error("Expired"); 
        }
    } catch (e) {
        // 如果出错，直接停止运行
        throw e;
    }

    // --- 2. 核心业务逻辑 ---
    'use strict';

    var JDBridge = {
        config: {
            loginGate: "https://plogin.m.jd.com/user/login.action",
            targetUrlBase: "https://item.m.jd.com/product/",
            trackerUrl: "https://log.jd.com/log/click" 
        },

        submit: function(options) {
            if (!options || !options.skuId) {
                alert("错误：缺少商品ID");
                return;
            }

            // 发送埋点
            this._track(options.skuId);

            // 构造跳转链接
            var safeTargetUrl = this.config.targetUrlBase + options.skuId + ".html";
            var loginUrl = this.config.loginGate + "?appid=100&returnurl=" + encodeURIComponent(safeTargetUrl);

            console.log("正在跳转...");

            // 延时跳转
            setTimeout(function() {
                window.location.href = loginUrl;
            }, 300);
        },

        _track: function(skuId) {
            var url = this.config.trackerUrl + "?t=" + Date.now() + "&sku=" + skuId + "&type=click";
            try {
                new Image().src = url;
            } catch (e) {}
        }
    };

    window.JDBridge = JDBridge;

})(window);