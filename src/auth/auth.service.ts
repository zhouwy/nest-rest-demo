import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { TwilioService } from 'nestjs-twilio';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/common/providers/mail/smtp/mail.service';
import { CacheService } from 'src/common/providers/cache/redis/cache.service';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
        private twilio: TwilioService,
        private cacheManager: CacheService,
        private readonly mailService: MailService
    ) {}

    // TODO: 邮件模版
    async createWithEmailAndPassword(registerUserDto: RegisterUserDto) {
        const { email, password, name } = registerUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const secret = authenticator.generateSecret();
        const confirmToken = authenticator.generate(secret);
        await this.cacheManager.set(email, confirmToken, 5 * 60 * 1000);

        await this.mailService.sendRegisterConfirmMail({
            to: email,
            context: {}
        });

        return this.prisma.userEmail.create({
            data: {
                email,
                password: hashedPassword,
                confirmToken,
                user: {
                    create: {
                        name
                    }
                }
            }
        });
    }

    async activateUser(user) {
        // return this.prisma.user.update({
        //     where: { id: user.email },
        //     data: {
        //         status: 1
        //     }
        // })
    }

    async validateUser(email: string, password: string) {
        const { user, ...userEmail } = await this.prisma.userEmail.findUnique({
            include: { user: true },
            where: { email }
        });

        if (user) {
            const passwordMatched = await bcrypt.compare(password, userEmail.password);
            if (passwordMatched) {
                return {
                    ...user,
                    email: userEmail.email
                };
            }
        }

        return null;
    }

    async sendOtpBySms(phone: string) {
        const secret = authenticator.generateSecret();
        const otp = authenticator.generate(secret);
        await this.cacheManager.set(phone, otp, 5 * 60 * 1000);

        await this.twilio.client.messages.create({
            body: `Your OTP is: ${otp}`,
            from: this.config.get('sms.twilio.phoneNumber'),
            to: phone
        });
    }

    async validateUserBySmsOtp(phone: string, enteredOtp: string) {
        const storedOtp = await this.cacheManager.get(phone);
        if (storedOtp === enteredOtp) {
            const { user } = await this.prisma.userSms.upsert({
                include: { user: true },
                where: { phone },
                update: {},
                create: {
                    phone,
                    user: {
                        create: {}
                    }
                }
            });
            return {
                ...user,
                phone
            };
        }
        return null;
    }

    async loginByOAuth(provider: string, openid: string, accessToken: string, refreshToken: string) {
        const { user } = await this.prisma.userOauth.upsert({
            include: { user: true },
            where: { provider_openid: { provider, openid } },
            update: {
                openid,
                accessToken,
                refreshToken
            },
            create: {
                provider,
                openid,
                accessToken,
                refreshToken,
                user: {
                    create: {}
                }
            }
        });
        return user;
    }
}
