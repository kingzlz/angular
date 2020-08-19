import { debounce, throttle } from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
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
    descriptor.value = debounce(descriptor.value, wait, options);
  };
};