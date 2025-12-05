/**
 * Authentication Routes
 * All auth-related API endpoints
 * 
 * @module routes/auth.routes
 */

import { Router, Request, Response } from 'express';
import { AuthService, RegisterInput, LoginInput } from '../services/AuthService';
import { authenticate, requireRole } from '../middleware/auth';
import { getAuthLimiter, getPasswordResetLimiter } from '../middleware/rateLimiter';
import { validatePassword, PASSWORD_REQUIREMENTS } from '../utils/password';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', getAuthLimiter(), async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone, role } = req.body;

    // Validate required fields
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required',
        errorCode: 'MISSING_FIELDS'
      });
    }

    // Validate role
    const validRoles = ['CUSTOMER', 'PROMOTER'];
    const userRole = role || 'CUSTOMER';
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be CUSTOMER or PROMOTER',
        errorCode: 'INVALID_ROLE'
      });
    }

    const input: RegisterInput = {
      email: email.trim().toLowerCase(),
      password,
      full_name: full_name.trim(),
      phone: phone?.trim() || undefined,
      role: userRole
    };

    const result = await AuthService.register(input);

    if (!result.success) {
      const statusCode = result.errorCode === 'EMAIL_EXISTS' ? 409 : 400;
      return res.status(statusCode).json({
        success: false,
        error: result.error,
        errorCode: result.errorCode
      });
    }

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.tokens!.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens!.accessToken,
        expiresAt: result.tokens!.accessTokenExpiresAt
      }
    });
  } catch (error) {
    console.error('Register route error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', getAuthLimiter(), async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
        errorCode: 'MISSING_FIELDS'
      });
    }

    const input: LoginInput = {
      email: email.trim().toLowerCase(),
      password,
      ip_address: req.ip || req.socket.remoteAddress,
      user_agent: req.headers['user-agent'],
      device_fingerprint: req.headers['x-device-fingerprint'] as string
    };

    const result = await AuthService.login(input);

    if (!result.success) {
      const statusCode = result.errorCode === 'ACCOUNT_LOCKED' ? 423 : 401;
      return res.status(statusCode).json({
        success: false,
        error: result.error,
        errorCode: result.errorCode
      });
    }

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', result.tokens!.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      data: {
        user: result.user,
        accessToken: result.tokens!.accessToken,
        expiresAt: result.tokens!.accessTokenExpiresAt
      }
    });
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (revoke refresh token)
 * @access  Private
 */
router.post('/logout', authenticate, async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (refreshToken) {
      await AuthService.logout(
        req.user!.userId,
        refreshToken,
        req.ip,
        req.headers['user-agent']
      );
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout route error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post('/logout-all', authenticate, async (req: Request, res: Response) => {
  try {
    await AuthService.logoutAll(req.user!.userId);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out from all devices'
    });
  } catch (error) {
    console.error('Logout all route error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (with valid refresh token)
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
        errorCode: 'NO_REFRESH_TOKEN'
      });
    }

    const result = await AuthService.refreshTokens(refreshToken);

    if (!result.success) {
      res.clearCookie('refreshToken');
      return res.status(401).json({
        success: false,
        error: result.error,
        errorCode: 'INVALID_REFRESH_TOKEN'
      });
    }

    // Set new refresh token in cookie
    res.cookie('refreshToken', result.tokens!.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: {
        accessToken: result.tokens!.accessToken,
        expiresAt: result.tokens!.accessTokenExpiresAt
      }
    });
  } catch (error) {
    console.error('Refresh route error:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset email
 * @access  Public
 */
router.post('/forgot-password', getPasswordResetLimiter(), async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
        errorCode: 'MISSING_EMAIL'
      });
    }

    await AuthService.requestPasswordReset(
      email.trim().toLowerCase(),
      req.ip,
      req.headers['user-agent']
    );

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process request',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password', getPasswordResetLimiter(), async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token and new password are required',
        errorCode: 'MISSING_FIELDS'
      });
    }

    const result = await AuthService.resetPassword(token, password);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        errorCode: 'RESET_FAILED'
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password route error:', error);
    res.status(500).json({
      success: false,
      error: 'Password reset failed',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email using token
 * @access  Public
 */
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required',
        errorCode: 'MISSING_TOKEN'
      });
    }

    const result = await AuthService.verifyEmail(token);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        errorCode: 'VERIFICATION_FAILED'
      });
    }

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify email route error:', error);
    res.status(500).json({
      success: false,
      error: 'Email verification failed',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password (for logged-in users)
 * @access  Private
 */
router.post('/change-password', authenticate, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current and new password are required',
        errorCode: 'MISSING_FIELDS'
      });
    }

    const result = await AuthService.changePassword(
      req.user!.userId,
      currentPassword,
      newPassword
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
        errorCode: 'CHANGE_PASSWORD_FAILED'
      });
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, async (req: Request, res: Response) => {
  try {
    const user = await AuthService.getUserById(req.user!.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        errorCode: 'USER_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get me route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user',
      errorCode: 'SERVER_ERROR'
    });
  }
});

/**
 * @route   GET /api/auth/password-requirements
 * @desc    Get password requirements
 * @access  Public
 */
router.get('/password-requirements', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: PASSWORD_REQUIREMENTS
  });
});

/**
 * @route   POST /api/auth/validate-password
 * @desc    Validate a password against requirements
 * @access  Public
 */
router.post('/validate-password', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      error: 'Password is required'
    });
  }

  const validation = validatePassword(password);

  res.json({
    success: true,
    data: {
      valid: validation.valid,
      errors: validation.errors
    }
  });
});

export default router;
