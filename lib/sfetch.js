/*!
 * |=======================================|
 * |               sfetch     
 * |=======================================|
 * package fetch
 * author: JiChuangWei(2323176669@qq.com)
 */
"use strict";

var get = function get(body, headers) {
    return {
        method: "GET",
        headers: headers
    };
};
var method = function method(method_type, body, headers) {
    return {
        method: method_type,
        body: body,
        headers: headers
    };
};
var result_promise = function result_promise(req) {
    return req.then(function (resp) {
        return new Promise(function (resolve, reject) {
            resp.json().then(function (data) {
                resp.json = data;
                return resolve(resp);
            }, function (data) {
                resp.text = data;
                return reject(resp);
            });
        });
    }).then(function (j) {
        if (j.status !== 2000) {
            throw j;
        }
        return j;
    })["catch"](function (j) {
        return j;
    });
};
var url_parameter = function url_parameter(data) {
    var toString = "";
    for (var key in data) {
        var obj = data[key];
        if (Array.isArray(obj)) {
            var arrayString = obj.join(",");
            toString += key + "=" + arrayString + "&";
        } else {
            toString += key + "=" + data[key] + "&";
        }
    }
    return toString.replace(/$/, "");
};
var checkTimeout = function checkTimeout(default_fetch, url, time) {
    var stop = null;
    var stop_promise = new Promise(function (resolve, reject) {
        stop = function stop() {
            var reject_response = {};
            reject_response.ok = false;
            reject_response.status = 499;
            reject_response.statusText = "timeout(" + time + "s)";
            reject_response.url = url;
            reject(new Response('', reject_response));
        };
    });
    var exit_promise = Promise.race([default_fetch, stop_promise]);
    if (!isNaN(time)) {
        setTimeout(function () {
            stop();
        }, time);
    }
    return exit_promise;
};
module.exports.get = function (param) {
    var headers = param.headers === undefined ? {} : param.headers;
    param.url = param.url + '?' + url_parameter(param.body);
    return result_promise(checkTimeout(fetch(param.url, get(headers)), param.url, param.timeout));
};
module.exports.post = function (param) {
    var headers = param.headers === undefined ? {} : param.headers;
    var body = param.dataType === 'formdata' ? param.body : JSON.stringify(param.body);
    return result_promise(checkTimeout(fetch(param.url, method('POST', body, headers)), param.url, param.timeout));
};
module.exports.path = function (param) {
    var headers = param.headers === undefined ? {} : param.headers;
    var body = param.dataType === 'formdata' ? param.body : JSON.stringify(param.body);
    return result_promise(checkTimeout(fetch(param.url, method('PATH', body, headers)), param.url, param.timeout));
};
module.exports.del = function (param) {
    var headers = param.headers === undefined ? {} : param.headers;
    var body = param.dataType === 'formdata' ? param.body : JSON.stringify(param.body);
    return result_promise(checkTimeout(fetch(param.url, method('DELETE', body, headers)), param.url, param.timeout));
};