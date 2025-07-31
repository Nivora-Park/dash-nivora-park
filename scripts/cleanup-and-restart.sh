#!/bin/bash

# Cleanup and Restart Script for Nivora Park Services
# This script cleans up problematic containers and restarts services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to stop all services
stop_all_services() {
    print_status "Stopping all services..."
    
    # Stop services in reverse order
    docker-compose -f docker-compose.yml down 2>/dev/null || true
    docker-compose -f docker-compose.elasticsearch.yml down 2>/dev/null || true
    docker-compose -f docker-compose.prometheus.yml down --remove-orphans 2>/dev/null || true
    docker-compose -f docker-compose.redis.yml down 2>/dev/null || true
    
    print_success "All services stopped"
}

# Function to clean up problematic containers
cleanup_containers() {
    print_status "Cleaning up problematic containers..."
    
    # Stop and remove all nivora containers
    docker ps -q --filter "name=nivora" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=nivora" | xargs -r docker rm 2>/dev/null || true
    
    # Remove any containers with grafana in the name
    docker ps -q --filter "name=grafana" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=grafana" | xargs -r docker rm 2>/dev/null || true
    
    # Remove any containers with monitoring in the name
    docker ps -q --filter "name=monitoring" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=monitoring" | xargs -r docker rm 2>/dev/null || true
    
    # Remove any containers with redis in the name
    docker ps -q --filter "name=redis" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=redis" | xargs -r docker rm 2>/dev/null || true
    
    # Remove any containers with elasticsearch in the name
    docker ps -q --filter "name=elasticsearch" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=elasticsearch" | xargs -r docker rm 2>/dev/null || true
    
    # Remove any containers with kibana in the name
    docker ps -q --filter "name=kibana" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=kibana" | xargs -r docker rm 2>/dev/null || true
    
    # Remove any containers with logstash in the name
    docker ps -q --filter "name=logstash" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=logstash" | xargs -r docker rm 2>/dev/null || true
    
    print_success "Problematic containers cleaned up"
}

# Function to clean up volumes
cleanup_volumes() {
    print_status "Cleaning up volumes..."
    
    # Remove volumes that might be causing issues
    docker volume rm nivora_grafana_data 2>/dev/null || true
    docker volume rm nivora_prometheus_data 2>/dev/null || true
    docker volume rm nivora_redis_data 2>/dev/null || true
    docker volume rm nivora_elasticsearch_data 2>/dev/null || true
    
    print_success "Volumes cleaned up"
}

# Function to start services in correct order
start_services() {
    print_status "Starting services in correct order..."
    
    # Start Redis first
    print_status "Starting Redis..."
    docker-compose -f docker-compose.redis.yml up -d
    sleep 5
    
    # Start Elasticsearch
    print_status "Starting Elasticsearch..."
    docker-compose -f docker-compose.elasticsearch.yml up -d
    sleep 10
    
    # Start Prometheus (with Grafana)
    print_status "Starting Prometheus and Grafana..."
    docker-compose -f docker-compose.prometheus.yml up -d
    sleep 5
    
    # Start Dashboard last
    print_status "Starting Dashboard..."
    docker-compose -f docker-compose.yml up -d
    sleep 5
    
    print_success "All services started successfully"
}

# Function to verify services
verify_services() {
    print_status "Verifying services..."
    
    local services=(
        "nivora-redis:6379"
        "nivora-elasticsearch:9200"
        "nivora-monitoring:9090"
        "nivora-grafana:3002"
        "nivora-dashboard:3001"
    )
    
    for service in "${services[@]}"; do
        local container=$(echo $service | cut -d: -f1)
        local port=$(echo $service | cut -d: -f2)
        
        if docker ps | grep -q "$container"; then
            print_success "$container is running"
        else
            print_error "$container is not running"
        fi
    done
}

# Function to show service URLs
show_urls() {
    echo
    print_status "Service URLs:"
    echo "  Dashboard:     http://localhost:3001"
    echo "  Redis:         localhost:6379"
    echo "  Prometheus:    http://localhost:9090"
    echo "  Grafana:       http://localhost:3002 (admin/nivora_grafana_password)"
    echo "  Elasticsearch: http://localhost:9200"
    echo "  Kibana:        http://localhost:5601"
    echo "  Logstash:      localhost:5044"
    echo
    print_status "Credentials:"
    echo "  Grafana:       admin/nivora_grafana_password"
    echo "  Redis:         nivora_redis_password"
}

# Main function
main() {
    echo "🧹 Nivora Park Cleanup and Restart"
    echo "==================================="
    echo
    
    # Stop all services
    stop_all_services
    
    # Clean up containers
    cleanup_containers
    
    # Clean up volumes
    cleanup_volumes
    
    # Start services
    start_services
    
    # Verify services
    verify_services
    
    # Show URLs
    show_urls
    
    echo
    print_success "Cleanup and restart completed!"
    echo
    print_status "If you still have issues, try:"
    echo "  docker system prune -f"
    echo "  docker volume prune -f"
    echo "  ./scripts/manage-services.sh restart all"
}

# Run main function
main "$@" 