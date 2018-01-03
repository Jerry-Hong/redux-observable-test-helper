let originalTimer;

/**
 * Combine timer with the test scheduler, and override the timer.
 * Note that interval must not exceed 750, since testScheduler limits the max interval.
 *
 * Ref: https://stackoverflow.com/a/42734681
 * @param {Number|Date} initialDelay The initial delay time to wait before emitting.
 * @param {Number} interval the interval to use in test. Each "-" in marble means 10.
 */
const mockTimer = (initialDelay, interval = '---|') => (
  testScheduler,
  Observable = Observable
) => {
  originalTimer = originalTimer || Observable.timer;
  Observable.timer = function() {
    const i = testScheduler.createTime(initialDelay);
    const t = testScheduler.createTime(interval);
    return originalTimer.call(this, i, t, testScheduler);
  };
};

export default mockTimer;
