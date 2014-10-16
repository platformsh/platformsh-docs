
Miscellaneous
=============


.. _dns:

Configure DNS
-------------

Configure your DNS provider to point your domain to your `Platform.sh <https://platform.sh>`_  Master environment.

Once you've checked with your registrar about where to change your DNS settings, simply add a CNAME record to the environment hostname: ``<environment>-<project>.<cluster>.platform.sh``
For example: master-k4ywtmwigmmgc.eu.platform.sh

.. note::
  This will **not** work for a naked domain. In that case, you need to use a DNS provider that supports forwarding DNS queries (aka an ALIAS record).


last update: |today|
