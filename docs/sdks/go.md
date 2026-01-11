# Go SDK

Official Go SDK for the HEIR API.

## Installation

```bash
go get github.com/heirlabs/heir-go
```

## Quick Start

```go
package main

import (
    "fmt"
    "log"

    "github.com/heirlabs/heir-go"
)

func main() {
    client := heir.NewClient("heir_pk_xxx...")

    contract, err := client.Contracts.Generate(&heir.GenerateParams{
        Blockchain:   "evm",
        OwnerAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f5bA2e",
        Beneficiaries: []heir.Beneficiary{
            {Name: "Alice", Address: "0xabc...", Percentage: 100},
        },
    })
    if err != nil {
        log.Fatal(err)
    }

    fmt.Println(contract.ContractCode)
}
```

## Configuration

```go
client := heir.NewClient(
    "heir_pk_xxx...",
    heir.WithBaseURL("https://api.heir.es/api/v1"),
    heir.WithTimeout(30*time.Second),
    heir.WithRetries(3),
)
```

## API Reference

### Contracts

#### Generate Contract

```go
result, err := client.Contracts.Generate(&heir.GenerateParams{
    Blockchain:   "evm",
    OwnerAddress: "0x...",
    Beneficiaries: []heir.Beneficiary{
        {
            Name:         "Alice",
            Address:      "0xabc...",
            Percentage:   50,
            Relationship: "spouse",
        },
        {
            Name:         "Bob",
            Address:      "0xdef...",
            Percentage:   50,
            Relationship: "child",
        },
    },
    InheritanceTemplate: "common-law",
    DeadMansSwitch: &heir.DeadMansSwitchConfig{
        Enabled:       true,
        Interval:      365 * 24 * 60 * 60, // 1 year
        CheckInMethod: "manual",
    },
})
if err != nil {
    log.Fatal(err)
}

fmt.Println(result.ContractCode)
fmt.Println(result.Compiled.ABI)
fmt.Println(result.Compiled.Bytecode)
```

#### List Templates

```go
templates, err := client.Contracts.Templates()
if err != nil {
    log.Fatal(err)
}

for _, t := range templates {
    fmt.Printf("%s: %s\n", t.ID, t.Name)
}
```

### API Keys

```go
// List API keys
keys, err := client.APIKeys.List()

// Create a new key
newKey, err := client.APIKeys.Create(&heir.CreateAPIKeyParams{
    Name:   "Production Key",
    Tier:   "partner",
    Scopes: []string{"contracts", "webhooks"},
})
fmt.Printf("New key: %s\n", newKey.RawKey) // Save this!

// Revoke a key
err = client.APIKeys.Revoke("key_id")
```

### Webhooks

```go
// List subscriptions
webhooks, err := client.Webhooks.List()

// Create subscription
webhook, err := client.Webhooks.Create(&heir.CreateWebhookParams{
    Event:  "contract.deployed",
    URL:    "https://your-app.com/webhooks",
    Secret: "your_secret",
})

// Test a webhook
result, err := client.Webhooks.Test(webhook.ID)
fmt.Printf("Delivered: %v\n", result.Delivered)

// Delete subscription
err = client.Webhooks.Delete(webhook.ID)
```

## Context Support

All methods accept a context for cancellation and timeouts:

```go
ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
defer cancel()

contract, err := client.Contracts.GenerateWithContext(ctx, params)
```

## Error Handling

```go
import "github.com/heirlabs/heir-go/errors"

result, err := client.Contracts.Generate(params)
if err != nil {
    switch e := err.(type) {
    case *errors.RateLimitError:
        fmt.Printf("Rate limited. Retry after %d seconds\n", e.RetryAfter)
    case *errors.ValidationError:
        fmt.Printf("Validation errors: %v\n", e.Details)
    case *errors.APIError:
        fmt.Printf("API error: %s - %s\n", e.Code, e.Message)
    default:
        fmt.Printf("Unknown error: %v\n", err)
    }
}
```

## Webhook Verification

```go
import (
    "net/http"
    "github.com/heirlabs/heir-go/webhook"
)

func webhookHandler(w http.ResponseWriter, r *http.Request) {
    signature := r.Header.Get("X-Webhook-Signature")
    
    body, _ := io.ReadAll(r.Body)
    
    if !webhook.VerifySignature(body, signature, webhookSecret) {
        http.Error(w, "Invalid signature", http.StatusUnauthorized)
        return
    }
    
    var payload webhook.Payload
    json.Unmarshal(body, &payload)
    
    switch payload.Event {
    case "contract.deployed":
        // Handle deployment
    case "deadman.triggered":
        // Handle dead man's switch
    }
    
    w.WriteHeader(http.StatusOK)
}
```

## Concurrency

The client is safe for concurrent use:

```go
var wg sync.WaitGroup

for _, params := range paramsList {
    wg.Add(1)
    go func(p *heir.GenerateParams) {
        defer wg.Done()
        result, err := client.Contracts.Generate(p)
        // Handle result
    }(params)
}

wg.Wait()
```

## Links

- [pkg.go.dev](https://pkg.go.dev/github.com/heirlabs/heir-go)
- [GitHub Repository](https://github.com/heirlabs/heir-go)

