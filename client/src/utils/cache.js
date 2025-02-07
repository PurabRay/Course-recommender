const CACHE_KEY_PREFIX = 'search_cache_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const cacheService = {
  get: (key) => {
    try {
      const item = localStorage.getItem(CACHE_KEY_PREFIX + key);
      if (!item) return null;

      const { value, timestamp } = JSON.parse(item);
      const now = new Date().getTime();

      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY_PREFIX + key);
        return null;
      }

      return value;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      const item = {
        value,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify(item));
    } catch (error) {
      console.error('Cache setting error:', error);
    }
  },

  // Get all recent searches
  getRecentSearches: () => {
    try {
      const searches = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          const item = JSON.parse(localStorage.getItem(key));
          searches.push({
            term: key.replace(CACHE_KEY_PREFIX, ''),
            timestamp: item.timestamp,
          });
        }
      }
      return searches
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5)
        .map(s => s.term);
    } catch (error) {
      console.error('Recent searches retrieval error:', error);
      return [];
    }
  }
}; 