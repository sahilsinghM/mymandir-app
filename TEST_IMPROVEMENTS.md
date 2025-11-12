# Why Tests Didn't Catch Firebase Config Issue

## The Problem

The Firebase configuration loading issue wasn't caught by tests because:

### 1. **Tests Were Mocking Firebase**
```typescript
// In AuthContext.test.tsx and firebaseHelper.test.ts
jest.mock('../../services/firebase');
jest.mock('firebase/auth');
```
- Tests mocked `getFirebaseAuth()` so it never actually checked config
- The real `getFirebaseAuth()` function that validates config was never executed
- Mock returned `{}` so no validation errors occurred

### 2. **No Integration Tests**
- Unit tests verified function signatures but not actual behavior
- No tests tried to actually initialize Firebase with real config
- No tests verified that `app.config.ts` → `Constants.expoConfig.extra` flow worked

### 3. **Missing Test Coverage**
- No tests for `firebase.ts` service itself
- No tests for `env.ts` configuration loading
- No tests that verified `.env` → `app.config.ts` → `Constants` chain

## What Tests SHOULD Have Done

### Should Have Tested:
1. ✅ `getFirebaseAuth()` throws error when config is missing
2. ✅ `env.ts` loads values from `Constants.expoConfig.extra`
3. ✅ `app.config.ts` loads `.env` via dotenv
4. ✅ Integration: Full flow from `.env` → Firebase initialization

### Should Have Had:
- Integration test with `USE_REAL_FIREBASE=true` (but even mocks should catch this)
- Configuration validation tests (not just mocked)
- Environment variable loading tests

## Fix Applied

1. ✅ Created `src/__tests__/services/firebase.test.ts` - Tests actual Firebase config validation
2. ✅ Created `src/__tests__/config/env.test.ts` - Tests env variable loading
3. ✅ Enhanced existing tests to verify config state

## Lesson Learned

**Don't mock critical initialization code** - Test the actual validation logic:
- Configuration loading
- Error handling
- Environment variable resolution
- Integration between modules

## Going Forward

- ✅ Add integration tests that test real config loading
- ✅ Test error paths, not just success paths
- ✅ Verify configuration chain end-to-end
- ✅ Don't mock validation logic


