# PBI Source

| Field | Value |
|---|---|
| Issue | #19 |
| URL | https://github.com/MikitaZhyhadla/ai-qa-test-case-generator/issues/19 |
| Title | PBI: Subscribe to the product newsletter |
| Labels | enhancement |
| State | open |
| Fetched at | 2026-09-24 16:42 |

## Body

## Context

Product: Notely, a fictional note-taking web app. This is a small sample PBI for a quick end-to-end check of the workflow (about 15-20 minutes).

## User story

As a visitor of the Notely website, I want to subscribe to the product newsletter with my email address, so that I receive product news.

## Acceptance criteria

1. The website footer shows an "Email" field and a "Subscribe" button.
2. A valid email address of at most 254 characters is accepted, and the page shows "Thanks! Please check your inbox to confirm your subscription."
3. An empty or invalid email address shows "Enter a valid email address." and nothing is saved.
4. The system sends a confirmation email with a link; the subscription becomes active only after the link is opened.
5. Subscribing again with an email address that already has an active subscription shows the same message as in criterion 2 and does not create a duplicate subscription.

## Out of scope

- Unsubscribing
- Newsletter content and sending schedule

## Comments

- None
