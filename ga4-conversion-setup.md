# Mannion Lawyers: GA4 setup
GA4 property: Mannion Lawyers (553006862) · GTM container: GTM-TCTRVLCH

GA4 is for reporting and checking numbers against Google Ads. Google Ads bids on its own conversion actions, so GA4 key events go into Ads only as **Secondary**.

## 1. Check the base tag
- In GTM, look for a **Google Tag** using the property's Measurement ID (G-XXXX, found under GA4 Admin > Data streams > the web stream) that fires on **Initialization – All Pages**. Create it if it's missing.
- If there's also a hardcoded GA4 `gtag` in the page code, remove one of the two so page views aren't counted twice.
- Data stream > Enhanced measurement: **turn off "Form interactions"**. It misreads AJAX forms and duplicates leads.

## 2. Event tags in GTM
Reuse the triggers from the Google Ads setup.

**GA4 – generate_lead**
- Tag type: Google Analytics: GA4 Event · Event name `generate_lead`
- Parameters: `form_id` = {{DLV – form_id}} · `matter_type` = {{DLV – matter_type}}
- Trigger: **CE – lead_form_submit**

**GA4 – phone_click**
- Event name `phone_click`
- Parameters: `phone_number` = {{DLV – phone_number}} · `page` = {{DLV – page}}
- Trigger: **CE – phone_click**

Create these Data Layer Variables (Version 2): `form_id`, `matter_type`, `phone_number`, `page`.

## 3. GA4 Admin
- **Key events**: mark `generate_lead` and `phone_click` as key events, after they first show up (usually within 24 hours).
- **Custom dimensions** (event scope): `form_id`, `matter_type`, `phone_number`.
- **Google Ads link**: Product links > Google Ads > link 915-999-9780, with auto-tagging on.
- **Data retention**: set it to 14 months.
- **Internal traffic**: add the office IP addresses and turn the filter on, so staff visits don't count.
- **Unwanted referrals**: add `formspree.io`.

## 4. In Google Ads, after linking
- Import `generate_lead` and `phone_click` from GA4 and set both to **Secondary**.

## 5. Test
1. Open GA4 DebugView with GTM Preview running.
2. Tap a phone link, then submit a test form, on `/lp-canberra` and `/contact`.
3. You should see exactly one `phone_click` and one `generate_lead`, each with its parameters filled in.
4. Publish GTM.

## 6. Reporting
In Explore > Free form, set Rows to `Session source / medium` and `Landing page`, and filter to `generate_lead` and `phone_click`. Compare the google / cpc rows with Google Ads conversions each week. They should be within about 10–20% of each other.
