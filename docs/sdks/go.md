# Go

::: warning No published module (2026-07-30)
`github.com/heirlabs/heir-go` is **not** a public module. Use `net/http`.
:::

## Generate a contract

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	body, _ := json.Marshal(map[string]any{
		"blockchain":    "evm",
		"ownerAddress":  "0x...",
		"beneficiaries": []map[string]any{
			{"name": "Alice", "address": "0xabc...", "percentage": 100},
		},
		"inheritanceTemplate": "common-law",
	})

	req, _ := http.NewRequest(
		http.MethodPost,
		"https://api.heir.es/api/v1/contracts/generate",
		bytes.NewReader(body),
	)
	req.Header.Set("Authorization", "Bearer "+os.Getenv("HEIR_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer res.Body.Close()

	var out map[string]any
	_ = json.NewDecoder(res.Body).Decode(&out)
	fmt.Println(res.StatusCode, out)
}
```

## See also

- [SDKs overview](/sdks/)  
- [cURL](/sdks/curl)  
- [Contracts API](/api/contracts)
