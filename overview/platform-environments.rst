.. _environments:

Platform.sh Environments
========================

An environment is tight to a Git branch, plus all the :term:`services <service>` that are serving that branch. You can see that as a **complete working website**. 

`Platform.sh <https://platform.sh>`_  helps a coder with the development workflow by making it easy to manage multiple environments, including the live enviornment which runs the production website.

.. _environment_master:

Master environment
------------------

Every Platform.sh project starts with a :ref:`environment_master` which corresponds to the Master branch in Git. 

If you subscribed to a :term:`production plan`, this environment is your **live site** and can be mapped to a :term:`domain name` and an :term:`SSL certificate`.

Hierarchy
---------

.. figure:: images/clone-hierarchy.png
   :alt: Understand hierarchical environments.

Platform.sh brings a concept of hierarchy between your environments. Each new environment you will create is considered as a **child** of the **parent** environment which it was branched from.

Each child environment can :term:`sync` code and/or data down from its parent, and :term:`merge` code up to his parent. These are used for development, staging, and testing.

Workflows
---------

Since you can organize your :ref:`environments` as you want, you have a complete flexibility to create your own workflows. 

There are no rule you must follow when branching the master environment. You simply need a structure that best fits your workflow:

* **Agile**: one master environment, a child environment per sprint. Each story in the sprint can have its own environment as a child of the sprint environment. 
* **Developer-centric**: one master environment, one QA environment and a few development environments (*per developer, per task...*). 
* **Testing**:: one master environment, an operational test environment, a user test environment and a few unit test environments. 
* **Fix**: one master environment and children environments (*per bug fix, per security update...*).

Here is an example of a possible Agile workflow.

.. image:: /use-platform.sh/images/branches.png
  :alt: Create Branches
  :align: left

The administrator creates a sprint environment and gives each of the developers permission to create new feature environments. Another approach is that the administrator could create an environment for each developer.

----

.. image:: /use-platform.sh/images/merge.png
  :alt: Merge a feature
  :align: left

As a feature is completed, the adimistrator can review the work by accessing the website of the feature environment. When they are satisfied, they can merge the new feature back into the Sprint environment.

----

.. image:: /use-platform.sh/images/sync.png
  :alt: Sync the update to other features
  :align: left

The remaining features will sync with the Sprint environment to ensure their working environment is up-to-date with the latest code.

----

.. image:: /use-platform.sh/images/merge-live.png
  :alt: Merge to Live
  :align: left

When the objectives of the sprint are complete, the administrator can then make a backup of the live site, then merge the sprint environment into the live environment.

----

The adminstrator can then synchronize the live site with any existing Sprint environments to repeat the process and continue the development process.

.. _naming_convention:

Naming conventions
------------------

Platform.sh provides great flexibility on the way you can organize and work with your development environments. To improve readability and productivity, it's important to think carefully about how to name and structure those environments.

The name should represent the purpose of the environment. Is it a Staging site to show to your client? Is it an implementation of a new feature? Is it a hot fix?

If you're working Agile, for example, you could use hierarchical environments and name them like this:

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