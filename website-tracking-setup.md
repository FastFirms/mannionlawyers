# Mannion Lawyers: website tracking changes
Site: familylawforfathers.com (this folder, deployed on Vercel) · GTM: GTM-TCTRVLCH · Ads tag: AW-545135668

Do this **first**, before the Google Ads and GA4 guides. Google Tag Manager (GTM) can only track events the site sends.

## 1. Changes already made in this folder (deploy them)
| File | Change |
|---|---|
| `js/main.js` | Pushes `lead_form_submit` (with `form_id`) to the dataLayer after a successful Formspree submit, before the redirect to `/thank-you` |
| `js/main.js` | Pushes `phone_click` (`phone_number`, `page`) whenever someone taps a `tel:` link on a page that loads main.js |
| `lp-canberra.html`, `lp-wagga.html` | Push `phone_click` on `tel:` taps. The form already pushed `lead_form_submit` with `form_id` and `matter_type` |

To deploy, push to the repo or run `vercel --prod`. Then hard-refresh the live site so the browser doesn't serve the cached `main.js`.

## 2. Check after deploying (browser console)
Open each page, run `dataLayer` in the console after each action, and confirm the last entry is the one listed:
| Page | Action | Last dataLayer entry should be |
|---|---|---|
| `/lp-canberra` | Tap the phone number | `{event: "phone_click", phone_number: "0247049977", page: "lp-canberra"}` |
| `/lp-canberra` | Submit a test form | `{event: "lead_form_submit", form_id: "lp-canberra", matter_type: ...}` |
| `/lp-wagga` | Same two checks | `page` / `form_id` = `lp-wagga` |
| `/contact` | Submit a test form | `lead_form_submit` appears just before the redirect (tick "Preserve log" in the console) |
| any page | Tap a footer phone number | `phone_click` |

Name test leads "TEST – ignore" so intake knows to delete them in Formspree.

## 3. Recommended changes (not made yet)

### a. Local phone numbers on the landing pages
Both landing pages show the Penrith number, (02) 4704 9977.
- **Canberra LP**: use (02) 6243 3607 in the three `tel:` links (lines ~624, 665, 867) and in `phone_conversion_number` in the `<head>`.
- **Wagga LP**: decide which number to use. There's no Wagga number on the site yet.
- Each number you swap in needs its own "Call from website" action in Google Ads, or the call swap won't work.

### b. Capture the GCLID for offline conversions
Add this hidden field to every form:
```html
<input type="hidden" name="gclid" id="gclid">
```
And add this script to every page:
```html
<script>
(function(){
  var p = new URLSearchParams(location.search), g = p.get('gclid');
  if (g) { try { localStorage.setItem('gclid', JSON.stringify({v:g, t:Date.now()})); } catch(e){} }
  try { var s = JSON.parse(localStorage.getItem('gclid')||'null');
    if (s && Date.now()-s.t < 90*864e5) document.querySelectorAll('input[name=gclid]').forEach(function(i){ i.value = s.v; });
  } catch(e){}
})();
</script>
```
The GCLID then arrives in every Formspree email or CRM record, ready for the offline upload of "Consult booked" and "File opened".

### c. Remove leftover tags
- Look for any old TechSol form script on the site. If there is one, remove it. The new GTM tags replace it.
- Keep the `gtag('config', 'AW-545135668/...', {phone_conversion_number})` block in the `<head>`. It runs the website call number swap.
- Don't add a second GA4 or Ads config in the page code. Those live in GTM.

### d. Privacy page
Mention Google Ads and Google Analytics cookies and conversion tracking in `privacy.html`.

## 4. Order of work
1. Deploy section 1 and check section 2.
2. Follow `google-ads-conversion-setup.md`.
3. Follow `ga4-conversion-setup.md`.
4. When you're ready, do 3a and 3b and redeploy.
