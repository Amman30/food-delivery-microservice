# Food Delivery Microservices System

A scalable food delivery platform built with NestJS microservices architecture. The system consists of multiple services communicating via Kafka for event-driven architecture, with PostgreSQL as the primary database and Redis for caching.

## Tech Stack

- **Framework**: NestJS
- **Event Streaming**: Apache Kafka
- **Database**: PostgreSQL
- **Cache**: Redis
- **Containerization**: Docker
- **API Gateway**: NestJS (food-delivery-service)
- **Services**:
  - User Service
  - Restaurant Service
  - Delivery Service

## Features

- Restaurant menu management
- Order processing workflow
- Delivery agent assignment
- Real-time status updates via Kafka
- Distributed transaction handling
- Containerized deployment

### Prerequisites

- Node.js v19+
- Docker & Docker Compose
- npm v10+
- Kafka (included in Docker setup)
- redis (Optional)

### Installation

```bash
# Clone repository
git clone https://github.com/Amman30/food-delivery-system.git
cd food-delivery-system

# Install dependencies
npm install
```
### Running the Application

```bash
# Start all services in development mode
npm run start:dev

# Individual services
npm run start:user        # User service
npm run start:restaurant  # Restaurant service
npm run start:delivery    # Delivery service
npm run start:gateway     # API Gateway
```

### Production Build
```bash
# Build all services
npm run build:user
npm run build:restaurant
npm run build:delivery
npm run build:gateway

# Start production
npm run start:prod
```
### Docker Deployment
```bash 
# Start all services with dependencies (Kafka, Postgres, Redis)
docker-compose up --build

# Stop and remove containers
docker-compose down
```


### API Endpoints

Service	Port	Base URL
API Gateway	3000	http://localhost:3000
User Service	3001	http://localhost:3001
Restaurant Service	3002	http://localhost:3002
Delivery Service	3003	http://localhost:3003


### Swagger 
#### Access Swagger documentation at /api endpoint for each service.
