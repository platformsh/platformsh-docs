
Platform.sh environments 
========================

`Platform.sh <https://platform.sh>`_  helps a coder with the development workflow by making it easy to manage project environments.
 
.. figure:: images/clone-hierarchy.png
   :alt: In this environment layout, *Master* is the parent of *Sprint1*. *Feature1* is a child of *Sprint1*. 

The `platform <https://github.com/platformsh/platformsh-cli>`_ tool helps you manage your local environment, copy code, data and resources between your local environment and remote Platform.sh environments. 



Hierarchical environments
-------------------------

.. figure:: images/clone-hierarchy.png
   :alt: Understand hierarchical environments.

   Platform allows you to organize and structure your :term:`environments <environment>` as you want.

When you :term:`Branch` an :term:`environment`, this creates a child of this :term:`environment`. 

Each child :term:`environment` can :term:`sync` code and/or data from his parent and :term:`merge` code to his parent.


parents and children
^^^^^^^^^^^^^^^^^^^^

Platform.sh allows the user to organize :term:`environments <environment>` in different ways. A developer can :term:`Branch` an :term:`environment` to create a child of this :term:`environment`. One environment can be used for production and the other for testing. An agile web development team may create a more complex hierarchy to fit their working style. 

The master environment - the web site to be used by customers - can be easily branched, git-style, to make a hierarchy of child environments. Child environments can be updated and the changes merged back up to the parent site.
Code and data can be copied between environments. A child :term:`environment` can :term:`sync` code and data from the parent and :term:`merge` code to the parent. Merging data to the parent can be done, but there is no easy Platform.sh option - this would make it easy to over-write live production data.


the master environment
^^^^^^^^^^^^^^^^^^^^^^

The first web site is the master - the public-facing site. Work is done on copies of the master site - not the original.  Nobody wants developers breaking the master site while they develop and test their changes - changes are made to copies, tested and finally merged into this site. 


a child environment
^^^^^^^^^^^^^^^^^^^

A child environment is used for development and testing. The master can be branched to create a child used for client acceptance tests. Staging can be branched to make a child for code integration tests. The integration environment can be copied to the user’s workstation, to make a local development environment.

Different members of a development team can control different environments. A coder  works on his local workstation , then merges work into a test environment on Platform.sh.  The team leader controls merges from test environments to the staging site. The site owner controls merges to the master site. 


a local development environment
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In addition to these environments on Platform.sh, you also have one more - your local development environment. You connect your local environment to to Platform.sh. 


workflows and environments
--------------------------

Platform gives you the flexibility to create your own workflows. 

There are no rules you must follow when branching the master environment. You can use a style that best fits your workflow.
* *agile* - one master parent, branch a few children to use for sprints, and branch each sprint to make stories for feature development. 
* *developer-centric* - one production master, one QA environment and a few development environments - one per coder. 
* *testing* - one production master, an operational test environment, a user test environment and a few unit test environments. 
* *fix* - one master parent and two children - one for testing bug fixes and one for security updates.


Here is an example of an agile workflow.

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

The adminstrator can then Sync the live site with any existing Sprint environments to repeat the process and continue the development process.

.. note::

  When using `Drupal <http://drupal.org>`_, it's recommended to have a site-specific module. This will allow you to enable other modules and update configurations in an update function so the necessary changes can be applied upstream when you merge an environment up.


Continuous Integration and Automated Testing
--------------------------------------------

Continuous integration a software development practice where team members frequently integrate their work into the main base. It is often combined with automated testing - which is a series of triggered tests that detects integration errors quickly and check that new work does not negatively effect the existing state of the software.

The flexible, mulit-user development processes that are enabled by Platform compliment continuous integration. Each branch has it's own :term:`environment` for quick review and testing both before and after merging work at each step along the process.

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


