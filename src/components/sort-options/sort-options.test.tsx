import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('opens the options and reports the selected sort type', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<SortOptions sortType={SortType.Popular} onSortChange={onSortChange} />);

    await user.click(screen.getByRole('button', {name: SortType.Popular}));
    await user.click(screen.getByRole('option', {name: SortType.PriceLowToHigh}));

    expect(onSortChange).toHaveBeenCalledWith(SortType.PriceLowToHigh);
    expect(screen.getByRole('button', {name: SortType.Popular})).toHaveAttribute('aria-expanded', 'false');
  });
});
