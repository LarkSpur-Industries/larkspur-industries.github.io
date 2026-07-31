---
title: Operation
description: Understand Marigold-5 output voltage, status LED behavior, and FRC brownout performance.
---

## Why the output is 5.1V

The 5.1V output is intentional. USB cables introduce resistance, commonly 0.1-0.5 Ω per meter. Under load, this resistance causes a voltage drop:

- **Voltage drop = Current × Resistance**
- At 3A through 0.1 Ω of total cable resistance, the drop is **0.3V**.

Starting at 5.1V helps the connected device remain above the 4.75V USB minimum under load. In the example above, the device receives approximately 4.8V. A cable with 0.3 Ω of resistance would drop 0.9V at 3A and is generally not suitable for that load.

## Status LED

The status led on top of the enclosure is driven by the TPS56A37 power-good output.

| LED state | Meaning | Action |
| --- | --- | --- |
| 🟠 **Solid orange** | Normal operation; output is stable | None :) |
| ⚫ **Off** | Input or output fault | Follow the troubleshooting guide |

The LED turns off when:

- Input power is disconnected.
- Input polarity is reversed.
- Output voltage is outside its acceptable range, commonly because of an overload or short circuit.
- The regulator enters thermal shutdown when its junction temperature exceeds 165°C.
- Input voltage falls below the regulator's undervoltage-lockout threshold.

The Power Good circuit includes deglitch timing to avoid false fault indications during short transients.

## FRC brownouts

During high-current maneuvers, a robot battery can sag from 12V to 6–7V for several seconds. Many inexpensive automotive and general-purpose 12V to 5V converters specify minimum input voltages around 8–9V and are not designed to remain regulated through a deep FRC battery sag. A loss of stable regulated output can reboot a co-processor or cause undervoltage damage.

The TPS56A37 buck converter operates with input voltages as low as 6V. Marigold-5 can therefore maintain its regulated output during the battery voltage sags.
