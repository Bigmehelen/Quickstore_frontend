import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout as logoutAction, selectCurrentUser, selectIsAuthenticated } from '../apislice/auth/authSlice';
import { useLoginMutation, useRegisterMutation } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // RTK Query hooks (ready for real backend)
  const [loginTrigger] = useLoginMutation();
  const [registerTrigger] = useRegisterMutation();

  // Mock implementation for demo (since no backend is provided)
  const register = ({ name, email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Normally you'd use registerTrigger here
        const newUser = { id: Date.now(), name, email };
        dispatch(setCredentials({ user: newUser, token: 'mock-token' }));
        resolve(newUser);
      }, 700);
    });
  };

  const login = ({ email, password }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Normally you'd use loginTrigger here
        if (email && password) {
          const user = { id: 1, name: 'Demo User', email };
          dispatch(setCredentials({ user, token: 'mock-token' }));
          resolve(user);
        } else {
          reject(new Error('Invalid email or password.'));
        }
      }, 700);
    });
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
