# 5square meter property inventory

A real estate portfolio demonstration of a developer–broker inventory workflow. Built with AI-assisted development to turn property information into an interface that is easy to inspect and use.

## Features

- Filter fictional units by city, project or neighbourhood, availability and maximum asking price.
- Compare area, bedrooms, asking prices and median asking price per square metre.
- Save a shortlist in browser storage and export it as CSV.
- Use a responsive layout with keyboard controls, labelled inputs and live result announcements.

## Run locally

No package installation is required. Serve this folder with Python 3:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000. Run the six logic tests with Node.js 18 or later:

```sh
node --test core.test.mjs
```

## Implementation

Vanilla JavaScript ES modules, HTML and CSS. `inventory.json` contains six invented listings; `core.mjs` implements filtering, sorting, median calculations and CSV export. `app.js` handles the interface and browser-local shortlist.

## Scope

This is a standalone demonstration, not the production 5square meter platform. Every project, price and availability state is fictional. No personal information is collected; no live inventory, reservations, payments, lead submission or advertising connections are implemented. The code is a new real estate adaptation of reusable dashboard concepts.

## Related project

[5square meter marketing operations](https://github.com/parsleykyrie-svg/5square-meter-marketing-operations) demonstrates audience-specific content workflows and campaign reporting.
