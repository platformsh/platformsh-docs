# Region migration

Platform.sh is available in a number of different *Regions*.  Each region is a self-contained copy of Platform.sh in a single datacenter.  When you first create a project you can specify which region it should be in.

There is no automated way to migrate a project from one region to another after it is created.  However, the process to do so manually is fairly straightforward.

## Why migrate between regions?

* Different datacenters are located in different geographic areas, and you may want to keep your site physically close to the bulk of your user base for reduced latency.
* Only selected regions offer European Sovereign hosting.  If you created a project in a non-Sovereign region you may need to migrate to a Sovereign region.
* Some regions are running older versions of the Platform.sh orchestration system that offers fewer features.  In particular, the US-1 and EU-1 regions do not offer XL and 2XL plans, self-terminating builds in case of a build process that runs too long, or distributing environments across different grid hosts.  If you are on one of those regions and desire those features you will need to migrate to the newer US-2 or EU-2 regions.

## Migration process

### 0. Preparation

* Plan a timeframe in which to handle the migration.  You will want to avoid developing any new code during that period (as your Git repository will change) and be prepared for a brief site outage when you migrate.  You are essentially relaunching the site, just with the same host as previously.  Plan accordingly.
* Set your DNS Time-to-Live as low as possible.

### 1. Create and populate a new project

Create a new Platform.sh project in the desired region.  You can initially create it as a Development project and change the plan size immediately before switching over or go ahead and use the desired size from the beginning.  When the system asks if you want to use an existing template or provide your own code, select provide your own code.

Make a Git clone of your existing project.  Then add a Git remote to the new project, using the Git URL shown in the UI.  Push the code for at least your master branch to the new project.  (You can also transfer other branches if desired.  That's optional.)

Alternatively, if you are using a 3rd party Git repository (GitHub, BitBucket, GitLab, etc.), you can add an integration to the new project just as you did the old one.  It will automatically mirror your 3rd party repository exactly the same way as the old project and you won't need to update it manually.

Copy your existing user files on the old project to your computer using `rsync`.  See the [exporting](/tutorials/exporting.md) page for details.  Then use `rsync` to copy them to the same directory on the new project.  See the [migrating](/tutorials/migrating.md) page for details.

Export your database from the old project and import it into the new project.  Again, see the exporting and migration pages, as well as the instructions for your specific database services.

Re-enter any project or environment variables you've defined on your old project in your new project.

Add any users to your new project that you want to continue to have access.

If you have any 3rd party integrations active, especially the [Health Notification](/administration/integrations/notifications.md) checks, add them to the new project.

### 2. Maintain the mirror

Most sites have generated data in Solr, Elasticsearch, or similar that needs to be regenerated.  Take whatever steps are needed to reindex such systems.  That may simply be allowing cron to run for a while, or your system may have a command to reindex everything faster.  That will vary by your application.

You can also periodically re-sync your data.  For `rsync` the process should be quite fast as long as you maintain your local copy of it, as rsync will transfer only content that has changed.  For the database it may take longer depending on the size of your data.

Depending on your site's size and your schedule, you can have the old and new project overlapping for only an hour or two or several weeks.  That's up to you.  Be sure to verify that the new site is working as desired before continuing.

### 3. Launch the new site

Once your new project is on the right production plan size you can cut over to it.  Add your domain name(s) to your new project.  If you have a custom SSL certificate you will need to add that at the same time.  (Because the projects are in separate regions it's safe to add the domain name to both at the same time, which reduces apparent downtime.)

If possible, put your site into read-only mode or maintenance mode.  Then do one final data sync (code and database) to ensure the new project starts with all fo the data from the old one.

Once the domain is set, update your DNS provider's records to point to the new site.  Run `platform environment:info edge_hostname -p <NEW_PROJECT_ID>` to get the domain name to point the CNAME at.

It may take some time for the DNS change and SSL change to propagate.  Until it does, some browsers may not see the new site or may get an SSL mismatch error.  In most cases that will resolve itself in 1-3 hours.

### 4. Remove the old project

Once the new project is running and the DNS has fully propagated you can delete the old project.
