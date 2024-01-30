import { Queue } from 'bull';
import { mail } from 'src/config/mail';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(@InjectQueue(mail.queueName) private mailQueue: Queue) {}

    sendRegisterConfirmMail(payload: ISendMailOptions) {
        return this.sendMail('common', {
            template: 'registerConfirm',
            subject: '请确认你的电子邮件',
            ...payload
        });
    }

    sendResetPasswordMail(payload: ISendMailOptions) {
        return this.sendMail('common', {
            template: 'resetPassword',
            subject: '重置密码',
            ...payload
        });
    }

    async sendMail(type: string, payload: ISendMailOptions) {
        try {
            await this.mailQueue.add(type, { payload });
            return true;
        } catch (error) {
            return false;
        }
    }
}
