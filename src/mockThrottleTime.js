let originalThrottleTime;
const mockThrottleTime = timer => (testScheduler, Observable = Observable) => {
  originalThrottleTime =
    originalThrottleTime || Observable.prototype.throttleTime;
  Observable.prototype.throttleTime = function() {
    const t = testScheduler.createTime(timer);
    return originalThrottleTime.call(this, t, testScheduler);
  };
};

export default mockThrottleTime;
