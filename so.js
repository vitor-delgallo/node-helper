const VDFileHelper = require('./file.js');
const os = require('os');
const fs = require('fs');
const pidusage = require('pidusage');

class VDSOHelper {
    /**
     * Retrieves server status, including CPU, memory, uptime, disk usage, and process stats.
     * @returns {Object} An object containing system, process, and disk usage details.
     */
    static async getServerStatus() {
        // Get system uptime in hours
        const uptime = os.uptime();
        const processUptime = process.uptime(); // Process uptime in minutes

        // Get disk usage (only for UNIX systems)
        let diskUsage = {};
        try {
            const diskStats = fs.statSync('/');
            diskUsage = {
                total: VDFileHelper.humanFileSize(diskStats.blksize * diskStats.blocks),
                free: VDFileHelper.humanFileSize(diskStats.blksize * diskStats.bfree)
            };
        } catch (err) {
            diskUsage = { error: 'Unable to retrieve disk usage data.' };
        }

        // Get system load average (1-minute average)
        const loadAverage = os.loadavg()[0];

        // Determine if the system is overloaded
        const cpuCount = os.cpus().length;
        const isOverloaded = loadAverage > cpuCount;

        // Get CPU and memory usage for the current Node.js process
        const pidStats = await pidusage(process.pid);

        // Get total and available system memory
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsage = (usedMem / totalMem) * 100; // Memory usage percentage

        return {
            system: {
                memory: {
                    total: VDFileHelper.humanFileSize(totalMem),
                    used: VDFileHelper.humanFileSize(usedMem),
                    free: VDFileHelper.humanFileSize(freeMem),
                    usage: memUsage.toFixed(2) + ' %',
                },
                cpu: {
                    loadAverage: loadAverage.toFixed(2),
                    cpuCount: cpuCount,
                    overloaded: isOverloaded, // true if loadAverage > cpuCount
                },
                uptime: (uptime / 60 / 60).toFixed(2) + ' hours',
            },
            process: {
                cpu: {
                    usage: pidStats.cpu.toFixed(2) + ' %',
                },
                memory: {
                    used: VDFileHelper.humanFileSize(pidStats.memory),
                    usage: ((pidStats.memory / totalMem) * 100).toFixed(2) + ' %', // Memory usage relative to total system memory
                },
                uptime: (processUptime / 60).toFixed(2) + ' minutes',
            },
            disk: diskUsage,
        };
    }

    /**
     * Calculates the total system CPU usage percentage.
     * @returns {Promise<number>} The CPU usage in percentage.
     */
    static getSystemCpuUsage() {
        return new Promise((resolve) => {
            const start = os.cpus();
            setTimeout(() => {
                const end = os.cpus();
                let idleDiff = 0;
                let totalDiff = 0;

                for (let i = 0; i < start.length; i++) {
                    const startCpu = start[i].times;
                    const endCpu = end[i].times;

                    const idle = endCpu.idle - startCpu.idle;
                    const total =
                        (endCpu.user - startCpu.user) +
                        (endCpu.nice - startCpu.nice) +
                        (endCpu.sys - startCpu.sys) +
                        (endCpu.irq - startCpu.irq) +
                        idle;

                    idleDiff += idle;
                    totalDiff += total;
                }

                const cpuUsage = 100 * (1 - idleDiff / totalDiff);
                resolve(cpuUsage);
            }, 500); // Wait 500ms for CPU usage calculation
        });
    }
}

module.exports = VDSOHelper;
