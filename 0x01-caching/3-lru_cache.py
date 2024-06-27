#!/usr/bin/env python3

"""LRU Least Recently Used Cache class

    Adds and retrieves data from the cache using
    the Least Recently Used (LRU) algorithm
"""
from datetime import datetime
from typing import Dict

BaseCaching = __import__('base_caching').BaseCaching


class LRUCache(BaseCaching):
    """A cache system using LRU

        Manages the cache limit using the LRU algorithm

        Attributes
        ----------
        __lru_counter: Dict[str, List]
            Dictionary that tracks how the recently used resource
            and the time it was added/modified
        __key_to_remove: str
            Key that maps to the data in the cache to remove
    """
    __lru_counter: Dict[str, datetime]
    __key_to_remove: str

    def __init__(self):
        """Initializes the cache instance"""
        super().__init__()
        self.__lru_counter = {}

    def put(self, key: str, item):
        """Adds data in the cache using a key

        Parameters
        ----------
        key: str
            The key that identifies the entry for the data
        item: Any
            The data stored in the cache
        """
        if key is None or item is None:
            return
        data = self.cache_data.copy()
        cache_data_keys: list = list(data.keys())
        cache_data_len: int = len(cache_data_keys)

        # Add the data if the key does not exist
        if key not in cache_data_keys and cache_data_len > 0:
            # Find and remove the least recently used data when cache is full
            if cache_data_len == BaseCaching.MAX_ITEMS:
                time_now = datetime.now()
                deltas = {key: time_now - value for key,
                          value in self.__lru_counter.items()}
                self.__key_to_remove = sorted(deltas.items(),
                                              key=lambda item: item[1],
                                              reverse=True
                                              )[0][0]
                data.pop(self.__key_to_remove)
                self.__lru_counter.pop(self.__key_to_remove)
                print("DISCARD: {}".format(self.__key_to_remove))
        self.__lru_counter[key] = datetime.now()
        data.update({key: item})
        self.cache_data = data

    def get(self, key):
        """Retrieves data from the cache using a key

            Parameters
            ----------
            key: str
                The key that identifies the data
        """
        if key is None:
            return None
        data = self.cache_data.get(key, None)
        if data is not None:
            self.__lru_counter[key] = datetime.now()
        return data
