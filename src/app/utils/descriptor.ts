import { Inject, Injectable, Injector } from '@angular/core';
import { debounce, throttle } from 'lodash';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BaseDescriptor {
  constructor(@Inject(Injector) public injector: Injector) {}
}

/**
 * 函数节流装饰器
 * @param {number} wait 节流的毫秒
 * @param {Object} options 节流选项对象
 * [options.leading=true] (boolean): 指定调用在节流开始前。
 * [options.trailing=true] (boolean): 指定调用在节流结束后。
 */
export const throttleFn = function (wait, options = {}) {
  console.log(wait);
  return function (target: any, name: any, descriptor: { value: any }) {
    descriptor.value = throttle(descriptor.value, wait, options);
  };
};

/**
 * 函数防抖装饰器
 * @param {number} wait 需要延迟的毫秒数。
 * @param {Object} options 选项对象
 * [options.leading=false] (boolean): 指定在延迟开始前调用。
 * [options.maxWait] (number): 设置 func 允许被延迟的最大值。
 * [options.trailing=true] (boolean): 指定在延迟结束后调用。
 */
export const debounceFn = function (wait, options = {}) {
  return function (target, name, descriptor) {
    const _this = target.constructor;
    console.log(_this, new _this());

    descriptor.value = debounce(descriptor.value, wait, options);
  };
};

export function confirmFn(message = '确定要删除数据，此操作不可回退。', title = '提示', cancelFn = function (error) {}) {
  // tslint:disable-next-line: only-arrow-functions
  // tslint:disable-next-line: typedef
  return function (_target: BaseDescriptor, targetKey?: string, descriptor?: PropertyDescriptor) {
    const originFn = descriptor.value;

    // tslint:disable-next-line: typedef
    descriptor.value = function (...args: any) {
      console.log('args', args);

      const injector = (this as NzSafeAny).injector as Injector;
      const model = injector.get(NzModalService, null) as NzModalService;
      if (model == null) {
        throw new TypeError(`Not found '_HttpClient', You can import 'AlainThemeModule' && 'HttpClientModule' in your root module.`);
      }
      try {
        model.confirm({
          nzTitle: title,
          nzContent: message,
          nzOnOk: () => originFn.apply(this, args),
        });
      } catch (error) {
        if (cancelFn) {
          cancelFn(error);
        }
      }
    };
  };
}
