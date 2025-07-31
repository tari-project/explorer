# Tari Explorer Type System

This directory contains comprehensive TypeScript type definitions for the Tari Block Explorer. The types are organized into separate files based on their domain and usage.

## Type Organization

### 📁 File Structure

```
src/types/
├── index.ts          # Main export file - import all types from here
├── api.ts            # API responses and blockchain data structures
├── components.ts     # React component props and UI types
├── stores.ts         # State management and store types
├── utils.ts          # Utility types and helper function signatures
└── README.md         # This documentation
```

## 🚀 Quick Start

### Basic Import

```typescript
// Import commonly used types
import type { BlockHeader, ApiError, PageLayoutProps } from '@types';

// Or import specific categories
import type { TransactionKernel, MainApiResponse } from '@types/api';
import type { ButtonProps, GridProps } from '@types/components';
```

### Using Path Aliases

The project is configured with TypeScript path aliases:

```typescript
// These are equivalent:
import type { BlockData } from '@types';
import type { BlockData } from '@types/api';
import type { BlockData } from '../types/api';
```

## 📊 Type Categories

### 1. API Types (`api.ts`)

**Core Blockchain Data:**

- `BlockHeader` - Complete block header structure
- `BlockData` - Simplified block data for lists
- `TransactionKernel` - Transaction kernel structure
- `TransactionInput` - Transaction input structure
- `TransactionOutput` - Transaction output structure
- `MempoolTransaction` - Mempool transaction structure
- `ValidatorNode` - Validator node information

**API Responses:**

- `MainApiResponse` - Main endpoint response (/?json)
- `BlockDetailResponse` - Single block detail response
- `KernelSearchResponse` - Kernel search results
- `PayRefSearchResponse` - Payment reference search results

**Utility Types:**

- `HexData` - Hex-encoded binary data structure `{ data: string }`
- `ApiError` - Standardized error structure
- `PowAlgorithm` - Proof of Work algorithm enumeration
- `SearchType` - Search type enumeration

### 2. Component Types (`components.ts`)

**Layout Components:**

- `PageLayoutProps` - Main page layout props
- `MainLayoutProps` - Application layout props
- `HeaderProps` - Header component props

**Block Components:**

- `BlockTableProps` - Block table component props
- `BlockInfoProps` - Block info component props
- `BlockPartsProps` - Block parts (inputs/outputs/kernels) props

**Chart Components:**

- `BlockTimesChartProps` - Block times chart props
- `HashRatesChartProps` - Hash rates chart props
- `POWChartProps` - Proof of Work distribution chart props

**Utility Components:**

- `LoadingProps` - Loading indicator props
- `ErrorProps` - Error display props
- `CopyToClipboardProps` - Copy to clipboard props

### 3. Store Types (`stores.ts`)

**Application Stores:**

- `MainStore` - Main application state (mobile menu, modals, etc.)
- `SearchStatusStore` - Search operation status
- `ThemeStore` - Theme preferences
- `NavigationStore` - Navigation state
- `UserPreferencesStore` - User preferences and settings

**Store Utilities:**

- `StoreCreator<T>` - Zustand store creator type
- `StoreSelector<T, U>` - Store selector function type
- `PersistOptions<T>` - Store persistence configuration

### 4. Utility Types (`utils.ts`)

**Generic Utilities:**

- `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>` - TypeScript utility types
- `ApiResponse<T>` - Generic API response wrapper
- `PaginatedResponse<T>` - Paginated API response wrapper

**Form and Validation:**

- `ValidationResult` - Form validation result
- `FieldState<T>` - Form field state
- `ValidationSchema<T>` - Form validation schema

**Theme and UI:**

- `Theme` - Complete theme object structure
- `ColorScheme` - Color definitions
- `Breakpoints` - Responsive breakpoint definitions

## 🎯 Best Practices

### 1. Importing Types

**✅ Good:**

```typescript
// Import types with type-only imports
import type { BlockHeader, ApiError } from '@types';

// Import specific categories when needed
import type { MainStore } from '@types/stores';
```

**❌ Avoid:**

```typescript
// Don't import types as values
import { BlockHeader } from '@types'; // ❌

// Don't import from deep paths when alias exists
import { BlockHeader } from '../../../types/api'; // ❌
```

### 2. Component Props

**✅ Good:**

```typescript
import type { BlockTableProps } from '@types';

const BlockTable: React.FC<BlockTableProps> = ({
  blocks,
  loading,
  onPageChange,
}) => {
  // Component implementation
};
```

**✅ Also Good:**

```typescript
// For simple components, inline props are acceptable
interface SimpleComponentProps {
  title: string;
  onClick: () => void;
}

const SimpleComponent: React.FC<SimpleComponentProps> = ({
  title,
  onClick,
}) => {
  // Component implementation
};
```

### 3. API Response Handling

**✅ Good:**

```typescript
import type { MainApiResponse, ApiError } from '@types';

const useBlockData = () => {
  const { data, error } = useQuery<MainApiResponse, ApiError>({
    queryKey: ['blocks'],
    queryFn: fetchBlocks,
  });

  return { data, error };
};
```

### 4. Store Usage

**✅ Good:**

```typescript
import type { MainStore } from '@types';
import { useMainStore } from '@services/stores/useMainStore';

// With selector
const isMobile = useMainStore((state: MainStore) => state.isMobile);

// Without selector
const store = useMainStore();
```

## 🔧 Extending Types

### Adding New API Types

When adding new API endpoints or data structures:

1. Add the new types to `api.ts`
2. Follow the existing patterns (use `HexData` for binary data)
3. Export the types from `index.ts` (happens automatically)
4. Update this README with the new types

**Example:**

```typescript
// In api.ts
export interface NewBlockchainData {
  id: HexData;
  timestamp: number;
  metadata: {
    version: number;
    type: string;
  };
}

export interface NewApiResponse {
  data: NewBlockchainData[];
  total: number;
}
```

### Adding New Component Props

When creating new components:

1. Define props interface in `components.ts`
2. Use descriptive names ending in `Props`
3. Extend base interfaces when appropriate
4. Include JSDoc comments for complex props

**Example:**

```typescript
// In components.ts
/**
 * Props for the new feature component
 */
export interface NewFeatureProps extends BaseComponentProps {
  /** The data to display */
  data: NewBlockchainData[];
  /** Whether the component is in loading state */
  loading?: boolean;
  /** Callback when user interacts with the component */
  onAction: (action: string, data: NewBlockchainData) => void;
}
```

## 📝 Migration Guide

### From Inline Types to Centralized Types

**Before:**

```typescript
// In component file
interface Props {
  blocks: any[];
  loading: boolean;
}

const BlockTable: React.FC<Props> = ({ blocks, loading }) => {
  // ...
};
```

**After:**

```typescript
// Props defined in types/components.ts
import type { BlockTableProps } from '@types';

const BlockTable: React.FC<BlockTableProps> = ({ blocks, loading }) => {
  // ...
};
```

### From `any` Types to Specific Types

**Before:**

```typescript
const processBlockData = (data: any) => {
  return data.header.height;
};
```

**After:**

```typescript
import type { Block } from '@types';

const processBlockData = (data: Block) => {
  return data.header.height;
};
```

## 🐛 Troubleshooting

### Common Import Issues

**Problem:** `Cannot find module '@types'`
**Solution:** Make sure the path alias is configured in both `tsconfig.json` and your IDE settings.

**Problem:** `Type 'X' is not assignable to type 'Y'`
**Solution:** Check if you're using the correct type. The centralized types might be more specific than previous `any` types.

**Problem:** `Module has no exported member 'SomeType'`
**Solution:** Check that the type is properly exported from the appropriate file and re-exported from `index.ts`.

### IDE Configuration

For better development experience, make sure your IDE understands the TypeScript path mapping:

**VS Code:** Should work automatically with `tsconfig.json`
**WebStorm:** May need to mark `src` as "Sources Root"

## 🔄 Maintenance

### Regular Tasks

1. **Review and Update:** Regularly review types for accuracy as the API evolves
2. **Deprecation:** Use `@deprecated` JSDoc tags for types being phased out
3. **Documentation:** Keep this README updated with new type categories
4. **Validation:** Ensure types match actual API responses and component usage

### Breaking Changes

When making breaking changes to types:

1. Mark old types as `@deprecated` first
2. Provide migration path in JSDoc comments
3. Update all usage gradually
4. Remove deprecated types after migration is complete

---

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Zustand TypeScript Guide](https://github.com/pmndrs/zustand#typescript)

For questions or suggestions about the type system, please check the existing GitHub issues or create a new one.
