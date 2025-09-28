# 🚗 Nivora Park - Separated Services Architecture

## 📋 Overview

Nivora Park Dashboard sekarang menggunakan arsitektur microservices dengan Docker Compose terpisah untuk setiap komponen utama:

- **Dashboard Service** - Next.js application
- **Redis Service** - Caching dan session storage
- **Prometheus Service** - Monitoring dan metrics
- **Elasticsearch Service** - Logging dan analytics

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │    │     Redis       │    │   Prometheus    │
│   (Port 3001)   │◄──►│   (Port 6379)   │    │   (Port 9090)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │  Elasticsearch  │             │
         │              │   (Port 9200)   │             │
         │              └─────────────────┘             │
         └──────────────┼─────────────────┼─────────────┘
                        │  Shared Network │
                        └─────────────────┘
```

## 📁 File Structure

```
dash-nivora-park/
├── docker-compose.yml              # Dashboard service
├── docker-compose.redis.yml        # Redis service
├── docker-compose.prometheus.yml   # Prometheus + Grafana
├── docker-compose.elasticsearch.yml # ELK Stack
├── scripts/
│   ├── deploy.sh                   # Original deployment script
│   └── manage-services.sh          # New management script
├── monitoring/
│   ├── prometheus.yml              # Prometheus config
│   ├── grafana/                    # Grafana configs
│   └── logstash/                   # Logstash configs
└── README-Separated-Services.md    # This file
```

## 🚀 Quick Start

### 1. Create Network
```bash
docker network create shared-network
```

### 2. Start All Services
```bash
# Using the management script
./scripts/manage-services.sh start all

# Or manually
docker-compose -f docker-compose.redis.yml up -d
docker-compose -f docker-compose.prometheus.yml up -d
docker-compose -f docker-compose.elasticsearch.yml up -d
docker-compose -f docker-compose.yml up -d
```

### 3. Access Services

| Service | URL | Description |
|---------|-----|-------------|
| Dashboard | http://localhost:3001 | Main application |
| Redis | localhost:6379 | Cache service |
| Prometheus | http://localhost:9090 | Metrics monitoring |
| Grafana | http://localhost:3002 | Visualization (admin/nivora_grafana_password) |
| Elasticsearch | http://localhost:9200 | Search engine |
| Kibana | http://localhost:5601 | Log visualization |
| Logstash | localhost:5044, localhost:5001 | Log processing |

## 🛠️ Service Management

### Using Management Script

```bash
# Start all services
./scripts/manage-services.sh start all

# Start specific service
./scripts/manage-services.sh start redis
./scripts/manage-services.sh start prometheus
./scripts/manage-services.sh start elasticsearch
./scripts/manage-services.sh start dashboard

# Stop all services
./scripts/manage-services.sh stop all

# Stop specific service
./scripts/manage-services.sh stop redis

# Restart service
./scripts/manage-services.sh restart dashboard

# Show status
./scripts/manage-services.sh status

# Show logs
./scripts/manage-services.sh logs all
./scripts/manage-services.sh logs dashboard

# Build dashboard
./scripts/manage-services.sh build

# Cleanup everything
./scripts/manage-services.sh cleanup
```

### Manual Commands

```bash
# Redis
docker-compose -f docker-compose.redis.yml up -d
docker-compose -f docker-compose.redis.yml down

# Prometheus + Grafana
docker-compose -f docker-compose.prometheus.yml up -d
docker-compose -f docker-compose.prometheus.yml down

# Elasticsearch + Kibana + Logstash
docker-compose -f docker-compose.elasticsearch.yml up -d
docker-compose -f docker-compose.elasticsearch.yml down

# Dashboard
docker-compose -f docker-compose.yml up -d
docker-compose -f docker-compose.yml down
```

## 🔧 Service Details

### 1. Dashboard Service (`docker-compose.yml`)
- **Port:** 3001
- **Dependencies:** Redis
- **Features:** Next.js application dengan monitoring
- **Environment Variables:**
  - `NODE_ENV=production`
  - `NEXT_PUBLIC_API_URL=http://10.241.197.145:8080`
  - `REDIS_URL=redis://nivora-redis:6379`
  - `REDIS_PASSWORD=nivora_redis_password`

### 2. Redis Service (`docker-compose.redis.yml`)
- **Port:** 6379
- **Password:** nivora_redis_password
- **Features:** Caching, session storage, real-time data
- **Persistence:** Volume `nivora_redis_data`

### 3. Prometheus Service (`docker-compose.prometheus.yml`)
- **Prometheus Port:** 9090
- **Grafana Port:** 3002
- **Features:** Metrics collection, monitoring dashboard
- **Credentials:** admin/nivora_grafana_password
- **Persistence:** Volumes `nivora_prometheus_data`, `nivora_grafana_data`

### 4. Elasticsearch Service (`docker-compose.elasticsearch.yml`)
- **Elasticsearch Port:** 9200, 9300
- **Kibana Port:** 5601
- **Logstash Port:** 5044, 5000, 9600
- **Features:** Log aggregation, search, analytics
- **Persistence:** Volume `nivora_elasticsearch_data`

## 📊 Monitoring & Logging

### Prometheus Metrics
- **Dashboard:** http://localhost:9090
- **Targets:** All services dengan health checks
- **Alerts:** Configurable alerting rules

### Grafana Visualization
- **Dashboard:** http://localhost:3002
- **Username:** admin
- **Password:** nivora_grafana_password
- **Pre-configured:** Prometheus datasource dan Nivora dashboard

### ELK Stack Logging
- **Elasticsearch:** http://localhost:9200
- **Kibana:** http://localhost:5601
- **Logstash:** localhost:5044
- **Log Format:** JSON structured logging
- **Index Pattern:** `nivora-logs-*`

## 🔒 Security

### Network Security
- External network isolation (`shared-network`)
- Service-to-service communication only
- No direct external access to internal services

### Service Security
- **Redis:** Password protected
- **Grafana:** Admin password required
- **Elasticsearch:** X-Pack security disabled for development
- **Logstash:** Secure log processing pipeline

### Credentials Summary
- **Redis:** `nivora_redis_password`
- **Grafana:** `admin/nivora_grafana_password`
- **Elasticsearch:** No authentication (dev mode)
- **Kibana:** No authentication (dev mode)

## 🔄 Scaling & Maintenance

### Scale Services
```bash
# Scale dashboard instances
docker-compose -f docker-compose.yml up -d --scale nivora-dashboard=3

# Scale Redis (requires Redis Cluster setup)
docker-compose -f docker-compose.redis.yml up -d --scale nivora-redis=3
```

### Backup & Restore
```bash
# Backup Redis
docker exec nivora-redis redis-cli -a nivora_redis_password BGSAVE

# Backup Elasticsearch
curl -X PUT "localhost:9200/_snapshot/nivora_backup" -H 'Content-Type: application/json' -d '{
  "type": "fs",
  "settings": {
    "location": "/backup"
  }
}'
```

### Update Services
```bash
# Update dashboard
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# Update monitoring
docker-compose -f docker-compose.prometheus.yml pull
docker-compose -f docker-compose.prometheus.yml up -d
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Network Issues
```bash
# Check network exists
docker network ls | grep shared-network

# Create network if missing
docker network create shared-network
```

#### 2. Service Dependencies
```bash
# Check service dependencies
./scripts/manage-services.sh status

# Restart in correct order
./scripts/manage-services.sh restart all
```

#### 3. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3001
netstat -tulpn | grep :6379
netstat -tulpn | grep :9090
netstat -tulpn | grep :9200
```

#### 4. Service Logs
```bash
# Check specific service logs
./scripts/manage-services.sh logs dashboard
./scripts/manage-services.sh logs redis
./scripts/manage-services.sh logs prometheus
./scripts/manage-services.sh logs elasticsearch
```

### Health Checks
All services include health checks:
- **Dashboard:** `/api/health` endpoint
- **Redis:** `redis-cli ping`
- **Prometheus:** `/-/healthy` endpoint
- **Elasticsearch:** `/_cluster/health` endpoint
- **Grafana:** `/api/health` endpoint
- **Kibana:** `/api/status` endpoint
- **Logstash:** `/_node/stats` endpoint

## 📈 Performance Optimization

### Resource Limits
```yaml
# Add to docker-compose files for production
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
    reservations:
      memory: 256M
      cpus: '0.25'
```

### Monitoring Alerts
- High memory usage
- Service unavailability
- Response time degradation
- Error rate increase

---

**Nivora Park Dashboard** - Microservices architecture with separated Docker Compose services! 🚗💳📊 