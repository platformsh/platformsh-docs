# Strong Customer Authentication (SCA)

In accordance with Article 14(1) of the [Commission Delegated Regulation (EU) 2018/389](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32018R0389), Platform.sh has made changes in order to comply with and implement Strong Customer Authentication (SCA) for customers using payment methods from the EU

> *Payment service providers shall apply strong customer authentication when a payer creates, amends, or initiates for the first time, a series of recurring transactions with the same amount and with the same payee.*

SCA is part of the second [Payment Services Directive (PSD2)](https://ec.europa.eu/info/law/payment-services-psd-2-directive-eu-2015-2366_en), acting as a regulatory requirement to reduce fraud and to make online transactions more secure.

The law goes into affect September 14, 2019, and European card holders will be required to go through an additional re-authentication step within the Platform.sh management console starting October 1, 2019 in order to authenticate recurring payments with your payment institution.

Prior to October 1, 2019, Platform.sh projects associated with an EU credit card will see a banner at the top of the management console.

![SCA Warning](/images/sca/sca-warning.png)

That banner will direct you to authenticate your payment information settings.

![SCA Authentication](/images/sca/authenticate-payment.png)

The process after you click "Authenticate" will vary according to your payment institution. In most cases, having your phone number registered with that institution will be sufficient to enable 2FA with them from here.

After October 1, 2019, the SCA banner in the management console will become a warning for you to update your payment settings.

![SCA Post-Change Warning](/images/sca/sca-postchange.png)

There will be a grace period in the first few weeks following that change, but when that period has ended projects that have not set up payment authentication through the console will be suspended, so it is important for you to do so as soon as possible.
