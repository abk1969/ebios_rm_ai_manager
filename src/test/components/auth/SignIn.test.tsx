import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '@/pages/auth/SignIn';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Mock Firebase Auth
vi.mock('@/services/firebase/auth', () => ({
  signIn: vi.fn().mockImplementation((email: string, password: string) => {
    if (email === 'test@example.com' && password === 'validpassword') {
      return Promise.resolve({ user: { uid: 'test-uid' } });
    }
    return Promise.reject(new Error('auth/invalid-credentials'));
  })
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('SignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderSignIn = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <SignIn />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  const mockSignIn = async (email: string, password: string) => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    const submitButton = screen.getByRole('button', { name: /se connecter/i });

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(submitButton);
  };

  it('should render sign in form', () => {
    renderSignIn();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
  });

  it('should show error message on invalid credentials', async () => {
    renderSignIn();
    
    await mockSignIn('invalid@email.com', 'wrongpassword');

    await waitFor(() => {
      expect(screen.getByText(/email ou mot de passe invalide/i)).toBeInTheDocument();
    });
  });

  it('should redirect on successful login', async () => {
    renderSignIn();
    
    await mockSignIn('test@example.com', 'validpassword');

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith('/app');
    });
  });
});