.. _best_practices:

Best Practices in Platform
==========================

Here are some things you might want to know about the best practices you should follow to fully utilize the power of Platform.

Hierarchical environments
-------------------------

.. figure:: images/clone-hierarchy.png
   :alt: Understand hierarchical environments.

   Platform allows you to organize and structure your :term:`environments <environment>` as you want.

When you :term:`Branch` an :term:`environment`, this creates a child of this :term:`environment`. 

Each child :term:`environment` can :term:`sync` code and/or data from his parent and :term:`merge` code to his parent.

Environment conventions
-----------------------

Platform provides great flexibility on the way you can organize and work with your development environments. To improve readability and productivity, it’s important to think carefully about how to name and structure those environments.

Naming
^^^^^^

The name should represent the purpose of the environment. Is it a Staging site to show to your client? Is it an implementation of a new feature? Is it a hot fix?

If you’re working Agile, for example, you could use hierarchical environments and name them like this:

.. code-block:: console

    Sprint1
      Feature1
      Feature2
      Feature3
    Sprint2
      Feature1
      Feature2
    ...

If you prefer splitting your environments per developer and having a specific environment per task or per ticket, you could use something like this:

.. code-block:: console

    Staging
      Developer1
        Ticket-526
        Ticket-593
      Developer2
        Ticket-395
      ...

Changing name
^^^^^^^^^^^^^

You can rename an :term:`environment` by clicking its name on the Platform UI. 

.. figure:: /using-platform/images/renaming-environment.png
  :alt: Renaming environment

  For example, you can rename the ``Master`` :term:`environment` into ``Live``.

.. note::
    This will not change the associated Git branch name.

You can also rename your :term:`project` by clicking its name on the project configuration page on the Platform UI. 

.. figure:: /using-platform/images/renaming-project.png
  :alt: Renaming project
