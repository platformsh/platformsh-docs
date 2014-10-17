.. _technical_requirements:

Technical Requirements
======================

The only technical requirements for developing on Platform are **Git** and **SSH**.

Git
---

:ref:`Git <git>` is the version control system used by Platformsh. You will need to have it installed to be able to interact with your codebase on Platform.sh.


SSH
---

You will need a :ref:`SSH <ssh>` public/private keypair in order to interact with Platform.sh. Your public key is upladed to your Platform.sh user account, and it then governs authentication for  :ref:`Git <git>`, SSH sessions (shell access), and other tools that connect to your Platform.sh project.

.. seealso::
   * :ref:`Generating an SSH keypair <ssh_genkeypair>`


The Platform.sh CLI
-------------------

Platform.shs has a dedication :ref:`Command Line Interface (CLI) <cli>` tool called  *platform*. The *platform* tool gives enables you to use and manage all of your Platform.sh projects from the command line.

Download *platform* from `Github <https://github.com/commerceguys/platform-cli>`_. 
Installation instructions are included in the readme file.
