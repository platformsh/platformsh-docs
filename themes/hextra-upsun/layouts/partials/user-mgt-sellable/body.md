{{ $content := `This feature is available as part of the Standard User Management add-on.
To enable it on your organization, [administer your organization's billing](/administration/billing/billing-admin).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Feature Availability" )}}
