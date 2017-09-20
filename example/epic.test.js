import {
  delayEpic,
  show,
  close,
  requestEpic,
  debounceEpic,
  throttleEpic,
} from './epic.js';
import {
  createExpectedEpic,
  mockDelay,
  mockDebounceTime,
  mockThrottleTime,
} from '../bundle/bundle.js';
import API from './api.js';

jest.mock('./api.js');

const expectedEpic = createExpectedEpic((actual, expected) => {
  expect(actual).toEqual(expected);
});

test('test delay', () => {
  expectedEpic(
    delayEpic,
    {
      expect: ['--a', { a: close() }],
      action: ['a', { a: show() }],
    },
    mockDelay('--|')
  );
});

test('test request', () => {
  const request = testScheduler => {
    API.mockImplementation(() =>
      testScheduler.createColdObservable('--b', { b: { data: 123 } })
    );
    return () =>
      expect(API).toBeCalledWith('http://jsonplaceholder.typicode.com/posts');
  };

  expectedEpic(
    requestEpic,
    {
      expect: ['--b', { b: close({ data: 123 }) }],
      action: ['a', { a: show() }],
    },
    request
  );
});

test('test debounceTime', () => {
  expectedEpic(
    debounceEpic,
    {
      expect: ['---------a', { a: close() }],
      action: ['aaa-a-a', { a: show() }],
    },
    mockDebounceTime('---|')
  );
});

test('test throttleTime', () => {
  expectedEpic(
    throttleEpic,
    {
      expect: ['a--a--a', { a: close() }],
      action: ['aaaaa-a', { a: show() }],
    },
    mockThrottleTime('--|')
  );
});
