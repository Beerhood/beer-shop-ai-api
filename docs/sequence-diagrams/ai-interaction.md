# Sequence Diagram: AI Assistant Interaction

This diagram illustrates the process of a user interacting with an AI assistant to receive personalized beer recommendations. The process includes authentication, data collection for personalization, querying an external AI service, and displaying the result.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Cache
    participant Database
    participant AIService

    Title: AI Beer Assistant Recommendation Flow with Caching

    User->>+Frontend: Enters a request into the chat (e.g., "Recommend a light IPA")
    note over User, Frontend: User initiates conversation

    Frontend->>+Backend: POST /api/ai/chat (body: { query }, headers: { Authorization: Bearer <JWT> })

    Backend->>Backend: Validate JWT and identify user
    Backend->>Backend: Generate cache key based on query and user profile hash

    Backend->>+Cache: GET [cache_key]
    Cache-->>-Backend: Return cached response (or null)

    alt Cached response exists
        note over Backend: Prepare response from cache
    else No cached response
        alt Personalized recommendation
            Backend->>+Database: Request user profile, purchase history, and preferences
            Database-->>-Backend: Return user data
        end

        Backend->>Backend: Generate advanced prompt for AI
        note right of Backend: The prompt includes:<br/>1. The user's current query.<br/>2. Context: purchase history, preferences.<br/>3. Instructions for the AI (e.g., "Answer like an expert sommelier").

        Backend->>+AIService: POST /v1/chat/completions (prompt)
        AIService-->>-Backend: Return response (success or error)

        alt AI Service responds successfully
            Backend->>Backend: Parse and validate the response from AI

            opt If response contains specific products
                Backend->>+Database: Request details of recommended products (price, availability)
                Database-->>-Backend: Return product details
            end

            Backend->>+Cache: SET [cache_key] (formatted_response)
            Cache-->>-Backend: Confirm cache write
            note over Backend: Prepare success response
        else AI Service fails or times out
            note over Backend: Prepare error response
        end
    end

    Backend-->>-Frontend: Return final response (200 OK or 503 Error)
    Frontend-->>-User: Display assistant's response and recommended products

```
