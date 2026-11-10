# Mannion Lawyers: Google Ads audit (915-999-9780), last 90 days to 10 Nov 2026
Source: Windsor.ai, plus a review of the site code in this folder.

| Campaign | Spend | Clicks | CPC | Primary conv | All conv | Search IS |
|---|---|---|---|---|---|---|
| FLFF Canberra | $2,680 | 148 | $18.11 | 2 | 5 | 56% |
| FLFF Wagga Wagga | $1,695 | 114 | $14.87 | 1 | 9 | 89% |
| Total | $4,375 | 262 | $16.70 | 3 | 14 | |

## Conversion tracking problems
1. Duplicate actions: there are two call actions for (02) 4704 9977 and two form actions (a codeless one, which is primary, and the TechSol tag, which is secondary).
2. The codeless form action is named for mannionlawyers.com.au, but the ads land on the familylawforfathers.com landing pages.
3. The landing page forms submit by AJAX and never reach /thank-you. They push `lead_form_submit` to the dataLayer, which only counts if a GTM tag listens for that event.
4. Clicks on phone links weren't tracked. Only website call forwarding was set up.
5. There were only 3 primary conversions in 90 days. That's too few for smart bidding, and you can't judge keywords on it.
6. The Canberra and Wagga landing pages show the Penrith number, (02) 4704 9977.
7. There's no offline or GCLID import.

## Site code changed (not deployed)
- js/main.js: pushes `lead_form_submit` before the redirect, and pushes `phone_click` whenever someone taps a tel: link.
- lp-canberra.html, lp-wagga.html: push `phone_click` whenever someone taps a tel: link.

## Still to do in Google Ads and GTM (GTM-TCTRVLCH)
1. Use one form action, "Lead form – FLFF", as primary. Set the codeless and TechSol actions to secondary, then remove them after 30 days.
2. In GTM, add a Google Ads Conversion tag triggered by `lead_form_submit`.
3. Create a "Phone click" action and set it to primary. In GTM, trigger its tag on `phone_click`.
4. Keep "Call (02) 4704 9977" as primary. Set "Call (1)" to secondary.
5. Add a "Calls from ads" action that counts calls of 60 seconds or longer, and set it to primary.
6. Test in Tag Assistant: each submit or tap should fire exactly once.
7. Capture the GCLID in a hidden form field, then import "consult booked" and "file opened" as offline conversions.

## Campaigns
- Keywords are tight exact and phrase match, and every search term is relevant. There's no waste to cut.
- Canberra is losing about 44% of its impression share. Any extra budget should go there.
- "family lawyers canberra" ($772), "family lawyer canberra" ($595) and "family lawyers wagga" ($478) have 0 primary conversions. Hold off judging them until tracking is fixed.
- Keywords aimed at fathers ("family lawyer for fathers", "dads rights lawyer") convert cheaply. Expand this theme.
- Archive the three campaigns with no spend.
