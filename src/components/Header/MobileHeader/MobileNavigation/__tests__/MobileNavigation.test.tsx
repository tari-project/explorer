import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import MobileNavigation from '../MobileNavigation';

// Mock the styles module
vi.mock('../styles', () => ({
  Wrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
  NavLink: ({
    to,
    onClick,
    children,
  }: {
    to: string;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <a
      data-testid="nav-link"
      data-to={to}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      href={to}
    >
      {children}
    </a>
  ),
}));

// Mock the store
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: vi.fn(),
}));

// Mock theme
const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    background: { paper: '#ffffff' },
    divider: '#e0e0e0',
  },
};

// Test wrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={mockTheme as any}>
    <MemoryRouter>{children}</MemoryRouter>
  </ThemeProvider>
);

describe('MobileNavigation', () => {
  let mockUseMainStore: any;
  let mockSetShowMobileMenu: any;

  beforeEach(async () => {
    vi.clearAllMocks();

    const { useMainStore } = await import('@services/stores/useMainStore');
    mockUseMainStore = vi.mocked(useMainStore);
    mockSetShowMobileMenu = vi.fn();

    // Mock the implementation to return the setShowMobileMenu function directly
    // since useMainStore((state) => state.setShowMobileMenu) should return the function
    mockUseMainStore.mockReturnValue(mockSetShowMobileMenu);
  });

  describe('Rendering', () => {
    it('should render navigation wrapper', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      expect(screen.getByTestId('wrapper')).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const navLinks = screen.getAllByTestId('nav-link');
      expect(navLinks).toHaveLength(3);

      // Check Home link
      expect(navLinks[0]).toHaveAttribute('data-to', '/');
      expect(navLinks[0]).toHaveTextContent('Home');

      // Check Blocks link
      expect(navLinks[1]).toHaveAttribute('data-to', '/blocks');
      expect(navLinks[1]).toHaveTextContent('Blocks');

      // Check Mempool link
      expect(navLinks[2]).toHaveAttribute('data-to', '/mempool');
      expect(navLinks[2]).toHaveTextContent('Mempool');
    });
  });

  describe('Navigation functionality', () => {
    it('should close mobile menu when Home link is clicked', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);

      expect(mockSetShowMobileMenu).toHaveBeenCalledWith(false);
    });

    it('should close mobile menu when Blocks link is clicked', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const blocksLink = screen.getByText('Blocks');
      fireEvent.click(blocksLink);

      expect(mockSetShowMobileMenu).toHaveBeenCalledWith(false);
    });

    it('should close mobile menu when Mempool link is clicked', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const mempoolLink = screen.getByText('Mempool');
      fireEvent.click(mempoolLink);

      expect(mockSetShowMobileMenu).toHaveBeenCalledWith(false);
    });

    it('should call setShowMobileMenu with false for all link clicks', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const navLinks = screen.getAllByTestId('nav-link');

      navLinks.forEach((link) => {
        fireEvent.click(link);
      });

      expect(mockSetShowMobileMenu).toHaveBeenCalledTimes(3);
      expect(mockSetShowMobileMenu).toHaveBeenNthCalledWith(1, false);
      expect(mockSetShowMobileMenu).toHaveBeenNthCalledWith(2, false);
      expect(mockSetShowMobileMenu).toHaveBeenNthCalledWith(3, false);
    });
  });

  describe('Store integration', () => {
    it('should use the correct store selector', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      expect(mockUseMainStore).toHaveBeenCalled();

      // Verify the selector function is looking for setShowMobileMenu
      const selectorCall = mockUseMainStore.mock.calls[0][0];
      expect(selectorCall.toString()).toContain('setShowMobileMenu');
    });

    it('should handle store updates correctly', () => {
      const { rerender } = render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      // Click a link to trigger store update
      const homeLink = screen.getByText('Home');
      fireEvent.click(homeLink);

      expect(mockSetShowMobileMenu).toHaveBeenCalledWith(false);

      // Rerender should still work
      rerender(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      expect(screen.getByTestId('wrapper')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('should have proper link structure', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const wrapper = screen.getByTestId('wrapper');
      const navLinks = screen.getAllByTestId('nav-link');

      // All links should be contained within wrapper
      navLinks.forEach((link) => {
        expect(wrapper).toContainElement(link);
      });
    });

    it('should render links in correct order', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const navLinks = screen.getAllByTestId('nav-link');

      expect(navLinks[0]).toHaveTextContent('Home');
      expect(navLinks[1]).toHaveTextContent('Blocks');
      expect(navLinks[2]).toHaveTextContent('Mempool');
    });

    it('should have proper href attributes', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const navLinks = screen.getAllByTestId('nav-link');

      expect(navLinks[0]).toHaveAttribute('href', '/');
      expect(navLinks[1]).toHaveAttribute('href', '/blocks');
      expect(navLinks[2]).toHaveAttribute('href', '/mempool');
    });
  });

  describe('Event handling', () => {
    it('should handle click events without errors', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const navLinks = screen.getAllByTestId('nav-link');

      // Should not throw errors when clicking
      expect(() => {
        navLinks.forEach((link) => {
          fireEvent.click(link);
        });
      }).not.toThrow();
    });

    it('should handle multiple rapid clicks', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const homeLink = screen.getByText('Home');

      // Rapid clicks
      fireEvent.click(homeLink);
      fireEvent.click(homeLink);
      fireEvent.click(homeLink);

      expect(mockSetShowMobileMenu).toHaveBeenCalledTimes(3);
      expect(mockSetShowMobileMenu).toHaveBeenCalledWith(false);
    });
  });

  describe('Accessibility', () => {
    it('should render semantic navigation elements', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      const navLinks = screen.getAllByTestId('nav-link');

      // All should be anchor elements with proper attributes
      navLinks.forEach((link) => {
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href');
        expect(link).toHaveAttribute('data-to');
      });
    });

    it('should have descriptive link text', () => {
      render(
        <TestWrapper>
          <MobileNavigation />
        </TestWrapper>
      );

      // Link text should be clear and descriptive
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Blocks')).toBeInTheDocument();
      expect(screen.getByText('Mempool')).toBeInTheDocument();
    });
  });
});
