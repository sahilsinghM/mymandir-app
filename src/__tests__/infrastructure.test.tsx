import { render } from './utils/testUtils';
import { mockAuth } from './utils/mockFirebase';
import { server } from './utils/mockApis';

describe('Testing Infrastructure', () => {
  it('should have render function available', () => {
    expect(render).toBeDefined();
  });

  it('should have access to mock Firebase functions', () => {
    expect(mockAuth.signInWithEmailAndPassword).toBeDefined();
    expect(mockAuth.createUserWithEmailAndPassword).toBeDefined();
    expect(mockAuth.signOut).toBeDefined();
  });

  it('should have MSW server configured', () => {
    expect(server).toBeDefined();
    expect(server.listen).toBeDefined();
  });
});