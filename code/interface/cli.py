import threading
import time

import serial


def receiver(conn, keepalive):
    """Run forever and read stuff"""
    while keepalive['status'] == 'live':
        msg = conn.readline()
        if len(msg):
            print(msg)
        time.sleep(0.01)
    print("Exiting thread")


def make_conn(name):
    """Make a monitor to repeat what we get"""
    conn = serial.Serial(name, 9600, timeout=0)
    keepalive = {'status': 'live'}

    thrd = threading.Thread(
        target=receiver, kwargs=dict(conn=conn, keepalive=keepalive))
    thrd.start()
    
    return conn, keepalive, thrd


def close_conn(conn, keepalive):
    keepalive['status'] = 'dead'
    conn.close()