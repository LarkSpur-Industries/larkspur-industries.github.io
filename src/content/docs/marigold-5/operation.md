---
title: Operation
description: Understand Marigold-5 output voltage, status LED behavior, and FRC brownout performance.
---

## Why the output is 5.1V

The 5.1V output is intentional. USB cables introduce resistance, commonly 0.1–0.5Ω per meter. Under load, this creates a voltage drop:

- **Voltage drop = Current × Resistance**
- At 3A through 0.3Ω of resistance, the drop is **0.9V**.

Starting at 5.1V helps the device at the far end of the cable remain above the USB minimum voltage under load. High-quality embedded and industrial USB supplies commonly use this approach.

## STATUS LED

The STATUS LED on top of the case is driven by the TPS56A37 Power Good output.

| LED state | Meaning | Action |
| --- | --- | --- |
| 🟠 **Solid orange** | Normal operation; output is stable | None |
| ⚫ **Off** | Input or output fault | Follow the troubleshooting guide |

The LED turns off when:

1. Input power is disconnected.
2. Input polarity is reversed.
3. Output voltage is outside its acceptable range, commonly because of an overload or short circuit.
4. Thermal shutdown occurs above 165°C junction temperature.
5. Input voltage falls below the regulator's undervoltage lockout threshold.

The Power Good circuit includes deglitch timing to avoid false fault indications during short transients.

## FRC brownouts

During high-current maneuvers, a robot battery can sag from 12V to 6–7V for several seconds. Generic 12V-to-5V adapters often stop operating below 9–10V, which can reboot a vision co-processor and interrupt NetworkTables communication.

The TPS56A37 buck converter is designed for operation down to a 6V input. Marigold-5 therefore continues providing its regulated output through the battery voltage sag that commonly occurs during an FRC match.
