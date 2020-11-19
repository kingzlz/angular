import { HttpParams, HttpResponse } from '@angular/common/http';
import { STColumn } from '@delon/abc/st';

/**
 * 前端请求后端数据过滤时，的条件数据类型接口。
 */
export interface ISearchFilter {
  [key: string]: any;
}
/**
 * 前端发送给后端的分页数据接口
 */
export interface IRequestPagination {
  /**
   * 当前页码
   */
  page: number;
  /**
   * 每页显示数据限制
   */
  limit: number;
}

/**
 * // 如果向后台发送的分页数据格式不是 IRequestPagination 类型，则通过此函数进行适配
 * @param requestPagination - 分页数据
 */
export function parseRequestPagination(requestPagination: IRequestPagination): any {
  return requestPagination || {};
}


export function filterNullValue(source: { [key: string]: any } | HttpParams): { [key: string]: any } {
  const result: { [key: string]: any } = {};

  if (!source) {
    source = {};
  }

  if (source instanceof HttpParams) {
    (source as HttpParams).keys().forEach((key: string) => {
      const value: string | null = (source as HttpParams).get(key);

      if (value != null) {
        result[key] = value;
      }
    });

    return result;
  }

  Object.keys(source).forEach((key: string) => {
    if (source[key] != null) {
      result[key] = source[key];
    }
  });

  return result;
}

export function execFixedTableScrollX(columns: STColumn[], defaultColWidth: number = 200, incWidth: number = 50): number {
  return columns.reduce<number>((total: number, col: STColumn) => {
    if (col.fixed) {
      return total;
    }

    if (!col.width || /%\s*$/i.test(col.width + '')) {
      return total + defaultColWidth + incWidth;
    }

    return parseFloat(col.width + '') + total + incWidth;
  }, 0);
}
export interface AllTypes {
  [key: string]: any;
}

/**
 * @description: 深拷贝
 * @param obj 要拷贝的对象
 * @param cache 缓存
 */

export function deepClone(obj: AllTypes, cache: Map<any, any> = new Map()): AllTypes {
  if (cache.get(obj)) {
    return cache.get(obj);
  }

  if (typeof obj !== 'object' || typeof obj === null) {
    return obj;
  }

  let cloneObj: AllTypes;
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }

  if (obj instanceof Array) {
    cloneObj = [];
  } else {
    // 将对象的原型链也复制，如果用{}代替p，则对象构造函数(constructor)都将为Object
    const p = obj.constructor.prototype;
    cloneObj = Object.create(p);
  }

  cache.set(obj, obj);

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], cache);
    }
  }

  return cloneObj;
}

/**
 * @description: 防抖触发高频时间后n秒内函数只会执行一次,如果n秒内高频时间再次触发,
 * 则重新计算时间防抖常应用于用户进行搜索输入节约请求资源，window触发resize事件时进行防抖只触发一次。
 * @param fn 回调函数
 * @param delay 时间
 */
export function debounce(fn: () => void, delay: number): () => void {
  let ts = null;
  return () => {
    clearTimeout(ts);
    ts = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
}

/**
 * @description: 节流;高频时间触发,但n秒内只会执行一次,所以节流会稀释函数的执行频率;
 * 节流常应用于鼠标不断点击触发、监听滚动事件。
 * @param fn 回调函数
 * @param delay 时间
 */
export function throttle(fn: () => void, delay: number): () => void {
  let ts = null;
  return () => {
    if (!ts) {
      ts = setTimeout(() => {
        fn.call(this, ...arguments);
        ts = null;
      }, delay);
    }
  };
}
