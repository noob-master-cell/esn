module.exports = {
    apps: [{
        name: 'esn-backend',
        script: './dist/main.js',
        instances: 'max', // Use all available CPU cores
        exec_mode: 'cluster',
        env: {
            NODE_ENV: 'production',
            PORT: 4000,
        },
        env_development: {
            NODE_ENV: 'development',
            PORT: 4000,
        },
        // Performance settings
        max_memory_restart: '1G',
        kill_timeout: 5000,
        wait_ready: true,
        listen_timeout: 10000,

        // Logging
        error_file: './logs/error.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        merge_logs: true,

        // Restart strategy
        autorestart: true,
        max_restarts: 10,
        min_uptime: 10000,
        watch: false,

        // Graceful shutdown
        shutdown_with_message: true,
    }]
};
