---
title: Marigold-5 Overview & Safety
description: Product overview, key features, and safety limits for the Marigold-5 DC-DC USB-C power module.
---

![Marigold-5 corner view](/docs/marigold-5/img/Marigold-5_V1.0-Corner-USB.webp)
*Marigold-5 corner view*

The Marigold-5 is a synchronous step-down, buck, DC-DC converter module that provides a regulated 5.1V rail for FIRST Robotics Competition applications. It accepts a 6V to 18V input compatible with FRC robots and other power systems and provides power through a high-current USB-C connector and an auxiliary output.

Built around the Texas Instruments TPS56A37, the Marigold-5 provides reliable 5.1V power to co-processors, such as Raspberry Pi and Orange Pi boards, even when input voltage sags.  

## Key features

- **High-current output:** 5-6A recommended combined load for continuous operation
- **Brownout protection:** Maintains stable 5.1V output all the way down to 6V input
- **Secure mounting:** Attaches to 1×2-inch aluminum extrusion with #4-40 hardware or through integrated zip-tie points
- **Built-in protection:** Reverse polarity, input voltage spikes, thermal shutdown, and overcurrent limiting

:::danger[Safety limits]
- Do not exceed the max 18V DC input.
- For continuous operation, keep the combined load across the USB-C and auxiliary outputs within the recommended **5–6A** range.
- The 7A continuous rating was validated at 12.3V input, at standard ambient temperature in still air, with the enclosed module not mounted to aluminum. Thermal performance varies with placement, nearby heat sources, and airflow inside the robot.
- Limit 8–10A loads to a few seconds. Sustained operation above 7A requires adequate user-supplied active heatsinking and cooling.
- Always connect red wire to BATT+ and black wire to GND.
- Keep the module away from conductive debris, metal shavings, water, and loose tools.
- Do not open the enclosure while the device is operating or connected to power. Internal components can become hot enough to cause burns.
- Monitor temperature and provide adequate airflow under high-current loads.
:::

## FRC use

This device is designed for use in the FIRST Robotics Competition. Before each competition, verify all requirements against the current season's official game manual.

## Continue

Start with [installation and wiring](/docs/marigold-5/installation/), then review [operation](/docs/marigold-5/operation/) and [troubleshooting](/docs/marigold-5/troubleshooting/).
