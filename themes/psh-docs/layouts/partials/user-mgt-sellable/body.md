{{ $content := `This feature is available as part of the Advanced User Management add-on. You can [upgrade your organization to this add-on](/administration/billing/add-on-subscription.md#upgrade-to-the-advanced-user-management-add-on) in the Console.

For details about the other features included in this add-on, see the [Advanced User Management add-on](/administration/billing/add-on-subscription.md#advanced-user-management-add-on) help topic section; for pricing information, see the [Upsun pricing](https://upsun.com/pricing/) page. `}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Feature Availability" )}}
