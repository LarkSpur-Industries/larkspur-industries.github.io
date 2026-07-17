---
title: Technical Specifications
description: Electrical, protection, USB-C, and mechanical specifications for Marigold-5.
---

## Electrical characteristics

| Parameter | Minimum | Typical | Maximum | Units |
| --- | ---: | ---: | ---: | --- |
| Input voltage | 6.0 | 12.0 | 18.0 | V DC |
| Input surge voltage | - | - | 22 | V DC |
| Output voltage | 5.00 | 5.10 | 5.20 | V DC |
| Output voltage accuracy | - | ±2% | - | - |
| Recommended continuous output current | 5 | - | 6 | A |
| Validated continuous output current | - | - | 7 | A |
| Brief output current | 8 | - | 10 | A (a few seconds only) |
| Switching frequency | - | 500 | - | kHz |
| Quiescent current | - | 45 | - | µA |
| Shutdown current | - | 3 | - | µA |
| Efficiency at 5A, 12V input | - | ~90% | - | % |

The current ratings apply to the combined load across the USB-C and auxiliary outputs. Use **5–6A** for normal continuous operation. The **7A continuous rating** was validated at **12.3V input**, at standard ambient temperature in still air, with the enclosed module not mounted to aluminum. Actual thermal performance depends on placement, nearby heat sources, mounting, and moving airflow inside the robot.

The USB-C receptacle hardware can carry the full device output current, while its CC resistors advertise 3A to standards-compliant USB-C sinks. Confirm the connected device and cable are suitable for the intended current. Loads of **8–10A are supported for only a few seconds** under standard passive conditions. Sustained operation above 7A requires adequate user-supplied active heatsinking and cooling. Active cooling hardware is not included.

## Protection features

| Protection | Threshold | Response |
| --- | --- | --- |
| Reverse polarity | Any | PMOS blocks current |
| Input overvoltage | >22V | TVS diode clamps; sustained overvoltage may cause damage |
| Output overcurrent | >10A valley | Cycle-by-cycle current limiting |
| Output overvoltage | >125% of target | Shutdown after 32µs deglitch |
| Output undervoltage | <65% of target | Hiccup restart after 256µs |
| Thermal shutdown | >165°C junction | Automatic shutdown; restart at 135°C |
| Input UVLO | <4.2V rising | Regulator disabled until input recovers |

## USB-C configuration

| Parameter | Value |
| --- | --- |
| Port role | Source (DFP) |
| CC resistor configuration | 10 kΩ to VBUS on CC1 and CC2 |
| Advertised current | 3A per USB Type-C specification |
| Data lines | D+ and D− floating; no data communication |
| USB Power Delivery | No; fixed 5.1V output only |

## Mechanical specifications

| Parameter | Specification |
| --- | --- |
| Dimensions | 2.52 × 0.87 × 0.67 inches (64 × 22 × 17 mm) |
| Weight | Approximately 45 g |
| Case material | Black PETG |
| Mounting pattern | Two #4-40 threaded inserts at 1.25-inch spacing |
| Maximum mounting screw length | 0.5 inches |
| Operating temperature | −40°C to +60°C ambient, derated above 50°C |
| Storage temperature | −40°C to +85°C |

![Marigold-5 mechanical drawing](/docs/marigold-5/pdf/Marigold-5_V1.0B_Drawing.png)
*Mechanical drawing with dimensions*
