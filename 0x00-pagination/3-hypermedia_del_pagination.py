#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import List, Dict


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        """Instantiate a server instance"""
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        """Returns data and pagination parameters"""
        result: Dict = {
            'index': None,
            'data': [],
            'page_size': 10,
            'next_index': 0,
        }
        dataset = self.indexed_dataset()
        dataset_len = len(dataset)
        assert type(index) is int
        assert index <= dataset_len and index >= 0
        result['index'] = index
        result['page_size'] = page_size
        num_indexed_data: int = page_size
        result['next_index'] = index + page_size
        for i in range(index, dataset_len):
            data = dataset.get(i, None)
            if data is not None and num_indexed_data > 0:
                result['data'].append(dataset[i])
                num_indexed_data -= 1
            elif data is not None and num_indexed_data == 0:
                if dataset.get(i, None) is not None:
                    result['next_index'] = i
                break
        return result
