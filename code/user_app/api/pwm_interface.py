"""Use this to interface with the PWM driver boards"""
import smbus

_CHANNEL = 1
_BUS = smbus.SMBus(_CHANNEL)


def _stitch_bytes(high, low):
    """Stitch together 12-byte word"""
    return ((0b00001111 & high) << 8) + low


def split_word(word):
    """Break the word into high and low byte components"""
    high = (word & 0b111100000000) >> 8
    low = word & 0b11111111
    return high, low


class PWMInterface:

    def __init__(self, address):
        self._address = address
        # Load state from the board.
        # Get mode status
        mode_byte = _BUS.read_byte_data(self._address, 0x00)
        self.sleeping = (0b00010000 & mode_byte) >> 3 == 1

        base_register_addr = 0x06
        on_registers = {}
        off_registers = {}
        for pin_num in range(16):
            addr_start = base_register_addr + (4 * pin_num)
            # Map registers in order of HIGH, LOW
            on_registers[pin_num] = addr_start + 1, addr_start
            off_registers[pin_num] = addr_start + 3, addr_start + 2
        
        self._on_registers = on_registers
        self._off_registers = off_registers

    def power_on(self):
        """
        Need to turn off sleep mode in order to actually 
        make PWM work.
        """
        _BUS.write_i2c_block_data(self._address, 0x00, [0x00])
        self.sleeping = False
    
    def sleep(self):
        """Sleep the board, for whatever reason"""
        _BUS.write_i2c_block_data(self._address, 0x00, [0x10])
        self.sleeping = True
    
    def set_time_on(self, pin_id, on_time:int):
        """
        The PWM driver allows you to control the phase of the pulse by 
        controlling when in the period the drive turns on. Argument must be 
        between 0 and 4096 (inclusive)
        """
        for reg, byte in zip(self._on_registers[pin_id], split_word(on_time)):
            _BUS.write_i2c_block_data(self._address, reg, [byte])

    def set_time_off(self, pin_id, off_time:int):
        """Refer to previous docstring"""
        for reg, byte in zip(self._off_registers[pin_id], split_word(off_time)):
            _BUS.write_i2c_block_data(self._address, reg, [byte])

    def get_duty_cycle(self, pin_id):
        """
        Return the current duty cycle in terms of counts. Ranges from 0 to 4096
        """
        on_high_addr, on_low_addr = self._on_registers[pin_id]
        off_high_addr, off_low_addr = self._off_registers[pin_id]

        time_on = _stitch_bytes(
            _BUS.read_byte_data(self._address, on_high_addr), 
            _BUS.read_byte_data(self._address, on_low_addr))
        time_off = _stitch_bytes(
            _BUS.read_byte_data(self._address, off_high_addr),
            _BUS.read_byte_data(self._address, off_low_addr))

        total_cycle_dur = 2 ** 12
        if time_on > time_off:
            return int(total_cycle_dur - (time_on - time_off))
        return int(time_off - time_on)
