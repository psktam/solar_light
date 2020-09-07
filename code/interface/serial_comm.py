import struct

import serial


def make_color_cmd(red, green, blue):
    """Send given RGB values"""
    return b'C' + struct.pack('BBB', red, green, blue)


def send_color(conn, red, green, blue):
    """Send color via connection"""
    conn.write(make_color_cmd(red, green, blue))


def send_stop(conn):
    """Send stop message"""
    conn.write(b'MS00')


def turn_cw(conn, speed):
    """Turn clockwise"""
    conn.write(b'ML' + struct.pack('B', speed) + b'0')


def turn_ccw(conn, speed):
    """Turn counterclockwise"""
    conn.write(b'MR' + struct.pack('B', speed) + b'0')
