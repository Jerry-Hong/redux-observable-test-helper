let originalDelay;
const mockDelay = timer => (testScheduler, Observable = Observable) => {
  originalDelay = originalDelay || Observable.prototype.delay;
  Observable.prototype.delay = function() {
    const t = testScheduler.createTime(timer);
    return originalDelay.call(this, t, testScheduler);
  };
};

export default mockDelay;
