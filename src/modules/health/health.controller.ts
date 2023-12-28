import { PrismaService } from 'nestjs-prisma';
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, PrismaHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private prismaHealth: PrismaHealthIndicator,
        private prisma: PrismaService,
        private readonly disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () =>  this.prismaHealth.pingCheck('prisma', this.prisma),
            () => this.disk.checkStorage('storage', { path: '/', thresholdPercent: 0.5 }),
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024)
        ]);
    }
}
