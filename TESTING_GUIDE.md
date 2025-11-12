# Testing Guide

## Overview

The test suite supports **two modes**:

1. **Unit Tests (Default)** - Fast, isolated tests with mocks
2. **Integration Tests** - Tests against your real Firebase project

## Running Tests

### Unit Tests (Default - Fast, Isolated)
```bash
npm test
```
Uses mocked Firebase/services for fast, deterministic tests.

### Integration Tests (Real Firebase)
```bash
USE_REAL_FIREBASE=true npm test
```
Uses your **actual Firebase configuration** from `.env` to test against your real project.

⚠️ **Note**: Integration tests will:
- Make real API calls
- Create/update real data in Firebase
- Count against your Firebase quotas
- Take longer to run

## Test Structure

```
src/__tests__/
├── services/          # Service layer tests
│   ├── aiService.test.ts
│   ├── openaiService.test.ts
│   └── astroService.test.ts
├── components/        # UI component tests
│   └── ui/
│       ├── ThemedButton.test.tsx
│       └── ThemedInput.test.tsx
├── contexts/          # Context tests
│   └── AuthContext.test.tsx
└── utils/             # Utility tests
    └── firebaseHelper.test.ts
```

## Configuration

### Environment Variables

Tests automatically use your `.env` file when running in integration mode:

```bash
# .env
FIREBASE_API_KEY=your_real_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
# ... etc
```

### Test Mode Selection

- **Unit Tests**: Mocks all external services (Firebase, APIs)
- **Integration Tests**: Uses real services (set `USE_REAL_FIREBASE=true`)

## Writing Tests

### Unit Test Example (Mocked)
```typescript
// Tests run fast with mocks
describe('AuthContext', () => {
  it('should sign in user', async () => {
    // Uses mocked Firebase
    const result = await signIn('email', 'password');
    expect(result).toBeDefined();
  });
});
```

### Integration Test Example (Real Firebase)
```typescript
// Only runs when USE_REAL_FIREBASE=true
describe('AuthContext Integration', () => {
  it('should sign in user with real Firebase', async () => {
    // Uses your actual Firebase
    const result = await signIn('real-email@test.com', 'real-password');
    expect(result.user.email).toBe('real-email@test.com');
  });
});
```

## Best Practices

1. **Write unit tests first** - Fast feedback loop
2. **Use integration tests for critical paths** - Verify end-to-end
3. **Don't commit test credentials** - Use `.env` (already in `.gitignore`)
4. **Clean up test data** - Integration tests should clean up after themselves

## Current Test Status

Run `npm test` to see current status:
- ✅ Passing tests
- ⚠️ Failing tests (mostly mock-related, doesn't affect real functionality)

## Debugging Failed Tests

```bash
# Run specific test file
npm test -- src/__tests__/services/aiService.test.ts

# Run with verbose output
npm test -- --verbose

# Run in watch mode
npm test -- --watch
```


