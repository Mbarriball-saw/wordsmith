type MemoizedFunction<F extends (...args: any[]) => any> = F & { memoized: boolean };

function memoize<F extends (...args: any[]) => any>(fn: F): MemoizedFunction<F> {
  const cacheKey = `${fn.name}_cache`;

  const memoizedFn = (...args: Parameters<F>): ReturnType<F> => {
    const cache = localStorage.getItem(cacheKey);
    let cacheData;

    if (cache) {
      try {
        cacheData = JSON.parse(cache);
      } catch {
        cacheData = {};
      }
    } else {
      cacheData = {};
    }

    const key = JSON.stringify(args);

    if (key in cacheData) {
      return cacheData[key];
    }

    const result = fn(...args);
    cacheData[key] = result;

    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    return result;
  };

  memoizedFn.memoized = true;

  return memoizedFn as MemoizedFunction<F>;
}
