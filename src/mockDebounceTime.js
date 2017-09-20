let originalDebounceTime;
const mockDebounceTime = timer => (testScheduler, Observable = Observable) => {
  originalDebounceTime =
    originalDebounceTime || Observable.prototype.debounceTime;
  Observable.prototype.debounceTime = function() {
    const t = testScheduler.createTime(timer);
    return originalDebounceTime.call(this, t, testScheduler);
  };
};

export default mockDebounceTime;
