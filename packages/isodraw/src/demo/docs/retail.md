<!-- diagram -->
## Overview

**Shelfwise** connects Northgate Grocers' 140 stores to Azure. Each store sends checkout sales, shelf-sensor readings and staff scans to the cloud as they happen. Head office sees stock levels within a minute, and the [@Replenishment](isodraw:node/replenish) service reorders before shelves run empty.

Everything a store sends goes through its [@Store router](isodraw:node/router), on one of two paths:

- **To Azure:** telemetry and sales events go to [@IoT Hub](isodraw:node/iothub) over MQTT, then through [@Event Hubs](isodraw:node/eventhubs) to [@Inventory](isodraw:node/inventory) and [@Sales](isodraw:node/sales).
- **To head office:** card payments and back-office traffic go over the SD-WAN to the [@HQ firewall](isodraw:node/firewall) and the [@ERP](isodraw:node/erp).

## At a glance

| Metric | Typical | Peak (Saturday afternoon) |
| --- | --- | --- |
| Stores | 140 | 140 |
| Events per second (all stores) | 1,800 | 6,500 |
| Shelf to dashboard | 40 s | 90 s |
| Stockouts caught before a shopper noticed | 82% | – |

## If a store goes offline

The router queues up to 24 hours of events, and checkouts keep taking cards through the backup 4G link. When the connection is back, queued events are sent oldest first. [@stock-events](isodraw:node/stockfn) ignores duplicates by event ID.

<!-- node:shoppers -->
About 2,500 shoppers a day at a typical store. They only ever touch the [@Checkout lanes](isodraw:node/checkout); everything else in the store works around them.

<!-- node:store -->
A typical mid-size store. Every store has the same kit, so one Terraform module and one router configuration cover the whole estate.

| Item | Count per store |
| --- | --- |
| Checkout lanes (staffed + self-checkout) | 8 + 6 |
| Shelf sensors | 300–450 |
| Staff handhelds | 12 |
| Wi-Fi access points | 6 |

<!-- node:checkout -->
Staffed and self-checkout lanes. Each sale produces two things: a card authorization, which goes over the SD-WAN to the payment processor through head office, and a `SaleCompleted` event for [@Sales](isodraw:node/sales).

```json
{
  "type": "SaleCompleted",
  "store": 142,
  "lane": 6,
  "items": [{ "sku": "0480012", "qty": 2, "price": 3.49 }],
  "total": 6.98,
  "ts": "2026-11-01T14:02:11Z"
}
```

<!-- node:shelves -->
Battery-powered weight sensors under shelf facings. A facing reports when its weight changes by more than one item, and sends a heartbeat every 15 minutes otherwise.

| Setting | Value |
| --- | --- |
| Radio | Wi-Fi, 2.4 GHz, low power |
| Battery life | About 3 years |
| Accuracy | ±1 item for items over 80 g |

<!-- node:handhelds -->
Rugged Android handhelds that staff use for gap scans, price checks and receiving deliveries. Scans go straight to [@Inventory](isodraw:node/inventory) through the same path as sensor readings, so a manual count corrects the sensors right away.

<!-- node:wifi -->
The store's managed Wi-Fi. Sensors and handhelds are on separate SSIDs and VLANs, and neither can reach the checkout network.

<!-- node:router -->
The store's edge router. It runs the [@IoT Hub](isodraw:node/iothub) client for the whole store, so individual sensors never hold cloud credentials.

| Function | How |
| --- | --- |
| Cloud uplink | MQTT over TLS to IoT Hub, one device identity per store |
| Head office | SD-WAN tunnel to the [@HQ firewall](isodraw:node/firewall) |
| Backup | 4G modem, checkout traffic only |
| Offline queue | 24 hours on local flash |

<!-- node:azure -->
The Azure subscription `shelfwise-prod`, in West Europe, with a paired region for backups. Everything inside is deployed by Terraform from the `shelfwise-infra` repository.

<!-- node:iothub -->
One IoT Hub (S2, 4 units) with a device identity per store router. Routing rules send all telemetry to [@Event Hubs](isodraw:node/eventhubs) and drop heartbeats after updating device twins.

<!-- node:eventhubs -->
The event backbone: one hub, 32 partitions, partitioned by store number so each store's events stay in order. Events are kept for 3 days to allow replays.

| Consumer group | Reader |
| --- | --- |
| `stock` | [@stock-events](isodraw:node/stockfn) |
| `sales` | Stream Analytics job writing to [@Sales](isodraw:node/sales) |

<!-- node:stockfn -->
An Azure Function that turns sensor readings, scans and sales into stock levels per store and SKU. It is the only writer to [@Inventory](isodraw:node/inventory).

Processing order matters: a sale lowers the expected count, a sensor reading confirms it, and a handheld count overrides both.

<!-- node:inventory -->
Cosmos DB holding the current stock level of every SKU in every store, about 4 million documents. Partitioned by store. A change feed drives [@Replenishment](isodraw:node/replenish).

<!-- node:sales -->
Azure SQL Database (Business Critical, 8 vCores) with every sale line, kept for 2 years. It is the source of truth for finance and for [@Store dashboards](isodraw:node/dashboards).

<!-- node:dashboards -->
Store and regional dashboards: sales against forecast, gaps on shelves, and the slowest-selling lines. They refresh every 5 minutes from [@Sales](isodraw:node/sales).

<!-- node:replenish -->
The replenishment service: when [@Inventory](isodraw:node/inventory) shows a SKU below its reorder point, it adds the SKU to the next delivery from the distribution center. Most orders go out by 6 pm for next-morning delivery.

<!-- node:managers -->
Twelve regional managers, each with 10–14 stores. They mostly use the [@Store dashboards](isodraw:node/dashboards) on laptops during store visits.

<!-- node:hq -->
Northgate's head office in Leeds, with the on-premises systems that haven't moved to Azure yet.

<!-- node:firewall -->
The head-office firewall pair, which ends every store's SD-WAN tunnel and passes card traffic on to the payment processor.

<!-- node:erp -->
The on-premises ERP, the source of prices, promotions and supplier contracts. A nightly job pushes the next day's prices to [@Sales](isodraw:node/sales) and on to the stores.

<!-- edge:e6 -->
Each store router keeps one MQTT connection to IoT Hub and publishes to `devices/store-{n}/messages/events/`. Messages are batched every second, which keeps a busy store under 50 messages per second.

<!-- edge:e12 -->
Reorders are created from the [@Inventory](isodraw:node/inventory) change feed, at most once per SKU per store per day. A manager can pause reordering for a SKU, for example during a recall.

<!-- edge:e14 -->
The SD-WAN carries everything that must not leave the private network: card authorizations, the back office, and remote support for store systems.
