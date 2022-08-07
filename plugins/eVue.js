import Vue from "vue"


function setClip(content) {
    let aux = document.createElement("input");
    aux.style.position = "fixed"
    aux.style.opacity = "0"
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.focus()
    aux.select();
    document.execCommand("copy");
    // console.log(document.execCommand("copy"))
    document.body.removeChild(aux);
}

Vue.prototype.$formatEmail = email => {
    let strs = email.split('@')
    if (strs[0].length <= 4) {
        return strs.join('@')
    }
    let s = strs[0].substr(0, 2) + '****' + strs[0].substr(strs[0].length - 2, 2)
    return [s, strs[1]].join('@')
}

Vue.prototype.$setClip = setClip

Vue.prototype.$fixed8 = n => {
    let s = n
    try {
        s = n ? n.toFixed(10) : '0'
    } catch (error) {

    }
    return s == '0' ? '0' : s.substr(0, s.length - 2)
}
Vue.prototype.$toNumberStr = (num, digits) => {
    // 正则匹配小数科学记数法
    let reg = RegExp(`^[\-]?\\d*(\\.?\\d{0,${digits}})`, "g");
    // 正则匹配小数科学记数法
    if (/^(\d+(?:\.\d+)?)(e)([\-]?\d+)$/.test(num)) {
        // 正则匹配小数点最末尾的0
        return num.toFixed(digits + 1).match(reg)[0] || "0";
    } else {
        return `${num}`.match(reg) != null ? `${num}`.match(reg)[0] : '0';
    }

}
Vue.prototype.$toDoc = () => {
    let b_lang = null
    switch (window.$nuxt.$vuetify.lang.current) {
        case 'en_us':
            b_lang = 'en'
            break;
        case 'zh_CN':
            b_lang = 'zh-CN'
            break;
        case 'zh_TW':
            b_lang = 'zh-TW'
            break;
        default:
            b_lang = 'en'
    }
    window.open(`https://ib.cc/#/Doc?lang=${b_lang}`, "GW");
    // window.open(`http://192.168.31.160:9000/#/Doc?lang=${b_lang}`, "GW");
    // window.open(`https://http://zentao.88887.cn:1000/#/Doc?lang=${b_lang}`, "GW");
}
Vue.prototype.$toBlockBrowser = (hash, item) => {
    setClip(hash)
    window.open(item.url, "_blank")
}

Vue.prototype.$formatTime = (str = "yyyy-mm-dd HH:MM:SS", time) => {
    let t = new Date()
    if (time) {
        t = new Date(time)
    }
    let yyyy = t.getFullYear()
    let mm = (t.getMonth() + 1) > 9 ? (t.getMonth() + 1) : '0' + (t.getMonth() + 1)
    let dd = t.getDate() > 9 ? t.getDate() : '0' + t.getDate()
    let HH = t.getHours() > 9 ? t.getHours() : '0' + t.getHours()
    let MM = t.getMinutes() > 9 ? t.getMinutes() : '0' + t.getMinutes()
    let SS = t.getSeconds() > 9 ? t.getSeconds() : '0' + t.getSeconds()
    return str.replace('yyyy', yyyy).replace('mm', mm).replace('dd', dd).replace('HH', HH).replace('MM', MM).replace('SS', SS)
}

Vue.config.warnHandler = (...args) => {}

let eVue = new Vue()
export default eVue