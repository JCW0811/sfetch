/*!
 * |=======================================|
 * |               sfetch     
 * |=======================================|
 * package fetch
 * author: JiChuangWei(2323176669@qq.com)
 */
(function() {
    const jsonHead = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };
    const post = (body) => ({
        method: "POST",
        headers: jsonHead,
        body: JSON.stringify(body)
    });
    const get = () => ({
        method: 'GET'
    });
    const result_promise = (req) => (req.then((resp) => {
        return new Promise((resolve, reject) => {
            resp.json().then((data) => {
                resp.json = data;
                return resolve(resp)
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
    const filterBody = (p) => {
        let g = Object.assign({
            body: {}
        }, p);
        return g;
    };
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
        let p = filterBody(param);
        p.url = p.url + '?' + url_parameter(p.body);
        return result_promise(checkTimeout(fetch(p.url, get()), p.url, p.timeout));
    };
    exports.post = function(param) {
        let p = filterBody(param);
        return result_promise(checkTimeout(fetch(p.url, post(p.body)), p.url, p.timeout));
    };
}).call(this);