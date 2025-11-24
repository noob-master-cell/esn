# Maintenance Guide

## Daily Tasks
- **Health Check**: Verify the `/health` endpoint returns `OK`.
- **Redis**: Ensure the Redis container is running (`docker ps`).
- **Logs**: Review backend logs for errors (`docker logs esn-backend`).

## Weekly Tasks
- **Dependency Updates**: Run `npm audit` and update vulnerable packages.
- **Database Vacuum**: Execute `VACUUM ANALYZE` on the PostgreSQL database.
- **Backup Verification**: Confirm that the latest backup file exists and is not corrupted.

## Monthly Tasks
- **Performance Review**: Check query performance using `EXPLAIN ANALYZE` for heavy queries.
- **Index Review**: Ensure the `@@index([eventId, status])` on `Registration` is still optimal.
- **Full Backup**: Run `pg_dump` to create a full database dump.

## Backup & Restore
- **Export**: `pg_dump -U postgres -h localhost -Fc esn_db > backup.dump`
- **Import**: `pg_restore -U postgres -d esn_db backup.dump`

## Disaster Recovery
1. Spin up a new PostgreSQL container.
2. Restore the latest backup.
3. Deploy the backend and frontend containers.
4. Verify functionality via smoke tests.

## Monitoring
- Use **Prometheus** and **Grafana** (optional) to monitor CPU, memory, and request latency.
- Set up alerts for high error rates or Redis connection failures.

*All steps avoid any references to payments or notification features.*
