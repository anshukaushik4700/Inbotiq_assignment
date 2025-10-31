/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useAuth } from "@/context/AuthContext";

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Dashboard Page", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            user: {
              name: "Anshu",
              email: "anshu@example.com",
              role: "Admin",
              _id: "12345",
            },
          }),
      })
    );
  });

  it("renders welcome message when data loads", async () => {
    useAuth.mockReturnValue({ token: "mock-token", logout: mockLogout });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument(); 
      expect(screen.getAllByText(/anshu/i).length).toBeGreaterThan(0);
    });
  });

  it("fetches and displays dashboard data", async () => {
    useAuth.mockReturnValue({ token: "mock-token", logout: mockLogout });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/email/i)).toBeInTheDocument();
      expect(screen.getByText(/anshu@example.com/i)).toBeInTheDocument();
      expect(screen.getByText(/role/i)).toBeInTheDocument();
      expect(screen.getAllByText(/admin/i).length).toBeGreaterThan(0);
    });
  });

  it("calls logout when logout button is clicked", async () => {
    useAuth.mockReturnValue({ token: "mock-token", logout: mockLogout });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
