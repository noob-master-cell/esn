# Maintenance Guide

## Overview

This guide covers ongoing maintenance procedures, monitoring, updates, and troubleshooting for the ESN Event Management Platform.

---

## Table of Contents

- [Regular Maintenance Tasks](#regular-maintenance-tasks)
- [Monitoring](#monitoring)
- [Database Maintenance](#database-maintenance)
- [Security Updates](#security-updates)
- [Performance Optimization](#performance-optimization)
- [Backup & Recovery](#backup--recovery)
- [Log Management](#log-management)
- [Troubleshooting](#troubleshooting)
- [Incident Response](#incident-response)

---

## Regular Maintenance Tasks

### Daily

- [ ] Check application health endpoints
- [ ] Review error logs
- [ ] Monitor response times
- [ ] Check database connections
- [ ] Verify backup completion

### Weekly

- [ ] Review security audit logs
- [ ] Check disk space usage
- [ ] Analyze slow queries
- [ ] Review user feedback/issues
- [ ] Update dependencies (non-breaking)

### Monthly

- [ ] Database vacuum and analyze
- [ ] Review and archive old logs
- [ ] Update major dependencies
- [ ] Security vulnerability scan
- [ ] Performance analysis
- [ ] Backup verification test

### Quarterly

- [ ] Full security audit
- [ ] Capacity planning review
- [ ] Documentation update
- [ ] Disaster recovery drill
- [ ] SSL certificate renewal (if applicable)

---

## Monitoring

### Health Checks

```bash
# Application health
curl http://localhost:4000/health

# Database health
docker-compose exec postgres pg_isready -U postgres

# Redis health
docker-compose exec redis redis-cli ping
```

### Automated Monitoring Setup

#### Using Uptime Robot (Free)

1. Sign up at https://uptimerobot.com
2. Add monitors for:
   - Frontend: `https://yourdomain.com`
   - Backend: `https://api.yourdomain.com/health`
3. Configure alerts (email, SMS)

#### Using DataDog/New Relic (Paid)

```bash
# Install agent
npm install --save dd-trace
npm install --save newrelic

# Configure in main.ts
import tracer from 'dd-trace';
tracer.init();
```

### Key Metrics to Monitor

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Response Time (p95) | <200ms | >500ms |
| Error Rate | <1% | >5% |
| CPU Usage | <70% | >85% |
| Memory Usage | <80% | >90% |
| Disk Usage | <70% | >85% |
| Database Connections | <50 | >80 |

---

## Database Maintenance

### Vacuum Database (PostgreSQL)

```bash
# Manual vacuum
docker-compose exec postgres psql -U postgres -d esn_db -c "VACUUM ANALYZE;"

# Check last vacuum time
docker-compose exec postgres psql -U postgres -d esn_db -c "
  SELECT schemaname, tablename, last_vacuum, last_autovacuum 
  FROM pg_stat_user_tables;
"
```

### Analyze Query Performance

```sql
-- Enable query logging
ALTER DATABASE esn_db SET log_statement = 'all';
ALTER DATABASE esn_db SET log_duration = on;

-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Find missing indexes
SELECT schemaname, tablename, attname
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  AND n_distinct > 10
  AND correlation < 0.1
ORDER BY tablename, attname;
```

### Database Size Management

```bash
# Check database size
docker-compose exec postgres psql -U postgres -c "
  SELECT pg_size_pretty(pg_database_size('esn_db'));
"

# Check table sizes
docker-compose exec postgres psql -U postgres -d esn_db -c "
  SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
  FROM pg_tables
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### Cleanup Old Data

```typescript
// Archive old events (older than 2 years)
async archiveOldEvents() {
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

  // Move to archive table or delete
  await prisma.event.updateMany({
    where: {
      endDate: { lt: twoYearsAgo },
      status: 'COMPLETED'
    },
    data: {
      status: 'ARCHIVED'
    }
  });
}

// Delete cancelled registrations older than 6 months
async cleanupCancelledRegistrations() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  await prisma.registration.deleteMany({
    where: {
      status: 'CANCELLED',
      cancelledAt: { lt: sixMonthsAgo }
    }
  });
}
```

---

## Security Updates

### Dependency Updates

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check outdated packages
npm outdated

# Update specific package
npm update <package-name>

# Update all packages (carefully!)
npm update
```

### Security Checklist

- [ ] All dependencies up to date
- [ ] No critical vulnerabilities
- [ ] SSL certificates valid
- [ ] API keys rotated (every 90 days)
- [ ] Auth0 configuration reviewed
- [ ] Database passwords strong
- [ ] CORS settings appropriate
- [ ] Rate limiting enabled
- [ ] Input validation working
- [ ] Security headers configured

### Rotating Secrets

```bash
# 1. Generate new secret
openssl rand -base64 32

# 2. Update in environment
# .env
NEW_SECRET=<generated-value>

# 3. Deploy with new secret
# 4. Remove old secret after verification
```

---

## Performance Optimization

### Database Optimization

```bash
# Add indexes for slow queries
CREATE INDEX idx_events_date_category ON events(start_date, category);
CREATE INDEX idx_registrations_user_status ON registrations(user_id, status);

# Analyze query plans
EXPLAIN ANALYZE SELECT * FROM events WHERE category = 'SOCIAL';
```

### Application Caching

```typescript
// Implement Redis caching
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL);
  }

  async get(key: string): Promise<any> {
    const cached = await this.redis.get(key);
    return cached ? JSON.parse(cached) : null;
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}

// Use in service
async getEvents(filter: EventsFilterInput) {
  const cacheKey = `events:${JSON.stringify(filter)}`;
  
  // Try cache first
  let events = await this.cacheService.get(cacheKey);
  
  if (!events) {
    // Query database
    events = await this.prisma.event.findMany({ where: filter });
    
    // Cache for 5 minutes
    await this.cacheService.set(cacheKey, events, 300);
  }
  
  return events;
}
```

### Frontend Optimization

```typescript
// Code splitting
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Memoization
const EventList = memo(({ events }) => {
  // Component code
});

// Debouncing
const debouncedSearch = useDebounce(searchTerm, 500);
```

---

## Backup & Recovery

### Automated Backups

```bash
# Create backup script
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="esn_db"

# Create backup
docker-compose exec -T postgres pg_dump -U postgres $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/esn/scripts/backup.sh
```

### Restore from Backup

```bash
# List available backups
ls -lh /backups/

# Restore specific backup
gunzip -c /backups/backup_20250123_020000.sql.gz | \
  docker-compose exec -T postgres psql -U postgres esn_db
```

### Disaster Recovery Plan

1. **Identify Issue**
   - Check monitoring alerts
   - Review error logs
   - Verify scope of impact

2. **Communicate**
   - Notify team
   - Update status page
   - Set expectations

3. **Restore Service**
   - Restore from latest backup
   - Verify data integrity
   - Run smoke tests

4. **Post-Mortem**
   - Document incident
   - Identify root cause
   - Implement preventive measures

---

## Log Management

### Log Locations

```
Backend Logs:
- Development: Console output
- Production: Docker logs

Frontend Logs:
- Browser console
- Error tracking (Sentry)

Database Logs:
- PostgreSQL: /var/log/postgresql/
- Docker: docker-compose logs postgres
```

### Viewing Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# With timestamps
docker-compose logs -f --timestamps backend

# Since specific time
docker-compose logs --since 2025-01-23T10:00:00 backend
```

### Log Rotation

```yaml
# docker-compose.prod.yml
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### Centralized Logging (Optional)

```bash
# Using Papertrail
npm install winston winston-papertrail

# Configure
import * as winston from 'winston';
import * as Papertrail from 'winston-papertrail';

const logger = winston.createLogger({
  transports: [
    new Papertrail({
      host: 'logs.papertrailapp.com',
      port: xxxx
    })
  ]
});
```

---

## Troubleshooting

### Common Issues

#### High Memory Usage

**Diagnosis**:
```bash
# Check memory usage
docker stats

# Check Node.js heap
node --max-old-space-size=512 dist/main.js
```

**Solutions**:
- Increase container memory limit
- Optimize database queries
- Implement pagination
- Add caching layer

---

#### Slow Database Queries

**Diagnosis**:
```sql
-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

**Solutions**:
- Add appropriate indexes
- Optimize query logic
- Use database views
- Implement caching

---

#### Connection Pool Exhausted

**Diagnosis**:
```bash
# Check active connections
docker-compose exec postgres psql -U postgres -c "
  SELECT count(*) FROM pg_stat_activity;
"
```

**Solutions**:
```env
# Increase connection limit
DATABASE_URL="postgresql://...?connection_limit=30"

# Or reduce app connection pool
// In production
datasources: {
  db: {
    url: process.env.DATABASE_URL,
    pool: {
      max: 20,
      min: 5
    }
  }
}
```

---

#### High CPU Usage

**Diagnosis**:
```bash
# Monitor CPU
docker stats

# Profile Node.js
node --prof dist/main.js
node --prof-process isolate-*.log > processed.txt
```

**Solutions**:
- Optimize heavy computations
- Move to background jobs
- Implement rate limiting
- Scale horizontally

---

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **P0 - Critical** | Complete outage | 15 minutes |
| **P1 - High** | Major feature down | 1 hour |
| **P2 - Medium** | Minor feature degraded | 4 hours |
| **P3 - Low** | Cosmetic issue | Next business day |

### Response Procedure

1. **Acknowledge**
   - Confirm incident
   - Assign owner
   - Set severity level

2. **Assess**
   - Check monitoring
   - Review logs
   - Identify scope

3. **Mitigate**
   - Apply immediate fix
   - Rollback if needed
   - Verify resolution

4. **Document**
   - Create incident report
   - Update runbook
   - Schedule post-mortem

### Emergency Contacts

```
Platform Owner: [Email]
DevOps Lead: [Email]
Database Admin: [Email]
On-Call Rotation: [Link to PagerDuty]
```

---

## Maintenance Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Database migrations tested
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Team notified

### During Deployment

- [ ] Enable maintenance mode
- [ ] Deploy new version
- [ ] Run migrations
- [ ] Verify health checks
- [ ] Run smoke tests
- [ ] Disable maintenance mode

### Post-Deployment

- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify user flows
- [ ] Document changes
- [ ] Update documentation

---

## Tools & Resources

### Recommended Tools

- **Monitoring**: DataDog, New Relic, Uptime Robot
- **Error Tracking**: Sentry, Rollbar
- **Log Management**: Papertrail, Loggly
- **Database**: pgAdmin, DBeaver
- **API Testing**: Postman, Insomnia
- **Performance**: k6, Artillery

### Useful Commands

```bash
# Database backup
./scripts/backup.sh

# View logs
docker-compose logs -f backend

# Check health
./scripts/health-check.sh

# Deploy
./scripts/deploy.sh production

# Monitor resources
docker stats

# Clean up
docker system prune -a
```

---

## Support Escalation

1. **Self-Service**: Check documentation
2. **Team Chat**: Ask in Slack/Discord
3. **GitHub Issues**: Create detailed issue
4. **Emergency**: Contact on-call engineer

---

**Last Updated**: 2025-11-23  
**Maintained By**: Platform Team
