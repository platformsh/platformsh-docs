{{ $content := `This feature is available as part of the Standard User Management add-on.
See how you can [add it to your organization](/administration/organizations.md#add-the-standard-user-management-add-on).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Feature Availability" )}}
