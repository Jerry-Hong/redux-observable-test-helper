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

test('advance example', () => {
  const response = { data: 123 };
  const requestMock = testScheduler => {
    // mock your module here
    API.mockImplementation(() =>
      testScheduler.createColdObservable('--r|', { r: response })
    );

    // return a function to assert your mock module above
    return () =>
      expect(API).toBeCalledWith('http://jsonplaceholder.typicode.com/posts');
  };

  expectedEpic(
    requestEpic,
    {
      action: ['--a', { a: show() }],
      expect: ['----b', { b: close(response) }],
    },
    requestMock
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
