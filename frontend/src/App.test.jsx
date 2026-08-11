import { fireEvent, render, screen } from "@testing-library/react";
import axios from "axios";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";

jest.mock("axios");

beforeEach(() => {
  jest.spyOn(window, "alert").mockImplementation(() => {});
  axios.get.mockImplementation((url) => {
    if (url === "/api/users") {
      return Promise.resolve({
        data: [{ id: "user-frodo", name: "Frodo Baggins" }],
      });
    }

    if (url === "/api/users/user-frodo/accounts") {
      return Promise.resolve({
        data: [
          {
            id: "acct-bag-end",
            userId: "user-frodo",
            name: "Bag End Checking",
            number: "**** 1111",
            balance: 1842.42,
            currency: "USD",
          },
        ],
      });
    }

    if (url === "/api/accounts/acct-bag-end/transactions") {
      return Promise.resolve({
        data: [
          {
            id: "txn-001",
            fromAccountId: "acct-bag-end",
            toAccountId: "acct-mithril",
            fromAccountName: "Bag End Checking",
            toAccountName: "Mithril Savings",
            transactionDate: "2026-08-01",
            message: "Second breakfast supplies, absolutely essential",
            type: "Instant",
            amount: -25.5,
            currency: "USD",
          },
        ],
      });
    }

    return Promise.reject(new Error(`Unexpected URL: ${url}`));
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test("selects a user, loads accounts, and opens account transactions", async () => {
  render(
    <HashRouter>
      <App />
    </HashRouter>,
  );

  fireEvent.click(await screen.findByRole("button", { name: /frodo baggins/i }));

  expect(screen.getByLabelText(/one bank to rule them all/i)).toBeInTheDocument();
  expect(await screen.findByText("Frodo Baggins")).toBeInTheDocument();
  expect(
    screen.getByRole("navigation", { name: /primary navigation/i }),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /open profile/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /log off/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /accounts/i })).toBeInTheDocument();
  fireEvent.click(await screen.findByRole("button", { name: /bag end checking/i }));

  expect(await screen.findByText("Second breakfast supplies, absolutely essential")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /bag end checking transactions/i })).toBeInTheDocument();
  expect(screen.getAllByText("-$25.50")).toHaveLength(2);

  fireEvent.click(screen.getByRole("button", { name: /second breakfast supplies/i }));

  expect(window.alert).toHaveBeenCalledWith("Not implemented yet");
  expect(axios.get).toHaveBeenCalledWith("/api/users");
  expect(axios.get).toHaveBeenCalledWith("/api/users/user-frodo/accounts");
  expect(axios.get).toHaveBeenCalledWith("/api/accounts/acct-bag-end/transactions");
});
