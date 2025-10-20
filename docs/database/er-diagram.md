# Entity-Relationship Diagram

## Database Schema Overview

![ER Diagram](./Beerhood-ER.drawio.svg)

## Entities Description

### User

- **id**: ObjectId
- **firstName**: string
- **lastName**: string
- **email**: string
- **role**: "admin" | "customer"
- **birthDate**: Date
- **createdAt**: Date
- **updatedAt**: Date

### Product

- **id**: ObjectId
- **name**: string
- **description**: string
- **price**: int
- **type**: ObjectId → Type
- **productType**: "beer" | "snack"
- **country**: string
- **ABV**: string
- **createdAt**: Date
- **updatedAt**: Date

### Type

- **id**: ObjectId
- **name**: string

### Order

- **id**: ObjectId
- **user**: ObjectId → User
- **products**: ObjectId[]
- **address**: string
- **totalPrice**: int
- **createdAt**: Date
- **updatedAt**: Date

### Order_mn_Product

- **id**: ObjectId
- **orderId**: ObjectId → Order
- **productId**: ObjectId → Product
- **quantity**: int
