.. _technical_requirements:

Technical Requirements
======================

`Platform.sh <https://platform.sh/>`_ will require you to have **Git** installed. You also need to be familiar with **SSH**.

.. _git:

Git
---

Git is the open source version control system that is utilized by Platform.sh. 

Any change you make to your Platform.sh project will need to be committed via Git. You can see all the Git commit messages of an :ref:`environment` in the activity feed of :ref:`platform_ui`.

Before getting started, make sure you have it installed on your computer to be able to interact with Platform.sh.

.. seealso::
  * `Install Git <https://help.github.com/articles/set-up-git>`_
  * `Learn more about Git <http://git-scm.com/>`_

.. _ssh:

SSH
---

One of the ways `Platform.sh <https://platform.sh/>`_ keeps things secure is by using :ref:`SSH` behind the scenes. Users connect to their Platform.sh :ref:`git` repository and to their :ref:`Command Line Interface (CLI) <cli>` using SSH. 

SSH requires two `RSA keys <https://en.wikipedia.org/wiki/RSA_(cryptosystem)>`:

* A **private key** kept secret by the user
* A **public key** stored within the Platform.sh account. 

These keys are called *the public-private keypair* and usually look like random lines of characters, like this. 

*A private key*: ::

    -----BEGIN RSA PRIVATE KEY-----
    MIIEowIBAAKCAQEAtpw0S4DwDVj2q04mhiIMkhvrYU7Z6hRiNbTFsqg3X7x/uYS/
    dcNrSvT82j/jSeYQP3Dsod9GERW+dmOuLaFNeiqOStZi6jRSWo41hCOWOFbpBum3
    ra1n6nUO1wa/7O5wbgzhUOfnim77oOK0UgkqPArBCNXiNFTUJAvRyVmCtvJOyrqz
    ...(20 more lines of this garbage)...
    cPjJ/wKBgGd3eZIBK6Ak92u65HYXgY9EcX3vBNP4NsF087uxV4YfrM18KlGf5I87
    QGerp3VKaGe0St3ot57GlwCAQUJAf1mit8qDTi0I8MhBe7q2lstXkBvde7GY1gKx
    Kng4ohG6xHZ/OvC9tq7/THwAvleaxgLZN5GyXfAqNylDdZ0LtSjl
    -----END RSA PRIVATE KEY-----

*A public key (one very long line)*: ::

    ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC2nDRLgPANWParTiaGIgySG+thTtnqFGI1tMWyqDdfvH+5hL91w2tK9PzaP+NJ5hA/cOyh30YRFb52Y64toU16Ko5K1mLqNFJajjWEI5Y4VukG6betrWfqdQ7XBr/s7nBuDOFQ5+eKbvug4rRSCSo8CsEI1eI0VNQkC9HJWYK28k7KurMdTN7X/Z/4vknM4/Rm2bnMk2idoORQgomeZS1p3GkG8dQs/c0j/b4H7azxnqdcCaR4ahbytX3d49BN0WwE84C+ItsnkCt1g5tVADPrab+Ywsm/FTnGY3cJKKdOAHt7Ls5lfpyyug2hNAFeiZF0MoCekjDZ2GH2xdFc7AX/ your_email_address@example.com

You will need a :ref:`ssh` public/private keypair in order to interact with Platform.sh. Your public key is upladed to your Platform.sh user account, and it then governs authentication for  :ref:`git`, SSH sessions (shell access), and other tools that connect to your Platform.sh project.

.. seealso::
   * :ref:`Generating an SSH keypair <ssh_genkeypair>`
