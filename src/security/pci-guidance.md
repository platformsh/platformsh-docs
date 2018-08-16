# PCI DSS Responsibility Guidance

Platform.sh has many PCI certified customers using our services. Below we will attempt to clarify the PCI compliance responsibilities for Platform.sh and our customers.

Simple audit questions can be handled via support tickets however in-depth support for your audit may required additional arrangements. Please contact your Platform.sh account manager to discuss your needs.


## Overview

Platform.sh provides a Platform as a Service (PaaS) solution which our customers may use to store, process, or transmit cardholder data.


## Security & Compensating Controls

 * For those customers needing to meet SAQ C or SAQ D, a Platform.sh Enterprise Plan may be needed in order to fully meet your needs. Please [contact us](https://platform.sh/contact) for more information.

 * For a list of security measures, please see our [Security section](https://platform.sh/security).

 * Please take note that customer environments are deployed in a read-only instance, segregated with GRE and IPSEC tunnels, which often permits compensating controls to be claimed for several PCI requirements.

 * Because customers can use our PaaS in a variety of ways, the best approach with auditors is to focus is on “What do I, the customer, control/configure and how is it managed in a compliant manner?”


## Responsibility

Platform.sh customers are ultimately responsible for their own PCI DSS compliance.

The following sections provide guidance on shared responsibilities to achieve PCI DSS compliance. We have chosen to list all the sections found in a typical SAQ D although you may not need this level of detail for your efforts. This section is currently using PCI DSS 3.2 as a reference.


### Requirement 1

|Requirement|Responsibility|Comments|
|---|---|---|
|1.1 to 1.3.3| Platform|Infrastructure cannot be modified by the customer|
|1.3.4|Shared|Platform is responsible for the infrastructure. Customer is responsible for correct routes.yaml configuration|
|1.3.5 to 1.3.6|Platform|Infrastructure cannot be modified by the customer|
|1.3.7|Shared|Customers are responsible for ensuring their application does not leak private IP addresses|
|1.4 to 1.5|Shared|Customers are responsible for their devices accessing the environment|


### Requirement 2

|Requirement|Responsibility|Comments|
|---|---|---|
|2.1|Shared|Customer is responsible to change vendor-supplied defaults in their app|
|2.1.1|N/A|There are no wireless environments connected to the CDE|
|2.2 to 2.2.1|Platform|Infrastructure cannot be modified by the customer|
|2.2.2 to 2.2.5|Shared|Customers must ensure their app is configured to only use the necessary services (services.yaml), routes (routes.yaml), and apps (app.yaml)|
|2.3|Shared|Customers are responsible for admin access to their app|
|2.4|Shared|Customer is responsible for application and data flows. Platform maintains a data flow chart and network diagram for the infrastructure|
|2.5|Shared|Customers are responsible for their app|
|2.6|Platform|[Yes we do](https://platform.sh/security)|


### Requirement 3

|Requirement|Responsibility|Comments|
|---|---|---|
|3.1|Shared|Platform.sh is responsible that storage is securely deleted. Customer is responsible for all other provisions.|
|3.2 to 3.4.1|Customer|
|3.5 to 3.7|Shared|Customer is responsible for data encryption and non-infrastructure key management. We recommend column-level database encryption. If you need data at rest protection, please see our docs about [Encryption](https://docs.platform.sh/security/encryption.html)|


### Requirement 4

|Requirement|Responsibility|Comments|
|---|---|---|
|All|Customer|Customer is responsible for internet transmission of cardholder data. See also our docs about [Encryption](https://docs.platform.sh/security/encryption.html)|


### Requirement 5

|Requirement|Responsibility|Comments|
|---|---|---|
|All|Shared|Customer is responsible for their systems.|


### Requirement 6

|Requirement|Responsibility|Comments|
|---|---|---|
|All|Shared|Customer is responsible for their application. Platform.sh is responsible for the infrastructure.|


### Requirement 7

|Requirement|Responsibility|Comments|
|---|---|---|
|All|Shared|Customer is responsible for their application and also their project access control. Platform.sh is responsible for the infrastructure.|


### Requirement 8

|Requirement|Responsibility|Comments|
|---|---|---|
|8.1 to 8.5|Shared|Customer is responsible for their application. Platform.sh is responsible for the infrastructure.|
|8.5.1|N/A|There is no remote access.|
|8.6 to 8.8|Shared|Customer is responsible for their application. Platform.sh is responsible for the infrastructure.|


### Requirement 9

|Requirement|Responsibility|Comments|
|---|---|---|
|All|N/A|Platform uses PCI compliant cloud hosting providers|


### Requirement 10

|Requirement|Responsibility|Comments|
|---|---|---|
|10.1 to 10.7|Shared|Customer is responsible for their application. Platform.sh is responsible for the infrastructure.|
|10.8|Platform|Service provider only requirement|
|10.9|Shared|Customer is responsible for their application. Platform.sh is responsible for the infrastructure.|


### Requirement 11

|Requirement|Responsibility|Comments|
|---|---|---|
|11.1 to 11.1.2|N/A|There are no wireless APs in the Platform.sh hosting providers|
|11.2 to 11.3.4|Shared|Customer is responsible for their application. Platform.sh is responsible for the infrastructure.|
|11.3.4.1|Platform|Service provider only requirement|
|11.4 to 11.6|Shared|Customer is responsible for their application. Platform.sh is responsible for the infrastructure.|


### Requirement 12

|Requirement|Responsibility|Comments|
|---|---|---|
|12.1 to 12.4|Shared|Customer is responsible for their organization. Platform.sh is responsible for its organization.|
|12.4.1|Platform|Service provider only requirement|
|12.5 to 12.8.5|Shared|Customer is responsible for their organization. Platform.sh is responsible for its organization.|
|12.9|Platform|Service provider only requirement|
|12.10 to 12.10.6|Customer is responsible for their organization. Platform.sh is responsible for its organization.|
|12.11|Platform|Service provider only requirement|


### Appendix A1

|Requirement|Responsibility|Comments|
|---|---|---|
|All|Platform|Service provider only requirement|


### Appendix A2

|Requirement|Responsibility|Comments|
|---|---|---|
|All|Customer|This is only applicable if the customer uses POS terminals accessing their environment, otherwise it is likely considered N/A|
