---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
categories: ["Features", "Workflows", "Benefits"]
tags: ["{{ .Name }}", "test6"]
outline:
    problem: |
        Outline the problem question/explanation for the title slide.
    spoiler: |
        You can also include a smaller spoiler.
---
