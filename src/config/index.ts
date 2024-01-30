import { app } from './app';
import { log } from './log';
import { sms } from './sms';
import { mail } from './mail';
import { oauth } from './oauth';

export default () => ({
    app,
    log,
    mail,
    sms,
    oauth
});
