import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import SocialLinks, { SocialIconButtons } from '../SocialLinks'
import { lightTheme } from '@theme/themes'

// Mock the useMainStore hook
const mockSetShowMobileMenu = vi.fn()
vi.mock('@services/stores/useMainStore', () => ({
  useMainStore: () => ({
    setShowMobileMenu: mockSetShowMobileMenu
  })
}))

// Mock the icon components
vi.mock('../icons/DiscordIcon', () => ({
  default: () => <div data-testid="discord-icon">Discord</div>
}))

vi.mock('../icons/GithubIcon', () => ({
  default: () => <div data-testid="github-icon">GitHub</div>
}))

vi.mock('../icons/InstagramIcon', () => ({
  default: () => <div data-testid="instagram-icon">Instagram</div>
}))

vi.mock('../icons/TelegramIcon', () => ({
  default: () => <div data-testid="telegram-icon">Telegram</div>
}))

vi.mock('../icons/TikTokIcon', () => ({
  default: () => <div data-testid="tiktok-icon">TikTok</div>
}))

vi.mock('../icons/XIcon', () => ({
  default: () => <div data-testid="x-icon">X</div>
}))

vi.mock('../icons/YoutubeIcon', () => ({
  default: () => <div data-testid="youtube-icon">YouTube</div>
}))

// Test wrapper with theme
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={lightTheme}>
    {children}
  </ThemeProvider>
)

describe('SocialLinks', () => {
  beforeEach(() => {
    mockSetShowMobileMenu.mockClear()
  })

  describe('SocialLinks component', () => {
    it('should render all social media links', () => {
      render(
        <TestWrapper>
          <SocialLinks />
        </TestWrapper>
      )

      // Check that all social media icons are rendered
      expect(screen.getByTestId('x-icon')).toBeInTheDocument()
      expect(screen.getByTestId('telegram-icon')).toBeInTheDocument()
      expect(screen.getByTestId('discord-icon')).toBeInTheDocument()
      expect(screen.getByTestId('tiktok-icon')).toBeInTheDocument()
      expect(screen.getByTestId('github-icon')).toBeInTheDocument()
      expect(screen.getByTestId('youtube-icon')).toBeInTheDocument()
      expect(screen.getByTestId('instagram-icon')).toBeInTheDocument()
    })

    it('should render exactly 7 social media links', () => {
      render(
        <TestWrapper>
          <SocialLinks />
        </TestWrapper>
      )

      const links = screen.getAllByRole('link')
      expect(links).toHaveLength(7)
    })
  })

  describe('SocialIconButtons component', () => {
    it('should render all social media links with correct URLs', () => {
      render(
        <TestWrapper>
          <SocialIconButtons />
        </TestWrapper>
      )

      // Check specific URLs
      expect(screen.getByRole('link', { name: /x/i })).toHaveAttribute('href', 'https://twitter.com/tari')
      expect(screen.getByRole('link', { name: /telegram/i })).toHaveAttribute('href', 'https://t.me/tariproject')
      expect(screen.getByRole('link', { name: /discord/i })).toHaveAttribute('href', 'https://discord.gg/tari')
      expect(screen.getByRole('link', { name: /tiktok/i })).toHaveAttribute('href', 'https://www.tiktok.com/@tari_xtr')
      expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/tari-project')
      expect(screen.getByRole('link', { name: /youtube/i })).toHaveAttribute('href', 'https://www.youtube.com/channel/UCFjcsEiAtr9mC1Yt0uJ-3xA')
      expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute('href', 'https://www.instagram.com/tari_xtr')
    })

    it('should have target="_blank" and rel="noreferrer" attributes', () => {
      render(
        <TestWrapper>
          <SocialIconButtons />
        </TestWrapper>
      )

      const links = screen.getAllByRole('link')
      links.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noreferrer')
      })
    })

    it('should call setShowMobileMenu(false) when any link is clicked', () => {
      render(
        <TestWrapper>
          <SocialIconButtons />
        </TestWrapper>
      )

      const xLink = screen.getByRole('link', { name: /x/i })
      fireEvent.click(xLink)

      expect(mockSetShowMobileMenu).toHaveBeenCalledWith(false)
    })

    it('should call setShowMobileMenu(false) for each social media link click', () => {
      render(
        <TestWrapper>
          <SocialIconButtons />
        </TestWrapper>
      )

      const links = screen.getAllByRole('link')
      
      // Click each link and verify the store method is called
      links.forEach((link, index) => {
        fireEvent.click(link)
        expect(mockSetShowMobileMenu).toHaveBeenNthCalledWith(index + 1, false)
      })

      expect(mockSetShowMobileMenu).toHaveBeenCalledTimes(7)
    })

    it('should render Twitter/X link first', () => {
      render(
        <TestWrapper>
          <SocialIconButtons />
        </TestWrapper>
      )

      const links = screen.getAllByRole('link')
      expect(links[0]).toHaveAttribute('href', 'https://twitter.com/tari')
    })

    it('should render Instagram link last', () => {
      render(
        <TestWrapper>
          <SocialIconButtons />
        </TestWrapper>
      )

      const links = screen.getAllByRole('link')
      expect(links[6]).toHaveAttribute('href', 'https://www.instagram.com/tari_xtr')
    })

    it('should render all expected social media platforms', () => {
      render(
        <TestWrapper>
          <SocialIconButtons />
        </TestWrapper>
      )

      // Check that all expected platforms are present
      const expectedPlatforms = ['x', 'telegram', 'discord', 'tiktok', 'github', 'youtube', 'instagram']
      
      expectedPlatforms.forEach(platform => {
        expect(screen.getByTestId(`${platform}-icon`)).toBeInTheDocument()
      })
    })
  })
})
