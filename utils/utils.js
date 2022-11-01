/** 元素是否在数组中 */
const inArray = (element, arr) => {
    for (const i = 0; i < arr.length; i++) {
        if (element == arr[i]) {
            return true;
        }
    }
    return false;
}

/** 
 * 大小排序 
 * by: 0: 升序，1降序，不填升序
 */
const sortSize = (arr, by) =>{
    if (typeof by == 'undefined') {
        by = 0;
    }
    if (by) {
        arr.sort(function (a, b) { return b - a });
    } else {
        arr.sort(function (a, b) { return a - b });
    }
    return arr;
}

/**
 * 时间戳差 转为 剩余时间
 */
const remainTime = (diffms) =>{
    const daysms = 24 * 60 * 60 * 1000;
    const hoursms = 60 * 60 * 1000;
    const minutems = 60 * 1000;
    const secondms = 1000;
    const result = '';
    const hasfrontVal = false;

    const differDay = Math.floor(diffms / daysms);
    result = differDay ? differDay + '天' : '0天';
    hasfrontVal = differDay ? true : false;

    diffms -= differDay * daysms;
    const differHour = Math.floor(diffms / hoursms);
    result += differHour ? differHour + '时' : '0时';
    hasfrontVal = differHour ? true : false;

    diffms -= differHour * hoursms;
    const differMinute = Math.floor(diffms / minutems);
    result += differMinute ? differMinute + '分' : '0分';

    diffms -= differMinute * minutems;
    const differSecond = Math.floor(diffms / secondms);
    result += differSecond ? differSecond + '秒' : '0秒';

    return result;
}

/** 对象转为用'&'连接的字符串 */
const Obj2Str = (obj) =>{
    const str = '';
    for (const i in obj) {
        str += (str ? '&' : '') + i + '=' + obj[i]
    }
    return str;
}

export{
	inArray,
	sortSize,
	remainTime,
	Obj2Str
}
