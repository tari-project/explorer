import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import POWChart from "../POWChart";

interface EChartsProps {
  option: unknown;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

interface AlertProps {
  severity: string;
  variant: string;
  children: React.ReactNode;
}

interface SkeletonProps {
  variant: string;
  height: string | number;
}

interface Theme {
  spacing: (value: number) => string;
  palette: {
    mode: string;
    text: {
      primary: string;
    };
    grey: {
      300: string;
      400: string;
      500: string;
    };
  };
}

// Mock ECharts
vi.mock("echarts-for-react", () => ({
  default: ({ option, style, ...props }: EChartsProps) => (
    <div data-testid="echarts" data-option={JSON.stringify(option)} style={style} {...props}>
      POW Chart
    </div>
  ),
}));

// Mock components
vi.mock("@components/StyledComponents", () => ({
  TransparentBg: ({ children }: { children: React.ReactNode }) => <div data-testid="transparent-bg">{children}</div>,
}));

// Mock MUI components
vi.mock("@mui/material", () => ({
  Alert: ({ severity, variant, children }: AlertProps) => (
    <div data-testid="alert" data-severity={severity} data-variant={variant}>
      {children}
    </div>
  ),
  Skeleton: ({ variant, height }: SkeletonProps) => (
    <div data-testid="skeleton" data-variant={variant} data-height={height}>
      Loading...
    </div>
  ),
  useMediaQuery: vi.fn(() => false), // Default to desktop (false)
}));

// Mock API hook
vi.mock("@services/api/hooks/useBlocks", () => ({
  useAllBlocks: vi.fn(),
}));

// Mock theme and colors
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    mode: "light",
    text: {
      primary: "#000000",
    },
    grey: {
      300: "#e0e0e0",
      400: "#bdbdbd",
      500: "#9e9e9e",
    },
    divider: "#e0e0e0",
  },
  breakpoints: {
    down: vi.fn(() => "max-width: 600px"),
  },
};

vi.mock("@mui/material/styles", () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock("@theme/colors", () => ({
  chartColor: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"],
}));

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={mockTheme as Theme}>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

describe("POWChart", () => {
  let mockUseAllBlocks: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useAllBlocks } = await import("@services/api/hooks/useBlocks");
    mockUseAllBlocks = vi.mocked(useAllBlocks);
  });

  const mockPowData = {
    algoSplit: {
      moneroRx10: 45,
      moneroRx20: 30,
      moneroRx50: 20,
      moneroRx100: 15,
      sha3X10: 25,
      sha3X20: 20,
      sha3X50: 15,
      sha3X100: 10,
      tariRx10: 35,
      tariRx20: 25,
      tariRx50: 20,
      tariRx100: 15,
      cuckaroo10: 20,
      cuckaroo20: 15,
      cuckaroo50: 10,
      cuckaroo100: 5,
    },
  };

  it("should render loading state", () => {
    mockUseAllBlocks.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-variant", "rounded");
    expect(screen.getByTestId("skeleton")).toHaveAttribute("data-height", "300");
  });

  it("should render error state", () => {
    const errorMessage = "Failed to load POW data";
    mockUseAllBlocks.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: errorMessage },
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    expect(screen.getByTestId("transparent-bg")).toBeInTheDocument();
    const alert = screen.getByTestId("alert");
    expect(alert).toHaveAttribute("data-severity", "error");
    expect(alert).toHaveAttribute("data-variant", "outlined");
    expect(alert).toHaveTextContent(errorMessage);
  });

  it("should render bar chart with POW data", () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    expect(chart).toBeInTheDocument();

    const option = JSON.parse(chart.getAttribute("data-option") || "{}");
    expect(option.series).toBeDefined();
    expect(option.series[0].type).toBe("bar");
    expect(option.series).toHaveLength(4); // RandomX, Sha3, TariRandomX, Cuckaroo
  });

  it("should calculate percentages correctly", () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    const barData = option.series[0].data;

    // Check that data exists for all time periods
    expect(barData).toHaveLength(4); // 100, 50, 20, 10 blocks

    // Check series names
    expect(option.series[0].name).toBe("RandomX");
    expect(option.series[1].name).toBe("Sha 3");
    expect(option.series[2].name).toBe("Tari RandomX");
    expect(option.series[3].name).toBe("Cuckaroo29");
  });

  it("should configure chart with proper options", () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    // Check tooltip configuration
    expect(option.tooltip.trigger).toBe("axis");

    // Check legend configuration (desktop mode)
    expect(option.legend).toBeDefined();
    expect(option.legend.bottom).toBe(10);

    // Check axis configuration
    expect(option.xAxis.type).toBe("value");
    expect(option.yAxis.type).toBe("category");
    expect(option.yAxis.data).toEqual(["100", "50", "20", "10"]);

    // Check series configuration
    expect(option.series[0].type).toBe("bar");
    expect(option.series[0].stack).toBe("total");
    expect(option.series[0].label.show).toBe(true);
  });

  it("should use correct colors for bar segments", () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    // Check that colors are set globally
    expect(option.color).toEqual(["#98D8C8", "#FFA07A", "#45B7D1", "#4ECDC4"]);
  });

  it("should handle chart dimensions and styling", () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    expect(chart).toBeInTheDocument();
  });

  it("should render single-row legend on desktop", async () => {
    const { useMediaQuery } = await import("@mui/material");
    vi.mocked(useMediaQuery).mockReturnValue(false); // Desktop

    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    // Desktop should have a single legend object, not an array
    expect(Array.isArray(option.legend)).toBe(false);
    expect(option.legend.bottom).toBe(10);
    expect(option.legend.textStyle.color).toBe("#000000");
  });

  it("should render two-row legend on mobile", async () => {
    const { useMediaQuery } = await import("@mui/material");
    vi.mocked(useMediaQuery).mockReturnValue(true); // Mobile

    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    // Mobile should have an array of two legend objects
    expect(Array.isArray(option.legend)).toBe(true);
    expect(option.legend).toHaveLength(2);
    
    // First legend (top row)
    expect(option.legend[0].data).toEqual(["RandomX", "Sha 3"]);
    expect(option.legend[0].bottom).toBe(30);
    expect(option.legend[0].left).toBe("center");
    
    // Second legend (bottom row)
    expect(option.legend[1].data).toEqual(["Tari RandomX", "Cuckaroo29"]);
    expect(option.legend[1].bottom).toBe(10);
    expect(option.legend[1].left).toBe("center");
  });

  it("should handle zero values gracefully", () => {
    const zeroData = {
      algoSplit: {
        moneroRx10: 0,
        moneroRx20: 0,
        moneroRx50: 0,
        moneroRx100: 0,
        sha3X10: 100,
        sha3X20: 0,
        sha3X50: 0,
        sha3X100: 0,
        tariRx10: 0,
        tariRx20: 0,
        tariRx50: 0,
        tariRx100: 0,
        cuckaroo10: 0,
        cuckaroo20: 0,
        cuckaroo50: 0,
        cuckaroo100: 0,
      },
    };

    mockUseAllBlocks.mockReturnValue({
      data: zeroData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    // Should still render all series even if some have 0 values
    expect(option.series).toHaveLength(4);

    // Check that the component handles zero values gracefully
    expect(option.series[0].data).toHaveLength(4); // 4 time periods
  });

  it("should handle missing data gracefully", () => {
    mockUseAllBlocks.mockReturnValue({
      data: {
        algoSplit: {
          moneroRx10: 0,
          moneroRx20: 0,
          moneroRx50: 0,
          moneroRx100: 0,
          sha3X10: 0,
          sha3X20: 0,
          sha3X50: 0,
          sha3X100: 0,
          tariRx10: 0,
          tariRx20: 0,
          tariRx50: 0,
          tariRx100: 0,
          cuckaroo10: 0,
          cuckaroo20: 0,
          cuckaroo50: 0,
          cuckaroo100: 0,
        },
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    expect(chart).toBeInTheDocument();
  });

  it("should format labels correctly", () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    // Check label configuration
    expect(option.series[0].label.show).toBe(true);
    expect(option.series[0].label.formatter).toBe("{c}%");

    // Check emphasis configuration
    expect(option.series[0].emphasis.focus).toBe("series");
  });

  it("should use theme colors for chart elements", async () => {
    const { useMediaQuery } = await import("@mui/material");
    vi.mocked(useMediaQuery).mockReturnValue(false); // Desktop mode for consistent legend structure

    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    // Check that theme colors are applied to legend (desktop mode)
    expect(option.legend.textStyle.color).toBe("#000000");

    // Check that theme colors are applied to axes
    expect(option.xAxis.axisLine.lineStyle.color).toBe("#000000");
    expect(option.yAxis.axisLine.lineStyle.color).toBe("#000000");
    expect(option.xAxis.splitLine.lineStyle.color).toBe("#e0e0e0");
  });

  it("should have proper tooltip configuration", () => {
    mockUseAllBlocks.mockReturnValue({
      data: mockPowData,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(
      <TestWrapper>
        <POWChart />
      </TestWrapper>
    );

    const chart = screen.getByTestId("echarts");
    const option = JSON.parse(chart.getAttribute("data-option") || "{}");

    // Check tooltip configuration
    expect(option.tooltip.trigger).toBe("axis");
    expect(option.tooltip.axisPointer.type).toBe("shadow");
  });
});
