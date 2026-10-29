<!-- diagram -->
## Overview

**Linewatch** is a predictive maintenance pipeline for a bottling plant. Sensors on each production line report vibration and temperature every 2 seconds. Linewatch spots machines drifting toward failure early enough to schedule repairs, instead of stopping a line unexpectedly.

Data takes two paths after [@enrich](isodraw:node/enrich):

- **Hot path:** the latest events go to [@OpenSearch](isodraw:node/search), which drives the plant-floor dashboards and anomaly alerts within seconds.
- **Cold path:** every event goes through [@Firehose](isodraw:node/firehose) into the [@Data lake](isodraw:node/lake), where analysts use [@Athena](isodraw:node/athena) to study trends and train models.

## Volumes

| Metric | Typical | Peak (all lines running) |
| --- | --- | --- |
| Events per second | 4,000 | 15,000 |
| Data per day (raw JSON) | 120 GB | 400 GB |
| Sensor to dashboard | 3 s | 8 s |

## Event lifecycle

| Stage | Where | Kept for |
| --- | --- | --- |
| Buffered | [@Kinesis](isodraw:node/kinesis) | 24 hours |
| Searchable | [@OpenSearch](isodraw:node/search) | 7 days |
| Raw archive | [@raw](isodraw:node/raw) | 30 days |
| Analytics | [@curated](isodraw:node/curated) | 3 years |

<!-- node:floor -->
The three bottling lines at the Riverside plant. Each line has a sensor gateway that collects readings from about 40 sensors and publishes them over MQTT.

| Line | Products | Shifts |
| --- | --- | --- |
| [@Line 1](isodraw:node/s1) | 330 ml glass | 24/7 |
| [@Line 2](isodraw:node/s2) | 500 ml PET | 2 shifts |
| [@Line 3](isodraw:node/s3) | 1 l PET | 2 shifts |

The plant network reaches AWS through a site-to-site VPN. If the VPN drops, the gateways buffer up to 6 hours of readings locally and send them once it's back.

<!-- node:s1 -->
The sensor gateway on Line 1 (glass bottles), the busiest line, which runs around the clock.

| Setting | Value |
| --- | --- |
| Hardware | Industrial gateway running AWS IoT Greengrass |
| Thing name | `riverside-line1-gw` |
| Sensors | 42 (filler, capper and labeller motors, conveyor bearings) |
| Publish rate | Every 2 s, one message per sensor |
| Topic | `factory/riverside/line1/telemetry` |

## Message

```json
{
  "sensorId": "l1-filler-motor-03",
  "ts": "2026-10-29T16:20:05.120Z",
  "vibration_mm_s": 4.7,
  "temp_c": 61.2,
  "rpm": 1480,
  "seq": 908112
}
```

`seq` increases with every message, so a gap shows that readings were dropped.

## Error cases

- **Certificate expired:** IoT Core refuses the connection and the gateway buffers locally. An alarm fires 30 days before any certificate expires.
- **Clock drift:** the gateway syncs time over NTP. Readings more than 5 minutes in the future are rejected by [@enrich](isodraw:node/enrich).
- **Sensor unplugged:** that sensor's messages stop. The dashboard marks it grey after 30 seconds of silence.

<!-- node:s2 -->
The sensor gateway on Line 2 (500 ml PET bottles), thing `riverside-line2-gw`. It has 38 sensors and publishes to `factory/riverside/line2/telemetry`. The message format and error handling are the same as [@Line 1](isodraw:node/s1).

<!-- node:s3 -->
The sensor gateway on Line 3 (1 l PET bottles), thing `riverside-line3-gw`. It has 36 sensors and publishes to `factory/riverside/line3/telemetry`. The message format and error handling are the same as [@Line 1](isodraw:node/s1).

<!-- node:iot -->
The MQTT broker the gateways connect to. It authenticates each device and forwards every reading into the pipeline.

| Setting | Value |
| --- | --- |
| Service | AWS IoT Core |
| Protocol | MQTT 3.1.1 over TLS, port 8883 |
| Auth | One X.509 certificate per gateway; certificates rotate yearly |
| Policy | Each gateway can publish only to its own line's topic |

## Rules

| Rule | SQL | Action |
| --- | --- | --- |
| `telemetry_to_stream` | `SELECT *, topic(3) AS line FROM 'factory/+/+/telemetry'` | Put into [@Kinesis](isodraw:node/kinesis), partition key `${sensorId}` |
| `telemetry_archive` | `SELECT * FROM 'factory/+/+/telemetry'` | Write to [@raw](isodraw:node/raw) through a small Firehose stream |

## Error cases

- **Rule action fails** (for example, Kinesis throttling): the rule's error action writes the message to an S3 error bucket, and an alarm fires when anything lands there.
- **Gateway rejected:** an unknown certificate or a publish to another line's topic is denied and logged in CloudWatch.
- **Message over 128 KB:** rejected by IoT Core. Gateways send one reading per message, so messages are around 200 bytes.

<!-- node:kinesis -->
The stream that buffers every reading, so the downstream consumers can fall behind or restart without losing data.

| Setting | Value |
| --- | --- |
| Service | Amazon Kinesis Data Streams, `linewatch-telemetry` |
| Capacity | On-demand mode (currently 8 shards) |
| Partition key | `sensorId`, so each sensor's readings stay in order |
| Retention | 24 hours |
| Encryption | KMS |

## Error cases

| Symptom | Cause | What to do |
| --- | --- | --- |
| `ProvisionedThroughputExceededException` on writes | One shard is hot (too many sensors hashed together) | On-demand mode splits shards automatically; IoT Core retries in the meantime |
| `IteratorAge` growing | [@enrich](isodraw:node/enrich) is falling behind | Check enrich errors and duration; raise its parallelization factor |
| Data older than 24 h is gone | A consumer was down for over a day | Replay from [@raw](isodraw:node/raw) |

<!-- node:enrich -->
The Lambda function that turns raw sensor readings into useful events: it adds machine details, converts units and flags anomalies.

| Setting | Value |
| --- | --- |
| Service | AWS Lambda, Python 3.12, 1024 MB |
| Trigger | [@Kinesis](isodraw:node/kinesis), batches of 500, parallelization factor 4 |
| Timeout | 60 s |
| On failure | Splits the batch in half and retries; after 3 tries, the batch's location goes to an SQS failure queue |

## Steps

1. Look up the machine, line and service history for `sensorId` in the asset registry (cached in memory for 10 minutes).
2. Convert units to SI and drop readings with impossible values (for example, below absolute zero).
3. Compare the reading to the machine's rolling 7-day baseline. Mark `anomaly: true` if it's more than 3 standard deviations away for 5 readings in a row.

## Output event

```json
{
  "sensorId": "l1-filler-motor-03",
  "ts": "2026-10-29T16:20:05.120Z",
  "line": "line1",
  "machine": { "id": "filler-03", "model": "KHS Innofill", "lastServiced": "2026-08-14" },
  "vibration_mm_s": 4.7,
  "temp_k": 334.35,
  "rpm": 1480,
  "anomaly": true,
  "anomalyScore": 3.4
}
```

## Error cases

| Case | Handling |
| --- | --- |
| Unknown `sensorId` | Passed through with `machine: null`; counted in the `UnknownSensor` metric |
| Bad reading (impossible value) | Dropped and counted in `RejectedReading` |
| Asset registry unavailable | Uses the cached copy; if there's none, passes through with `machine: null` |
| OpenSearch or Firehose write fails | The batch fails and Kinesis retries it, so writes must tolerate duplicates |

<!-- node:search -->
The search cluster behind the live plant-floor dashboards. It holds the last 7 days of enriched events.

| Setting | Value |
| --- | --- |
| Service | Amazon OpenSearch Service 2.17 |
| Cluster | 3 × `r7g.large.search` data nodes, 3 dedicated masters, across 3 AZs |
| Indexes | One per day (`telemetry-2026.10.29`); deleted after 7 days by an ISM policy |
| Dashboards | OpenSearch Dashboards, refreshing every 5 s |

## Alerting

A monitor runs every minute:

```json
{
  "query": { "bool": { "filter": [
    { "term": { "anomaly": true } },
    { "range": { "ts": { "gte": "now-5m" } } }
  ] } },
  "trigger": "count by machine.id > 10",
  "action": "notify #riverside-maintenance"
}
```

## Error cases

- **Cluster status yellow:** a replica shard isn't allocated, usually during a node replacement. Dashboards keep working.
- **Cluster status red:** a primary shard is missing and writes to that index fail. [@enrich](isodraw:node/enrich) retries; page the platform team.
- **`429 es_rejected_execution_exception`:** the write queue is full. Writes back off and retry. If it keeps happening, the cluster needs more nodes.

<!-- node:firehose -->
Batches enriched events into Parquet files in the data lake.

| Setting | Value |
| --- | --- |
| Service | Amazon Data Firehose, stream `linewatch-curated` |
| Buffer | 5 minutes or 128 MB, whichever comes first |
| Format | JSON converted to Parquet using the [@Glue crawler](isodraw:node/glue)'s table schema |
| Partitioning | `dt=YYYY-MM-DD/line=lineN/` (dynamic partitioning) |
| Errors | Records that fail to convert go to `s3://…/errors/` |

## Error cases

- **Schema mismatch:** a new field from [@enrich](isodraw:node/enrich) that isn't in the table schema is dropped from the Parquet output. Update the schema before deploying the change.
- **S3 unavailable:** Firehose retries for up to 24 hours before giving up on a batch.

<!-- node:lake -->
Linewatch's long-term store: S3 buckets catalogued by AWS Glue and governed by Lake Formation.

| Zone | Bucket | Format | Retention | Who can read |
| --- | --- | --- | --- | --- |
| Raw | [@raw](isodraw:node/raw) | JSON, as received | 30 days | Data engineers |
| Curated | [@curated](isodraw:node/curated) | Parquet, partitioned | 3 years | Analysts, ML pipelines |

Access is granted per table and column in Lake Formation, not with bucket policies.

<!-- node:raw -->
Readings exactly as the gateways sent them, kept for 30 days so the pipeline can be replayed after a bug.

| Setting | Value |
| --- | --- |
| Bucket | `linewatch-raw-prod` |
| Layout | `yyyy/mm/dd/hh/` gzipped JSON lines |
| Lifecycle | Delete after 30 days |

**Replay:** a script reads a time range from this bucket and puts the readings back into [@Kinesis](isodraw:node/kinesis). They then flow through enrich again, with a `replayed: true` flag.

<!-- node:curated -->
The analytics source of truth: every enriched event as Parquet, partitioned by day and line.

| Setting | Value |
| --- | --- |
| Bucket | `linewatch-curated-prod` |
| Layout | `telemetry/dt=2026-10-29/line=line1/part-0001.parquet` |
| Size | About 12 GB per day after compression |
| Lifecycle | Infrequent Access after 90 days; delete after 3 years |

A nightly compaction job merges the many small files from each day into files of about 512 MB, which makes queries faster and cheaper.

<!-- node:glue -->
Keeps the `linewatch.telemetry` table definition in the Glue Data Catalog in step with the files in [@curated](isodraw:node/curated).

| Setting | Value |
| --- | --- |
| Service | AWS Glue crawler |
| Schedule | Every hour |
| Schema changes | New columns are added; removed or changed columns are only logged |

## Error cases

- **Crawler creates a second table** (for example `telemetry_abc123`): the files under a path didn't match. Usually a stray CSV someone uploaded. Delete the file and the extra table.
- **New partitions not visible in Athena:** the crawler hasn't run yet. Run `MSCK REPAIR TABLE telemetry` or wait for the next hour.

<!-- node:athena -->
SQL over the data lake for analysts and the weekly maintenance report.

| Setting | Value |
| --- | --- |
| Service | Amazon Athena (engine version 3) |
| Workgroup | `linewatch-analysts`; 10 GB scan limit per query |
| Results | `s3://linewatch-athena-results/`, deleted after 7 days |

## Example: average temperature by line today

```sql
SELECT line,
       avg(temp_k - 273.15) AS avg_temp_c,
       count_if(anomaly)    AS anomalies
FROM linewatch.telemetry
WHERE dt = cast(current_date AS varchar)
GROUP BY line
ORDER BY anomalies DESC;
```

Always filter on `dt`. Without it, a query scans all 3 years of data and hits the 10 GB limit.

## Error cases

- **`Query exhausted resources`:** usually a join without partition filters. Narrow the date range.
- **`HIVE_PARTITION_SCHEMA_MISMATCH`:** a column's type changed between days. Fix the type in the catalog, or cast the column in the query.

<!-- node:analysts -->
The reliability engineers and data scientists who study long-term trends, tune anomaly thresholds and train the failure-prediction model. They use [@Athena](isodraw:node/athena) from the console, from notebooks, and through a Tableau connection.

<!-- edge:e1 -->
MQTT `PUBLISH` at QoS 1 to `factory/riverside/line1/telemetry`, over TLS with the gateway's certificate. QoS 1 means IoT Core acknowledges each message, and the gateway resends anything that isn't acknowledged.

<!-- edge:e2 -->
Same as Line 1: MQTT at QoS 1 to `factory/riverside/line2/telemetry`.

<!-- edge:e3 -->
Same as Line 1: MQTT at QoS 1 to `factory/riverside/line3/telemetry`.

<!-- edge:e4 -->
The `telemetry_to_stream` rule calls `PutRecord` for each message, partitioned by `sensorId`. The rule adds a `line` field taken from the topic.

<!-- edge:e5 -->
An event source mapping reads from the stream: batches of up to 500 records or 1 second of waiting, 4 concurrent batches per shard. Records with the same `sensorId` are always processed in order.

<!-- edge:e6 -->
Bulk index requests to the daily index, using `sensorId + seq` as the document ID. A retried batch overwrites the same documents instead of creating duplicates.

Only the fields the dashboards need are sent, which keeps the cluster small:

```json
{ "index": { "_index": "telemetry-2026.10.29", "_id": "l1-filler-motor-03:908112" } }
{ "ts": "2026-10-29T16:20:05.120Z", "line": "line1", "machine.id": "filler-03", "vibration_mm_s": 4.7, "temp_k": 334.35, "anomaly": true }
```

<!-- edge:e7 -->
`PutRecordBatch` with the full enriched event, up to 500 records per call. Firehose may store a retried record twice; the nightly compaction removes duplicates by `sensorId` and `seq`.

<!-- edge:e8 -->
Firehose writes a Parquet file to `curated` at most every 5 minutes for each `dt`/`line` partition.

<!-- edge:e9 -->
The `telemetry_archive` rule copies every message, unchanged, to the raw zone. This copy doesn't depend on Kinesis or enrich, so it still works when they break, and the pipeline can be replayed from it.

<!-- edge:e10 -->
The crawler lists new objects under `telemetry/` every hour and updates the table's partitions and columns.

<!-- edge:e11 -->
Athena reads table and partition definitions from the Glue Data Catalog when it plans each query.

<!-- edge:e12 -->
Analysts send SQL through the console, JDBC (Tableau) or `boto3` in notebooks, and get results back as CSV in the results bucket.
