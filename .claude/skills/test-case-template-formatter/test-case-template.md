# Test Case Template

Copy this block for every test case. Keep the heading level, field order, table, and bold labels exactly as shown.

```markdown
### <ID> - <Title>

| Field | Value |
|---|---|
| Type | <Type> |
| Priority | <Priority> |
| Requirement refs | <AC-n, IA-n> |
| Technique | <Technique> |
| Source | <URL or N/A - derived from requirements> |

**Preconditions**
- <precondition>

**Test data**
- <fictional value>

**Steps**
1. <action>
2. <action>

**Expected result**
- <observable outcome>
```

## Filled example

```markdown
### TC-NEG-003 - Reject password reset link after it has expired

| Field | Value |
|---|---|
| Type | Security |
| Priority | High |
| Requirement refs | AC-4 |
| Technique | Security check |
| Source | https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html |

**Preconditions**
- A registered user account exists with email `anna.test@example.com`
- A password reset link was requested for this account more than 60 minutes ago

**Test data**
- Email: `anna.test@example.com`
- Reset link age: 61 minutes

**Steps**
1. Open the password reset link from the email.
2. Enter a new valid password `N3w-Passw0rd!` in both password fields.
3. Click "Save new password".

**Expected result**
- The page shows the message "This link has expired. Please request a new one."
- The password is not changed; login with the old password still succeeds.
- A "Request a new link" button is displayed.
```
