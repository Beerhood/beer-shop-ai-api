# Sequence Diagram: Product Search and Filtering

This diagram illustrates the process of a user searching for products and applying filters, including caching and interaction with a dedicated search engine.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Cache
    participant SearchEngine
    participant Database

    Title: Product Search and Filtering Flow with Caching

    User->>+Frontend: Enters search query and/or applies filters
    note over User, Frontend: e.g., query: "IPA", style: "NEIPA", abv_gt: 6.0

    Frontend->>+Backend: GET /api/products?q=IPA&style=NEIPA&abv_gt=6.0&page=1
    note over Frontend, Backend: Request includes pagination and sorting parameters

    Backend->>Backend: Generate cache key from normalized query and filter parameters

    Backend->>+Cache: GET [cache_key]
    Cache-->>-Backend: Return cached results (or null)

    alt Cache Hit
        note over Backend: Prepare response from cached results
    else Cache Miss
        note over Backend: No results in cache, querying search engine
        Backend->>Backend: Construct native query for the search engine

        Backend->>+SearchEngine: Search with constructed query, filters, and pagination
        SearchEngine-->>-Backend: Return list of product IDs and search metadata

        opt If search engine returns only IDs
            Backend->>+Database: Fetch full product details by IDs
            Database-->>-Backend: Return full product data
        end

        Backend->>Backend: Format the final product list and pagination data

        Backend->>+Cache: SET [cache_key] (formatted_results)
        note right of Backend: Cache the results for subsequent requests
        Cache-->>-Backend: Confirm cache write
        note over Backend: Prepare response from new search results
    end

    Backend-->>-Frontend: 200 OK (body: { products, pagination_meta })
    Frontend-->>-User: Display the list of found products
```
