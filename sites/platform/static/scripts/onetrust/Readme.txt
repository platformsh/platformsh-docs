The OneTrust Cookie Compliance service is designed by default to be Software-as-a-Service, where you place the tag into your webpages
that calls the functionality from the remote servers.

However, some customers may wish to host the files locally.  This download package contains all the code needed to run the service off a customer's
own server.

Just be aware when using this functionality, changes made and published through the online admin system will then require you to download 
and install a new copy of this package each time.


Please follow the below steps to add the local scripts in the application.
==========================================================================

1. Download the latest version local scripts files from consent manager domain overview page.

Script Tab --> Get the Code --> Download Local Script File --> Click button "Download Local File"

2. Extract the downloaded file.

3. Copy the oneTrust folder in the root folder of the application, or wherever is most appropriate for your site.

4. Then use the below code exactly as you would when using the hosted version of the service, replacing the file name and location
reference with the one you have saved.

5. For more information, see the online documentation within your user account.
 
=======================================================
For production script:
<!-- Optanon Consent Notice start -->
<script src='oneTrust_production/onetrustConsent.js' type="text/javascript" charset="UTF-8"></script>
<script type="text/javascript">
function OptanonWrapper() { }
</script>
<!-- Optanon Consent Notice end -->

For test script:
<!-- Optanon Consent Notice start -->
<script src='oneTrust_test/onetrustConsent.js' type="text/javascript" charset="UTF-8"></script>
<script type="text/javascript">
function OptanonWrapper() { }
</script>
<!-- Optanon Consent Notice end -->
=========================================================

5. This code will put a button in your page to enable visitors to access the Preference Centre. Use it instead of or in conjunction with a notice bar. The main script tag must also be in the page.
=========================================================
<!-- Optanon Privacy Settings button start -->
<a class="optanon-show-settings">Privacy Settings</a>
<!-- Optanon Privacy Settings button end -->
=========================================================

6. This code will insert a detailed cookie policy including description and table of cookies based on the current cookie assignment. Embed in a privacy policy or a standalone cookie policy page. The main script tag must also be in the page.
=========================================================
<!-- Optanon Cookie Policy start -->
<div id="optanon-cookie-policy"></div>
<!-- Optanon Cookie Policy end -->
=========================================================
