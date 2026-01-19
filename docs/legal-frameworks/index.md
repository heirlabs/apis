# Legal Frameworks

HEIR supports 11 inheritance frameworks across 190+ jurisdictions. Each framework maps legal rules to smart contract logic and document templates.

## Supported Frameworks

| Framework | Summary | Typical Jurisdictions |
| --- | --- | --- |
| Common Law | Testamentary freedom, per-capita or per-stirpes distribution | US, UK, Canada, Australia |
| Civil Law | Forced heirship and reserved portions | France, Germany, Spain |
| Islamic Law | Quranic fixed shares + optional Wasiyyah/Waqf | GCC, MENA, parts of Asia |
| Jewish Law | Halachic inheritance structures | Israel, diaspora jurisdictions |
| Hindu Law | Hindu Succession Act frameworks | India |
| Chinese Law | PRC civil code inheritance rules | China |
| Japanese Law | Civil Code inheritance rules | Japan |
| Christian Law | Christian customary frameworks | Global |
| African Customary | Regional customary inheritance patterns | Sub-Saharan Africa |
| Indigenous | Indigenous community inheritance traditions | Jurisdiction-specific |
| Secular/Custom | User-defined or secular custom logic | Global |

## How Frameworks Map to the API

Use `inheritanceTemplate` in contract generation:

```json
{
  "inheritanceTemplate": "common-law"
}
```

See: `/api/contracts` and the template list endpoint for available template IDs.

## Next Steps

- Common Law: `/legal-frameworks/common-law`
- Civil Law: `/legal-frameworks/civil-law`
- Islamic Law: `/legal-frameworks/islamic/`
