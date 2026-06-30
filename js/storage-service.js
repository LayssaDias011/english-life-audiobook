(function () {
  "use strict";

  const memoryStore = {};

  function canUseLocalStorage() {
    try {
      const key = "__english_life_test__";
      localStorage.setItem(key, "1");
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  const localStorageAvailable = canUseLocalStorage();

  window.StorageService = {
    get(key, fallback = null) {
      try {
        const raw = localStorageAvailable ? localStorage.getItem(key) : memoryStore[key];
        return raw ? JSON.parse(raw) : fallback;
      } catch (error) {
        console.warn("Storage read failed", error);
        return fallback;
      }
    },

    set(key, value) {
      const raw = JSON.stringify(value);
      if (localStorageAvailable) {
        localStorage.setItem(key, raw);
      } else {
        memoryStore[key] = raw;
      }
    },

    remove(key) {
      if (localStorageAvailable) {
        localStorage.removeItem(key);
      } else {
        delete memoryStore[key];
      }
    },
  };
})();
