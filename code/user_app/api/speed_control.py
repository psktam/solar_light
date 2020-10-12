from pwm_interface import PWMInterface
from shared import Planet


DRIVER = PWMInterface(0x42)
DRIVER.power_on()


class SpeedController:
    """Controls speeds. D'uh"""

    def __init__(self, speed_pin, dir_pin):
        self._speed_pin = speed_pin
        self._dir_pin = dir_pin

    def set_rotation(self, cw:bool, speed:int):
        cw_duty_cycle = (2 ** 12 - 1) * int(cw)
        print(f"Controller setting {self._speed_pin} to {speed} and {self._dir_pin} to {cw_duty_cycle}")
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
    Planet.Venus: SpeedController(2, 3),
    Planet.Earth: SpeedController(4, 5),
    Planet.Mars: SpeedController(6, 7),
    Planet.Jupiter: SpeedController(8, 9),
    Planet.Saturn: SpeedController(10, 11),
    Planet.Uranus: SpeedController(12, 13),
    Planet.Neptune: SpeedController(14, 15)
}
