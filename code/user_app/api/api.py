from flask import Blueprint

import color_management as cm
import speed_management as sm
from shared import Planet


api = Blueprint('api', __name__)


@api.route('/set_speed/<planet>/<speed>')
def set_speed(planet: str, speed: int):
    planet_enum = Planet(planet.lower())
    sm.set_speed(planet_enum, speed)
    return {planet: sm.get_speed(planet_enum)}


@api.route('/get_speed/<planet>')
def get_speed(planet: str):
    planet_enum = Planet(planet.lower())
    return {planet: sm.get_speed(planet_enum)}


@api.route('/get_color/<planet>')
def get_color(planet: str):
    """Get planet color"""
    planet_enum = Planet(planet.lower())
    return {planet: list(cm.get_color(planet_enum))}


@api.route('/set_color/<planet>/<rgbw_hex>')
def set_color(planet: str, rgbw_hex: str):
    """Set the color of the planet"""
    planet_enum = Planet(planet.lower())
    rgbw_hex = rgbw_hex.lower()
    red = int(rgbw_hex[:2], 16)
    green = int(rgbw_hex[2:4], 16)
    blue = int(rgbw_hex[4:6], 16)
    white = int(rgbw_hex[6:], 16)

    cm.set_color(planet_enum, red, green, blue, white)
    return {planet: list(cm.get_color(planet_enum))}
