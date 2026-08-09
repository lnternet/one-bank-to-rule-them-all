import { render, screen } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 'txn-001',
        accountId: 'demo-account',
        transactionDate: '2026-08-01',
        description: 'Coffee shop',
        amount: -4.75,
        currency: 'USD',
      },
    ],
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders recent transactions on the homepage route', async () => {
  render(
    <HashRouter>
      <App />
    </HashRouter>,
  );

  expect(await screen.findByText('Coffee shop')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /one bank to rule them all/i })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /primary navigation/i })).toBeInTheDocument();
  expect(screen.getAllByText('-$4.75')).toHaveLength(2);
  expect(global.fetch).toHaveBeenCalledWith(
    '/api/accounts/demo-account/transactions',
    expect.objectContaining({ signal: expect.any(AbortSignal) }),
  );
});
