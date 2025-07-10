import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from './dto/refreshtoken.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { LoginUserDto } from './dto/loginUser.dto';
import { sendOtpEmailDto } from './dto/sendOtpEmail.dto';
import { MailService } from 'src/mail/mail.service';
import { verifyOtpDto } from './dto/verify-otp.dto';
import { Request } from 'express';
import { CreateAdminrDto } from './dto/createAdmin.dto';
import { ResetPasswordDto } from './dto/resetPassport.dto';
import { ResetPasswordEmailDto } from './dto/resetOtpToEmail.dto';


@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly jwt: JwtService,
  ){}

  genAccToken(payload:{id:string, role:string}):string{
    return this.jwt.sign(payload,{expiresIn:'1d'})
  }

  generateRefreshToken(payload:{id:string,role:string}):string {
    return this.jwt.sign(payload,{
      secret: process.env.TOKEN_KEY_REFRESH,
      expiresIn: '7d'
    })
  }

  async checkEmail(email: string) {
    try {
      let user = await this.prisma.user.findFirst({ where: { email } });
      return user;
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }

  
  verifyRefreshToken(tokenDto: RefreshTokenDto) {
    try {
      const data = this.jwt.verify(tokenDto.token, {
        secret: process.env.TOKEN_KEY_REFRESH,
      });
      const payload = { id: data.id, role: data.role };
      const accessToken = this.genAccToken(payload);
      return { accessToken };
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }

  async sentOtpEmail(data: sendOtpEmailDto) {
    try {
      let userEmail = await this.checkEmail(data.email);
      if (userEmail) throw new BadRequestException('Email already exists!');
      const otp = this.mail.createOtp(data.email);
      const message = await this.mail.sendEmail(
        data.email,
        'ONE-TIME PASSWORD',
        `<h4>Your login password is <h3><u>${otp}</u></h3>. It is valid for 2 minutes.</h4>`,
      );
      return { message };
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }

  verifyOtp(data: verifyOtpDto) {
    try {
      const match = this.mail.checkOtp(data.otp, data.email);
      return { result: match };
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }



  async create(data: CreateUserDto) {
    try {
      let user = await this.checkEmail(data.email);
      if(user){
        throw new BadRequestException({message: "Email already exists!"})
      }

      let username = await this.prisma.user.findFirst({where:{username:data.username}})
      if(username){
        throw new NotFoundException({message: "Username already exists!"})
      }

      let hash = bcrypt.hashSync(data.password, 10)
      let newUser= await this.prisma.user.create({
        data: {...data, password: hash}
      })

      return newUser;
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async login(data: LoginUserDto,req: Request) {
    try {
      let user = await this.checkEmail(data.email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      let isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Wrong credentials!!');
      }
    
      let payload = { id: user.id, role: user.role };
      let accessToken = this.genAccToken(payload);
      let refreshToken = this.generateRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error)
      throw new BadRequestException({message: error.message});
    }
  }
 


  async resetPassword(data: ResetPasswordDto) {
    try {
      let {email,otp,newPassword} = data
      const match = this.mail.checkOtp(otp, email);
      if (!match) throw new BadRequestException('Invalid or expired OTP');
  
      const user = await this.checkEmail(email);
      if (!user) throw new NotFoundException('User not found');
  
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
  
      return { message: 'Password has been successfully reset.' };
    } catch (error) {
      console.log(error)
      throw new BadRequestException({ message: error.message });
    }
  }


  async sendResetPasswordEmail(data: ResetPasswordEmailDto) {
    try {
      let {email} = data
      const user = await this.checkEmail(email);
      if (!user) throw new NotFoundException('User not found!');
  
      const otp = this.mail.createOtp(email);
      const message = await this.mail.sendEmail(
        email,
        'Password Reset Request',
        `<h4>Your password reset code is <h3><u>${otp}</u></h3>. It is valid for 2 minutes.</h4>`
      );
  
      return { message };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }
  
  

  async me(id: string) {
    try {
      return await this.prisma.user.findFirst({
        where: { id },
        include: {
          createdNFTs: true,
          ownedNFTs: true,
          collections: true,
          auctionResults: true
        },
      });
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }

  async findAll(params: {
    page: number;
    limit: number;
    username?: string;
    email?: string;
    role?: UserRole;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page,
      limit,
      username,
      email,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;
  
    const skip = (Number(page) - 1) * Number(limit);
  
    const where: any = {};
  
    if (username) {
      where.username = { contains: username, mode: 'insensitive' };
    }
  
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }
  
  
  
    if (role) {
      where.role = role;
    }
  
    try {
      const data = await this.prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          createdNFTs: true,
          ownedNFTs: true,
          collections: true
        },
      });
    
      const total = await this.prisma.user.count({ where });
    
      return {
        data,
        meta: {
          total,
          page: Number(page),
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
  

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id },
        include: {
          createdNFTs: true,
          ownedNFTs: true,
          collections: true,
          auctionResults: true
        },
      });
  
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }

  async update(id: string, dto: UpdateUserDto) {
    try {
     await this.findOne(id)
      return await this.prisma.user.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new BadRequestException({message: error.message});
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      
      await this.prisma.$transaction(async (tx) => {
        await tx.follower.deleteMany({
          where: {
            OR: [{ artistId: id }, { followerId: id }],
          },
        });
  
        await tx.auctionResult.deleteMany({
          where: { buyerId: id },
        });
  
        await tx.collection.deleteMany({
          where: { creatorId: id },
        });
  
        await tx.nFT.deleteMany({
          where: {
            OR: [{ creatorId: id }, { ownerId: id }],
          },
        });
  
        await tx.user.delete({
          where: { id },
        });
      });
  
      return { message: 'User and all related data deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new BadRequestException({message: error.message});
    }
  }
  

  async createAdmin(data: CreateAdminrDto) {
    try {
      const exists = await this.checkEmail(data.email)
      if (exists) throw new BadRequestException('Email already exists')
  
      let hash = bcrypt.hashSync(data.password,10)
      const admin = await this.prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hash,
          role: data.role,
        },
      })
  
      return admin
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
  
  async deleteAdmin(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } })
    } catch (error) {
      throw new BadRequestException({message: error.message})
    }
  }
}
