Push your changes
=================

Push changes to an environment
------------------------------

Do your changes
^^^^^^^^^^^^^^^

Here, we'll see how to make code changes to an :term:`environment`.

.. note::
  You should never be working on the :term:`Master` branch since it's supposed to be your production environment.

Make sure you're on a working :term:`environment`. In this example we're on the *sprint1* branch:

.. code-block:: console

   $ git branch
   * sprint1

Now that you're set up on your working branch, you can start developing on your website by making code changes and pushing those changes to Platform to test them live.

Push your changes with Git
^^^^^^^^^^^^^^^^^^^^^^^^^^

When pushing code, Platform will deploy your code and rebuild your environment.

When you're done, commit your changes to test them on your online :term:`environment`.

.. code-block:: console

   $ git add .
   $ git commit -m "Made changes to my make file."
   $ git push

When the build is completed, you can see it's marked as Success in the UI ane you can see your changes on your site by clicking ``View this website`` under the name of the ** environment on :term:`Platform UI`.

Merge code changes
------------------

Once you've got a Git branch with some changes, you'll want to be able to push those changes up to your live environment. Platform has a great button called ``Merge`` that you can click on and it will push the appropriate changes to master.

.. figure:: images/merge.png
  :alt: Merge your changes.

  Just click on the ``Merge`` button and all of the commits you made on your branch will be merged into the master environment.
