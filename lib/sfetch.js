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
    const post = (pm) => ({
        method: "POST",
        headers: jsonHead,
        body: JSON.stringify(pm)
    });
    const get = () => ({
        method: 'GET'
    });
    const handlerReq = (req, p) => (req.then((resp) => {
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
    const filterPm = (p) => {
        let g = Object.assign({
            pm: {}
        }, p);
        return g;
    };
    exports.get = function(param) {
        let p = filterPm(param);
        p.url = p.url + '?' + JSON2Str(p.pm);
        return handlerReq(fetch(p.url, get()), p);
    };
    exports.post = function(param) {
        let p = filterPm(param);
        return handlerReq(fetch(p.url, post(p.pm)), p);
    };
    const JSON2Str = (data) => {
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
}).call(this);