import json 
import os

from shared import Planet


COLORS = {
    planet: (0, 0, 0, 255)
    for planet in [Planet.Mercury, 
                   Planet.Venus, 
                   Planet.Earth,
                   Planet.Mars,
                   Planet.Jupiter,
                   Planet.Saturn,
                   Planet.Uranus,
                   Planet.Neptune]
}


_PARAM_FILE = os.path.join(os.path.dirname(__file__), 'colors.json')


def initialize():
    """Load parameters from disk, if they are there"""
    if os.path.exists(_PARAM_FILE):
        with open(_PARAM_FILE, 'r') as fh:
            all_params = json.load(fh)
    else:
        all_params = COLORS.copy()

    for key, val in all_params.items():
        COLORS[key] = val



def to_disk():
    """Invoke to save parameters to disk"""
    with open(_PARAM_FILE, 'w') as fh:
        json.dump(COLORS, fh)


def set_color(planet, red, grn, blu, wht):
    """Each color is 8-bit"""
    COLORS[planet] = (red, grn, blu, wht)


def get_color(planet):
    """Returns `(red, green, blue, white)` tuple for the given planet"""
    return COLORS[planet]


initialize()