# Snapshots and Backups

## Automatic snapshots 	
Snapshots of the production system are taken every four hours and retained for two weeks. These are not accessible to the customer and are only used for disaster recovery purposes. 	

## Backups

### Backup and Restore on Platform Enterprise
Backups are scheduled and automatic, and restoration from Backups is a managed process done by the Platform.sh team. The periodicity of backups can be determined by the customer.

Full site backups, comprising codebase, files and database, are run every night. These can be run more regularly if required. These backups are stored in individual S3 buckets and are available to customers via a standard ticket and the Platform API.
Backups are also available through the standard Platform UI so that customers can initiate backup and restore on-demand and download backups directly from the site.

### Backup and Restore on Platform Standard
Backups can be triggered via the UI and CLI tools, and the CLI commands can be quickly and easily incorporated into a shell script should an automated backup schedule be required. A GUI-based backup scheduler is also on the roadmap for Platform.sh. Restoration of the environment from these backups is likewise a simple command from the UI or CLI. 

## Customer on-demand backups
Customers run backups through the Platform.sh UI and CLI