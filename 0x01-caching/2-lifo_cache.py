#!/usr/bin/env python3

"""LIFO Cache class

    Adds and retrieves data from the cache using
    the Last In First Out (LIFO) algorithm
"""

BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """A cache system using LIFO

        Manages the cache limit using the LIFO algorithm

        Attributes
        ----------
        __last_in: str
            The key of the last item inserted/modified
    """
    __last_in: str

    def __init__(self):
        """Initializes the LIFO cache instance"""
        super().__init__()

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
        cache_data_keys: list = list(self.cache_data.keys())
        if key not in cache_data_keys:
            cache_data_len: int = len(cache_data_keys)
            if cache_data_len + 1 > BaseCaching.MAX_ITEMS:
                self.cache_data.pop(self.__last_in)
                print("DISCARD: {}".format(self.__last_in))
        self.cache_data.update({key: item})
        self.__last_in = key

    def get(self, key):
        """Retrieves data from the cache using a key

            Parameters
            ----------
            key: str
                The key that identifies the data
        """
        if key is None:
            return None
        return self.cache_data.get(key, None)
