import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchInput } from './SearchInput';

// Extend expect with Testing Library matchers
import '@testing-library/jest-dom';

describe('SearchInput', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test('renders correctly with default placeholder', () => {
    const { container } = render(<SearchInput value="" onChange={mockOnChange} />);
    
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Поиск...');
    expect(input).toHaveValue('');
  });

  test('renders correctly with custom placeholder', () => {
    const { container } = render(<SearchInput value="" placeholder="Найти видео..." onChange={mockOnChange} />);
    
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Найти видео...');
  });

 test('displays the correct value', () => {
    const { container } = render(<SearchInput value="test search" onChange={mockOnChange} />);
    
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test search');
  });

  test('calls onChange when input value changes', async () => {
    const { container } = render(<SearchInput value="" onChange={mockOnChange} />);
    
    const input = container.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'new search');
    
    expect(mockOnChange).toHaveBeenCalledTimes(11); // по одной для каждого символа
    expect(mockOnChange).toHaveBeenLastCalledWith('new search');
  });

  test('updates input when value prop changes', () => {
    const { container, rerender } = render(<SearchInput value="first value" onChange={mockOnChange} />);
    
    let input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('first value');
    
    rerender(<SearchInput value="second value" onChange={mockOnChange} />);
    
    input = container.querySelector('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('second value');
  });
});