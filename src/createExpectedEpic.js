import { Observable, TestScheduler } from 'rxjs';
import { ActionsObservable } from 'redux-observable';

const createExpectedEpic = expectFunc => (
  epic,
  { expect, action, store },
  ...rest
) => {
  const testScheduler = new TestScheduler(expectFunc);

  const testsFunc = rest
    .filter(func => typeof func === 'function')
    .map(func => func(testScheduler, Observable));

  const action$ = new ActionsObservable(
    testScheduler.createHotObservable(...action)
  );

  const test$ = epic(action$, store);
  testScheduler.expectObservable(test$).toBe(...expect);
  testScheduler.flush();
  testsFunc.filter(func => typeof func === 'function').forEach(test => test());
};

export default createExpectedEpic;
