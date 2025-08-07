# ✅ EFY Platform — Access & Testing Guide

### 📍 Website URL:
**[http://efy-sandbox-env.s3-website.ap-south-1.amazonaws.com/](http://efy-sandbox-env.s3-website.ap-south-1.amazonaws.com/)**  
> This is the test environment for the **Ethics For Youth (EFY)** web platform.

---

## 🔐 Admin Access

To access the **admin panel**, navigate to:  
**[http://efy-sandbox-env.s3-website.ap-south-1.amazonaws.com/admin](http://efy-sandbox-env.s3-website.ap-south-1.amazonaws.com/admin)**

### 🎫 Admin Credentials:
- **Username:** `admin@ethicsforyouth.org`
- **Password:** `admin123`  

---

## 🧪 Testing Checklist

### 🟢 1. General Access
- [x] Website loads without error.
- [x] Navigation links (Home, Events, Contact, etc.) are working.
- [x] Responsive design works well on desktop and mobile.

### 🗓️ 2. Events Module
**Page:** `/events`

- [x] User can view list of events.
- [x] Clicking on an event shows its details.
- [] (Admin only) Create/Edit/Delete events via admin panel.
- [x] Verify edge case: Empty event list shows “No events found”.

### 🏆 3. Competitions Module
**Page:** `/competitions`

- [x] User can see all competitions.
- [x] User can click a competition and see details.
- [x] User can register for a competition (via form).
- [x] Submission form validates required fields.
- [ ] (Admin only) View registration count and competition entries (if applicable).
- [x] Verify response from `GET /competitions/:id/results`.

### 📝 4. Volunteer Registration
**Page:** `/volunteers`

- [x] User can submit the volunteer form with required fields.
- [x] Confirm the form triggers API and shows success.
- [x] Test with both complete and partial data (to trigger validation).
- [ ] Admin can view volunteers in admin panel.

### 💬 5. Messages (Contact Us)
**Page:** `/contact-us`

- [x] User can submit a message (test all fields: name, email, category, etc.).
- [x] Optional fields like phone and isPublic work.
- [x] After submission, user sees a success confirmation.
- [x] Admin can view all messages under `/admin/messages`.
- [x] Admin filters (search, category, isPublic toggle) work as expected.

### 📚 6. Courses
**Page:** `/courses`

- [x] User can view list of available courses.
- [x] Admin can add/edit/delete courses.
- [ ] Course detail view opens with accurate data.

### 📝 7. Registrations
- [x] Use `/registrations` form from competitions/events if wired in frontend.
- [x] Test registration flow and check data via API or admin panel if integrated.

### 📊 8. Admin Dashboard
**Page:** `/admin`

- [x] Admin login works.
- [ ] Admin can view stats (events count, volunteers, messages, etc.).
- [ ] All admin sections (Events, Messages, Volunteers, Courses) load properly.
- [x] Admin actions like delete/edit/save work and reflect in frontend.

### 🌐 9. API Integration (Cross-Origin Testing)
- [x] Confirm frontend on S3 can successfully call the deployed API Gateway endpoints.
- [x] No CORS errors when using POST/PUT from the browser.
- [x] OPTIONS requests return proper headers.

---

## 🧪 Testing Tips
- Use **DevTools → Network** to verify API requests and CORS headers.
- Use **incognito mode** or different browsers to test auth/session flows.
- You can use `curl` or Postman to directly test APIs if needed.

---

## 📝 Reporting Bugs
Please report any bugs or inconsistencies with:
- URL where issue occurred
- Steps to reproduce
- Screenshot (if possible)
- Console/network error (if visible)
