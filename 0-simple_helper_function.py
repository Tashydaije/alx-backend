#!/usr/bin/env python3
"""Helper function that returns pagination parameters"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """Returns pagination parameters for a given page"""
    start_index: int = 0
    for _ in range(1, page, 1):
        start_index += page_size
    end_index: int = start_index + page_size
    return (start_index, end_index)
