import { Queue } from 'bull';
import { mail } from 'src/config/mail';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(@InjectQueue(mail.queueName) private mailQueue: Queue) {}

    sendConfirmMail(payload: ISendMailOptions) {
        return this.sendMail('common', {
            template: 'confirmation',
            context: {
                code: 1,
                username: 'test'
            },
            ...payload
        });
    }

    async sendMail(type: string, payload: ISendMailOptions) {
        try {
            await this.mailQueue.add(type, {
                payload
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}
