#!/bin/bash

# Nivora Park Dashboard Deployment Script
# This script automates the deployment of the Nivora Park Dashboard

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

# Function to check ports
check_ports() {
    local ports=("3000" "80" "5432" "6379" "9090" "9200")
    local conflicts=()
    
    for port in "${ports[@]}"; do
        if netstat -tulpn 2>/dev/null | grep -q ":$port "; then
            conflicts+=("$port")
        fi
    done
    
    if [ ${#conflicts[@]} -ne 0 ]; then
        print_warning "Port conflicts detected: ${conflicts[*]}"
        read -p "Do you want to continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled"
            exit 1
        fi
    fi
}

# Function to build and start services
deploy_services() {
    print_status "Building and starting services..."
    
    # Build the dashboard image
    print_status "Building nivora-dashboard image..."
    docker-compose build nivora-dashboard
    
    # Start all services
    print_status "Starting all services..."
    docker-compose up -d
    
    print_success "Services started successfully"
}

# Function to wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database
    print_status "Waiting for database..."
    timeout=60
    while ! docker-compose exec -T nivora-db pg_isready -U nivora_user -d nivora_park > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Database failed to start within 60 seconds"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    print_success "Database is ready"
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    timeout=30
    while ! docker-compose exec -T nivora-redis redis-cli ping > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Redis failed to start within 30 seconds"
            exit 1
        fi
        sleep 1
        timeout=$((timeout - 1))
    done
    print_success "Redis is ready"
    
    # Wait for dashboard
    print_status "Waiting for dashboard..."
    timeout=120
    while ! curl -f http://localhost:3000 > /dev/null 2>&1; do
        if [ $timeout -le 0 ]; then
            print_error "Dashboard failed to start within 120 seconds"
            exit 1
        fi
        sleep 2
        timeout=$((timeout - 2))
    done
    print_success "Dashboard is ready"
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    
    echo
    print_status "Service URLs:"
    echo "  Dashboard:     http://localhost:3000"
    echo "  API Gateway:   http://localhost:80"
    echo "  Database:      localhost:5432"
    echo "  Redis:         localhost:6379"
    echo "  Monitoring:    http://localhost:9090"
    echo "  Logging:       http://localhost:9200"
    
    echo
    print_status "Default Credentials:"
    echo "  Admin User:    admin@nivora.com"
    echo "  Password:      admin123"
}

# Function to show logs
show_logs() {
    print_status "Recent logs from all services:"
    docker-compose logs --tail=20
}

# Function to stop services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down -v

    # Be careful with docker system prune: it's destructive and can remove images/volumes
    # Prompt the user for confirmation before running it interactively.
    # Allow non-interactive mode via AUTO_PRUNE=yes environment variable
    if [[ "$AUTO_PRUNE" == "yes" ]]; then
        print_warning "AUTO_PRUNE=yes detected; running docker system prune -f (destructive)..."
        docker system prune -f
        print_success "Docker system prune completed"
    else
        read -p "Do you want to run 'docker system prune -f'? This will remove unused images, containers, networks, and volumes. (type 'yes' to proceed): " -r
        echo
        if [[ $REPLY == "yes" ]]; then
            print_warning "Running docker system prune -f (destructive)..."
            docker system prune -f
            print_success "Docker system prune completed"
        else
            print_status "Skipped docker system prune"
        fi
    fi

    print_success "Cleanup completed"
}

# Main deployment function
main() {
    echo "🚗 Nivora Park Dashboard Deployment"
    echo "=================================="
    echo
    
    # Check prerequisites
    check_docker
    create_network
    check_ports
    
    # Deploy services
    deploy_services
    
    # Wait for services
    wait_for_services
    
    # Show status
    show_status
    
    echo
    print_success "Deployment completed successfully!"
    echo
    print_status "Useful commands:"
    echo "  View logs:     ./scripts/deploy.sh logs"
    echo "  Stop services: ./scripts/deploy.sh stop"
    echo "  Cleanup:       ./scripts/deploy.sh cleanup"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "stop")
        stop_services
        ;;
    "cleanup")
        cleanup
        ;;
    "restart")
        stop_services
        sleep 2
        main
        ;;
    *)
        echo "Usage: $0 {deploy|logs|status|stop|cleanup|restart}"
        echo
        echo "Commands:"
        echo "  deploy   - Deploy all services (default)"
        echo "  logs     - Show recent logs"
        echo "  status   - Show service status and URLs"
        echo "  stop     - Stop all services"
        echo "  cleanup  - Stop services and clean up volumes"
        echo "  restart  - Restart all services"
        exit 1
        ;;
esac 