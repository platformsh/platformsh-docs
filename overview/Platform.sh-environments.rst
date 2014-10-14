
Platform.sh environments 
========================

`Platform.sh <https://platform.sh>`_  helps a coder with the development workflow by making it easy to manage project environments.
 
.. figure:: images/clone-hierarchy.png
   :alt: In this environment layout, *Master* is the parent of *Sprint1*. *Feature1* is a child of *Sprint1*. 

The `platform <https://github.com/platformsh/platformsh-cli>`_ tool helps you manage your local environment, copy code, data and resources between your local environment and remote Platform.sh environments. 


parents and children
--------------------

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

If you are a web developer, chances are you are already running a local hosting environment on your workstation. You edit the code and configure the database, your application engine obeys your commands and your web server hands over the resources. 

One big benefit is the ability to work offline - you don’t need to be connected to the Internet to get stuff done. You can work on the train and push your changes to Platform.sh later. 

When you are online, you can download an environment to your workstation, do your work and, when ready, upload to Platform.sh.


workflows and environments
--------------------------

There are no rules you must follow when branching the master environment. You can use a style that best fits your workflow.
* *agile* - one master parent, branch a few children to use for sprints, and branch each sprint to make stories for feature development. 
* *developer-centric* - one production master, one QA environment and a few development environments - one per coder. 
* *testing* - one production master, an operational test environment, a user test environment and a few unit test environments. 
* *fix* - one master parent and two children - one for testing bug fixes and one for security updates.

