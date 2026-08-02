# Agents and orchestration

HEIR product surfaces include multi-agent experiences (for example Wealth Advisor
Swarm on the main app). Those are **product session APIs**, not a separate public
“agent orchestration MCP” with unlimited specialist agents.

## What integrators should use today

| Surface | How | Docs |
|---------|-----|------|
| MCP tools (calculators, jurisdiction, contract params) | `@morbidcorp/heir` | [Tools](/mcp/tools) |
| REST contract generation | `POST /api/v1/contracts/generate` | [Contracts](/api/contracts) |
| REST legal drafts | `POST /api/v1/legal/generate` | [Legal](/api/legal) |
| Product swarm / desk agents | Session APIs on heir.es | Product app; not fully documented here yet |

## What is not claimed

- No public `POST /api/agents/orchestrate` integrator contract is documented on
  this site.
- MCP docs must not invent agent names, “coming soon” agent fleets, or fake
  multi-agent workflow APIs without monorepo mounts and auth models.

## Related

- [MCP overview](/mcp/)
- [API reference](/api/)
- [Pricing / metering](/pricing/)
