#!/usr/bin/python3

"""Basic Cache class

    Does basic caching tasks like adding
    and retrieving data
"""
BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """ A cache system """
    def put(self, key, item):
        """
        Add an item in the cache.

        Args:
            key (str): the key under which the item is stored.
            item (any): the item to store in the cache.
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """
        Retrieve an item from the cache by key.

        Args:
            key (str): the key of the item to retrieve.

        Returns:
            any: the item stored in the cache,
            or None if the key doesn't exist.
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]
