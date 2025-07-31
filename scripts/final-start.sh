#!/bin/bash

# Final Startup Script for Nivora Park Services
# This script starts all services in the correct order

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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Function to create external network
create_network() {
    if ! docker network ls | grep -q "shared-network"; then
        print_status "Creating shared-network..."
        docker network create shared-network
        print_success "Network shared-network created"
    else
        print_success "Network shared-network already exists"
    fi
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

# Function to clean up containers
cleanup_containers() {
    print_status "Cleaning up containers..."
    
    # Stop and remove all nivora containers
    docker ps -q --filter "name=nivora" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=nivora" | xargs -r docker rm 2>/dev/null || true
    
    print_success "Containers cleaned up"
}

# Function to start services in correct order
start_services() {
    print_status "Starting services in correct order..."
    
    # Start Redis first
    print_status "Starting Redis..."
    docker-compose -f docker-compose.redis.yml up -d
    sleep 5
    
    # Wait for Redis to be ready
    print_status "Waiting for Redis to be ready..."
    timeout=30
    while ! docker exec nivora-redis redis-cli -a nivora_redis_password ping > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Redis failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    print_success "Redis is ready"
    
    # Start Elasticsearch
    print_status "Starting Elasticsearch..."
    docker-compose -f docker-compose.elasticsearch.yml up -d
    sleep 10
    
    # Start Prometheus (with Grafana)
    print_status "Starting Prometheus and Grafana..."
    docker-compose -f docker-compose.prometheus.yml up -d
    sleep 5
    
    # Start Dashboard last (after Redis is ready)
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
    echo "  Logstash:      localhost:5044, localhost:5001"
    echo
    print_status "Credentials:"
    echo "  Grafana:       admin/nivora_grafana_password"
    echo "  Redis:         nivora_redis_password"
}

# Main function
main() {
    echo "🚀 Nivora Park Final Startup"
    echo "============================"
    echo
    
    # Check prerequisites
    check_docker
    create_network
    
    # Stop all services
    stop_all_services
    
    # Clean up containers
    cleanup_containers
    
    # Start services
    start_services
    
    # Verify services
    verify_services
    
    # Show URLs
    show_urls
    
    echo
    print_success "All services started successfully!"
    echo
    print_status "You can now access:"
    echo "  Dashboard: http://localhost:3001"
    echo "  Grafana:   http://localhost:3002"
    echo "  Prometheus: http://localhost:9090"
}

# Run main function
main "$@" 