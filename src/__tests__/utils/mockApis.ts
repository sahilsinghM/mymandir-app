// Mock API responses
export const mockGeetaResponse = {
  chapter: 2,
  verse: 47,
  slok: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
  transliteration: 'karmaṇy-evādhikāras te mā phaleṣhu kadāchana mā karma-phala-hetur bhūr mā te saṅgo \'stv akarmaṇi',
  translation: 'You have a right to perform your prescribed duty, but not to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
  purport: 'The verse teaches the principle of detached action...',
};

export const mockOpenAIResponse = {
  id: 'chatcmpl-123',
  object: 'chat.completion',
  created: 1677652288,
  model: 'gpt-4',
  choices: [
    {
      index: 0,
      message: {
        role: 'assistant',
        content: 'This is a mock AI response for testing purposes.',
      },
      finish_reason: 'stop',
    },
  ],
  usage: {
    prompt_tokens: 10,
    completion_tokens: 20,
    total_tokens: 30,
  },
};

export const mockAstroResponse = {
  sign: 'Aries',
  date: '2024-01-15',
  horoscope: 'Today brings new opportunities and fresh energy.',
  mood: 'Optimistic',
  keywords: ['new beginnings', 'energy', 'leadership'],
  compatibility: 'Leo',
  lucky_numbers: [1, 7, 21],
  lucky_time: '10:00 AM',
};

export const mockPanchangResponse = {
  date: '2024-01-15',
  tithi: 'Purnima',
  nakshatra: 'Rohini',
  yoga: 'Siddhi',
  karana: 'Vishti',
  sunrise: '07:15 AM',
  sunset: '06:30 PM',
  moonrise: '07:45 PM',
  moonset: '08:30 AM',
  auspicious_times: [
    { name: 'Brahma Muhurat', time: '05:30 AM - 06:00 AM' },
    { name: 'Abhijit Muhurat', time: '12:00 PM - 12:30 PM' },
  ],
};

// Mock server for MSW (simplified version)
export const server = {
  listen: jest.fn(),
  resetHandlers: jest.fn(),
  close: jest.fn(),
};

// Basic test to ensure the module loads
describe('Mock APIs', () => {
  it('should export mock responses', () => {
    expect(mockGeetaResponse).toBeDefined();
    expect(mockOpenAIResponse).toBeDefined();
    expect(mockAstroResponse).toBeDefined();
    expect(mockPanchangResponse).toBeDefined();
  });

  it('should have mock server methods', () => {
    expect(server.listen).toBeDefined();
    expect(server.resetHandlers).toBeDefined();
    expect(server.close).toBeDefined();
  });
});