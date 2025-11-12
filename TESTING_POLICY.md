# Testing Policy - NO MOCKS ALLOWED

## Rules

1. **NO MOCKS** - All tests must use real implementations
2. **TDD** - Write tests FIRST before implementing features
3. **Integration Tests Only** - Test real behavior, not mocked behavior
4. **Real Services** - Use actual Firebase, actual APIs (with test credentials)

## Test Structure

```
src/__tests__/
├── services/          # Test real service implementations
├── components/        # Test real React components
├── contexts/          # Test real context providers
└── integration/       # End-to-end integration tests
```

## Writing Tests

### Step 1: Write Test First (TDD)
```typescript
describe('signUp - Real Integration Test', () => {
  it('should create user in real Firebase', async () => {
    // Test what SHOULD happen
    const result = await signUp('test@example.com', 'password123');
    expect(result.user.email).toBe('test@example.com');
  });
});
```

### Step 2: Implement Feature
```typescript
// Implement to make test pass
export const signUp = async (email: string, password: string) => {
  // Real implementation
};
```

### Step 3: Run Test
```bash
npm test
```

## What's Allowed

✅ Real Firebase initialization
✅ Real API calls (with test credentials)
✅ Real component rendering
✅ Real navigation flows
✅ Real database operations

## What's NOT Allowed

❌ `jest.mock()` for services
❌ Mock implementations
❌ Fake data generators (except for test inputs)
❌ Bypassing real code paths

## Exception

Only allowed mocks:
- Expo modules not available in test environment (expo-font, expo-av, etc.)
- Platform-specific APIs

## Running Tests

```bash
# Tests use real Firebase from .env
npm test

# Make sure .env has test Firebase credentials
```

## Test Data

- Use real Firebase project
- Use test accounts
- Clean up test data after tests
- Use unique identifiers to avoid conflicts


