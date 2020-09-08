from shared import Planet


SPEEDS = {
    planet: 0
    for planet in [Planet.Mercury, 
                   Planet.Venus,
                   Planet.Earth,
                   Planet.Mars,
                   Planet.Jupiter,
                   Planet.Saturn,
                   Planet.Uranus,
                   Planet.Neptune]
}


def set_speed(planet, speed):
    SPEEDS[planet] = speed


def get_speed(planet):
    return SPEEDS[planet]
