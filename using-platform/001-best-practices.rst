.. _best_practices:

Best Practices in Platform
==========================

Here are some things you might want to know about the best practices you should follow to fully utilize the power of Platform.

Create hierarchical environments
--------------------------------

.. figure:: images/clone-hierarchy.png
   :alt: Understand hierarchical environments.

   Platform allows you to organize and structure your :term:`environments <environment>` as you want.

When you :term:`Branch` an :term:`environment`, this creates a child of this :term:`environment`. 

Each child :term:`environment` can :term:`sync` code and/or data from his parent and :term:`merge` code to his parent.

Name your environments
----------------------

To improve readability and productivity, it’s important to properly name your environment.

The name should represent the purpose of the environment. Is it a Staging site to show to your client? Is it an implementation of a new feature? Is it a hot fix?

If you’re working Agile, for example, you could use hierarchical environments and name them something like this:

.. code-block:: console

    Sprint1
      Feature1
      Feature2
      Feature3
    Sprint2
      Feature1
      Feature2
    ...

.. note::
   You can also rename an environment by clicking its name on the Platform UI. This will not change the branch name.
