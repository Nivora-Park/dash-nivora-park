# 🚗 Nivora Park Dashboard - Docker Deployment

## 📋 Overview

Nivora Park Dashboard adalah sistem monitoring transaksi parkir yang lengkap dengan fitur konfigurasi terminal, payment, manajemen kendaraan, laporan analitik, dan manajemen pengguna.

## 🐳 Docker Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Gateway │    │  Next.js App    │    │   PostgreSQL    │
│   (Port 80/443) │◄──►│  (Port 3000)    │◄──►│   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐             │
         │              │     Redis       │             │
         │              │   (Port 6379)   │             │
         │              └─────────────────┘             │
         │                                              │
         │              ┌─────────────────┐             │
         │              │   Prometheus    │             │
         │              │   (Port 9090)   │             │
         │              └─────────────────┘             │
         │                                              │
         │              ┌─────────────────┐             │
         │              │  Elasticsearch  │             │
         │              │   (Port 9200)   │             │
         │              └─────────────────┘             │
         └──────────────┼─────────────────┼─────────────┘
                        │  Shared Network │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- External network `shared-network`

### 1. Create External Network
```bash
docker network create shared-network
```

### 2. Build and Start Services
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Access Services

| Service | URL | Description |
|---------|-----|-------------|
| Dashboard | http://localhost:3000 | Main application |
| API Gateway | http://localhost:80 | Nginx reverse proxy |
| Database | localhost:5432 | PostgreSQL |
| Cache | localhost:6379 | Redis |
| Monitoring | http://localhost:9090 | Prometheus |
| Logging | http://localhost:9200 | Elasticsearch |

## 📊 Services Overview

### 1. **nivora-dashboard** (Next.js App)
- **Port:** 3000
- **Description:** Main dashboard application
- **Features:** React dashboard with real-time monitoring
- **Health Check:** `/api/health`

### 2. **nivora-db** (PostgreSQL)
- **Port:** 5432
- **Database:** nivora_park
- **User:** nivora_user
- **Password:** nivora_password
- **Features:** Complete database schema with sample data

### 3. **nivora-redis** (Redis Cache)
- **Port:** 6379
- **Features:** Session storage, caching, real-time data

### 4. **nivora-api** (Nginx Gateway)
- **Port:** 80, 443
- **Features:** Reverse proxy, rate limiting, SSL termination
- **Health Check:** `/health`

### 5. **nivora-monitoring** (Prometheus)
- **Port:** 9090
- **Features:** Metrics collection, monitoring dashboard
- **Targets:** All services with metrics endpoints

### 6. **nivora-elasticsearch** (Elasticsearch)
- **Port:** 9200
- **Features:** Log aggregation, search, analytics

## 🔧 Configuration

### Environment Variables

#### Dashboard Service
```yaml
NODE_ENV: production
NEXT_PUBLIC_API_URL: http://api.nivora.local
```

#### Database Service
```yaml
POSTGRES_DB: nivora_park
POSTGRES_USER: nivora_user
POSTGRES_PASSWORD: nivora_password
```

### Volumes

| Volume | Purpose | Location |
|--------|---------|----------|
| `nivora_postgres_data` | Database persistence | `/var/lib/postgresql/data` |
| `nivora_redis_data` | Cache persistence | `/data` |
| `nivora_prometheus_data` | Metrics persistence | `/prometheus` |
| `nivora_elasticsearch_data` | Log persistence | `/usr/share/elasticsearch/data` |

## 🛠️ Development

### Local Development
```bash
# Start only required services
docker-compose up -d nivora-db nivora-redis

# Run app locally
npm run dev
```

### Production Build
```bash
# Build production image
docker-compose build nivora-dashboard

# Start production stack
docker-compose up -d
```

## 📈 Monitoring & Logging

### Prometheus Metrics
- **Dashboard:** http://localhost:9090
- **Targets:** All services with health checks
- **Alerts:** Configurable alerting rules

### Logging
- **Elasticsearch:** http://localhost:9200
- **Log Format:** JSON structured logging
- **Retention:** Configurable log retention

### Health Checks
All services include health checks:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## 🔒 Security

### Network Security
- External network isolation
- Service-to-service communication only
- No direct external access to internal services

### Application Security
- Rate limiting on API endpoints
- Security headers in Nginx
- Input validation and sanitization
- SQL injection protection

### Database Security
- Encrypted passwords using pgcrypto
- Role-based access control
- Connection pooling
- Audit logging

## 📝 Database Schema

### Tables
- `users` - System users and authentication
- `terminals` - Parking terminal management
- `vehicles` - Vehicle tracking and parking
- `transactions` - Payment transactions
- `payment_methods` - Available payment options
- `rate_configs` - Parking rate configurations
- `system_logs` - Application logging

### Sample Data
- Default admin user: `admin@nivora.com` / `admin123`
- 4 parking terminals (A1, A2, B1, B2)
- Payment methods (QRIS, Cash, E-Wallet, Credit Card)
- Rate configurations for cars and motorcycles

## 🚨 Troubleshooting

### Common Issues

#### 1. Network Issues
```bash
# Check network exists
docker network ls | grep shared-network

# Create network if missing
docker network create shared-network
```

#### 2. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000

# Stop conflicting services
sudo systemctl stop apache2 nginx
```

#### 3. Database Connection
```bash
# Check database logs
docker-compose logs nivora-db

# Connect to database
docker-compose exec nivora-db psql -U nivora_user -d nivora_park
```

#### 4. Application Issues
```bash
# Check application logs
docker-compose logs nivora-dashboard

# Restart application
docker-compose restart nivora-dashboard
```

### Log Locations
- **Application:** `docker-compose logs nivora-dashboard`
- **Database:** `docker-compose logs nivora-db`
- **Nginx:** `docker-compose logs nivora-api`
- **Monitoring:** `docker-compose logs nivora-monitoring`

## 🔄 Maintenance

### Backup Database
```bash
# Create backup
docker-compose exec nivora-db pg_dump -U nivora_user nivora_park > backup.sql

# Restore backup
docker-compose exec -T nivora-db psql -U nivora_user nivora_park < backup.sql
```

### Update Application
```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose build nivora-dashboard
docker-compose up -d nivora-dashboard
```

### Scale Services
```bash
# Scale dashboard instances
docker-compose up -d --scale nivora-dashboard=3
```

## 📞 Support

For issues and questions:
- Check logs: `docker-compose logs`
- Health checks: `docker-compose ps`
- Network connectivity: `docker network inspect shared-network`

---

**Nivora Park Dashboard** - Complete parking management solution with Docker deployment! 🚗💳📊 