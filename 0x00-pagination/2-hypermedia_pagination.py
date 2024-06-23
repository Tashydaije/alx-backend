#!/usr/bin/env python3

"""Simple pagination

    Server that gets the data indexes for the given
    pagination parameters
"""
import csv
import math
from typing import List

index_range = __import__('0-simple_helper_function').index_range


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        """Instantiate a server instance"""
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Return data for the given pagination parameters

            Parameters
            ----------
            page: int
                The page number of the dataset
            page_size: int
                The size of a page

            Returns
            -------
            List[List]
                List of results for a given page
        """
        # Assert the datatypes and values
        assert type(page) is int
        assert type(page_size) is int
        assert page > 0
        assert page_size > 0

        # Paginate the data
        start_index, end_index = index_range(page, page_size)
        dataset = self.dataset()
        dataset_len = len(dataset)
        if start_index >= dataset_len or end_index >= dataset_len:
            return []
        return dataset[start_index:end_index]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """Returns the data and pagination parameters

            Parameters
            ----------
            page: int
                The page number of the dataset
            page_size: int
                The size of a page

            Returns
            -------
            List[List]
                List of results for a given page
        """
        data_metadata: dict = {
            'page_size': 0,
            'page': 1,
            'data': [],
            'next_page': None,
            'prev_page': None,
            'total_pages': 0
        }
        data = self.get_page(page=page, page_size=page_size)
        dataset = self.dataset()
        total_pages = math.ceil(len(dataset) / page_size)
        data_metadata['page'] = page
        if page == 1:
            data_metadata['prev_page'] = None
        else:
            data_metadata['prev_page'] = page - 1
        data_metadata['total_pages'] = total_pages
        if len(data) > 0:
            data_metadata['data'] = data
            data_metadata['next_page'] = page + 1
            data_metadata['page_size'] = page_size
        return data_metadata
