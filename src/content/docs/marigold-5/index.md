---
title: Marigold-5 Overview & Safety
description: Product overview, key features, and safety limits for the Marigold-5 DC-DC USB-C power module.
---

![Marigold-5 corner view](/docs/marigold-5/img/Marigold-5_V1.0-Corner-USB.webp)
*Marigold-5 corner view*

The **Marigold-5** is a synchronous step-down (buck) DC-DC converter module designed to provide a regulated 5.1V rail for FIRST Robotics Competition applications. It accepts a 6V–18V input suitable for FRC lead-acid battery architecture and distributes power through a high-current USB-C receptacle and one auxiliary output.

Built around the **Texas Instruments TPS56A37**, the Marigold-5 provides co-processors such as Raspberry Pi and Orange Pi boards with robust 5.1V power, including during robot battery voltage sags.

## Key features

- **High-current USB-C port:** Rated for 3A continuous through USB-C, with a 10A total system limit
- **Type-C current advertisement:** Standard 10 kΩ CC pull-up resistors advertise 3A capability to non-PD sink devices
- **Brownout protection:** Maintains stable 5.1V output down to 6V input
- **Secure mounting:** Mounts to 1×2-inch aluminum extrusion with #4-40 hardware, or with integrated zip-tie points
- **Built-in protection:** Reverse polarity, input voltage spikes, thermal shutdown, and overcurrent limiting

:::danger[Safety limits]
- Do not exceed **18V DC input**.
- Do not exceed **10A total output current** across the USB-C and auxiliary outputs.
- Connect red wire to **BATT+** and black wire to **GND**.
- Keep the module away from conductive debris, metal shavings, water, and loose tools.
- Provide adequate airflow under sustained high-current loads.
:::

## FRC use

This device is designed for FIRST Robotics Competition use. Always verify requirements against the current season's official game manual before competition.

## Continue

Start with [installation and wiring](/docs/marigold-5/installation/), then review [operation](/docs/marigold-5/operation/) and [troubleshooting](/docs/marigold-5/troubleshooting/).
