# redux-observable-test-helper

## install

This has peer dependencies of rxjs 5 and redux-observable, which will have to be installed as well.

```bash
npm install --save-dev redux-observable-test-helper
```

## Usage

```javascript
// epic.js
export const show = () => ({
  type: 'SHOW',
});

export const close = data => ({
  type: 'CLOSE',
  payload: data,
});

export const delayEpic = action$ =>
  action$.ofType('SHOW').delay(3000).map(x => close());
```

```javascript
// epic.test.js
import {
  delayEpic,
  show,
  close,
} from './epic.js';
import { createExpectedEpic, mockDelay } from 'redux-observable-test-helper';

const expectedEpic = createExpectedEpic((actual, expected) => {
  // here use Jest, you can use your assertion library
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
```

## API docs

[read here](https://github.com/Jerry-Hong/redux-observable-test-helper/blob/master/doc/API.md)

