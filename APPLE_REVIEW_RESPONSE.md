# Resposta ao Apple App Review - Guideline 5.1.2

## Para: Apple App Review Team  
## App: **Avantar Indica**  
## Issue: Guideline 5.1.2 - Data Collection and Storage

---

## Dear App Review Team,

Thank you for your continued review of Avantar Indica. We understand your concerns regarding Guideline 5.1.2 and have implemented a comprehensive **dual-consent mechanism** to ensure full compliance with Apple's privacy standards.

---

## 📋 **App Purpose & Context**

**Avantar Indica** is a **B2B (Business-to-Business) referral tool** designed exclusively for authorized sales representatives of Avantar Insurance partners (e.g., car dealerships, retail stores). 

**Use Case:**
- A customer walks into a car dealership and purchases a vehicle
- The customer verbally expresses interest in insurance services
- The salesperson (app user) obtains **verbal consent** from the customer to refer them to Avantar Insurance
- The salesperson uses our app to initiate the referral process

**This is NOT a consumer-facing app.** It is a professional tool for authorized business partners.

---

## 🔐 **Dual-Consent Mechanism (Updated)**

We have implemented a **two-layer consent system** that ensures no data is permanently stored without explicit electronic confirmation from the referred party:

### **Layer 1: Pre-Collection Verbal Consent**
Before any data entry, the app user (salesperson) must:
1. Obtain **verbal authorization** from the customer in person
2. Inform the customer they will receive a confirmation email
3. Explicitly declare in the app that prior consent was obtained

**In-App Declaration:**
```
"I DECLARE that I have obtained prior verbal authorization from the 
customer to share their data with Avantar Seguros, and that the 
customer is aware they will receive an email to electronically 
confirm their consent."
```

### **Layer 2: Electronic Confirmation (Double Opt-In)**
After the salesperson enters the referral information:
1. Data is stored **temporarily** (24-hour TTL) in a `temp_indications` collection
2. An **automated email** is sent to the customer with:
   - Clear explanation of what data is being shared
   - **"Accept" button** - confirms consent and saves data permanently
   - **"Reject" button** - deletes all data immediately
3. **Only if the customer clicks "Accept"** is the data moved to permanent storage
4. If no action is taken within 24 hours, the data is **automatically deleted**

---

## 📊 **Data Flow Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: VERBAL CONSENT (In-Person)                         │
│ Customer verbally authorizes salesperson to share data      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: APP DECLARATION                                     │
│ Salesperson declares in app that consent was obtained       │
│ ⚠️ Warning displayed: "Only proceed if verbal consent given"│
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: TEMPORARY STORAGE (24h TTL)                        │
│ Data stored in temp_indications (NOT permanent)             │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: EMAIL CONFIRMATION SENT                            │
│ Customer receives email with Accept/Reject options          │
└─────────────────────┬───────────────────────────────────────┘
                      │
            ┌─────────┴─────────┐
            │                   │
            ▼                   ▼
   ┌────────────────┐  ┌────────────────┐
   │ ACCEPT CLICKED │  │ REJECT CLICKED │
   │ → Save to DB   │  │ → Delete Data  │
   └────────────────┘  └────────────────┘
```

---

## 🆕 **Recent Updates to Address Review Concerns**

### 1. **Info.plist Privacy Declarations**
We have added comprehensive privacy usage descriptions:
```xml
<key>NSUserTrackingUsageDescription</key>
<string>This app is a B2B tool for authorized Avantar Insurance partners 
to refer customers interested in insurance services. Sales representatives 
must obtain verbal consent from customers before initiating referrals. A 
confirmation email is sent to the customer to validate consent before any 
data is permanently stored.</string>

<key>NSPrivacyTracking</key>
<false/>

<key>NSPrivacyCollectedDataTypes</key>
<array>
  <dict>
    <key>NSPrivacyCollectedDataType</key>
    <string>NSPrivacyCollectedDataTypeOther</string>
    <key>NSPrivacyCollectedDataTypeLinked</key>
    <false/>
    <key>NSPrivacyCollectedDataTypeTracking</key>
    <false/>
  </dict>
</array>
```

### 2. **Enhanced In-App Warnings**
Before submission, the app now displays:
- ⚠️ **Warning message:** "Only proceed if the customer verbally authorized you to send their data"
- 📋 **Detailed consent checklist** explaining the dual-consent process
- 🔴 **Red alert box** reminding users of their responsibility

### 3. **Explicit Declaration Checkbox**
Users must check a box declaring:
> "I DECLARE that I have obtained prior verbal authorization from the customer to share their data with Avantar Seguros, and that the customer is aware they will receive an email to electronically confirm their consent."

---

## 🌍 **Industry Context**

This business model is standard in the insurance and financial services industry. Similar apps in the App Store include:

- **Indique** (ID: 6446994759) - Collects name, phone, and address for referrals
- **Indique Educ Adventista** (ID: 6744768127) - Educational institution referral system

These apps operate on the same B2B referral model where:
1. Business representatives collect customer information in-person
2. Customers have given prior consent
3. Referral systems facilitate lead generation

---

## ✅ **Compliance Summary**

| Requirement | Implementation |
|-------------|----------------|
| **Prior Consent** | Verbal consent obtained in-person before app usage |
| **User Awareness** | Explicit declaration + warning messages in app |
| **Data Minimization** | Only name, email, phone, and product interest collected |
| **Temporary Storage** | Data stored temporarily for 24h only |
| **Electronic Confirmation** | Customer must click "Accept" in email |
| **Right to Refuse** | Customer can click "Reject" to delete all data |
| **Transparency** | Email clearly explains what data is shared and why |
| **Auto-Deletion** | Data automatically deleted after 24h if no response |

---

## 📱 **Testing Instructions**

To verify this implementation during review:

1. Open the app and navigate to the referral screen
2. Notice the **warning messages** about verbal consent requirement
3. Fill in referral information (use a test email you have access to)
4. Check the declaration box and submit
5. Check the email inbox - you will receive a consent confirmation email
6. Click **"Accept"** or **"Reject"** to see the dual-consent system in action

**Test Credentials:**
- [Provide test credentials here if needed]

---

## 🙏 **Conclusion**

We have implemented industry-leading privacy protections that go beyond standard practices:
- **Dual-consent** (verbal + electronic)
- **Temporary storage** with auto-deletion
- **Clear user declarations** and warnings
- **Transparent email confirmation** with accept/reject options

This app serves a legitimate B2B purpose and operates within the standard practices of the insurance and financial services industry. We are committed to user privacy and have designed our system to ensure no third-party data is stored without explicit, verifiable consent.

We kindly request that you reconsider your decision and approve Avantar Indica for distribution on the App Store.

Thank you for your time and consideration.

**Best regards,**  
Avantar Indica Development Team

---

## 📎 **Attachments**
- Screenshots of updated consent screens
- Email template showing accept/reject options
- Info.plist privacy declarations
- Privacy Policy (updated)

