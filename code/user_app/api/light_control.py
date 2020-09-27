from dataclasses import dataclass

from pwm_interface import PWMInterface
from shared import Planet


DRIVERS = {addr: PWMInterface(addr) for addr in [0x40, 0x41]}
for _driver in DRIVERS.values():
    _driver.power_on()


@dataclass
class PinSpec:
    addr: int
    pin: int


class LightController:
    """Controls lights. D'uh"""

    def __init__(self, red_spec, green_spec, blue_spec, white_spec):
        self._red_spec = red_spec
        self._green_spec = green_spec
        self._blue_spec = blue_spec
        self._white_spec = white_spec

    def set_color(self, red, green, blue, white):
        """Set color based on RGB"""
        color_specs = [self._red_spec, self._green_spec, 
                       self._blue_spec, self._white_spec]

        for spec, color in zip(color_specs, [red, green, blue, white]):
            driver = DRIVERS[spec.addr]
            driver.set_time_off(spec.pin, color)
        
    def get_color(self):
        """
        Return current color settings as list of RGB, scaled from 0.0 to 1.0
        """
        colors = []
        color_specs = [self._red_spec, self._green_spec,
                       self._blue_spec, self._white_spec]
        for spec in color_specs:
            driver = DRIVERS[spec.addr]
            colors.append(driver.get_duty_cycle(spec.pin))
        
        return colors


LIGHT_CONTROLLERS = {
    Planet.Mercury: LightController(PinSpec(0x40, 0), 
                                    PinSpec(0x40, 8),
                                    PinSpec(0x41, 0),
                                    PinSpec(0x41, 8)),
    Planet.Venus: LightController(PinSpec(0x40, 1),
                                  PinSpec(0x40, 9),
                                  PinSpec(0x41, 1),
                                  PinSpec(0x41, 9)),
    Planet.Earth: LightController(PinSpec(0x40, 2),
                                  PinSpec(0x40, 10),
                                  PinSpec(0x41, 2),
                                  PinSpec(0x41, 10)),
    Planet.Mars: LightController(PinSpec(0x40, 3),
                                 PinSpec(0x40, 11),
                                 PinSpec(0x41, 3),
                                 PinSpec(0x41, 11)),
    Planet.Jupiter: LightController(PinSpec(0x40, 4),
                                    PinSpec(0x40, 12),
                                    PinSpec(0x41, 4),
                                    PinSpec(0x41, 12)),
    Planet.Saturn: LightController(PinSpec(0x40, 5),
                                   PinSpec(0x40, 13),
                                   PinSpec(0x41, 5),
                                   PinSpec(0x41, 13)),
    Planet.Uranus: LightController(PinSpec(0x40, 6),
                                   PinSpec(0x40, 14),
                                   PinSpec(0x41, 6),
                                   PinSpec(0x41, 14)),
    Planet.Neptune: LightController(PinSpec(0x40, 7),
                                    PinSpec(0x40, 15),
                                    PinSpec(0x41, 7),
                                    PinSpec(0x41, 15))
}
