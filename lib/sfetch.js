/*!
 * |=======================================|
 * |               sfetch     
 * |=======================================|
 * package fetch
 * author: JiChuangWei(2323176669@qq.com)
 */
(function() {
    const get = (body, headers) => ({
        method: "GET",
        headers: headers,
    });
    const method = (method_type, body, headers) => ({
        method: method_type,
        body: body,
        headers: headers
    })
    const result_promise = (req) => (req.then((resp) => {
        return new Promise((resolve, reject) => {
            resp.json().then((data) => {
                resp.json = data;
                return resolve(resp)
            }, (data) => {
                resp.text = data;
                return reject(resp)
            })
        });
    }).then((j) => {
        if (j.status !== 2000) {
            throw j;
        }
        return j;
    }).catch((j) => {
        return j;
    }));
    const url_parameter = (data) => {
        let toString = "";
        for (var key in data) {
            var obj = data[key];
            if (Array.isArray(obj)) {
                let arrayString = obj.join(",");
                toString += key + "=" + arrayString + "&";
            } else {
                toString += key + "=" + data[key] + "&";
            }
        }
        return toString.replace(/$/, "");
    };
    const checkTimeout = (default_fetch, url, time) => {
        let stop = null;
        let stop_promise = new Promise(function(resolve, reject) {
            stop = function() {
                let reject_response = {};
                reject_response.ok = false;
                reject_response.status = 499;
                reject_response.statusText = `timeout(${time}s)`;
                reject_response.url = url;
                reject(new Response('', reject_response));
            };
        });
        let exit_promise = Promise.race([
            default_fetch,
            stop_promise
        ]);
        if (!isNaN(time)) {
            setTimeout(function() {
                stop();
            }, time);
        }
        return exit_promise;
    }
    exports.get = function(param) {
        let headers = param.headers === undefined ? {} : param.headers;
        param.url = param.url + '?' + url_parameter(param.body);
        return result_promise(checkTimeout(fetch(param.url, get(headers)), param.url, param.timeout));
    };
    exports.post = function(param) {
        let headers = param.headers === undefined ? {} : param.headers;
        let body = param.dataType === 'formdata' ? param.body : JSON.stringify(param.body);
        return result_promise(checkTimeout(fetch(param.url, method('POST', body, headers)), param.url, param.timeout));
    };
    exports.path = function(param) {
        let headers = param.headers === undefined ? {} : param.headers;
        let body = param.dataType === 'formdata' ? param.body : JSON.stringify(param.body);
        return result_promise(checkTimeout(fetch(param.url, method('PATH', body, headers)), param.url, param.timeout));
    };
    exports.del = function(param) {
        let headers = param.headers === undefined ? {} : param.headers;
        let body = param.dataType === 'formdata' ? param.body : JSON.stringify(param.body);
        return result_promise(checkTimeout(fetch(param.url, method('DELETE', body, headers)), param.url, param.timeout));
    };
}).call(this);