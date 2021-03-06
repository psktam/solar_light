# API must go through this layer before it can actually interface with actual
# hardware.

import json 
import os

from shared import Planet, is_dev

if not is_dev():
    from light_control import LIGHT_CONTROLLERS
else:
    from collections import defaultdict
    LIGHT_CONTROLLERS = defaultdict(lambda: None)


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
            all_params = {Planet[key]: tuple(val)
                          for key, val in json.load(fh).items()}
    else:
        all_params = COLORS.copy()

    for key, val in all_params.items():
        COLORS[key] = val


def to_disk():
    """Invoke to save parameters to disk"""
    with open(_PARAM_FILE, 'w') as fh:
        json.dump({key.name: list(val) for key, val in COLORS.items()})


def set_color(planet, red, grn, blu, wht):
    """Each color is 8-bit"""
    COLORS[planet] = (red, grn, blu, wht)
    # Convert these 8-bit colors to 12-bit for the drivers
    as_12_bit = [int(clr * 4096.0 / 256.0) for clr in COLORS[planet]]
    if not is_dev():
        LIGHT_CONTROLLERS[planet].set_color(*as_12_bit)


def get_color(planet):
    """Returns `(red, green, blue, white)` tuple for the given planet"""
    return COLORS[planet]


initialize()
