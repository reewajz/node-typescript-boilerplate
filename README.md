# ETL State Manager

ETL State Manager is a Node.js application built with TypeScript. It provides a boilerplate for managing ETL (Extract, Transform, Load) processes.

## Features

- TypeScript support
- ESLint and Prettier for code quality and formatting
- Docker support for development and production
- Jest for testing
- SWC for fast TypeScript compilation

## Getting Started

### Prerequisites

- Node.js 16.x
- Docker (optional, for containerized development and deployment)

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    cd etl-state-manager
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

### Running the Application

#### Development

To start the application in development mode with hot-reloading:

```sh
npm run dev
```

To run the application in a Docker container for development:
```sh
    docker-compose -f docker-compose.yml -f Dockerfile.dev up
    ```
    

#### Production

To build and start the application in production mode:
```sh
npm run build
npm start
```

To build and run the application in a Docker container for production:
    ```sh 
    docker build -f Dockerfile.prod -t etl-state-manager .
    docker run -p 3000:3000 etl-state-manager
    ```


#### Testing
```sh
npm test
```


#### Linting
```sh
npm run lint
```
To automatically fix linting issues:
```sh
npm run lint:fix
```
