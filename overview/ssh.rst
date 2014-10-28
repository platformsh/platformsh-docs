.. _ssh:

SSH
###

One of the ways `Platform <https://platform.sh/>`_ keeps things secure is by using :ref:`SSH` behind the scenes. Users connect to their Platform :ref:`git` repo and to their Platform :term:`CLI` using SSH. 

A RSA public/private keypair
****************************

SSH requires two `RSA keys <https://en.wikipedia.org/wiki/RSA_(cryptosystem)>` - a private key kept secret by the user, and a public key stored with the Platform.sh account. These keys are called "the public-private keypair" and usually look like random lines of characters, like this. 

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

As a Platform user, you need a public-private keypair like these to work with your :term:`environments <environment>`. 

..todo:: instructions on generating keypairs

last update: |today|


