import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { isMongoConnected, localStore } from '../db.ts';
import { UserModel } from '../models/User.ts';
import { AuthRequest } from '../middleware/auth.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'aa_properties_kano_jwt_super_secret_key_2026';

// Validate Nigerian phone numbers (e.g. 080..., 090..., 070..., 081... or +234...)
function isValidNigerianPhone(phone: string): boolean {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\+]/g, '');
  // Matches 11 digits starting with 07, 08, 09 or 13 digits starting with 2347, 2348, 2349
  return /^(0[789][01]\d{8}|234[789][01]\d{8})$/.test(cleaned);
}

function sanitizeUser(user: any) {
  return {
    id: user._id?.toString() || user.id,
    _id: user._id?.toString() || user.id,
    fullName: user.fullName,
    phone: user.phone,
    email: user.email,
    role: user.role,
    avatar: user.avatar || '',
    favorites: user.favorites || [],
    location: user.location || 'Kano, Nigeria',
    isVerified: !!user.isVerified,
    createdAt: user.createdAt,
  };
}

export async function signUp(req: Request, res: Response) {
  try {
    const { fullName, phone, email, password } = req.body;

    if (!fullName || !phone || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Da fatan a cika dukkan bayanan (Please fill in all required fields)',
      });
    }

    if (!isValidNigerianPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Lambar waya ba daidai ba ce. Lambar Najeriya mai lambobi 11 ake bukata misali: 08012345678',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Adireshin email ba daidai ba ne (Invalid email address)',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password ya zama akalla haruffa ko lambobi 6 (Password must be at least 6 characters)',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    if (isMongoConnected) {
      const existingEmail = await UserModel.findOne({ email: normalizedEmail });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'An riga an yi amfani da wannan email - Ka yi Sign In (This email is already registered)',
        });
      }

      const existingPhone = await UserModel.findOne({ phone: cleanPhone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'An riga an yi amfani da wannan lambar wayar (This phone number is already registered)',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await UserModel.create({
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        favorites: [],
        location: 'Kano, Nigeria',
        isVerified: false,
        lastLogin: new Date(),
      });

      const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
        expiresIn: '24h',
      });

      return res.status(201).json({
        success: true,
        message: `Barka da zuwa ${newUser.fullName}! An yi nasarar bude account.`,
        token,
        user: sanitizeUser(newUser),
      });
    } else {
      const users = localStore.getCollection('users');
      const existingEmail = users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'An riga an yi amfani da wannan email - Ka yi Sign In (This email is already registered)',
        });
      }

      const existingPhone = users.find((u) => u.phone === cleanPhone);
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'An riga an yi amfani da wannan lambar wayar (This phone number is already registered)',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        _id: 'user_' + Date.now(),
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        favorites: [],
        location: 'Kano, Nigeria',
        isVerified: false,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);
      localStore.save();

      const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
        expiresIn: '24h',
      });

      return res.status(201).json({
        success: true,
        message: `Barka da zuwa ${newUser.fullName}! An yi nasarar bude account.`,
        token,
        user: sanitizeUser(newUser),
      });
    }
  } catch (err: any) {
    console.error('Sign up error:', err);
    return res.status(500).json({
      success: false,
      message: 'Kuskure ya faru wajen yin Sign Up (Server error during sign up)',
      error: err.message,
    });
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const { identifier, email, phone, password } = req.body;
    const loginInput = (identifier || email || phone || '').trim();

    if (!loginInput || !password) {
      return res.status(400).json({
        success: false,
        message: 'Shigar da Email ko Lambar Waya da Password',
      });
    }

    let user: any = null;

    if (isMongoConnected) {
      user = await UserModel.findOne({
        $or: [
          { email: loginInput.toLowerCase() },
          { phone: loginInput },
        ],
      });
    } else {
      const users = localStore.getCollection('users');
      user = users.find(
        (u) =>
          u.email.toLowerCase() === loginInput.toLowerCase() ||
          u.phone === loginInput
      );
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email ko password ba daidai ba - Ka sake gwadawa (Invalid credentials)',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Email ko password ba daidai ba - Ka sake gwadawa (Invalid credentials)',
      });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    if (isMongoConnected) {
      await user.save();
    } else {
      localStore.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.json({
      success: true,
      message: `Barka da dawowa, ${user.fullName}!`,
      token,
      user: sanitizeUser(user),
    });
  } catch (err: any) {
    console.error('Sign in error:', err);
    return res.status(500).json({
      success: false,
      message: 'Kuskure ya faru wajen Sign In',
      error: err.message,
    });
  }
}

export async function adminLogin(req: Request, res: Response) {
  try {
    const { whatsapp, phone, pin, password } = req.body;
    const inputPhone = (whatsapp || phone || '').trim();
    const inputSecret = (pin || password || '').trim();

    if (!inputPhone || !inputSecret) {
      return res.status(400).json({
        success: false,
        message: 'Shigar da Lambar WhatsApp da PIN/Password na Admin',
      });
    }

    let admin: any = null;
    if (isMongoConnected) {
      admin = await UserModel.findOne({
        role: 'admin',
        $or: [{ phone: inputPhone }, { email: inputPhone.toLowerCase() }],
      });
    } else {
      const users = localStore.getCollection('users');
      admin = users.find(
        (u) =>
          u.role === 'admin' &&
          (u.phone === inputPhone || u.email.toLowerCase() === inputPhone.toLowerCase())
      );
    }

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Ba kai ba ne - Kira Adam 09042782681 (Only Admin Adam can access this area)',
      });
    }

    // Match either passwordHash or pin
    let isMatch = await bcrypt.compare(inputSecret, admin.passwordHash);
    if (!isMatch && admin.pin) {
      isMatch = await bcrypt.compare(inputSecret, admin.pin);
    }

    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: 'Ba kai ba ne - Kira Adam 09042782681 (Incorrect Admin PIN or password)',
      });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.json({
      success: true,
      message: 'Barka da zuwa Adam! Shugaban A.A Properties Kano.',
      token,
      user: sanitizeUser(admin),
    });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Kuskure ya faru wajen shiga Admin',
      error: err.message,
    });
  }
}

export async function getMe(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    return res.json({
      success: true,
      user: sanitizeUser(req.user),
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

export async function logout(_req: Request, res: Response) {
  return res.json({
    success: true,
    message: 'An fita lafiya daga account (Successfully logged out)',
  });
}

export async function forgotPassword(req: Request, res: Response) {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Shigar da lambar waya' });
  }

  // Demo OTP code
  const code = '774921';
  console.log(`[DEMO OTP] Password reset code for ${phone} is: ${code}`);

  return res.json({
    success: true,
    message: `An aike da lambar sirri (OTP) zuwa ${phone}. Lambar gwaji ita ce: ${code}`,
    code,
  });
}

export async function resetPassword(req: Request, res: Response) {
  const { phone, code, newPassword } = req.body;
  if (!phone || !code || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Cika dukkan bayanan (Phone, code, and new password required)',
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password ya zama akalla haruffa 6',
    });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  if (isMongoConnected) {
    const user = await UserModel.findOne({ phone: phone.trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Babu wannan mai amfani' });
    }
    user.passwordHash = passwordHash;
    await user.save();
  } else {
    const users = localStore.getCollection('users');
    const user = users.find((u) => u.phone === phone.trim());
    if (!user) {
      return res.status(404).json({ success: false, message: 'Babu wannan mai amfani' });
    }
    user.passwordHash = passwordHash;
    localStore.save();
  }

  return res.json({
    success: true,
    message: 'An canza password cikin nasara! Zaka iya shiga yanzu.',
  });
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const { fullName, phone, location, avatar } = req.body;
    const userId = req.user._id || req.user.id;

    if (isMongoConnected) {
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (fullName) user.fullName = fullName.trim();
      if (phone) user.phone = phone.trim();
      if (location) user.location = location.trim();
      if (avatar !== undefined) user.avatar = avatar;
      await user.save();
      return res.json({ success: true, message: 'An sabunta bayananka!', user: sanitizeUser(user) });
    } else {
      const users = localStore.getCollection('users');
      const user = users.find((u) => u._id === userId || u.id === userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      if (fullName) user.fullName = fullName.trim();
      if (phone) user.phone = phone.trim();
      if (location) user.location = location.trim();
      if (avatar !== undefined) user.avatar = avatar;
      localStore.save();
      return res.json({ success: true, message: 'An sabunta bayananka!', user: sanitizeUser(user) });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
