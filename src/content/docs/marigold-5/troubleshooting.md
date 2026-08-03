---
title: Troubleshooting
description: Diagnose Marigold-5 power, USB-C, overheating, wiring, and brownout problems.
---

## Status LED is off

Occurs when the module detects a dangerous fault or is damaged.

### Verify polarity

- Red wire should connect to **BATT+**.
- Black wire should connect to **GND**.
- Reverse-polarity protection prevents normal operation when the input is reversed.

### Inspect wiring

- Confirm that the wires are fully inserted into the terminal block.
- Check for loose or corroded connections at the PDH.
- Verify that the breaker is not tripped.

### Check input voltage

- Measure voltage at the terminal block. It should be between 6V and 18V.
- Below 6V, the battery may be discharged or the input wiring may have excessive resistance.
- Above 18V, **disconnect power immediately**.


### Power cycle

1. Disconnect input power for 30–100 seconds.
2. Reconnect power and observe the STATUS LED.

## USB device does not boot or charge
For when the module's status LED is on but connected devices are non-functional.

### Check the cable

- Try another USB-C cable rated for at least 3A.
- Measure voltage at the device end with a USB current tester. It should remain above 4.75V under load.
- Long or thin cables can create excessive voltage drop.

### Check the load

- Make sure the combined USB-C and auxiliary load is within 5–6A for normal continuous operation.
- Make sure the load did not exceed 7A continuously without adequate active cooling.
- Limit 8–10A load spikes to a few seconds unless adequate user-supplied active heatsinking and cooling are installed.
- Some devices have a brief inrush-current spike during startup.

### Check compatibility

- Confirm that the device accepts a fixed 5V input. Almost all standard SBCs and co-processors do.
- Devices *requiring* 9V, 12V, or 20V USB Power Delivery negotiation are not compatible.

### Check the co-processor SD card

- Most co-processors boot from an SD card, and match impacts can physically crack or corrupt one.
- Make sure the SD card is flashed with a viable image for that hardware. If you are using PhotonVision, refer to [their documentation](https://docs.photonvision.org/).

## Module feels hot

The regulator generates extreme heat at high current, and the enclosure helps dissipate that heat.

:::danger[Burn hazard]
Do not open the enclosure while Marigold-5 is operating or connected to power. Internal components may be hot enough to cause burns. Disconnect power and allow the module to cool before opening the enclosure or touching any internal components.
:::

Take corrective action when:

- The STATUS LED turns off, indicating a possible thermal shutdown.
- The module flickers on and off while hot.

To reduce temperature:

- Reduce the total output current to 5–6A or less.
- Move the module to a location with better airflow.
- Avoid mounting the module inside an unventilated enclosure.

## Co-processor reboots during a brownout

1. Measure the voltage at the co-processor end of the USB-C cable while the robot is under load.
2. Replace long, thin, or damaged cables.
3. Verify that the input voltage at Marigold-5 does not fall below 6V.
4. Inspect the PDH connection, breaker, terminal block, and wire gauge for excessive resistance.
5. Confirm that the combined output load remains within the 5–6A recommended continuous range.

If the problem continues, please email [engineering@larkspurindustries.com](mailto:engineering@larkspurindustries.com) with the STATUS LED behavior, the connected load, and a photo of the wiring. We may ask for more detail.
