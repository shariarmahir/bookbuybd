# Printing Attachments API Contract

Base path: `/api/printing`

Purpose: support photo/file upload in printing order details, keep files linked to cart items, and persist them into checkout orders.

## Data model changes

### 1) `printing_attachment` (new)
- `id` (string, UUID or ulid)
- `owner_session_key` (string, indexed) or `owner_user_id` if authenticated users
- `storage_key` (string)
- `original_name` (string)
- `mime_type` (string)
- `size_bytes` (integer)
- `public_url` (string, nullable)
- `status` (`uploaded` | `linked` | `orphaned` | `deleted`)
- `created_at` (datetime)
- `expires_at` (datetime, nullable for cleanup policy)

### 2) `printing_cart_item` (update)
- add relation: many attachments per cart item

### 3) `printing_order_item` (update)
- add snapshot relation: many attachments per order item (copied from cart at checkout)

## API endpoints

## 1) Upload file
- `POST /uploads/`
- Content-Type: `multipart/form-data`

Form fields:
- `file` (required, binary)

Response `201`:
```json
{
  "id": "att_01JQYQ9HP4R7X5YB2V7D1E8NPA",
  "original_name": "design-front.jpg",
  "mime_type": "image/jpeg",
  "size_bytes": 284313,
  "public_url": "https://cdn.example.com/printing/att_01JQYQ9H....jpg",
  "status": "uploaded",
  "created_at": "2026-03-12T09:40:00Z"
}
```

Validation:
- allowed mime: `image/jpeg`, `image/png`, `application/pdf` (adjust as needed)
- max size: e.g. `10MB` per file
- optional max files per cart item: e.g. `5`

## 2) Delete uploaded file (before checkout)
- `DELETE /uploads/{attachmentId}/`
- Response `204` on success.
- Must verify ownership by session/user.

## 3) Add cart item with attachments
- `POST /cart/items/`

Request body change (new field):
```json
{
  "category": "business-cards",
  "item_ids": ["matte-lamination"],
  "quantity": 200,
  "is_emergency": false,
  "budget": 3000,
  "required_by": "2026-03-20",
  "notes": "Use logo on top-left",
  "attachment_ids": [
    "att_01JQYQ9HP4R7X5YB2V7D1E8NPA"
  ]
}
```

Rules:
- all `attachment_ids` must exist and belong to current session/user
- attachment status becomes `linked` when associated to cart item

## 4) Update cart item attachments
- `PATCH /cart/items/{pk}/`

Request body:
```json
{
  "quantity": 250,
  "notes": "Updated note",
  "attachment_ids": [
    "att_01JQYQ9HP4R7X5YB2V7D1E8NPA",
    "att_01JQYR0MFJ3G9Q6M5NZH7S1R9D"
  ]
}
```

Behavior:
- `attachment_ids` is full replacement list for that cart item
- removed files can become `orphaned` (cleanup job can delete later)

## 5) Cart response shape update
- `GET /cart/`
- `POST /cart/items/`
- `PATCH /cart/items/{pk}/`
- `DELETE /cart/items/{pk}/`

Each cart item now includes:
```json
{
  "id": 42,
  "item_id": "matte-lamination",
  "item_name": "Matte Lamination",
  "quantity": 200,
  "line_total": 1250,
  "attachments": [
    {
      "id": "att_01JQYQ9HP4R7X5YB2V7D1E8NPA",
      "original_name": "design-front.jpg",
      "mime_type": "image/jpeg",
      "size_bytes": 284313,
      "public_url": "https://cdn.example.com/printing/att_01JQYQ9H....jpg"
    }
  ]
}
```

## 6) Checkout behavior
- `POST /checkout/` (existing)

No required payload change for customer fields, but backend must:
- copy cart item attachments into order item attachment snapshot
- keep order attachments immutable after checkout
- clear cart without deleting order attachments

Checkout response order item change:
```json
{
  "id": 1001,
  "item_name": "Matte Lamination",
  "quantity": 200,
  "line_total": "1250.00",
  "attachments": [
    {
      "id": "att_01JQYQ9HP4R7X5YB2V7D1E8NPA",
      "original_name": "design-front.jpg",
      "mime_type": "image/jpeg",
      "size_bytes": 284313,
      "public_url": "https://cdn.example.com/printing/att_01JQYQ9H....jpg"
    }
  ]
}
```

## Error responses (recommended)

Common format:
```json
{
  "detail": "Validation failed",
  "errors": {
    "attachment_ids": ["One or more attachments are invalid or not owned by this session"]
  }
}
```

Recommended status codes:
- `400` invalid payload
- `401` unauthenticated (if auth required)
- `403` attachment belongs to different user/session
- `404` attachment not found
- `413` file too large
- `415` unsupported media type

## Cleanup policy

- scheduled cleanup job every 1 hour:
  - delete `orphaned` attachments older than e.g. 24 hours
  - delete unlinked `uploaded` attachments older than e.g. 24 hours
- never auto-delete attachments linked to an order

## Frontend contract delta (for reference)

Add to `AddPrintingCartItemPayload` and `UpdatePrintingCartItemPayload`:
- `attachment_ids?: string[]`

Add to `PrintingCartItem` and `PrintingOrderItem`:
- `attachments: PrintingAttachment[]`
