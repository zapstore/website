---
title: NIPs
---

New event types were necessary to model applications and releases on Zapstore.

```mermaid
erDiagram
    App ||--o{ Release : makes
    Release ||--|{ FileMetadata : contains
    App }|..|{ AppCurationSet : uses
```