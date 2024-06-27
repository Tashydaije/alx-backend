#!/usr/bin/env python3

"""FIFO Cache class

    Adds and retrieves data from the cache using
    the First In First Out (FIFO) algorithm
"""

BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """A cache system using FIFO

        Manages the cache limit using the FIFO algorithm
    """

    def __init__(self):
        """Initializes the FIFO cache instance"""
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
        self.cache_data.update({key: item})
        cache_data_keys: list = list(self.cache_data.keys())
        cache_data_len: int = len(cache_data_keys)
        if cache_data_len > BaseCaching.MAX_ITEMS:
            first_item_key: str = cache_data_keys[0]
            self.cache_data.pop(first_item_key)
            print("DISCARD: {}".format(first_item_key))

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
