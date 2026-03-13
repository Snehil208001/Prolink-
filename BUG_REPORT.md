# ProLink Bug Report

**Last Updated:** 2026-03-13

Track all known bugs and issues. Update this file when bugs are found or fixed.

---

## Bug Status Legend

| Status | Description |
|--------|-------------|
| 🔴 Open | Bug reported, not yet fixed |
| 🟡 In Progress | Being worked on |
| 🟢 Fixed | Resolved |
| ⚪ Won't Fix | Not planned for fix |

---

## Open Bugs

_No open bugs._

---

## Resolved Bugs

### BUG-010: Gateway → Connection Service 500
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | High |
| **Service** | api-gateway |
| **Location** | `application.yml` |
| **Description** | Connection endpoints returned 500 via gateway but 200 when called directly. lb://CONNECTION-SERVICE resolved to Eureka hostname (Snehil.mshome.net) causing connection issues. |
| **Fix** | Changed connection-service routes from `uri: lb://CONNECTION-SERVICE` to `uri: http://localhost:9030`. For multi-instance: use lb:// with `eureka.instance.prefer-ip-address=true` on connection-service. |
| **Fixed** | 2026-03-13 |

### BUG-001: Hardcoded userId in Post and Like operations
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Medium |
| **Service** | post-service |
| **Location** | `PostController.java`, `LikesController.java` |
| **Description** | `createPost`, `likePost`, and `unlikePost` used hardcoded `userId = 1L` instead of `UserContextHolder.getCurrentUserId()`. |
| **Fix** | Replaced `1L` with `UserContextHolder.getCurrentUserId()`; added null check returning 401 if missing. |
| **Fixed** | 2026-03-13 |

### BUG-006: Post-service UserInterceptor throws 500 on invalid X-User-Id
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Low |
| **Service** | post-service |
| **Location** | `UserInterceptor.java` |
| **Description** | When `X-User-Id` header contained invalid value (e.g. `"abc"`), `Long.valueOf(userId)` threw `NumberFormatException`, causing 500. |
| **Fix** | Wrapped parse in try-catch; on failure, leave UserContextHolder unset. |
| **Fixed** | 2026-03-13 |

### BUG-007: PostService.getPostById NPE when X-User-Id is missing
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Medium |
| **Service** | post-service |
| **Location** | `PostController.java`, `PostService.java` |
| **Description** | When `X-User-Id` was missing, `connectionClient.getFirstConnection(null)` could fail. |
| **Fix** | Controller returns 401 if userId is null; service skips connection call when userId is null. |
| **Fixed** | 2026-03-13 |

### BUG-008: Connection-service route uses hardcoded localhost
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Low |
| **Service** | api-gateway |
| **Location** | `application.yml` |
| **Description** | Connection-service route used `uri: http://localhost:9030` instead of Eureka discovery. |
| **Fix** | Changed to `uri: lb://CONNECTION-SERVICE`. |
| **Fixed** | 2026-03-13 |

### BUG-009: Unused HttpServletRequest parameter
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Low |
| **Service** | post-service |
| **Location** | `PostController.java` |
| **Description** | `createPost` had unused `HttpServletRequest` parameter. |
| **Fix** | Removed the parameter. |
| **Fixed** | 2026-03-13 |

### BUG-002: First Degree returns 500 when Neo4j is down
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Low |
| **Service** | connection-service |
| **Location** | `ConnectionService`, `GlobalExceptionHandler` |
| **Description** | When Neo4j is not running, First Degree endpoint returns 500 instead of a clear error. |
| **Fix** | Added `ServiceUnavailableException` handler to return 503 with message about Neo4j. |
| **Fixed** | 2026-03-13 |

### BUG-005: AuthenticationFilter rejected valid Bearer tokens
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Critical |
| **Service** | api-gateway |
| **Location** | `AuthenticationFilter.java` line 30 |
| **Description** | Condition used `tokenHeader.startsWith("Bearer")` - rejected when token WAS valid. Logic was inverted. |
| **Fix** | Changed to `!tokenHeader.startsWith("Bearer ")` - reject only when token is missing or invalid format. |
| **Fixed** | 2026-03-13 |

### BUG-003: Signup/Login/Create Post returned 500 for empty body
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Medium |
| **Service** | user-service, post-service |
| **Description** | Missing required fields returned 500 instead of 400. |
| **Fix** | Added `@Valid`, `@NotBlank` to DTOs; added `MethodArgumentNotValidException` handler. |
| **Fixed** | 2026-03-13 |

### BUG-004: Login returned 404 for empty body
| Field | Value |
|-------|-------|
| **Status** | 🟢 Fixed |
| **Severity** | Medium |
| **Service** | user-service |
| **Description** | Empty login body returned 404 (User not found) instead of 400. |
| **Fix** | Added validation to LoginRequestDto; validation runs before service. |
| **Fixed** | 2026-03-13 |

---

## How to Report a Bug

Add a new entry under **Open Bugs** using this template:

```markdown
### BUG-XXX: [Short title]
| Field | Value |
|-------|-------|
| **Status** | 🔴 Open |
| **Severity** | Critical / High / Medium / Low |
| **Service** | user-service / post-service / connection-service / api-gateway |
| **Location** | File and method/line if known |
| **Description** | What happens? |
| **Steps to Reproduce** | 1. ... 2. ... |
| **Expected** | What should happen? |
| **Actual** | What actually happens? |
| **Reported** | YYYY-MM-DD |
```

When fixed, move the bug to **Resolved Bugs** and set Status to 🟢 Fixed.
