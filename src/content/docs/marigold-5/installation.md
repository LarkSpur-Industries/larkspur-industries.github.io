---
title: Installation & Wiring
description: Mount, wire, connect, and verify a Marigold-5 power module on an FRC robot.
---

## What you'll need

- Marigold-5 module
- 16–18 AWG red and black wire for a 15–20A FRC branch circuit
- Wire strippers
- 15–20A circuit breaker for the PDH
- USB-C cable rated for at least 3A
- #4-40 mounting hardware or zip ties

## Mounting

![Marigold-5 top view showing mounting points](/docs/marigold-5/img/Marigold-5_V1.0-Top.webp)
*Top view showing mounting points*

### Screw mounting

- Use the two #4-40 threaded inserts with 1.25-inch spacing.
- The pattern is compatible with standard 1×2-inch FRC aluminum extrusion.
- Use #4-40 screws no longer than 0.5 inches.

### Zip-tie mounting

- Route zip ties through the four integrated points around the case perimeter.
- Inspect the ties regularly because they can loosen over time.

## Wiring input power

![Marigold-5 wiring diagram](/docs/marigold-5/img/Marigold-5_V1.0-Wiring.webp)
*Marigold-5 wiring diagram*

The input connector is a TBLH10-350-04BK spring-cage terminal block.

| Parameter | Value |
| --- | --- |
| Rated current | 10A (UL), 17.5A (IEC) per contact |
| Wire gauge | 16–24 AWG (0.2–1.5 mm²) |
| Strip length | 7–8 mm |

The terminal block accepts **16–24 AWG** wire. For an FRC robot using the recommended 15–20A branch-circuit breaker, use **16–18 AWG** copper wire. Smaller wire may fit the connector but is not permitted on that breaker range under the current FRC wire-sizing rules.

| Pin | Function | Wire color |
| --- | --- | --- |
| BATT+ | +12V input | Red |
| BATT+ | +12V input | Red |
| GND | Ground | Black |
| GND | Ground | Black |

### Wiring procedure

1. Remove exactly **7–8 mm** of insulation. A shorter strip length may prevent a secure connection, while a longer strip length leaves exposed conductor.
2. Press the white push button on the terminal block.
3. Fully insert the red wire into **BATT+** and the black wire into **GND**.
4. Release the button so the spring clamp secures the wire.
5. Gently tug each wire to verify that it is secure.
6. Install a **15–20A breaker** in the PDH port before connecting battery power. Use 16–18 AWG wire with this breaker range.

## Connecting devices

### USB-C output

- **Role:** Source (DFP)
- **Advertised current:** 3A through 10 kΩ CC pull-ups
- **USB Power Delivery:** Not supported

Connect a cable rated for at least 3A. If using the locking cable, tighten its retention screw. Thin or low-quality cables can cause excessive voltage drop.

| Device | Typical current draw |
| --- | --- |
| Raspberry Pi 4/5 | 2–4A |
| Orange Pi 5 | 2–5A |
| Arduino/ESP32 | 0.2–0.5A |
| LED strips | Varies; check the device specifications |

### Co-processor wiring diagrams

![Orange Pi 5B wiring diagram](/docs/marigold-5/img/OPI5B_Wiring_Diagram.webp)
*Orange Pi 5B wiring diagram*

![Raspberry Pi 5 wiring diagram](/docs/marigold-5/img/RPI5_Wiring_Diagram.webp)
*Raspberry Pi 5 wiring diagram*

### Auxiliary output

The auxiliary output uses a pin header with a 2.54 mm pitch.

| Pin | Function |
| --- | --- |
| + | 5.1V output |
| − | Ground |

The auxiliary output can power cooling fans, indicator LEDs, microcontrollers, and compatible 5V network equipment. Its load counts toward the combined output current. The recommended combined load is **5–6A for continuous operation**, with a **7A continuous maximum**. Limit **8–10A loads to a few seconds** unless adequate user-supplied active heatsinking and cooling are installed.

## Power on and verify

1. Turn on the robot's main power.
2. Confirm that the **STATUS LED is solid orange**.
3. Confirm that the connected co-processor boots normally.
4. Optionally measure **5.1V ± 0.1V** at the auxiliary output with a multimeter.

If the STATUS LED remains off, continue to [troubleshooting](/docs/marigold-5/troubleshooting/).
