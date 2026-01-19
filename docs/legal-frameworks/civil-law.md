# Civil Law

Civil law inheritance is governed by forced heirship rules that reserve specific portions for legally protected heirs. HEIR models reserved shares and disposable portions for civil-law jurisdictions.

## Core Principles

- **Forced heirship**: protected shares for children/spouse
- **Disposable portion**: remaining estate can be allocated freely
- **Jurisdiction-specific ratios**: vary by country

## API Usage

```json
{
  "inheritanceTemplate": "civil-law",
  "inheritanceTemplateParameters": {
    "forcedHeirship": true
  }
}
```

## Best Practices

- Include all legally protected heirs.
- Use jurisdiction-specific configurations where applicable.
- Validate forced share constraints before deployment.
