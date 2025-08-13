# Auth System - Clean Code Architecture

## 📁 Structure Overview

```
src/
├── hooks/                          # Business Logic Layer
│   ├── useLoginForm.ts             # Login form state & validation
│   └── useUserDropdown.ts          # User dropdown behavior
├── components/auth/                # UI Components Layer
│   ├── index.ts                    # Clean exports
│   ├── LoginLayout.tsx             # Layout wrapper
│   ├── LoginCard.tsx               # Card container
│   ├── LoginHeader.tsx             # Header with logo & title
│   ├── LoginForm.tsx               # Form fields & submission
│   ├── DemoCredentials.tsx         # Demo info display
│   ├── LoginFooter.tsx             # Footer info
│   ├── UserDropdown.tsx            # Main user dropdown
│   ├── UserProfileButton.tsx       # Profile button UI
│   └── UserDropdownMenu.tsx        # Dropdown menu UI
├── contexts/
│   └── AuthContext.tsx             # Global auth state
└── app/
    └── login/page.tsx              # Login page orchestrator
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**

- **Hooks**: Business logic, state management, API calls
- **Components**: Pure UI presentation, no business logic
- **Context**: Global state management
- **Pages**: Component orchestration

### 2. **Component Composition**

```tsx
// Page Level - Orchestrator
<LoginLayout>
  <LoginHeader />
  <LoginCard>
    <LoginForm />
    <DemoCredentials />
  </LoginCard>
  <LoginFooter />
</LoginLayout>
```

### 3. **Business Logic Isolation**

```tsx
// Hook handles all logic
const { credentials, isLoading, error, updateField, handleSubmit } =
  useLoginForm();

// Component only handles presentation
<LoginForm
  credentials={credentials}
  onFieldChange={updateField}
  onSubmit={handleSubmit}
/>;
```

## 🔧 Implementation Details

### **Login System**

#### `useLoginForm.ts` - Business Logic

- Form state management
- Validation logic
- Error handling
- Integration with AuthContext

#### `LoginForm.tsx` - UI Component

- Form field rendering
- Event delegation to props
- Loading states
- Error display

#### `LoginPage.tsx` - Orchestrator

- Connects hooks to components
- Minimal logic, maximum composition

### **User Dropdown System**

#### `useUserDropdown.ts` - Business Logic

- Dropdown state (open/close)
- Click outside detection
- Logout functionality
- User data access

#### `UserDropdown.tsx` - Main Component

- Combines ProfileButton + DropdownMenu
- Uses composition pattern

#### `UserProfileButton.tsx` & `UserDropdownMenu.tsx` - UI Parts

- Isolated UI concerns
- Reusable components
- Props-based configuration

## 📋 Benefits

### **Maintainability**

- Easy to test business logic in isolation
- UI components are pure and predictable
- Clear responsibility boundaries

### **Reusability**

- Hooks can be used in different components
- UI components are interchangeable
- Composition over inheritance

### **Scalability**

- Easy to add new authentication methods
- Simple to extend UI without touching logic
- Clean imports with index.ts

### **Developer Experience**

- Clear file structure
- Predictable patterns
- Easy debugging

## 🧪 Testing Strategy

### **Business Logic (Hooks)**

```tsx
// Test form validation
const { result } = renderHook(() => useLoginForm());
act(() => {
  result.current.updateField("username", "admin");
});
expect(result.current.credentials.username).toBe("admin");
```

### **UI Components**

```tsx
// Test component rendering
render(
  <LoginForm
    credentials={{ username: "", password: "" }}
    onFieldChange={jest.fn()}
    onSubmit={jest.fn()}
  />
);
expect(screen.getByRole("textbox")).toBeInTheDocument();
```

## 🔄 Usage Examples

### **Login Flow**

1. User loads `/login` page
2. `useLoginForm` manages form state
3. `LoginForm` renders UI with current state
4. User submits → hook handles validation
5. AuthContext manages global auth state
6. Automatic redirect on success

### **Logout Flow**

1. User clicks profile in header
2. `useUserDropdown` manages dropdown state
3. User clicks logout
4. AuthContext clears auth state
5. Automatic redirect to login

## 🎯 Key Patterns Used

1. **Custom Hooks Pattern** - Business logic extraction
2. **Composition Pattern** - Building complex UI from simple parts
3. **Provider Pattern** - Global state management
4. **Controlled Components** - Predictable form handling
5. **Clean Imports** - Better developer experience

This architecture ensures maintainable, testable, and scalable authentication system with clear separation between UI and business logic.
