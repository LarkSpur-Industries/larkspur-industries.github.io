---
title: Troubleshooting
description: Diagnose Marigold-5 power, USB-C, overheating, wiring, and brownout problems.
---

## STATUS LED is off

### Check input voltage

- Measure voltage at the terminal block. It should be between 6V and 18V.
- Below 6V, the battery may be discharged or the input wiring may have excessive resistance.
- Above 18V, **disconnect power immediately**.

### Verify polarity

- Red wire should connect to **BATT+**.
- Black wire should connect to **GND**.
- Reverse-polarity protection prevents normal operation when the input is reversed.

### Inspect wiring

- Confirm that the wires are fully inserted into the terminal block.
- Check for loose or corroded connections at the PDH.
- Verify that the breaker is not tripped.

### Power cycle

1. Disconnect input power for 30 seconds.
2. Reconnect power and observe the STATUS LED.

## USB device does not boot or charge

### Check the cable

- Try another USB-C cable rated for at least 3A.
- Measure voltage at the device end; it should remain above 4.75V under load.
- Long or thin cables can create excessive voltage drop.

### Check the load

- Total load across the USB-C and auxiliary outputs must remain below 10A.
- Some devices have a brief inrush-current spike during startup.

### Check compatibility

- Confirm that the device accepts a fixed 5V input.
- Devices requiring 9V, 12V, or 20V USB Power Delivery negotiation are not compatible.

## Module feels hot

The regulator and MOSFETs generate heat at high current, and the case helps dissipate it.

Take corrective action when:

- The STATUS LED turns off, indicating a possible thermal shutdown.
- The device remains too hot to touch for more than two seconds.

To reduce temperature:

- Reduce the total output current below 8A.
- Move the module to a location with better airflow.
- Add a small 5V fan powered by the auxiliary output.
- Avoid mounting the module inside an unventilated enclosure.

## Co-processor reboots during a brownout

1. Measure the voltage at the co-processor end of the USB-C cable while the robot is under load.
2. Replace long, thin, or damaged cables.
3. Verify that input voltage at Marigold-5 does not fall below 6V.
4. Inspect the PDH connection, breaker, terminal block, and wire gauge for excessive resistance.
5. Confirm that the combined output load remains below 10A.

If the problem continues, email [engineering@larkspurindustries.com](mailto:engineering@larkspurindustries.com) with measured input/output voltages, the connected load, and a wiring photo.
