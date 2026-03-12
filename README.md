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
* **`sensor_to_pollution_mapping.csv`**: Cross-reference file for linking environmental monitors to specific highway stretches.


ng the `sensor_id` and the calculated `timestamp`.
