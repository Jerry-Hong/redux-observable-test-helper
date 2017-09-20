# API

## createExpectedEpic(assertFn)

createExpectedEpic() is used to create an **expectedEpic** function

### Arguments

- `assertFn`: a callback function to assert expected is equal actual or not.

### Returns

`expectedEpic`: a function use for test epic

### example

```javascript
const expectedEpic = createExpectedEpic((actual, expected) => {
  // here use Jest, you can use your assertion library
  expect(actual).toEqual(expected); 
});
```

## expectedEpic(epic, expect&action, ...mockFuns)

### Arguments

- `epic: Epic`: an epic you want to test
- `expect&action: Object`: an object contain two propeerty, **action** and **expect**
- `mockFuns: function[]`: functions you want to mock

### example

- Basic 

#### `yourEpic.js`

```javascript
export const show = () => ({ type: 'SHOW' });

export const close = () => ({ type: 'CLOSE' });

export function yourEpic(action$) {
    return action$.ofType('SHOW').mapTo(close())
}
```

#### `yourEpic.test.js`

```javascript
import { yourEpic, show, close } from '../yourEpic.js';

test('basic example', () => {
  expectedEpic(
    yourEpic,
    {
      action: ['-a', { a: show() }],
      expect: ['-b', { b: close() }],
    }
  );
});
```

- Advance 

#### `yourEpic.js`

```javascript
import API from './api.js';
export const show = () => ({ type: 'SHOW' });

export const close = (data) => ({ type: 'CLOSE', payload: data });

export const requestEpic = action$ =>
  action$
    .ofType('SHOW')
    .mergeMap(() => API('http://jsonplaceholder.typicode.com/posts'))
    .map(res => close(res));
```

#### `yourEpic.test.js`

```javascript
import { requestEpic, show, close } from '../yourEpic.js';

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
```

## mockDelay(marbles)

mock rxjs delay operator, return a mock function for expectedEpic

### Arguments

- `marbles: string`: marble diagram string

### Returns 

a mock function for expectedEpic

### Example

```javascript
test('test delay', () => {
  expectedEpic(
    delayEpic,
    {
      action: ['a', { a: show() }],
      expect: ['--a', { a: close() }]
    },
    mockDelay('--|')
  );
});
```