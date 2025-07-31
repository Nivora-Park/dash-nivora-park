#!/bin/bash

# Nivora Park Services Management Script
# This script manages all the separated Docker Compose services

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

# Function to start Redis service
start_redis() {
    print_status "Starting Redis service..."
    docker-compose -f docker-compose.redis.yml up -d
    print_success "Redis service started"
}

# Function to start Prometheus service
start_prometheus() {
    print_status "Starting Prometheus service..."
    docker-compose -f docker-compose.prometheus.yml up -d
    print_success "Prometheus service started"
}

# Function to start Elasticsearch service
start_elasticsearch() {
    print_status "Starting Elasticsearch service..."
    docker-compose -f docker-compose.elasticsearch.yml up -d
    print_success "Elasticsearch service started"
}

# Function to start Dashboard service
start_dashboard() {
    print_status "Starting Dashboard service..."
    docker-compose -f docker-compose.yml up -d
    print_success "Dashboard service started"
}

# Function to start all services
start_all() {
    print_status "Starting all services..."
    start_redis
    sleep 5
    start_prometheus
    sleep 5
    start_elasticsearch
    sleep 10
    start_dashboard
    print_success "All services started"
}

# Function to stop Redis service
stop_redis() {
    print_status "Stopping Redis service..."
    docker-compose -f docker-compose.redis.yml down
    print_success "Redis service stopped"
}

# Function to stop Prometheus service
stop_prometheus() {
    print_status "Stopping Prometheus service..."
    docker-compose -f docker-compose.prometheus.yml down
    print_success "Prometheus service stopped"
}

# Function to stop Elasticsearch service
stop_elasticsearch() {
    print_status "Stopping Elasticsearch service..."
    docker-compose -f docker-compose.elasticsearch.yml down
    print_success "Elasticsearch service stopped"
}

# Function to stop Dashboard service
stop_dashboard() {
    print_status "Stopping Dashboard service..."
    docker-compose -f docker-compose.yml down
    print_success "Dashboard service stopped"
}

# Function to stop all services
stop_all() {
    print_status "Stopping all services..."
    stop_dashboard
    stop_elasticsearch
    stop_prometheus
    stop_redis
    print_success "All services stopped"
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    echo
    echo "Dashboard Service:"
    docker-compose -f docker-compose.yml ps
    echo
    echo "Redis Service:"
    docker-compose -f docker-compose.redis.yml ps
    echo
    echo "Prometheus Service:"
    docker-compose -f docker-compose.prometheus.yml ps
    echo
    echo "Elasticsearch Service:"
    docker-compose -f docker-compose.elasticsearch.yml ps
    
    echo
    print_status "Service URLs:"
    echo "  Dashboard:     http://localhost:3001"
    echo "  Redis:         localhost:6379"
    echo "  Prometheus:    http://localhost:9090"
    echo "  Grafana:       http://localhost:3002 (admin/nivora_grafana_password)"
    echo "  Elasticsearch: http://localhost:9200"
    echo "  Kibana:        http://localhost:5601"
    echo "  Logstash:      localhost:5044"
}

# Function to show logs
show_logs() {
    local service=${1:-all}
    
    case $service in
        "dashboard")
            print_status "Dashboard logs:"
            docker-compose -f docker-compose.yml logs --tail=20
            ;;
        "redis")
            print_status "Redis logs:"
            docker-compose -f docker-compose.redis.yml logs --tail=20
            ;;
        "prometheus")
            print_status "Prometheus logs:"
            docker-compose -f docker-compose.prometheus.yml logs --tail=20
            ;;
        "elasticsearch")
            print_status "Elasticsearch logs:"
            docker-compose -f docker-compose.elasticsearch.yml logs --tail=20
            ;;
        "all"|*)
            print_status "All services logs:"
            echo "=== Dashboard ==="
            docker-compose -f docker-compose.yml logs --tail=10
            echo "=== Redis ==="
            docker-compose -f docker-compose.redis.yml logs --tail=10
            echo "=== Prometheus ==="
            docker-compose -f docker-compose.prometheus.yml logs --tail=10
            echo "=== Elasticsearch ==="
            docker-compose -f docker-compose.elasticsearch.yml logs --tail=10
            ;;
    esac
}

# Function to restart service
restart_service() {
    local service=$1
    case $service in
        "dashboard")
            stop_dashboard
            sleep 2
            start_dashboard
            ;;
        "redis")
            stop_redis
            sleep 2
            start_redis
            ;;
        "prometheus")
            stop_prometheus
            sleep 2
            start_prometheus
            ;;
        "elasticsearch")
            stop_elasticsearch
            sleep 2
            start_elasticsearch
            ;;
        "all")
            stop_all
            sleep 5
            start_all
            ;;
        *)
            print_error "Unknown service: $service"
            exit 1
            ;;
    esac
}

# Function to clean up
cleanup() {
    print_status "Cleaning up all services and volumes..."
    docker-compose -f docker-compose.yml down -v
    docker-compose -f docker-compose.redis.yml down -v
    docker-compose -f docker-compose.prometheus.yml down -v
    docker-compose -f docker-compose.elasticsearch.yml down -v
    docker system prune -f
    print_success "Cleanup completed"
}

# Function to build dashboard
build_dashboard() {
    print_status "Building dashboard image..."
    docker-compose -f docker-compose.yml build
    print_success "Dashboard image built"
}

# Main function
main() {
    echo "🚗 Nivora Park Services Management"
    echo "=================================="
    echo
    
    # Check prerequisites
    check_docker
    create_network
    
    # Execute command
    case "${1:-help}" in
        "start")
            case "${2:-all}" in
                "dashboard") start_dashboard ;;
                "redis") start_redis ;;
                "prometheus") start_prometheus ;;
                "elasticsearch") start_elasticsearch ;;
                "all"|*) start_all ;;
            esac
            ;;
        "stop")
            case "${2:-all}" in
                "dashboard") stop_dashboard ;;
                "redis") stop_redis ;;
                "prometheus") stop_prometheus ;;
                "elasticsearch") stop_elasticsearch ;;
                "all"|*) stop_all ;;
            esac
            ;;
        "restart")
            restart_service "${2:-all}"
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "${2:-all}"
            ;;
        "build")
            build_dashboard
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|*)
            echo "Usage: $0 {start|stop|restart|status|logs|build|cleanup} [service]"
            echo
            echo "Commands:"
            echo "  start [service]     - Start service(s) (dashboard|redis|prometheus|elasticsearch|all)"
            echo "  stop [service]      - Stop service(s) (dashboard|redis|prometheus|elasticsearch|all)"
            echo "  restart [service]   - Restart service(s) (dashboard|redis|prometheus|elasticsearch|all)"
            echo "  status              - Show status of all services"
            echo "  logs [service]      - Show logs (dashboard|redis|prometheus|elasticsearch|all)"
            echo "  build               - Build dashboard image"
            echo "  cleanup             - Stop all services and clean up volumes"
            echo
            echo "Examples:"
            echo "  $0 start all              # Start all services"
            echo "  $0 start redis            # Start only Redis"
            echo "  $0 logs dashboard         # Show dashboard logs"
            echo "  $0 restart prometheus     # Restart Prometheus"
            exit 1
            ;;
    esac
}

# Run main function
main "$@" 