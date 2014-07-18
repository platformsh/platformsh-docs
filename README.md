Platform.sh documentation
=============================

Here is what you need to build the Platform.sh documentation locally.

Getting started
---------------------------

.. rubric:: 1. Clone the repository

.. code:: console

  $ git clone git@github.com:platformsh/docs.git
  $ cd docs

.. rubric:: 2. Install Sphinx

.. code:: console

  $ sudo pip install sphinx

(on Mac OS X you might need to do ``easy_install pip`` first)
  
.. rubric:: 3. Build the html

.. code:: console

  $ make html
  
Once the build is finished, the HTML pages should be in _build/html.

![http://creativecommons.org/licenses/by-sa/4.0/](images/CC-BY-SA.png)
