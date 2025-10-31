/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../app/(auth)/login/page.tsx";
import { useAuth } from "@/context/AuthContext";

// ✅ Mock the AuthContext
const mockLogin = jest.fn();
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

// ✅ Mock next/navigation for router.push
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// ✅ Mock the fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ token: "fake-token", user: { name: "Anshu" } }),
  })
);

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders login form and inputs work", () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(button).toBeInTheDocument();
  });

  test("calls login and redirects when form is submitted", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(button);

    // ✅ Wait for login() to be called
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("fake-token", { name: "Anshu" });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
