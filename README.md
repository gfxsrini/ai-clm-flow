# AI-Enabled Contract Lifecycle Management

Interactive front-end prototype implemented from eight connected Figma screens.

## Run locally

Open `index.html` directly, or start a local server:

```bash
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

Use the **Prototype pages** menu in the top-right corner to open any screen directly. The sidebar items also navigate to working prototype pages.

When any Contract Manager flow screen is open, the fixed **Previous / Next** controller at the bottom shows the current Figma node and provides a guaranteed path through all seven supplied frames.

Direct routes are available through URL hashes:

- `#dashboard`
- `#dashboard-entered`
- `#review`
- `#overview`
- `#documents`
- `#confirm`
- `#sent`
- `#edit`

## Prototype interactions

- Dashboard and populated conversational request states
- Supplier-request review and key AI-generated review points
- Expandable request overview, checklist and procurement timeline
- Supporting-document and stakeholder actions
- Procurement confirmation and submitted states
- Editable request-information form
- Searchable recent conversations and collapsible navigation
- Responsive desktop, tablet and mobile layouts

## Main prototype path

1. Select **Review supplier requests**.
2. Send the populated request.
3. Review `REQ-2026-0187` and optionally open **View overview**.
4. Select **Send to Procurement**.
5. Review the attached documents and continue.
6. Confirm **Send to Procurement**.
7. View the procurement status or edit the request from the overview panel.

The layout is responsive for desktop, tablet, and mobile widths.
