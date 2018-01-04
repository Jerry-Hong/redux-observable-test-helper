import { Observable } from 'rxjs';
import API from './api.js';

export const show = () => ({
  type: 'SHOW',
});

export const close = data => ({
  type: 'CLOSE',
  payload: data,
});

export const delayEpic = action$ =>
  action$.ofType('SHOW').delay(3000).map(x => close());

export const requestEpic = action$ =>
  action$
    .ofType('SHOW')
    .mergeMap(() => API('http://jsonplaceholder.typicode.com/posts'))
    .map(res => close(res));

export const debounceEpic = action$ =>
  action$.ofType('SHOW').debounceTime(300).map(res => close());

export const throttleEpic = action$ =>
  action$.ofType('SHOW').throttleTime(300).map(res => close());

export const timerEpic = action$ =>
  action$
    .ofType('SHOW')
    .mergeMap(() => Observable.timer(100, 300))
    .map(res => close())
    .take(3);
