import React from 'react';
import { render } from '../../utils/testUtils';

describe('VirtualDiya Basic Tests', () => {
  it('should render VirtualDiya', () => {
    const VirtualDiya = require('../../../components/temple/VirtualDiya').VirtualDiya;
    const { UNSAFE_root } = render(<VirtualDiya />);
    expect(UNSAFE_root).toBeTruthy();
  });
});
