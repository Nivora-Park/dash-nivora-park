#!/bin/bash

# Restart Elasticsearch Services Script
# This script restarts Elasticsearch, Kibana, and Logstash with corrected configuration

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

# Function to stop Elasticsearch services
stop_elasticsearch_services() {
    print_status "Stopping Elasticsearch services..."
    docker-compose -f docker-compose.elasticsearch.yml down --remove-orphans
    print_success "Elasticsearch services stopped"
}

# Function to clean up Elasticsearch containers
cleanup_elasticsearch_containers() {
    print_status "Cleaning up Elasticsearch containers..."
    
    # Stop and remove all elasticsearch related containers
    docker ps -q --filter "name=nivora-elasticsearch" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=nivora-elasticsearch" | xargs -r docker rm 2>/dev/null || true
    docker ps -q --filter "name=nivora-kibana" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=nivora-kibana" | xargs -r docker rm 2>/dev/null || true
    docker ps -q --filter "name=nivora-logstash" | xargs -r docker stop 2>/dev/null || true
    docker ps -aq --filter "name=nivora-logstash" | xargs -r docker rm 2>/dev/null || true
    
    print_success "Elasticsearch containers cleaned up"
}

# Function to start Elasticsearch services
start_elasticsearch_services() {
    print_status "Starting Elasticsearch services..."
    
    # Start Elasticsearch first
    print_status "Starting Elasticsearch..."
    docker-compose -f docker-compose.elasticsearch.yml up -d nivora-elasticsearch
    sleep 10
    
    # Wait for Elasticsearch to be ready
    print_status "Waiting for Elasticsearch to be ready..."
    timeout=60
    while ! curl -f http://localhost:9200/_cluster/health > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Elasticsearch failed to start within 60 seconds"
            exit 1
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    print_success "Elasticsearch is ready"
    
    # Start Kibana
    print_status "Starting Kibana..."
    docker-compose -f docker-compose.elasticsearch.yml up -d nivora-kibana
    sleep 10
    
    # Start Logstash
    print_status "Starting Logstash..."
    docker-compose -f docker-compose.elasticsearch.yml up -d nivora-logstash
    sleep 5
    
    print_success "All Elasticsearch services started successfully"
}

# Function to verify Elasticsearch services
verify_elasticsearch_services() {
    print_status "Verifying Elasticsearch services..."
    
    local services=(
        "nivora-elasticsearch:9200"
        "nivora-kibana:5601"
        "nivora-logstash:9600"
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

# Function to show Elasticsearch URLs
show_elasticsearch_urls() {
    echo
    print_status "Elasticsearch Service URLs:"
    echo "  Elasticsearch: http://localhost:9200"
    echo "  Kibana:        http://localhost:5601"
    echo "  Logstash:      localhost:5044, localhost:5001"
    echo
    print_status "No authentication required (security disabled)"
}

# Main function
main() {
    echo "🔍 Elasticsearch Services Restart"
    echo "================================="
    echo
    
    # Stop services
    stop_elasticsearch_services
    
    # Clean up containers
    cleanup_elasticsearch_containers
    
    # Start services
    start_elasticsearch_services
    
    # Verify services
    verify_elasticsearch_services
    
    # Show URLs
    show_elasticsearch_urls
    
    echo
    print_success "Elasticsearch services restarted successfully!"
    echo
    print_status "You can now access:"
    echo "  Elasticsearch: http://localhost:9200"
    echo "  Kibana:        http://localhost:5601"
}

# Run main function
main "$@" 