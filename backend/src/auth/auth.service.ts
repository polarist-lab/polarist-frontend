import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../database/schema';

export interface GoogleUser {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
  intent?: 'signup' | 'login';
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async googleLogin(googleUser: GoogleUser): Promise<{ user: User; accessToken: string }> {
    // Check if user exists
    let user = await this.usersService.findByGoogleId(googleUser.googleId);
    
    if (!user) {
      // Create new user if doesn't exist
      user = await this.usersService.create({
        googleId: googleUser.googleId,
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.avatar,
      });
    } else {
      // Update user info if exists
      user = await this.usersService.update(user.id, {
        name: googleUser.name,
        avatar: googleUser.avatar,
        updatedAt: new Date(),
      });
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }

  async validateUser(userId: number): Promise<User | null> {
    return this.usersService.findById(userId);
  }

  async handleGoogleSignup(googleUser: GoogleUser, guestId?: string): Promise<{ 
    user: User; 
    accessToken: string; 
    isNewUser: boolean; 
    guestDataMigrated: boolean;
  }> {
    // Check if user already exists
    const existingUser = await this.usersService.findByGoogleId(googleUser.googleId);
    
    if (existingUser) {
      // User already exists - signup should fail
      throw new Error('Account already exists');
    }

    // Create new user
    const user = await this.usersService.create({
      googleId: googleUser.googleId,
      email: googleUser.email,
      name: googleUser.name,
      avatar: googleUser.avatar,
    });

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    // Try to migrate guest data if guestId provided
    let guestDataMigrated = false;
    if (guestId) {
      try {
        guestDataMigrated = await this.migrateGuestData(user.id, guestId);
      } catch (error) {
        console.warn('Guest data migration failed during signup:', error);
      }
    }

    return {
      user,
      accessToken,
      isNewUser: true,
      guestDataMigrated,
    };
  }

  async handleGoogleLogin(googleUser: GoogleUser): Promise<{ 
    user: User; 
    accessToken: string; 
    accountExists: boolean;
  }> {
    // Check if user exists
    let user = await this.usersService.findByGoogleId(googleUser.googleId);
    
    if (!user) {
      // User doesn't exist - login should fail
      throw new Error('Account not found');
    }

    // Update user info
    user = await this.usersService.update(user.id, {
      name: googleUser.name,
      avatar: googleUser.avatar,
      updatedAt: new Date(),
    });

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
      accountExists: true,
    };
  }

  async migrateGuestData(userId: number, guestId: string): Promise<boolean> {
    try {
      // This is a placeholder for guest data migration logic
      // In a real implementation, you would:
      // 1. Fetch guest data from localStorage/temporary storage
      // 2. Convert it to user-specific format
      // 3. Save it to the user's profile/database
      // 4. Clean up guest data
      
      console.log(`Migrating guest data from ${guestId} to user ${userId}`);
      
      // For now, just return true to indicate success
      // This would be implemented based on your data storage strategy
      return true;
    } catch (error) {
      console.error('Guest data migration failed:', error);
      return false;
    }
  }
}