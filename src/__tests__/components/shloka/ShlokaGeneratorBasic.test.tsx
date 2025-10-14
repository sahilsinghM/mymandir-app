import React from 'react';
import { render } from '../../utils/testUtils';

// Mock OpenAI service
jest.mock('../../../services/openaiService', () => ({
  OpenAIService: {
    generateShloka: jest.fn(() => Promise.resolve({
      sanskrit: 'Test Sanskrit shloka',
      translation: 'Test English translation',
      meaning: 'Test spiritual meaning'
    })),
  },
}));

describe('ShlokaGenerator Basic Tests', () => {
  it('should render ShlokaGenerator', () => {
    const ShlokaGenerator = require('../../../components/shloka/ShlokaGenerator').ShlokaGenerator;
    const { UNSAFE_root } = render(<ShlokaGenerator />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
