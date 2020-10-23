import os
from enum import Enum


class Planet(Enum):
    Mercury = 'mercury'
    Venus = 'venus'
    Earth = 'earth'
    Mars = 'mars'
    Jupiter = 'jupiter'
    Saturn = 'saturn'
    Uranus = 'uranus'
    Neptune = 'neptune'
    # Sorry, Pluto :'(


def is_dev():
    """Determine if we're in dev mode or not"""
    return os.environ.get('devmode', 'false') == 'true'
