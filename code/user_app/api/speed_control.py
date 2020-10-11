from pwm_interface import PWMInterface
from shared import Planet


DRIVER = PWMInterface(0x42)


class SpeedController:
    """Controls speeds. D'uh"""

    def __init__(self, speed_pin, dir_pin):
        self._speed_pin = speed_pin
        self._dir_pin = dir_pin

    def set_rotation(self, cw:bool, speed:int):
        cw_duty_cycle = (2 ** 12) * int(cw)
        DRIVER.set_time_off(self._dir_pin, cw_duty_cycle)
        DRIVER.set_time_off(self._speed_pin, speed)
    
    def get_speed(self):
        return DRIVER.get_duty_cycle(self._speed_pin)

    def get_direction(self):
        """
        Returns ``True`` if rotation is set clockwise. ``False`` if set CCW
        """
        return DRIVER.get_duty_cycle(self._dir_pin) == (2 ** 12)


SPEED_CONTROLLERS = {
    Planet.Mercury: SpeedController(0, 1),
    Planet.Venus: SpeedController(3, 4),
    Planet.Earth: SpeedController(5, 6),
    Planet.Mars: SpeedController(7, 8),
    Planet.Jupiter: SpeedController(9, 10),
    Planet.Saturn: SpeedController(11, 12),
    Planet.Uranus: SpeedController(13, 14),
    Planet.Neptune: SpeedController(15, 16)
}
