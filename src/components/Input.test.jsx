import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders with value', () => {
    render(<Input value="test value" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('test value');
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter text" onChange={vi.fn()} />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Input value="" onChange={handleChange} />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'hello');

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls.length).toBeGreaterThan(0);
  });

  it('applies small size class', () => {
    render(<Input size="sm" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input-sm');
  });

  it('applies large size class', () => {
    render(<Input size="lg" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input-lg');
  });

  it('applies custom className', () => {
    render(<Input className="w-full my-2" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('my-2');
  });

  it('passes additional props to input element', () => {
    render(<Input disabled type="email" name="email" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
  });

  it('combines size and custom classes', () => {
    render(<Input size="sm" className="w-full" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('input');
    expect(input).toHaveClass('input-sm');
    expect(input).toHaveClass('w-full');
  });

  it('works as controlled component', async () => {
    const ControlledInput = () => {
      const [value, setValue] = React.useState('');
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type here"
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledInput />);

    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'test');

    expect(input).toHaveValue('test');
  });
});
