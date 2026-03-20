import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Urban Intelligence Dashboard heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/Urban Intelligence Dashboard/i);
  expect(headingElement).toBeInTheDocument();
});
