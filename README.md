# Multi-Stack User App

This repository contains a Spring Boot API and two front-end implementations (Angular and React).

## Repository Layout
- api/ — Spring Boot 3 (JDK 21) microservice API
- angular-ui/ — Angular 18 standalone UI
- react-ui/ — React + Vite UI

## Prerequisites
- Node.js 20+ and npm
- Java 21 (JDK)
- Maven 3.9+

## Quick Start
### API
```bash
cd api
mvn spring-boot:run
```

### Angular UI
```bash
cd angular-ui
npm install
npm start
```

### React UI
```bash
cd react-ui
npm install
npm run dev
```

## Tests & Coverage
### API (Spock)
```bash
cd api
mvn verify
```

### Angular
```bash
cd angular-ui
npm test -- --code-coverage --watch=false
```
Coverage report: angular-ui/coverage/index.html

### React
```bash
cd react-ui
npm run test:coverage
```
Coverage report: react-ui/coverage/index.html
