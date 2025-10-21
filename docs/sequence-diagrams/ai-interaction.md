# Sequence Diagram: AI Assistant Interaction

This diagram illustrates the process of a user interacting with an AI assistant to receive personalized beer recommendations. The process includes authentication, data collection for personalization, querying an external AI service, and displaying the result.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database as MongoDB
    participant AIService as Groq API

    Title: AI Beer Assistant Recommendation Flow

    User->>+Frontend: Enters a request into the chat (e.g., "Recommend a light IPA")
    note over User, Frontend: User initiates conversation

    Frontend->>+Backend: POST /api/ai/chat (body: { query }, headers: { Authorization: Bearer <JWT> })

    activate Backend
    Backend->>Backend: JWT validation and user identification

    alt Personalized recommendation
        Backend->>+Database: Request user profile, purchase history, and preferences
        Database-->>-Backend: Returning user data
    end

    Backend->>Backend: Generating an advanced prompt for AI
    note right of Backend: The prompt includes:<br/>1. The user's current query.<br/>2. Context: purchase history, preferences.<br/>3. Instructions for the AI ​​(e.g., "Answer like an expert sommelier").

    Backend->>+AIService: POST /v1/chat/completions (prompt)
    AIService->>AIService: Prompt processing and response generation
    AIService-->>-Backend: Returning the generated recommendation

    Backend->>Backend: Parsing and validating the response from AI

    opt If the answer contains specific products
        Backend->>+Database: Request details of recommended products (price, availability)
        Database-->>-Backend: Return of product details
    end

    Backend-->>-Frontend: 200 OK (a response with recommendations has been formed)

    Frontend-->>-User: Displaying the assistant's response and a list of recommended products

```
