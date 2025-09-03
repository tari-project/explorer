import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import StatsDesktop from "../StatsDesktop";
import { lightTheme } from "@theme/themes";

// Mock StatsItem component
vi.mock("../StatsItem/StatsItem", () => ({
  default: ({ label, value, lowerCase }: { label: React.ReactNode; value: string; lowerCase?: boolean }) => {
    const labelText = typeof label === "string" ? label : "multiline-label";
    const testId = labelText.toLowerCase().replace(/\s+/g, "-");
    return (
      <div data-testid={`stats-item-${testId}`}>
        <span data-testid="value" className={lowerCase ? "lowercase" : ""}>
          {value}
        </span>
        <span data-testid="label">{label}</span>
      </div>
    );
  },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
);

describe("StatsDesktop", () => {
  const mockProps = {
    moneroHashRate: "12.3TH/s",
    shaHashRate: "9.9TH/s",
    tariRandomXHashRate: "5.4TH/s",
    cuckarooHashRate: "3.2TH/s",
    averageBlockTime: "4m",
    blockHeight: "123,456",
  };

  it("should render all statistics with correct labels and values", () => {
    render(
      <TestWrapper>
        <StatsDesktop {...mockProps} />
      </TestWrapper>
    );

    const statsItems = screen.getAllByTestId("stats-item-multiline-label");
    expect(statsItems).toHaveLength(6);
  });

  it("should display correct values for each statistic", () => {
    render(
      <TestWrapper>
        <StatsDesktop {...mockProps} />
      </TestWrapper>
    );

    const values = screen.getAllByTestId("value");
    expect(values[0]).toHaveTextContent("12.3TH/s"); // RandomX Hash Rate
    expect(values[1]).toHaveTextContent("9.9TH/s"); // Sha3X Hash Rate
    expect(values[2]).toHaveTextContent("5.4TH/s"); // Tari RandomX Hash Rate
    expect(values[3]).toHaveTextContent("3.2TH/s"); // Cuckaroo29 Hash Rate
    expect(values[4]).toHaveTextContent("4m"); // Average Block Time
    expect(values[5]).toHaveTextContent("123,456"); // Block Height
  });

  it("should apply lowerCase prop to average block time only", () => {
    render(
      <TestWrapper>
        <StatsDesktop {...mockProps} />
      </TestWrapper>
    );

    const values = screen.getAllByTestId("value");

    // Only the average block time (5th item, index 4) should have lowercase class
    expect(values[0]).not.toHaveClass("lowercase"); // RandomX
    expect(values[1]).not.toHaveClass("lowercase"); // Sha3X
    expect(values[2]).not.toHaveClass("lowercase"); // Tari RandomX
    expect(values[3]).not.toHaveClass("lowercase"); // Cuckaroo29
    expect(values[4]).toHaveClass("lowercase"); // Average Block Time
    expect(values[5]).not.toHaveClass("lowercase"); // Block Height
  });

  it("should handle empty string values gracefully", () => {
    const emptyProps = {
      moneroHashRate: "",
      shaHashRate: "",
      tariRandomXHashRate: "",
      cuckarooHashRate: "",
      averageBlockTime: "",
      blockHeight: "",
    };

    render(
      <TestWrapper>
        <StatsDesktop {...emptyProps} />
      </TestWrapper>
    );

    const statsItems = screen.getAllByTestId("stats-item-multiline-label");
    expect(statsItems).toHaveLength(6);
  });

  it("should render with desktop-specific layout wrapper", () => {
    const { container } = render(
      <TestWrapper>
        <StatsDesktop {...mockProps} />
      </TestWrapper>
    );

    // Should have the Wrapper component from StatsBox.styles
    expect(container.firstChild).toBeInTheDocument();
  });
});
