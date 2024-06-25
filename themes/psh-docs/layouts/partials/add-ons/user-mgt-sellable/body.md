{{ $content := `This feature is available as part of the Standard User Management add-on.
See how you can [upgrade to this add-on](/administration/billing/add-ons.md#standard-user-management-add-on).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Feature Availability" )}}
