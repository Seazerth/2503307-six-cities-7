import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Spinner from './spinner';

describe('Spinner', () => {
  it('renders an accessible loading status', () => {
    render(<Spinner />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading offers...');
  });
});
