# Mannion Lawyers: Google Ads conversion setup
Account: 915-999-9780 · Google Tag Manager (GTM) container: GTM-TCTRVLCH · Google Ads tag ID: AW-545135668

The site already sends two events to the GTM dataLayer. They go live once the updated code is deployed.
- `lead_form_submit`: the form was sent successfully (landing pages, plus the main site before the /thank-you redirect)
- `phone_click`: someone tapped a phone link

## Part A: Google Ads (Goals > Conversions > Summary)

### 1. Create the form conversion
New conversion action > Website > set it up manually:
- Category: **Submit lead form**
- Name: **FLFF – Lead form**
- Value: don't use a value
- Count: **One**
- Click-through window: 90 days · Engaged-view: 3 days · View-through: 1 day
- Attribution: Data-driven
- Choose "Use Google Tag Manager" and note the **Conversion ID** (545135668) and the **Conversion label**.

### 2. Create the phone tap conversion
Same steps as above:
- Category: **Contact**
- Name: **FLFF – Phone click**
- Count: **One** · Click-through window: 30 days
- Note its **Conversion label**.

### 3. Add calls from ads
New conversion action > Phone calls > **Calls from ads using call assets**
- Name: **FLFF – Calls from ads**
- Call length: **60 seconds**
- Count: **One** · Click-through window: 30 days
- Check that a call asset is on both campaigns, with **Google forwarding number** and call reporting turned on.

### 4. Clean up the existing actions
For each action, open it and change "Goal and action optimisation" (Primary or Secondary):
| Action | Set to |
|---|---|
| Call ((02) 4704 9977) | Primary (keep) |
| Call ((02) 4704 9977) (1) | **Secondary**, then remove |
| Submit lead form (www.mannionlawyers.com.au/) | **Secondary**, remove after 30 days |
| TechSol – Mannionlawyers form submissions 14578 | **Secondary**, remove after 30 days |
| FLFF – Lead form | **Primary** |
| FLFF – Phone click | **Primary** |
| FLFF – Calls from ads | **Primary** |
| Any imported GA4 key events | **Secondary** (avoids double counting) |

Then go to Goals > Summary and make sure the account default goals include **Submit lead form**, **Contact** and **Phone call lead**. Check both campaigns use the account default goals (Campaign settings > Goals).

## Part B: GTM (GTM-TCTRVLCH)

### 1. Triggers
- **CE – lead_form_submit**: Trigger type Custom Event, Event name `lead_form_submit`
- **CE – phone_click**: Trigger type Custom Event, Event name `phone_click`

### 2. Tags
- **Conversion Linker**: if one doesn't exist already, fire it on All Pages.
- **Ads – FLFF Lead form**: Tag type Google Ads Conversion Tracking, Conversion ID `545135668`, label from step A1, trigger **CE – lead_form_submit**
- **Ads – FLFF Phone click**: same tag type, label from step A2, trigger **CE – phone_click**

### 3. Remove double firing
- Check for any existing tag that fires on a page view of **/thank-you**, or any old TechSol form tag. Pause it, or form submits will count twice.
- The hardcoded `gtag config` for AW-545135668 in the page `<head>` stays. It handles the website call number swap. Don't add a second Ads config tag in GTM.

### 4. Test
1. In GTM, click Preview and open `/lp-canberra` with `?gclid=test`.
2. Tap the phone number. **Ads – FLFF Phone click** should fire once.
3. Submit a test form with a name like "TEST – ignore". **Ads – FLFF Lead form** should fire once.
4. Repeat on `/contact`. The form fires once before the redirect, and nothing fires again on /thank-you.
5. Publish the container.
6. After 24–48 hours, check that the Conversions > Summary status shows **Recording conversions**.

## Part C: next step (offline conversions)
- Add a hidden `gclid` field to the forms, filled from the URL or a cookie.
- Each month, upload "Consult booked" and "File opened" against the GCLID.
- Once there are 15 or more file-opened conversions a month, make "File opened" the bidding goal.
