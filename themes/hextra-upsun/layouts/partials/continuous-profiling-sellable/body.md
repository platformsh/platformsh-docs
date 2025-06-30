{{ $content := `By default, {{% vendor/name %}} offers 15 minutes of continuous profiling per project and for free.
To get 30 days of continuous profiling per project and for a fixed fee, [upgrade to the Continuous Profiling add-on](/administration/billing/add-on-subscription.md#continuous-profiling-add-on).`}}

{{ partial "premium-features/banner" ( dict "context" . "content" $content "title" "Feature Availability" )}}
