# Go

::: warning No published Go module
`github.com/heirlabs/heir-go` is **not** a published client. Call the REST API with `net/http`, or generate a client from the [OpenAPI spec](https://api.heir.es/api/docs/openapi.json).

The only published HEIR packages today are on npm:
[`@morbidcorp/element-sdk`](https://www.npmjs.com/package/@morbidcorp/element-sdk) and
[`@morbidcorp/elements-cli`](https://www.npmjs.com/package/@morbidcorp/elements-cli)
(Desk Elements, not a headless REST SDK).
:::

## HTTP example

```go
package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

func main() {
	body := []byte(`{
		"blockchain": "evm",
		"ownerAddress": "0x...",
		"beneficiaries": [{"name":"Alice","address":"0xabc...","percentage":100}]
	}`)
	req, err := http.NewRequest(
		"POST",
		"https://api.heir.es/api/v1/contracts/generate",
		bytes.NewReader(body),
	)
	if err != nil {
		log.Fatal(err)
	}
	req.Header.Set("Authorization", "Bearer "+os.Getenv("HEIR_API_KEY"))
	req.Header.Set("Content-Type", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	out, _ := io.ReadAll(res.Body)
	fmt.Println(res.Status, string(out))
}
```

## Generate a client from OpenAPI

```bash
curl -o openapi.json https://api.heir.es/api/docs/openapi.json
openapi-generator-cli generate -i openapi.json -g go -o ./heir-client
```

See also: [Authentication](/api/authentication) · [Contracts](/api/contracts) · [cURL](/sdks/curl)
