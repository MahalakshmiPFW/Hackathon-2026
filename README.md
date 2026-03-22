## 🏙️ Smart City 2030: AI Digital Twin

An advanced AI-powered digital twin designed to simulate urban dynamics, optimize traffic flow, and monitor environmental impact. This project integrates geospatial engineering, reinforcement learning, and natural language processing to create a living model of a modern metropolis.

## 🚀 Overview

Smart City 2030 leverages real-time data and predictive modeling to solve three core urban challenges:

Congestion: Reducing travel time via RL-based traffic light synchronization.

Sustainability: Mapping pollution levels and predicting high-emission zones.

Efficiency: Forecasting energy demand and optimizing infrastructure placement.

## 🏗️ System architecture
The platform is divided into five specialized layers, ensuring a modular and scalable deployment.

1. Data Engineering (Spatial Backbone)
Role: Ingests and normalizes complex geospatial and temporal datasets.

Key Tech: PostGIS, GeoPandas, OSMNX.

Focus: Building ETL pipelines that transform raw OpenStreetMap data into graph structures for simulation.


## 📂  Data Description: Digital Twins

### 🚦 Mobility & infrastructure
* **`simulation_telemetry.csv`**: Time-series telemetry (15-min intervals). Contains `time_step`, `sensor_id`, and `speed_mph`.
* **`road_network_adjacency.csv`**: Adjacency matrix ($W$) representing physical road connectivity between sensors for Graph Neural Network (GNN) modeling.
* **`california_traffic_sensors.geojson`**: Geospatial coordinates and properties (Freeway, Direction) for Mapbox/Leaflet visualization.
* **`traffic_velocity_california.csv`**: The raw 2024 speed matrix used to generate the telemetry.

### 🌬️ Atmosphere & environment
* **`weather_hourly_dim.csv`**: Hourly meteorological data (Temp, Humidity, Wind Speed, Wind Direction). Use to join with telemetry on timestamps.
* **`ca_pollution_silver_2024.csv`**: Filtered 2024 EPA annual concentration baselines ($NO_2$, $PM_{2.5}$, Ozone) for California.
* **`sensor_pollutant_links_2024.csv`**: Haversine distance mapping between each traffic sensor and its nearest air quality monitor.
* **`california_air_monitor_markers.csv`**: Metadata for official EPA monitoring sites.

### 🆔 Metadata & mapping
* **`sensor_metadata.csv`**: Static sensor attributes including Freeway ID, Direction, and mapped 2024 $NO_2$ baseline. Join key: `sensor_id`.
* **`sensor_to_pollution_mapping.csv`**: Cross-reference file 

# Smart City Digital Twin — March 28th Scope

> **Project:** Smart City Digital Twin — Hackathon Submission  
> **Deadline:** March 28, 2026 — 6 days from March 22  
> **Team:** 1 Data Engineer · 1 Backend · 1 ML Engineer · 1 NLP Engineer · 1 Frontend  
> **Stack:** Kafka · Faust · FastAPI · TimescaleDB · PostGIS · PyTorch · Gymnasium · LangChain · React · Mapbox GL · Redis · Docker  
> **Rule:** Everything in this document must run with `docker compose up`. If it can't run, it doesn't ship.

---

## Features

| Epic | Title | Owner | Days |
|------|-------|--------|-------|------|
| [EP-01](#ep-01--real-time-sensor-ingest) | Real-time sensor ingest | Data Eng + Backend | Days 1–3 |
| [EP-02](#ep-02--live-traffic-heatmap) | Live traffic heatmap | Frontend + Backend | Days 2–4 |
| [EP-03](#ep-03--traffic-light-simulation-stub) | Traffic light simulation (stub) | ML Eng + Backend | Days 3–5 |
| [EP-05](#ep-05--nlp-query-2-patterns) | NLP query (2 patterns) | NLP Eng + Frontend | Days 4–5 |
| [EP-06](#ep-06--pollution-overlay-basic) | Pollution overlay (basic) | Frontend | Day 5 |
| [CC](#cc--repo-documentation--docker) | Repo, README, Docker | All | Day 6 |

---

## Day-by-Day Plan

| Day | Date | Focus | Risk |
|-----|------|-------|------|
| 1 | Sat Mar 22 | Data pipeline running. Kafka + Faust + TimescaleDB + PostGIS receiving replay data. | Kafka local setup takes longer than expected. Mitigation: use Redpanda instead — single binary, no Zookeeper. |
| 2 | Sun Mar 23 | WebSocket broadcast live. Mapbox canvas up. Roads loading from PostGIS. | OSM data import to PostGIS fails. Mitigation: pre-seeded SQL dump committed to repo. |
| 3 | Mon Mar 24 | Heatmap colouring from real WebSocket events. Road detail panel. Gymnasium env scaffolded. | ML training doesn't converge. Mitigation: mock simulation output for demo district if needed. |
| 4 | Tue Mar 25 | PPO agent running on 4-intersection subgraph. Simulation API wired. NLP classifier running. | NLP entity resolution misses road names. Mitigation: hardcode the demo district street names as known entities. |
| 5 | Wed Mar 26 | NLP end-to-end for 2 query patterns. Pollution overlay toggle. Full flow integration. | Integration bugs between services. Mitigation: this day is deliberately left for fixing what breaks. |
| 6 | Thu Mar 27 | README, architecture diagram, repo cleanup, `docker compose up` verified clean on a fresh machine. | — |

---

## EP-01 — Real-time Sensor Ingest

**Goal:** Kafka receives sensor events from a replay script, Faust validates and enriches them, TimescaleDB stores time-series rows, PostGIS holds current road state. The entire pipeline runs locally in Docker.  
**Owner:** Data Engineer (lead) + Backend  
**Priority:** P0 — blocks everything else  
**Status:** ❌ Not Started  
**Target:** Done by end of Day 3

**Why it's P0:** No other epic can do real integration testing until sensor data is flowing. The frontend needs WebSocket events. The ML env needs road state. The NLP lookup needs TimescaleDB rows.

| Story ID | Title | Owner | Days | Status |
|----------|-------|-------|------|--------|
| M-101 | Kafka + Faust local setup | Data Eng | 1 day | ❌ Not Started |
| M-102 | Sensor replay script | Data Eng | 1 day | ❌ Not Started |
| M-103 | Faust processor — validate + enrich | Data Eng | 1 day | ❌ Not Started |
| M-104 | TimescaleDB + PostGIS schema + writer | Data Eng | 1 day | ❌ Not Started |
| M-105 | WebSocket broadcast on ingest | Backend | 1 day | ❌ Not Started |

---

### M-101 — Kafka + Faust Local Setup

**Type:** Task | **Owner:** Data Engineer | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** None

**Description:**  
Stand up Kafka (or Redpanda as a drop-in replacement — single binary, no Zookeeper dependency, dramatically faster local setup) via Docker Compose. Define the three topics. Confirm a producer and consumer can exchange messages. Faust app boots and connects to the broker.

**Use Redpanda if Kafka setup takes more than 2 hours.** It is API-compatible with Kafka and runs in a single container.

```yaml
# docker-compose.yml excerpt
redpanda:
  image: redpandadata/redpanda:latest
  command: redpanda start --overprovisioned --smp 1 --memory 512M
  ports:
    - "9092:9092"
    - "9644:9644"
```

**Topics:**

| Topic | Purpose |
|-------|---------|
| `city.traffic.raw` | Raw traffic sensor events |
| `city.pollution.raw` | Raw pollution sensor events |
| `city.traffic.clean` | Validated, enriched traffic events |
| `city.traffic.dlq` | Failed validation events |

**Acceptance Criteria:**
- `docker compose up` starts broker with no manual steps
- Three topics created on startup via topic config file
- Faust app in `ingest/processor/app.py` connects and logs "Connected to broker" on boot
- Test: `python ingest/test_producer.py` publishes 10 events and consumer reads all 10

**Success Criteria:** `docker compose up && python ingest/test_producer.py` runs clean with zero errors on a fresh clone.

---

### M-102 — Sensor Replay Script

**Type:** Task | **Owner:** Data Engineer | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** M-101

**Description:**  
Write a Python script that reads a sample traffic CSV (pre-committed to `data/sample_traffic.csv`) and publishes events to `city.traffic.raw` at configurable replay speed. The CSV should cover one real city district — download from OpenStreetMap using OSMNX and pre-process to generate synthetic sensor readings.

**Recommended city district:** Use a small, well-mapped area — central Amsterdam, inner London borough, or downtown Austin. OSMNX can download any of these in under 60 seconds.

```python
# Generate sample data
import osmnx as ox
import pandas as pd

G = ox.graph_from_place("Fitzrovia, London, UK", network_type="drive")
nodes, edges = ox.graph_to_gdfs(G)
# edges gives you road segments — generate synthetic speed/occupancy readings
```

**Event schema:**
```json
{
  "road_id": "str",
  "timestamp": "ISO8601",
  "speed_kmh": 23.4,
  "vehicle_count": 12,
  "occupancy_pct": 67.2,
  "sensor_id": "str"
}
```

**Acceptance Criteria:**
- `python ingest/replay.py --speed 10` publishes events 10× faster than real time
- Script loops continuously so the demo never runs out of data
- At least 200 unique road segments in the sample dataset
- CSV committed to `data/sample_traffic.csv` — no external download required at demo time
- Pollution replay script also included: `python ingest/replay_pollution.py` publishing NO2 and AQI per sensor

**Success Criteria:** Replay script runs for 10 minutes without error, publishing to Kafka continuously. Confirmed via Redpanda Console UI showing message throughput.

---

### M-103 — Faust Processor — Validate + Enrich

**Type:** Task | **Owner:** Data Engineer | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** M-101, M-102

**Description:**  
Faust agent consumes `city.traffic.raw`, validates each event against hard rules, enriches with canonical `road_id` from PostGIS, and routes to `city.traffic.clean` or `city.traffic.dlq`. Keep validation rules minimal for hackathon scope — focus on the rules that would actually catch corrupt sensor data.

**Validation rules (hackathon scope):**

| Rule | Action |
|------|--------|
| `speed_kmh` outside 0–200 | Route to DLQ |
| `occupancy_pct` outside 0–100 | Route to DLQ |
| Any required field null | Route to DLQ |
| `timestamp` more than 60s in future | Route to DLQ |

**Acceptance Criteria:**
- Faust app in `ingest/processor/app.py` with `traffic_agent` consuming `city.traffic.raw`
- Valid events forwarded to `city.traffic.clean` with `road_id` confirmed against PostGIS lookup
- Invalid events forwarded to `city.traffic.dlq` with `failed_rule` field added
- Processing lag < 500ms confirmed by comparing event timestamp to processing timestamp in logs
- Unit test: `pytest ingest/tests/test_processor.py` — 10 valid events pass, 5 invalid events route to DLQ

**Success Criteria:** 100 replay events processed with correct routing. `pytest` passes clean.

---

### M-104 — TimescaleDB + PostGIS Schema + Writer

**Type:** Task | **Owner:** Data Engineer | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** M-103

**Description:**  
Create the two database schemas and wire the Faust processor to write clean events to both. TimescaleDB stores the time-series history. PostGIS stores current road state (upserted on every event).

**TimescaleDB schema:**
```sql
CREATE TABLE traffic_readings (
  time          TIMESTAMPTZ NOT NULL,
  road_id       TEXT NOT NULL,
  speed_kmh     FLOAT,
  vehicle_count INT,
  occupancy_pct FLOAT
);
SELECT create_hypertable('traffic_readings', 'time');
CREATE INDEX ON traffic_readings (road_id, time DESC);

CREATE TABLE pollution_readings (
  time      TIMESTAMPTZ NOT NULL,
  road_id   TEXT NOT NULL,
  no2_ugm3  FLOAT,
  aqi       INT
);
SELECT create_hypertable('pollution_readings', 'time');
CREATE INDEX ON pollution_readings (road_id, time DESC);
```

**PostGIS schema:**
```sql
CREATE TABLE road_nodes (
  road_id       TEXT PRIMARY KEY,
  geom          GEOMETRY(LineString, 4326),
  speed_kmh     FLOAT,
  occupancy_pct FLOAT,
  aqi           INT,
  last_updated  TIMESTAMPTZ
);
CREATE INDEX ON road_nodes USING GIST (geom);
```

**Acceptance Criteria:**
- Migrations in `db/migrations/` run automatically on `docker compose up` via init script
- Faust processor writes to TimescaleDB using asyncpg with batch flush every 500ms
- PostGIS upserted on every clean event using `ON CONFLICT (road_id) DO UPDATE`
- Pre-seeded SQL dump of the demo district road network committed to `db/seeds/roads.sql` — runs on container start
- Verify: after 60s of replay, `SELECT COUNT(*) FROM traffic_readings` returns > 500 rows

**Success Criteria:** After `docker compose up` and 60 seconds of replay, both databases have live data and PostGIS road nodes have `last_updated` within the last 2 seconds.

---

### M-105 — WebSocket Broadcast on Ingest

**Type:** Task | **Owner:** Backend | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** M-104

**Description:**  
FastAPI WebSocket endpoint that broadcasts a road update payload to all connected clients every time PostGIS is upserted. This is the live feed that powers the heatmap (EP-02) and pollution overlay (EP-06).

**Broadcast payload:**
```json
{
  "type": "road_update",
  "road_id": "way/12345",
  "speed_kmh": 23.4,
  "occupancy_pct": 67.2,
  "aqi": 87,
  "last_updated": "2026-03-22T09:14:22Z"
}
```

**Acceptance Criteria:**
- FastAPI endpoint at `ws://localhost:8000/ws/city-feed`
- No auth for hackathon scope — remove the JWT requirement, add a TODO comment
- Broadcasts within 200ms of PostGIS upsert
- Handles multiple concurrent connections (test with 3 browser tabs open simultaneously)
- Client reconnects automatically if connection drops — exponential backoff in frontend hook

**Success Criteria:** Three browser tabs all receive the same road update within 500ms of the replay script publishing the event to Kafka.

---

---

## EP-02 — Live Traffic Heatmap

**Goal:** Mapbox GL map renders the demo district road network. Roads colour in real time from WebSocket events. Clicking a road opens a detail panel with live speed, occupancy, and last updated time.  
**Owner:** Frontend (lead) + Backend  
**Priority:** P0  
**Status:** ❌ Not Started  
**Target:** Done by end of Day 4

| Story ID | Title | Owner | Days | Status |
|----------|-------|-------|------|--------|
| M-201 | Mapbox GL canvas + road network load | Frontend | 1 day | ❌ Not Started |
| M-202 | WebSocket client + Zustand road store | Frontend | 1 day | ❌ Not Started |
| M-203 | Heatmap colour layer | Frontend | 1 day | ❌ Not Started |
| M-204 | Road node detail panel | Frontend + Backend | 1 day | ❌ Not Started |

---

### M-201 — Mapbox GL Canvas + Road Network Load

**Type:** Task | **Owner:** Frontend | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** M-104

**Description:**  
Bootstrap the React app with a Mapbox GL JS map centred on the demo district. Load the road network as GeoJSON from a single backend endpoint that queries PostGIS. The map must render the full road network on first load before any WebSocket events arrive.

**Acceptance Criteria:**
- React app in `frontend/src/` bootstrapped with Vite + TypeScript
- Mapbox GL JS initialised in `src/components/CityMap.tsx`
- `GET /api/roads` endpoint in FastAPI queries PostGIS and returns GeoJSON FeatureCollection
- Road network renders as thin gray lines on dark map style (Mapbox Dark v11) on first load
- Map centred and zoomed to demo district on mount — hardcode the bbox, no user location needed
- Mapbox token read from `VITE_MAPBOX_TOKEN` env var — `.env.example` committed, `.env` gitignored

**Success Criteria:** `docker compose up` → open `localhost:3000` → road network visible within 3 seconds, no console errors.

---

### M-202 — WebSocket Client + Zustand Road Store

**Type:** Task | **Owner:** Frontend | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** M-201, M-105

**Description:**  
Open a WebSocket connection to the FastAPI feed on app mount. Incoming `road_update` events write into a Zustand store keyed by `road_id`. The store is the single source of truth for all live road data — the heatmap layer and detail panel both read from it.

**Why Zustand:** WebSocket events arrive at up to 50/sec during replay. Zustand handles high-frequency partial state updates without re-rendering the full component tree. Redux would thrash.

**Acceptance Criteria:**
- WebSocket hook in `src/hooks/useRoadFeed.ts`
- Zustand store in `src/store/roadStore.ts` — shape: `Record<string, RoadUpdate>`
- Each event: `set(state => ({ roads: { ...state.roads, [e.road_id]: e } }))` — partial merge, never full replace
- Connection status indicator: green dot (connected), amber (reconnecting), red (failed) — top right corner of map
- Auto-reconnect on disconnect with 1s → 2s → 4s → max 30s backoff

**Success Criteria:** Store processes 50 events/sec for 60 seconds. No memory growth observed in Chrome DevTools. No full tree re-renders during event processing.

---

### M-203 — Heatmap Colour Layer

**Type:** User Story | **Owner:** Frontend | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** M-202

**User Story:** As a reviewer opening the repo demo, I want to see roads visually changing colour in real time as traffic data arrives so the system's core value is immediately obvious.

**Colour scale:**

| Occupancy | Colour | Meaning |
|-----------|--------|---------|
| 0–30% | `#1D9E75` green | Free flow |
| 31–60% | `#EF9F27` amber | Moderate |
| 61–80% | `#D85A30` coral | Heavy |
| 81–100% | `#E24B4A` red | Gridlock |
| No data / stale > 60s | `#444441` gray | Unknown |

**Acceptance Criteria:**
- Mapbox `line` layer reads colour from Zustand store via GeoJSON `properties.occupancy_pct`
- On each WebSocket event, only `map.getSource('roads').setData()` is called for the changed feature — not full GeoJSON replacement
- Road line width: 2px at city zoom, 5px at street zoom (zoom-dependent expression)
- Stale roads (no update in 60s) fade to gray automatically
- Smooth colour transitions: Mapbox `line-color-transition` set to 300ms

**Success Criteria:** Roads visibly change colour within 500ms of replay script publishing an event. The map looks alive within 10 seconds of starting replay.

---

### M-204 — Road Node Detail Panel

**Type:** User Story | **Owner:** Frontend + Backend | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** M-203

**User Story:** As a reviewer, I want to click any road and see its current speed, occupancy, and pollution reading so I can verify the data pipeline is working end to end.

**Panel contents:**
1. Road name (from OSM properties)
2. Live speed (km/h) and vehicle count
3. Occupancy % with colour badge
4. AQI reading with WHO category label
5. Last updated timestamp (relative: "2s ago")
6. Two action buttons: "Run simulation" (wires to EP-03) and "Ask AI" (wires to EP-05)

**Backend endpoint:**
```
GET /api/node/:road_id
```
Queries PostGIS `road_nodes` for current state. Single query, no joins needed — everything is already upserted onto the node row.

**Acceptance Criteria:**
- Panel opens as right-side drawer on road click, closes on Escape or X
- Reads current state from Zustand store first (instant) — no API call needed for basic metrics
- Backend `GET /api/node/:road_id` called only for fields not in the store (road name, geometry metadata)
- Response < 100ms (single PostGIS row lookup)
- "Run simulation" button opens simulation panel pre-filled with clicked `road_id`
- "Ask AI" button opens NLP panel pre-filled with "Tell me about [road name]"

**Success Criteria:** Panel opens and fully populates within 200ms of road click. All fields show live values, not placeholder text.

---

---

## EP-03 — Traffic Light Simulation (Stub)

**Goal:** A Gymnasium environment models a 4-intersection subgraph of the demo district. A PPO agent runs inference and returns a recommended timing plan. The result overlays on the map showing which intersections improve. Scope is deliberately small — 4 intersections is enough to prove the concept.  
**Owner:** ML Engineer (lead) + Backend  
**Priority:** P1  
**Status:** ❌ Not Started  
**Target:** Done by end of Day 5

**Scope decision:** Training a full city-scale PPO agent in 6 days is not feasible. A 4-intersection subgraph trains in hours, produces a real result, and correctly demonstrates the architecture. The code is identical to what would run at city scale — only the graph size differs.

| Story ID | Title | Owner | Days | Status |
|----------|-------|-------|------|--------|
| M-301 | Gymnasium environment — 4-intersection subgraph | ML Eng | 2 days | ❌ Not Started |
| M-302 | PPO agent train + export to ONNX | ML Eng | 1 day | ❌ Not Started |
| M-303 | Simulation API endpoint | Backend | 1 day | ❌ Not Started |
| M-304 | Simulation result overlay on map | Frontend | 1 day | ❌ Not Started |

---

### M-301 — Gymnasium Environment — 4-Intersection Subgraph

**Type:** Task | **Owner:** ML Engineer | **Priority:** P1 | **Estimate:** 2 days | **Depends on:** M-104

**Description:**  
Build a Gymnasium-compatible environment representing exactly 4 intersections from the demo district. Load the subgraph topology from PostGIS. State space is the current queue length and occupancy on each approach. Action space is phase timing per intersection. Reward penalises mean wait time.

**Why 4 intersections:** Trains in 2–4 hours on CPU. Produces a real, non-trivial result. Architecturally identical to a 400-intersection environment — only the graph query changes.

**State space:** 4 intersections × 4 approaches each = 16 occupancy values + 4 current phases = 20-dimensional observation vector.

**Action space:** 4 intersections × phase duration choice (15s, 30s, 45s, 60s) = `MultiDiscrete([4, 4, 4, 4])`.

**Reward:** `−mean(queue_lengths)` across all approaches per timestep.

**Acceptance Criteria:**
- Environment in `ml/envs/city_traffic_env.py` inheriting `gymnasium.Env`
- `reset()` loads subgraph from PostGIS using hardcoded 4 intersection IDs from demo district
- `step(action)` advances by 30s, returns observation, reward, done, info
- Passes `gymnasium.utils.env_checker.check_env()` with no errors
- 1,000 random steps complete in < 5 seconds on CPU
- Seeded with `np.random.seed(42)` for reproducible results

**Success Criteria:** `check_env()` passes. 1,000 random steps in < 5s. Environment importable with no GPU required.

---

### M-302 — PPO Agent Train + Export to ONNX

**Type:** Task | **Owner:** ML Engineer | **Priority:** P1 | **Estimate:** 1 day | **Depends on:** M-301

**Description:**  
Train a PPO agent on the 4-intersection environment using Stable-Baselines3. Log the reward curve to MLflow. Export the trained policy to ONNX so inference runs without the full SB3 runtime. If training does not converge within 3 hours, use the best checkpoint available — even a partially trained agent demonstrates the pipeline correctly.

**Acceptance Criteria:**
- Training script in `ml/training/train_ppo.py` — runs with `python ml/training/train_ppo.py`
- Trains for 50,000 timesteps — takes 1–3 hours on CPU for a 4-intersection env
- MLflow experiment logged to `mlruns/` — reward curve visible at `localhost:5000`
- Trained model exported to `ml/models/ppo_traffic_v1.onnx`
- Evaluation script `ml/eval/eval_ppo.py` runs 10 test episodes and prints mean reward vs random baseline
- Fallback: if ONNX export fails, pickle the SB3 model — inference still works

**Success Criteria:** Trained agent achieves better mean reward than a random policy on the 4-intersection env. Inference runs in < 100ms.

---

### M-303 — Simulation API Endpoint

**Type:** Task | **Owner:** Backend | **Priority:** P1 | **Estimate:** 1 day | **Depends on:** M-302

**Description:**  
FastAPI endpoint that loads the ONNX model, runs inference on the current road state from PostGIS, and returns a timing recommendation for the 4 demo intersections. Results cached in Redis for 2 minutes — identical requests return instantly.

**Request:**
```json
POST /api/simulate/run
{ "area": "demo_district" }
```

**Response:**
```json
{
  "run_id": "uuid",
  "intersections": [
    { "road_id": "node/111", "current_phase_s": 60, "recommended_phase_s": 35, "wait_time_delta_s": -14.2 },
    { "road_id": "node/222", "current_phase_s": 60, "recommended_phase_s": 50, "wait_time_delta_s": -8.1 },
    { "road_id": "node/333", "current_phase_s": 60, "recommended_phase_s": 45, "wait_time_delta_s": -11.4 },
    { "road_id": "node/444", "current_phase_s": 60, "recommended_phase_s": 40, "wait_time_delta_s": -9.7 }
  ],
  "mean_wait_delta_s": -10.9,
  "cached": false
}
```

**Acceptance Criteria:**
- Endpoint at `POST /api/simulate/run`
- ONNX model loaded once on startup — not reloaded per request
- Redis cache: TTL 2 minutes, key = `sim:demo_district`
- Cache hit returns in < 20ms
- Cache miss (model inference) returns in < 2s for 4-intersection subgraph
- If ONNX model file missing, endpoint returns 503 with clear error message (not a 500 crash)

**Success Criteria:** First call returns in < 2s. Second call returns in < 20ms (cache hit). Response JSON matches schema above exactly.

---

### M-304 — Simulation Result Overlay on Map

**Type:** User Story | **Owner:** Frontend | **Priority:** P1 | **Estimate:** 1 day | **Depends on:** M-303, M-204

**User Story:** As a reviewer, I want to click "Run simulation" and see the 4 demo intersections highlighted on the map with their recommended timing changes so I can understand what the RL agent is recommending.

**Acceptance Criteria:**
- "Run simulation" button in road detail panel (M-204) triggers `POST /api/simulate/run`
- Loading state shown while waiting for response — spinner on the button
- On response: 4 intersection nodes highlighted on map as coloured circles — green = wait time reduced, red = increased
- Side panel updates to show summary: "Mean wait time reduced by 10.9 seconds across 4 intersections"
- Per-intersection tooltip on hover: "Current: 60s → Recommended: 35s | −14.2s wait"
- Toggle: "Show optimised" / "Show current" switches between the two states on the map

**Success Criteria:** Full flow — click road → click "Run simulation" → see intersection markers on map — completes in under 5 seconds including model inference.

---

---

## EP-05 — NLP Query (2 Patterns Only)

**Goal:** A chat panel where the user can type one of two supported query patterns and receive a real answer. Pattern 1: "what if we close X street?" triggers the simulation API. Pattern 2: "how congested is X right now?" queries TimescaleDB and returns a real number. Everything else returns a graceful "I can only answer questions about traffic simulation and current congestion" message.  
**Owner:** NLP Engineer (lead) + Frontend  
**Priority:** P1  
**Status:** ❌ Not Started  
**Target:** Done by end of Day 5

**Scope decision:** The full NLP epic has 4 stories and 14 days of work. For the hackathon, 2 working query patterns wired end-to-end is more impressive than 5 half-working patterns. Quality over breadth.

| Story ID | Title | Owner | Days | Status |
|----------|-------|-------|------|--------|
| M-501 | LangChain intent classifier — 2 patterns | NLP Eng | 1 day | ❌ Not Started |
| M-502 | Query router + response composer | NLP Eng + Backend | 1 day | ❌ Not Started |
| M-503 | NLP chat panel UI | Frontend | 1 day | ❌ Not Started |

---

### M-501 — LangChain Intent Classifier — 2 Patterns

**Type:** Task | **Owner:** NLP Engineer | **Priority:** P1 | **Estimate:** 1 day | **Depends on:** None

**Description:**  
LangChain chain that classifies a free-text query into one of three intents: `what_if_simulation`, `congestion_lookup`, or `unknown`. For `what_if_simulation` and `congestion_lookup`, extract the street name and resolve it to a `road_id` via PostGIS fuzzy match. Unknown intents return a helpful fallback message — they never error.

**Supported patterns:**

| Intent | Example queries |
|--------|----------------|
| `what_if_simulation` | "What if we close Main St?" / "What happens if Oxford Rd is shut?" / "Close the high street" |
| `congestion_lookup` | "How bad is traffic on Main St?" / "Is Oxford Rd congested?" / "What's the congestion on the high street?" |
| `unknown` | Anything else → graceful fallback |

**Implementation note:** Use few-shot prompting against a base LLM (OpenAI GPT-4o-mini or Anthropic Claude) rather than a fine-tuned model — fine-tuning is a 30-day effort, few-shot works in an afternoon. If no API key is available, use a local Ollama model (`llama3.2:3b` runs on CPU).

**Acceptance Criteria:**
- Chain in `nlp/chains/intent_classifier.py`
- Output schema: `{ "intent": str, "road_id": str|null, "road_name": str|null, "raw_query": str }`
- Street name → `road_id` resolution via PostGIS `similarity()` — handles common typos
- Unknown intent never throws an exception — always returns `{ "intent": "unknown" }`
- Unit tests: `pytest nlp/tests/test_classifier.py` — 5 what-if queries, 5 lookup queries, 5 unknown queries all classified correctly
- Latency < 2s including PostGIS entity resolution

**Success Criteria:** All 15 unit test queries classified correctly. No exceptions on any input including empty string, emoji, or SQL injection attempts.

---

### M-502 — Query Router + Response Composer

**Type:** Task | **Owner:** NLP Engineer + Backend | **Priority:** P1 | **Estimate:** 1 day | **Depends on:** M-501, M-303

**Description:**  
Route classified intents to the correct backend and compose a natural language response. `what_if_simulation` calls the simulation API (M-303) and summarises the result in one sentence. `congestion_lookup` queries TimescaleDB for the last 5 minutes of readings and returns current speed and occupancy. `unknown` returns a friendly fallback explaining what the system can answer.

**FastAPI endpoint:**
```
POST /api/nlp/query
{ "query": "What if we close Main St?" }
```

**Response:**
```json
{
  "intent": "what_if_simulation",
  "answer": "Closing Main St would reduce mean intersection wait time by 10.9 seconds across the 4 nearby traffic lights, based on the current traffic conditions.",
  "road_id": "way/12345",
  "data": { "mean_wait_delta_s": -10.9 }
}
```

**Acceptance Criteria:**
- Endpoint at `POST /api/nlp/query`
- `what_if_simulation`: calls `POST /api/simulate/run`, formats result as one plain-English sentence
- `congestion_lookup`: queries `SELECT AVG(speed_kmh), AVG(occupancy_pct) FROM traffic_readings WHERE road_id = $1 AND time > NOW() - INTERVAL '5 minutes'`
- `unknown`: returns `{ "answer": "I can answer questions about traffic simulation (e.g. 'what if we close X?') and current congestion (e.g. 'how busy is X?')" }`
- Response always includes `road_id` when resolved — frontend uses this to highlight the road on the map
- Total response time < 4s for simulation path, < 500ms for lookup path

**Success Criteria:** Both supported patterns return a complete, grammatically correct answer in plain English. Unknown intent never returns an error or empty string.

---

### M-503 — NLP Chat Panel UI

**Type:** User Story | **Owner:** Frontend | **Priority:** P1 | **Estimate:** 1 day | **Depends on:** M-502, M-204

**User Story:** As a reviewer, I want to type a question about the city and receive a plain-English answer with the relevant road highlighted on the map so I can see the NLP layer working end to end.

**Acceptance Criteria:**
- Chat panel as left-side drawer, toggle button on map
- Text input at bottom, conversation history above (session only, not persisted)
- Submitting a query shows a loading skeleton while waiting for response
- On response: answer text displayed, relevant road highlighted on map with a blue glow outline
- For simulation responses: "View on map" button triggers the simulation overlay (M-304)
- For unknown intent: fallback message displayed with two example queries as clickable chips
- Keyboard: Enter submits, Shift+Enter adds newline

**Success Criteria:** Full flow — open chat, type "what if we close [demo road]?", receive answer, see road highlighted — completes end to end with no errors.

---

---

## EP-06 — Pollution Overlay (Basic)

**Goal:** A toggleable pollution layer on the map that reads AQI values from the same WebSocket feed already open for traffic. No interpolation — each sensor maps directly to its nearest road segment. Simple but real.  
**Owner:** Frontend  
**Priority:** P2  
**Status:** ❌ Not Started  
**Target:** Done by end of Day 5 (1 day effort, can run in parallel with M-503)

| Story ID | Title | Owner | Days | Status |
|----------|-------|-------|------|--------|
| M-601 | Pollution toggle layer + legend | Frontend | 1 day | ❌ Not Started |

---

### M-601 — Pollution Toggle Layer + Legend

**Type:** Task | **Owner:** Frontend | **Priority:** P2 | **Estimate:** 1 day | **Depends on:** M-203

**Description:**  
Add a second Mapbox layer that colours road segments by AQI value from the Zustand store (already populated by the WebSocket feed). Add a layer control panel to toggle traffic and pollution layers independently. Add a legend showing the AQI colour scale.

**AQI colour scale (WHO standard):**

| AQI | Colour | Category |
|-----|--------|---------|
| 0–50 | `#1D9E75` green | Good |
| 51–100 | `#EF9F27` yellow | Moderate |
| 101–150 | `#D85A30` orange | Unhealthy for sensitive groups |
| 151–200 | `#E24B4A` red | Unhealthy |
| 200+ | `#534AB7` purple | Very unhealthy |

**Acceptance Criteria:**
- Second Mapbox `line` layer `roads-pollution` reads colour from `properties.aqi` in Zustand store
- Layer control panel top-right: checkboxes for "Traffic" and "Pollution" — both can be on simultaneously
- Pollution layer renders at 70% opacity so underlying road network remains visible
- Legend component shows AQI colour ramp with WHO category labels
- Clicking a road while pollution layer active shows AQI value and category in detail panel
- Layer toggle state persisted to `localStorage`

**Success Criteria:** Both traffic and pollution layers visible simultaneously with no visual artefacts. Toggle switches layers within 100ms.

---

---

## CC — Repo, Documentation & Docker

**Goal:** Someone who has never seen the project can clone the repo, run `docker compose up`, and have a working demo in under 5 minutes. The README tells the full engineering story. The repo structure signals serious engineering.  
**Owner:** All  
**Priority:** P0  
**Status:** ❌ Not Started  
**Target:** Done by Day 6

| Story ID | Title | Owner | Days | Status |
|----------|-------|-------|------|--------|
| M-901 | Docker Compose — full stack | Backend | 1 day | ❌ Not Started |
| M-902 | README + architecture write-up | All | 1 day | ❌ Not Started |

---

### M-901 — Docker Compose — Full Stack

**Type:** Task | **Owner:** Backend | **Priority:** P0 | **Estimate:** 1 day | **Depends on:** All epics

**Description:**  
Single `docker-compose.yml` that starts every service with one command. No manual steps, no "first run this, then that." If it requires more than `docker compose up` to get a working demo, it's not done.

**Services:**

| Service | Image | Port |
|---------|-------|------|
| Redpanda (Kafka) | `redpandadata/redpanda` | 9092 |
| TimescaleDB | `timescale/timescaledb:latest-pg15` | 5432 |
| PostGIS | `postgis/postgis:15-3.4` | 5433 |
| Redis | `redis:7-alpine` | 6379 |
| MLflow | `ghcr.io/mlflow/mlflow` | 5000 |
| FastAPI backend | `./backend` (Dockerfile) | 8000 |
| Faust processor | `./ingest` (Dockerfile) | — |
| React frontend | `./frontend` (Dockerfile) | 3000 |
| Sensor replay | `./ingest` (same image, different command) | — |

**Acceptance Criteria:**
- `docker compose up` starts all services in correct dependency order (health checks on DB before app starts)
- DB migrations run automatically on first start via init scripts
- PostGIS road network seeded automatically from `db/seeds/roads.sql`
- Sensor replay starts automatically — no manual command needed for the demo
- `.env.example` committed with all required vars and instructions for getting a Mapbox token
- `docker compose down -v` cleans up completely — no leftover volumes or state

**Success Criteria:** Clone repo on a machine that has never seen the project. Run `docker compose up`. Open `localhost:3000`. Roads are visible and colouring within 60 seconds. Zero manual steps beyond adding a Mapbox token to `.env`.

---

## What we will build

| Feature | Why excluded for now |
|---------|-------------|
| FR7 — Historical playback | Requires simulation runs to be stored as parquet frames in S3 and a frame-reader service. Adds complexity without adding new engineering signal for reviewers. |
| JWT authentication | Correct decision for production, wrong priority for a hackathon repo. Removed with a `# TODO: add JWT auth before production` comment so reviewers see we know it's missing. |
| BERT policy engine | Fine-tuning requires labelled training data we don't have. The LangChain few-shot classifier demonstrates the same architectural concept without the data requirement. |
| Pollution grid interpolation | IDW interpolation across sparse sensors adds a day of work for a visual improvement. Basic overlay from direct sensor readings makes the same point. |
