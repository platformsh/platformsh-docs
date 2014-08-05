Phases of a Platform Website Life Cycle
=======================================

Development Workflow
--------------------

Platform gives you the flexibility to create your own workflows. Here is an example of an agile workflow.

.. image:: /using-platform/images/branches.png
  :alt: Create Branches
  :align: left

The administrator creates a sprint environment and gives each of the developers permission to create new feature environments. Another approach is that the administrator could create an environment for each developer.

----

.. image:: /using-platform/images/merge.png
  :alt: Merge a feature
  :align: left

As a feature is completed, the adimistrator can review the work by accessing the website of the feature environment. When they are satisfied, they can merge the new feature back into the Sprint environment.

----

.. image:: /using-platform/images/sync.png
  :alt: Sync the update to other features
  :align: left

The remaining features will sync with the Sprint environment to ensure their working environment is up-to-date with the latest code.

----

.. image:: /using-platform/images/merge-live.png
  :alt: Merge to Live
  :align: left

When the objectives of the sprint are complete, the administrator can then make a backup of the live site, then merge the sprint environment into the live environment.

----

The adminstrator can then Sync the live site with any existing Sprint environments to repeat the process and continue the development process.

.. note::

  When using `Drupal <http://drupal.org>`_, it's recommended to have a site-specific module. This will allow you to enable other modules and update configurations in an update function so the necessary changes can be applied upstream when you merge an environment up.

Updating Your Platform Plan
---------------------------
If you need to resize your live environement, add additional users, or increase the environment limit, you will need to update your Platform plan.

---------

.. image:: /quick-start-guide/images/icon-configure.png
  :alt: Configure icon
  :align: left

To do this, click on the top-most *Configure* icon next to the project name in the navigation bar. Select the **Subscription** tab and adjust the size, number of environments, and storage options.

Launch
------

When you are ready to launch your website, there are couple of steps that you must do to point your own domain to your Platform site.

  Add the domain to your Project.

  .. image:: /quick-start-guide/images/icon-configure.png
    :alt: Configure icon
    :align: left

  | Click the top-most **configure** icon next to the project name. Select the **Domains** tab.
  | Add your domain and save it (check wildcard if you would like all subdomains to default here).

.. note::
  If you're running on a Development environment, you need to upgrade it to a live included plan (Standard or more).

----

  Configure DNS provider to point your domain name to Platform.

  | You will need to check with your registrar about where exactly to change your DNS settings.
  | On your domain, add a CNAME record to the environment hostname: ``<environment>-<project>.<cluster>.platform.sh``
  | For example: master-k4ywtmwigmmgc.eu.platform.sh

.. note::
  This will not work for a naked domain. In that case, you need to use a DNS provider that supports forwarding DNS queries (aka an ALIAS record).

----

  Upload your SSL certificate.

  .. warning::
    It's currently not supported in the Platform UI so you need to send us a support request.
