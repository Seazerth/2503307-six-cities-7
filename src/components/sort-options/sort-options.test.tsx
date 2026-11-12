import {render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import {SortType} from './sort-type';
import SortOptions from './sort-options';

describe('SortOptions', () => {
  it('renders the selected sort option and available choices', () => {
    render(<SortOptions sortType={SortType.Popular} onSortChange={vi.fn()} />);

    expect(screen.getByRole('button', {name: SortType.Popular})).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(Object.values(SortType).length);
    expect(screen.getByRole('option', {name: SortType.Popular})).toHaveAttribute('aria-selected', 'true');
  });
});
