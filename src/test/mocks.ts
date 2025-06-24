//  Copyright 2022. The Tari Project
//
//  Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
//  following conditions are met:
//
//  1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following
//  disclaimer.
//
//  2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
//  following disclaimer in the documentation and/or other materials provided with the distribution.
//
//  3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote
//  products derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
//  INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
//  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
//  SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
//  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
//  WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
//  USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import { vi } from 'vitest'

// Centralized mock system to prevent module resolution issues

// API hooks mocks
export const mockUseAllBlocks = vi.fn()
export const mockUseSearchByKernel = vi.fn()

// Store mocks  
export const mockUseMainStore = vi.fn()
export const mockSetSearchOpen = vi.fn()

// Router mocks
export const mockNavigate = vi.fn()

// Utility function mocks
export const mockToHexString = vi.fn((data) => `hex_${data}`)
export const mockShortenString = vi.fn((str, start = 6, end = 6) => 
  str.length > start + end ? `${str.substring(0, start)}...${str.substring(str.length - end)}` : str
)
export const mockFormatTimestamp = vi.fn((timestamp) => `formatted_${timestamp}`)
export const mockPowCheck = vi.fn((algo) => `pow_${algo}`)
export const mockKernelSearch = vi.fn()

// Theme mock
export const mockTheme = {
  spacing: vi.fn((value: number) => `${value * 8}px`),
  palette: {
    background: { paper: '#ffffff' },
    divider: '#e0e0e0',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    error: { main: '#d32f2f' }
  },
  breakpoints: {
    up: vi.fn(() => '(min-width:600px)'),
    down: vi.fn(() => '(max-width:599px)')
  }
}

// Component mocks
export const mockStyledComponents = {
  TypographyData: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="typography-data">{children}</div>
  ),
  TransparentBg: ({ children, height }: { children: React.ReactNode; height?: string }) => (
    <div data-testid="transparent-bg" data-height={height}>{children}</div>
  ),
  TransparentDivider: () => <div data-testid="transparent-divider">---</div>
}

export const mockCopyToClipboard = ({ copy }: { copy: string }) => (
  <div data-testid="copy-to-clipboard" data-copy={copy}>Copy</div>
)

export const mockInnerHeading = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="inner-heading">{children}</div>
)

// MUI component mocks
export const mockMuiComponents = {
  Typography: ({ children, variant, color, ...props }: any) => (
    <div data-testid="typography" data-variant={variant} data-color={color} {...props}>
      {children}
    </div>
  ),
  Grid: ({ children, item, xs, md, lg, spacing, container, ...props }: any) => (
    <div 
      data-testid="grid" 
      data-item={item}
      data-xs={xs}
      data-md={md}
      data-lg={lg}
      data-spacing={spacing}
      data-container={container}
      {...props}
    >
      {children}
    </div>
  ),
  Box: ({ children, ...props }: any) => (
    <div data-testid="box" {...props}>{children}</div>
  ),
  Skeleton: ({ variant, height, width }: any) => (
    <div data-testid="skeleton" data-variant={variant} data-height={height} data-width={width}>
      Loading...
    </div>
  ),
  Alert: ({ severity, variant, children }: any) => (
    <div data-testid="alert" data-severity={severity} data-variant={variant}>
      {children}
    </div>
  ),
  Button: ({ children, variant, fullWidth, href, color, onClick, ...props }: any) => (
    <button 
      data-testid="button" 
      data-variant={variant}
      data-full-width={fullWidth}
      data-href={href}
      data-color={color}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
  Divider: ({ color, style }: any) => (
    <div data-testid="divider" data-color={color} style={style}>---</div>
  ),
  TextField: ({ label, value, onChange, error, helperText, ...props }: any) => (
    <input
      data-testid="text-field"
      data-label={label}
      value={value}
      onChange={onChange}
      data-error={error}
      data-helper-text={helperText}
      {...props}
    />
  )
}

// Sample mock data
export const mockMempoolData = {
  mempool: [
    {
      id: 1,
      excess_sig: { signature: 'mock_signature_1' },
      fee_per_gram: 1000,
      timestamp: 1640995200
    },
    {
      id: 2,
      excess_sig: { signature: 'mock_signature_2' },
      fee_per_gram: 1500,
      timestamp: 1640995260
    }
  ]
}

export const mockBlockData = {
  headers: [
    {
      height: 12345,
      timestamp: 1640995200,
      pow: { pow_algo: 1 },
      hash: { data: 'block_hash_1' },
      kernels: 5,
      outputs: 10
    },
    {
      height: 12346,
      timestamp: 1640995260,
      pow: { pow_algo: 2 },
      hash: { data: 'block_hash_2' },
      kernels: 3,
      outputs: 8
    }
  ]
}

export const mockVNData = {
  activeVns: [
    {
      public_key: 'vn_key_1',
      shard_key: 'shard_1',
      committee: 'committee_1'
    },
    {
      public_key: 'vn_key_2', 
      shard_key: 'shard_2',
      committee: 'committee_2'
    }
  ]
}

export const mockKernelSearchData = {
  results: [
    {
      block_height: 12345,
      kernel_index: 0,
      signature: 'kernel_signature_1'
    },
    {
      block_height: 12346,
      kernel_index: 1,
      signature: 'kernel_signature_2'
    }
  ]
}
