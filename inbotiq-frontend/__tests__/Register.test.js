/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../app/(auth)/register/page.tsx";
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

// ✅ Mock fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        token: "fake-token",
        user: { name: "Test User", email: "test@example.com" },
      }),
  })
);

describe("Register Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders register form and inputs work", () => {
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole("button", { name: /join us/i }); // ✅ Fixed here

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(nameInput.value).toBe("Test User");
    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
    expect(button).toBeInTheDocument();
  });

  test("calls register API and redirects after success", async () => {
    render(<RegisterPage />);

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole("button", { name: /join us/i }); // ✅ Fixed here

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith("fake-token", {
        name: "Test User",
        email: "test@example.com",
      });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });
});
