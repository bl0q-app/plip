# 🗺️ Roadmap & Features

This page outlines the current features, planned enhancements, version history, and language support roadmap for Plip Logger.

## 📌 Current Version

**Plip v1.1.0** (Released June 2025)

## ⭐ Feature Overview

### ✨ Core Features

- Colorful logger with emoji support
- Seven distinct log levels (info, success, warn, error, debug, trace, verbose)
- Smart terminal color and emoji detection
- Fluent API with method chaining
- Full TypeScript support
- Environment-aware logging (Node.js, Bun, Deno, Browser; dev/prod modes)
- Customizable themes (colors, emojis, format)
- Zero-configuration setup

### 🛠️ Technical Capabilities

- Flexible Configuration System (global, per-instance, JSON/programmatic)
- Modular Architecture (core functions, internal modules, optional imports)
- Extensibility (formatter hooks, middleware, console routing)
- Testing & Debugging Support (mocking, snapshotting, debug toggles)
- Broad compatibility (multiple package managers, SSR/CSR)

## 🌍 Language Support

| Language | Status | Expected Release | Package Manager |
|----------|--------|-----------------|-----------------|
| JavaScript/TypeScript | ✅ Available | Current | npm, yarn, pnpm, bun |
| Python | 🚧 In Development | Q4 2025 | pip |
| Java | 📋 Planned | 2026 | Maven, Gradle |
| PHP | 📋 Planned | 2026 | Composer |
| Go | 🔍 Exploring | TBD | Go modules |
| Rust | 🔍 Exploring | TBD | Cargo |
| C# | 🔍 Exploring | TBD | NuGet |
| Ruby | 🔍 Exploring | TBD | RubyGems |

> 💡 **Want your language prioritized?** [Vote or request here!](https://github.com/ru-dr/plip/discussions)

## 🗓️ Planned Features

### ➡️ Next Release (v1.2.0) - Q3 2025

- Built-in metrics collection
- React Native support
- Rotating file transport
- Plugin system for custom transports

### 🔮 Future Releases

- Encrypted logging
- Query language for logs
- Interactive log visualization dashboard
- Real-time log streaming
- OpenTelemetry integration
- Log grouping and timers
- Web-based inspector

## 📜 Version History

### v1.1.0 (Current) - June 2025

- Added enterprise logger patterns
- Improved performance for high-volume environments
- Added Docker and CI/CD integration examples
- Enhanced customization options
- Framework-specific bindings for popular libraries

### v1.0.0 - June 2025

- Initial stable release with core functionality
- Seven log levels (info, success, warn, error, debug, trace, verbose)
- Terminal color and emoji support
- Comprehensive documentation

## 🤝 Contribution Areas

We welcome community contributions in these areas:

- Language ports (help bring Plip to more languages)
- Framework integrations
- Performance improvements
- Documentation and examples
- Testing tools and methodologies

See our [Contributing Guide](../request/contributing.md) to get involved.

## ✔️ Compatibility

Plip aims for broad compatibility across modern JavaScript environments.

| Platform / Technology | Version / Details          | Supported |
|-----------------------|----------------------------|-----------|
| 🟢 Node.js            | 16.x and above             | ✅        |
| 🐰 Bun                | 1.x and above              | ✅        |
| 🦕 Deno               | 1.x and above              | ✅        |
| 🔷 TypeScript         | 4.5+ and above             | ✅        |
| 🌐 Modern Browsers    | Latest ECMAScript features | ✅        |
| 🖥️ SSR Frameworks     | Supported                  | ✅        |
| 📱 CSR Frameworks     | Supported                  | ✅        |

For more detailed compatibility information, see our [Compatibility Guide](../guide/compatibility.md).
