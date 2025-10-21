# Sequence Diagram: Order process

This diagram illustrates the checkout process, from the user's cart to order confirmation and notification.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database
    participant EmailService

    Title: Order Checkout Process

    User->>+Frontend: Clicks "Checkout" in the cart
    Frontend->>Frontend: Displays the checkout page

    User->>Frontend: Fills in the shipping address and selects a payment method
    User->>+Frontend: Confirms the order

    Frontend->>+Backend: POST /api/orders (body: { cartId, shippingDetails, paymentMethod }, headers: { Authorization: Bearer <JWT> })

    activate Backend
    Backend->>Backend: JWT validation and user identification

    alt Checking order data
        Backend->>+Database: Checking the availability and prices of items in the cart
        Database-->>-Backend: Return of product data
    end

    Backend->>+Database: Creating a new order with the status "Processing"
    Database-->>-Backend: Returning a created order

    Backend->>+Database: Emptying the user's trash
    Database-->>-Backend: Cleaning confirmation

    Backend->>+EmailService: Request to send an order confirmation letter
    EmailService-->>User: Sends an email with order details

    Backend-->>-Frontend: 200 OK (body: { orderId, confirmationDetails })
    deactivate Backend

    Frontend-->>-User: Displays the order confirmation page
    deactivate Frontend
```
