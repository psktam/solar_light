# API must go through this layer before it can actually interface with 
# actual hardware
import json
import os

from shared import Planet
from speed_control import SPEED_CONTROLLERS


SPEEDS = {
    planet: 0.0
    for planet in [Planet.Mercury, 
                   Planet.Venus,
                   Planet.Earth,
                   Planet.Mars,
                   Planet.Jupiter,
                   Planet.Saturn,
                   Planet.Uranus,
                   Planet.Neptune]
}


_PARAM_FILE = os.path.join(os.path.dirname(__file__), 'speeds.json')


def initialize():
    """Load parameter file from disk if they are there"""
    if os.path.exists(_PARAM_FILE):
        with open(_PARAM_FILE, 'r') as fh:
            all_params = {Planet[key]: val
                          for key, val in json.load(fh).items()}
    else:
        all_params = SPEEDS.copy()
    
    for key, val in all_params.items():
        SPEEDS[key] = val


def to_disk():
    """Invoke to save parameters to disk"""
    with open(_PARAM_FILE, 'w') as fh:
        json.dump({key.name: val for key, val in SPEEDS.items()})


def set_speed(planet, speed):
    SPEEDS[planet] = speed
    # Convert speed, given in -100 to 100, to 12-bit direction and duty cycle
    cw = speed > 0.0
    duty_cycle = int(round(abs(float(speed)) / 100.0 * 4096))
    SPEED_CONTROLLERS[planet].set_rotation(cw, duty_cycle)


def get_speed(planet):
    return SPEEDS[planet]


initialize()
