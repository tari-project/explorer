import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ThemeProvider, type Theme } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import SearchPage from "../SearchPage";

// Mock components
vi.mock("@components/StyledComponents", () => ({
  GradientPaper: ({ children }: { children: React.ReactNode }) => <div data-testid="gradient-paper">{children}</div>,
}));

vi.mock("@components/FetchStatusCheck", () => ({
  default: ({
    isError,
    isLoading,
    errorMessage,
  }: {
    isError?: boolean;
    isLoading?: boolean;
    errorMessage?: string;
  }) => (
    <div data-testid="fetch-status-check">
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">{errorMessage}</div>}
    </div>
  ),
}));

vi.mock("@components/Search/PayRefTable", () => ({
  default: ({ data }: { data: unknown[] }) => (
    <div data-testid="payref-table" data-count={data.length}>
      PayRef Table
    </div>
  ),
}));

vi.mock("@components/Search/BlockTable", () => ({
  default: ({ data }: { data: Array<{ block_height?: number }> }) => (
    <div data-testid="block-table" data-count={data?.length || 0}>
      Block Table
    </div>
  ),
}));

vi.mock("@mui/material", () => ({
  Alert: ({ children, ...props }: React.ComponentProps<"div">) => (
    <div data-testid="alert" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  Grid: ({ children, ...props }: React.ComponentProps<"div">) => (
    <div data-testid="grid" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
}));

// Mock the API hooks
const mockUseSearchByHashOrNumber = vi.fn();
vi.mock("@services/api/hooks/useBlocks", () => ({
  useSearchByHashOrNumber: (...args: unknown[]) => mockUseSearchByHashOrNumber(...args),
}));

// Mock store
const setStatus = vi.fn();
const setMessage = vi.fn();
vi.mock("@services/stores/useSearchStatusStore", () => ({
  default: (selector: (state: { setStatus: typeof setStatus; setMessage: typeof setMessage }) => unknown) =>
    selector({ setStatus, setMessage }),
}));

// Mock validateHash
vi.mock("@utils/helpers", () => ({
  validateHash: (hash: string) => hash === "validhash",
}));

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  breakpoints: {
    down: vi.fn(() => "media-query"),
  },
};

// Mock window.location.replace
const mockLocationReplace = vi.fn();
Object.defineProperty(window, "location", {
  value: {
    replace: mockLocationReplace,
  },
  writable: true,
});

// Test wrapper component
const TestWrapper = ({
  children,
  initialEntries = ["/search?hash=validhash"],
}: {
  children: React.ReactNode;
  initialEntries?: string[];
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme as unknown as Theme}>
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocationReplace.mockClear();
    setStatus.mockClear();
    setMessage.mockClear();
  });

  it("renders error for invalid hash", () => {
    mockUseSearchByHashOrNumber.mockReturnValue({
      data: null,
      isFetching: false,
      isError: false,
      isSuccess: false,
      error: null,
    });
    render(
      <TestWrapper initialEntries={[`/search?hash=invalid`]}>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId("alert")).toBeInTheDocument();
    expect(screen.getByText(/Invalid hash/i)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    mockUseSearchByHashOrNumber.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false,
      isSuccess: false,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId("fetch-status-check")).toBeInTheDocument();
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading...");
  });

  it("shows error state when both searches fail", () => {
    mockUseSearchByHashOrNumber.mockReturnValue({
      data: { items: [] },
      isFetching: false,
      isError: true,
      isSuccess: false,
      error: { message: "Payref error" },
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId("fetch-status-check")).toBeInTheDocument();
    expect(screen.getByTestId("error")).toHaveTextContent("Payref error");
  });

  it("shows PayRefTable and redirects if one payref result", async () => {
    mockUseSearchByHashOrNumber.mockReturnValue({
      data: { items: [{ block_height: 42, search_type: "Payref" }] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(mockLocationReplace).toHaveBeenCalledWith("/blocks/42?payref=validhash");
    });
  });

  it("shows PayRefTable if multiple payref results", () => {
    mockUseSearchByHashOrNumber.mockReturnValue({
      data: {
        items: [
          { block_height: 1, search_type: "Payref" },
          { block_height: 2, search_type: "Payref" },
        ],
      },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId("payref-table")).toBeInTheDocument();
    expect(screen.getByTestId("payref-table")).toHaveAttribute("data-count", "2");
  });

  it("shows BlockTable and redirects if payref empty but block found", async () => {
    mockUseSearchByHashOrNumber.mockReturnValue({
      data: { items: [{ block_height: 99, search_type: "#hash" }] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    await waitFor(() => {
      expect(mockLocationReplace).toHaveBeenCalledWith("/blocks/99");
    });
  });

  it("shows BlockTable if block found and not redirecting", () => {
    mockUseSearchByHashOrNumber.mockReturnValue({
      data: {
        items: [
          { block_height: 100, search_type: "#hash" },
          { block_height: 101, search_type: "#hash" },
        ],
      },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId("block-table")).toBeInTheDocument();
    expect(screen.getByTestId("block-table")).toHaveAttribute("data-count", "2");
  });

  it("has proper grid and gradient paper structure", () => {
    mockUseSearchByHashOrNumber.mockReturnValue({
      data: { items: [] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      error: null,
    });
    render(
      <TestWrapper>
        <SearchPage />
      </TestWrapper>
    );
    expect(screen.getByTestId("grid")).toBeInTheDocument();
    expect(screen.getByTestId("gradient-paper")).toBeInTheDocument();
  });
});
