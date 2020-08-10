import { HttpParams, HttpResponse } from '@angular/common/http';
import { STColumn } from '@delon/abc';

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
