import { Job } from 'bull';
import { mail } from 'src/config/mail';
import { Logger } from '@nestjs/common';
import { MailerService, ISendMailOptions } from '@nestjs-modules/mailer';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';

@Processor(mail.queueName)
export class MailProcessor {
    private readonly logger = new Logger(this.constructor.name);

    constructor(private readonly mailerService: MailerService) {}

    @OnQueueActive()
    onActive(job: Job) {
        this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
    }

    @OnQueueCompleted()
    onComplete(job: Job, result: any) {
        this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
    }

    @OnQueueFailed()
    onError(job: Job<any>, error: any) {
        this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
    }

    @Process('common')
    async sendEmail(
        job: Job<{
            type: string;
            payload: ISendMailOptions;
        }>
    ): Promise<any> {
        this.logger.log(`Sending email to '${job.data.payload.to}'`);
        try {
            return await this.mailerService.sendMail({ ...job.data.payload });
        } catch (error) {
            this.logger.error(`Failed to send email to '${job.data.payload.to}'`, error.stack);
            throw error;
        }
    }
}
