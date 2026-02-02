# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - img "easygenerator logo" [ref=e4]
    - generic [ref=e5]:
      - button "Sign In" [ref=e6]:
        - link "Sign In" [ref=e7] [cursor=pointer]:
          - /url: /signin
      - button "Sign Up" [ref=e8]:
        - link "Sign Up" [ref=e9] [cursor=pointer]:
          - /url: /signup
  - generic [ref=e13]:
    - generic [ref=e15]: Welcome back
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]: Email
        - textbox "Email" [active] [ref=e21]:
          - /placeholder: m@example.com
          - text: invalid-email
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: Password
          - link "Forgot your password?" [ref=e25] [cursor=pointer]:
            - /url: "#"
        - textbox "Password" [ref=e26]: password123
      - button "Login" [ref=e27]
    - generic [ref=e28]:
      - generic [ref=e29]: Don't have an account?
      - link "Sign up" [ref=e30] [cursor=pointer]:
        - /url: /signup
  - generic [ref=e31]:
    - img [ref=e33]
    - button "Open Tanstack query devtools" [ref=e81] [cursor=pointer]:
      - img [ref=e82]
```