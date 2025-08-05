// src/services/CacheService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class CacheService {
  private memoryCache = new Map<string, any>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  async set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): Promise<void> {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + ttl,
    };

    // Guardar en memoria
    this.memoryCache.set(key, item);

    // Guardar en AsyncStorage para persistencia
    try {
      await AsyncStorage.setItem(`@cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Intentar obtener de memoria primero
    let item = this.memoryCache.get(key) as CacheItem<T>;

    // Si no está en memoria, intentar AsyncStorage
    if (!item) {
      try {
        const cached = await AsyncStorage.getItem(`@cache_${key}`);
        if (cached) {
          item = JSON.parse(cached);
          // Restaurar en memoria
          this.memoryCache.set(key, item);
        }
      } catch (error) {
        console.error('Error reading from cache:', error);
        return null;
      }
    }

    if (!item) return null;

    // Verificar si ha expirado
    if (Date.now() > item.expiry) {
      await this.delete(key);
      return null;
    }

    return item.data;
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    try {
      await AsyncStorage.removeItem(`@cache_${key}`);
    } catch (error) {
      console.error('Error deleting from cache:', error);
    }
  }

  async clear(): Promise<void> {
    this.memoryCache.clear();
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith('@cache_'));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  async getOrFetch<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl = this.DEFAULT_TTL
  ): Promise<T> {
    // Intentar obtener del caché
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Si no está en caché, obtener datos frescos
    const freshData = await fetchFunction();
    await this.set(key, freshData, ttl);
    return freshData;
  }

  // Invalidar caché relacionado
  async invalidatePattern(pattern: string): Promise<void> {
    // Invalidar memoria
    for (const key of this.memoryCache.keys()) {
      if (key.includes(pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // Invalidar AsyncStorage
    try {
      const keys = await AsyncStorage.getAllKeys();
      const matchingKeys = keys.filter(key => 
        key.startsWith('@cache_') && key.includes(pattern)
      );
      await AsyncStorage.multiRemove(matchingKeys);
    } catch (error) {
      console.error('Error invalidating cache pattern:', error);
    }
  }
}

export const cacheService = new CacheService();