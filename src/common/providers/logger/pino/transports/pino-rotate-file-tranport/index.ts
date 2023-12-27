import * as path from 'node:path';
import { once } from 'node:events';
import * as objectHash from 'object-hash';
import { getStream } from 'file-stream-rotator';
import { TransportOptions } from './interface';

function getMaxSize(size) {
    if (size && typeof size === 'string') {
        var _s = size.toLowerCase().match(/^((?:0\.)?\d+)([k|m|g])$/);
        if (_s) {
            return size;
        }
    } else if (size && Number.isInteger(size)) {
        var sizeK = Math.round(size / 1024);
        return sizeK === 0 ? '1k' : sizeK + 'k';
    }

    return null;
}

export default async function (options: TransportOptions) {
    const filename = options.filename ? path.basename(options.filename) : 'pino.log.%DATE%';
    const dirname = options.dirname || path.dirname(options.filename);

    const stream = getStream({
        filename: path.join(dirname, filename),
        frequency: options.frequency ? options.frequency : 'custom',
        date_format: options.datePattern ? options.datePattern : 'YYYY-MM-DD',
        verbose: false,
        size: getMaxSize(options.maxSize),
        max_logs: options.maxFiles,
        end_stream: true,
        audit_file: options.auditFile
            ? options.auditFile
            : path.join(dirname, '.' + objectHash(options) + '-audit.json'),
        file_options: options.options ? options.options : { flags: 'a' },
        utc: options.utc ? options.utc : false,
        extension: options.extension ? options.extension : '',
        create_symlink: options.createSymlink ? options.createSymlink : false,
        symlink_name: options.symlinkName ? options.symlinkName : 'current.log',
        audit_hash_type: options.auditHashType ? options.auditHashType : 'sha256'
    });

    await once(stream, 'open');
    return stream;
}
