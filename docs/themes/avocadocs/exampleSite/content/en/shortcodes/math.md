---
title: "Katex math"
weight: 3
math: true
description: "Every time you push to a live branch (a git branch with an active environment attached to it) or activate an <a href=\"/administration/web/environments.html\">environment</a> for a branch, there are two main processes that happen: <b>Build</b> and <b>Deploy</b>."
 
---

[KaTeX setup guide](https://github.com/gohugoio/hugoBasicExample/blob/master/content/post/math-typesetting.mmark)

## Usage

Create mathematics expressions using the `katex` shortcode, where `.Inner` content is rendered.

### Code

```
{{< katex >}}
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
{{< /katex >}}
```

### Display

{{< katex >}}
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
{{< /katex >}}

## LaTeX Examples

{{% code %}}
  {{< katex >}}
  \left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
  {{< /katex >}}
{{% /code %}}

{{< katex >}}
\left( \sum_{k=1}^n a_k b_k \right)^2 \leq \left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
{{< /katex >}}


{{< katex >}}
x = \begin{cases}
   a &\text{if } b \\
   c &\text{if } d
\end{cases}
{{< /katex >}}

{{< katex >}}
workers = \max \Bigg( \frac{\text{ContainerMemory} - \text{ReservedMemory}}{\text{RequestMemory}}, 2 \Bigg)
{{< /katex >}}

{{< katex >}}
\frac{d}{dx}\left( \int_{0}^{x} f(u)\,du\right)=f(x)
{{< /katex >}}

{{< katex >}}
Diff(arctan(sin(x^2)),x)=simplify(diff(arctan(sin(x^2)),x))
{{< /katex >}}
