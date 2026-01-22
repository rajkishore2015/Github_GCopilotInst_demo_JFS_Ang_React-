---
applyTo: "**/*.java"
---
# Copilot Instructions — Spring Boot 3 (JDK 21) Microservice API

## Scope
These instructions apply to all generated code, tests, and documentation in this workspace.

## Platform & Tooling
- Java: JDK 21.
- Framework: Spring Boot (microservice API).
- Database: H2 SQL (in-memory by default).
- Unit tests: Spock framework (Groovy).
- Coverage gate: **minimum 90%** on unit tests whenever code is generated.

## Java Instructions (Current)
- Use Java 21 language features only.
- Base package is `com.wipro.api` and all subpackages must follow this root.
- Use constructor injection; avoid field injection.
- Prefer records for DTOs; entities remain POJOs.
- Use Jakarta Validation for request validation.
- Use Spring Boot 3.x starters; dependencies declared in Maven `pom.xml`.

## React JS Instructions (Current)
- Use the latest stable React with TypeScript.
- Prefer functional components and hooks.
- Keep components small and reusable; avoid prop drilling (use context when needed).
- Use a modern bundler (Vite) and ES modules.
- Unit testing: React Testing Library + Jest/Vitest.
- Coverage gate: **minimum 90%** and generate coverage report via `npm run test:coverage`.
- Coverage reports must be produced in a human-readable HTML format.
- Optimize for performance: memoize expensive computations, avoid unnecessary re-renders.
- Include `@vitest/coverage-v8` and enable `test.globals = true` to support `@testing-library/jest-dom` in setup files.
- Enforce coverage thresholds (lines/statements/functions/branches ≥ 90) in `vite.config.ts`.

## Angular Instructions (Current)
- Use the latest stable Angular with TypeScript and standalone components.
- Prefer signals and `OnPush` change detection where appropriate.
- Keep components small and reusable; use services for business logic.
- Use Angular CLI or Vite-equivalent tooling when available.
- Unit testing: Karma **only** (no Jest/Vitest for Angular).
- Coverage gate: **minimum 90%** and generate coverage report via `npm run test:coverage`.
- Coverage reports must be produced in a human-readable HTML format (coverage/index.html), matching the React UI report format.
- Optimize for performance: trackBy in lists, avoid unnecessary change detection, and use memoization helpers where applicable.
- Pin TypeScript to a version compatible with Angular CLI (e.g., `5.5.x` for Angular 18.x).
- Ensure `zone.js` is listed in Angular build polyfills, and `zone.js` + `zone.js/testing` in Karma test polyfills to avoid `Zone is not defined` errors.
- Use a custom `ChromeHeadlessNoSandbox` launcher (base `ChromeHeadless`) with `singleRun: true` and increased Karma timeouts to prevent browser disconnects during coverage runs.
- Ensure `karma.conf.js` includes `@angular-devkit/build-angular/plugins/karma` in `plugins` and `@angular-devkit/build-angular` in `frameworks` so Karma discovers specs and builds properly.
- Ensure test bootstrap exists at `src/test.ts`, and set `angular.json` test `main` to `src/test.ts` and `tsconfig.spec.json` `files` to include `src/test.ts`.
- Avoid `require.context` in `src/test.ts` (not supported in the current builder). Import spec files directly or use an Angular-supported discovery mechanism.

## API + UI Generation (Required)
- For each Java API functionality, generate a matching React UI feature.
- Keep API and UI in separate top-level folders (e.g., `api/` for Spring Boot, `react-ui/` for React, and `angular-ui/` for Angular).
- Always generate an OpenAPI specification for the Java API (OpenAPI 3.x) alongside the API code.
- Generation order: **create Java API first**, then React UI, then Angular UI.

## 12-Factor Compliance (Required)
1. **Codebase**: One repo per service. Keep all microservice code here.
2. **Dependencies**: Declare explicitly via build tool (Maven/Gradle). No unmanaged JARs.
3. **Config**: Store configuration in environment variables. Use `application.yml` to map env vars with defaults.
4. **Backing Services**: Treat DB and external services as attached resources. Use config to swap.
5. **Build, Release, Run**: Separate stages. Provide clear build/run steps and immutable artifacts.
6. **Processes**: Stateless services. No local persistence except H2 for dev/test.
7. **Port Binding**: Expose HTTP via embedded server (Spring Boot defaults).
8. **Concurrency**: Scale via process model; avoid in-process state.
9. **Disposability**: Fast startup/shutdown. Handle SIGTERM gracefully.
10. **Dev/Prod Parity**: Keep environments similar; use H2 for dev/test only.
11. **Logs**: Log to stdout/stderr. No file logs by default.
12. **Admin Processes**: Run admin tasks as one-off processes.

## Naming Conventions (Strict)
- Base package **must** be `com.wipro.api`.
- Controller classes **must** end with `Cntl`.
- Service classes **must** end with `Sve`.
- Repository classes **must** end with `Repo`.
- Entity/Bean classes **must** be simple POJOs.
- Composite primary key classes **must** end with `Cp`.

## Architecture Guidance
- Use layered architecture: `Cntl` → `Sve` → `Repo`.
- DTOs for request/response; validate inputs with Jakarta Validation.
- Use `@RestController`, `@Service`, `@Repository`, `@Entity` appropriately.
- Prefer constructor injection; avoid field injection.
- Keep services thin and transactional; repositories for data access only.

## Database Requirements (H2)
- Default to H2 in-memory for dev/test.
- Use `spring.jpa.hibernate.ddl-auto=update` for dev; use migrations if applicable.
- Enable H2 console for dev only.

## Testing (Spock)
- All new functionality must include Spock unit tests.
- Minimum **90% unit test coverage** is required (coverage gating).
- Use BDD-style `given/when/then` blocks.
- Mock dependencies with Spock `Mock()` or `Stub()`.
- Name Spock tests with `*Spec.groovy` and run coverage via `mvn verify` to enforce the gate.

## Code Generation Rules
- Do not generate code without corresponding Spock tests.
- Ensure each public method has at least one unit test.
- Keep methods small, single-responsibility.
- Use meaningful names and consistent package structure.
- Whenever creating an application, generate a **Maven** build file and include Spring Boot microservice scaffolding with controller, service, repository, and bean classes, each with corresponding Spock tests, plus an application bootstrap (`*App`) context test.

## Build & Test Fixes (Required for Future Services)
- Configure Maven Surefire to include Spock specs (`**/*Spec.groovy`) so tests run and JaCoCo gets execution data.
- Run coverage with `mvn verify` (not just `mvn test`) to enforce the 90% coverage gate.
- Prefer controller unit tests that do not require `spock-spring` (mock the service directly and assert `ResponseEntity`).
- Repository tests must bootstrap Spring (`@SpringBootTest`) to enable `@Autowired` repositories with H2.

## Cross-Stack Fixes & Guardrails (Required)
- If test runs show missing typings (e.g., Angular/RxJS), restore dependencies using `npm ci` to align with `package-lock.json` and avoid type resolution errors.
- Do not change coverage thresholds unless explicitly requested; if temporarily lowered to unblock a run, restore to the documented 90% gate before final delivery.

## Example Package Layout
- `com.wipro.api.cntl` — controllers
- `com.wipro.api.sve` — services
- `com.wipro.api.repo` — repositories
- `com.wipro.api.model` — entities/POJOs
- `com.wipro.api.model.key` — composite key classes (`*Cp`)
- `com.wipro.api.dto` — request/response DTOs

## Code Style
- Use Java records for DTOs when appropriate.
- Use Lombok only if already configured; otherwise plain Java.
- Include JavaDoc for public APIs when non-trivial.

## Security & Validation
- Validate all incoming requests.
- Fail fast on invalid input.
- Avoid leaking internal errors; return proper HTTP statuses.

## Observability
- Use structured logs where possible.
- Include request IDs if already supported by the platform.

## Deliverables Checklist
- [ ] Controller ends with `Cntl`
- [ ] Service ends with `Sve`
- [ ] Repository ends with `Repo`
- [ ] POJOs for beans/entities
- [ ] Composite key ends with `Cp` (when applicable)
- [ ] H2 database configured
- [ ] Spock unit tests added
- [ ] 90%+ unit test coverage gate
- [ ] 12-factor compliance considered

## Documentation & Repo Hygiene (Required)
- Maintain a root `README.md` describing the repo layout, prerequisites, run steps, and test/coverage commands for API, Angular, and React.
- Maintain a `README.md` in each tech stack folder (`api/`, `angular-ui/`, `react-ui/`) with install/run/test/coverage steps.
- Maintain a root `.gitignore` covering OS files, Node artifacts, Java/Maven artifacts, build outputs, coverage, and IDE files.
- Maintain per-folder `.gitignore` files for `api/`, `angular-ui/`, and `react-ui/` to keep stack-specific noise out of commits.
