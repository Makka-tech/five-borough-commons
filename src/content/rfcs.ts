export const rfcs = [
  {
    id: "0001",
    title: "Project acceptance and incubation process",
    status: "Draft",
    author: "Sample governance content — no community decision has been made",
    summary:
      "A proposed, reviewable process for deciding whether a community need should enter project incubation.",
    motivation:
      "A transparent process helps prevent premature software commitments and makes stewardship expectations visible.",
    proposal:
      "Use the public need-triage rubric, record a scoped recommendation, require a prospective steward, and give affected residents a meaningful opportunity to review the project proposal.",
    alternatives:
      "Accept needs as projects automatically; use a maintainer-only private process; or treat a hackathon as project acceptance. Each alternative has less public accountability.",
    risks:
      "The process could become too slow or burdensome. The community should review its accessibility and adjust it through an RFC.",
    accessibilityImpact:
      "Triage materials must use plain language, allow asynchronous feedback, and not require a GitHub account to understand the outcome.",
    privacyImpact:
      "Need triage must minimize personal data and route sensitive submissions through private moderation channels.",
    communityImpact:
      "Clear expectations protect residents from overpromising and make non-software outcomes legitimate.",
    decision:
      "Sample draft only. It is open for future community comment once a real governance group is established.",
    decisionDate: "Not decided",
  },
] as const;
