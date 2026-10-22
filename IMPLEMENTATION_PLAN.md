# GUDUMBA product and storefront improvement plan

## Audit backlog

This backlog is based on the current storefront, product detail, account, cart, checkout, and service code. It is a practical product backlog rather than a claim that every possible improvement has been discovered.

### Shopping and discovery

- Persist a cross-page wishlist and provide a dedicated saved-items page.
- Show recently viewed items so shoppers can return to products they left.
- Add an image viewer with keyboard navigation and a clear mobile close control.
- Replace the placeholder size-guide link with a useful fit reference.
- Validate stock at the selected variant before adding to bag.
- Add predictive search, recent searches, and keyboard navigation to search results.
- Add filters for size, availability, color, material, and price range.
- Add product comparison for a small number of pieces.
- Add back-in-stock alerts tied to a real notification provider.
- Add verified reviews and customer photos after a purchase-review flow exists.
- Add product recommendations based on category and browsing history.
- Add clearer product material, care, fit, and garment measurement details.

### Cart, checkout, and orders

- Revalidate price, inventory, shipping, and discount totals on the server at checkout.
- Provide discount codes only when a promotion system is configured.
- Add a delivery postcode checker backed by actual serviceability data.
- Add saved addresses and a guest checkout path.
- Make payment retries and duplicate callbacks idempotent and easy to recover from.
- Show order detail, payment state, fulfillment milestones, and tracking links.
- Add cancellation/return request flows connected to real order and policy rules.
- Improve cart recovery and shipping-cost transparency before payment.

### Account and operations

- Add account profile editing, saved addresses, and notification preferences.
- Show clear loading, empty, retry, and failure states for account and order data.
- Improve admin order operations, inventory editing, and audit history.
- Add a provider-backed email delivery workflow for newsletter and transactional mail.
- Add support escalation and searchable FAQ content alongside the concierge.
- Establish analytics for search, product views, wishlist actions, checkout, and conversion.

### Quality, accessibility, and performance

- Audit keyboard flow, focus management, accessible names, and color contrast.
- Add responsive checks for narrow phones, tablets, and wide screens.
- Review image sizes, video loading, font loading, and Core Web Vitals.
- Add structured product metadata and complete social preview images.
- Add automated checks for checkout, stock, wishlist, and account critical paths.
- Review API rate limits, session handling, payment webhook security, and error logging.
- Verify all promotional, delivery, material, and policy claims against launch-ready facts.

## Implementation plan

### Phase 1 — Product confidence (implemented in this change)

1. Create a shared wishlist store persisted in local storage, heart controls on product cards and detail pages, a header count, and a dedicated wishlist page.
2. Track a small, bounded list of recently viewed products and show it on product detail pages.
3. Replace the size-guide placeholder with a modal fit reference that explains its measurements are general guidance.
4. Add an accessible product image lightbox with thumbnails, previous/next controls, and keyboard shortcuts.
5. Select an available size by default and block unavailable variants from being added to the bag.

### Phase 2 — Discovery and merchandising

Implement search suggestions, richer filters, comparison, and recommendation surfaces after catalog metadata and analytics events are agreed.

### Phase 3 — Conversion and operations

Connect delivery lookup, stock alerts, verified reviews, order tracking, returns, and email to real service providers and business rules.

### Phase 4 — Launch readiness

Complete accessibility and performance audits, critical-flow automation, API/payment review, and a factual review of customer-facing claims.
