# **App Name**: AdZone Lanka

## Core Features:

- Phone Number Authentication: Allow users to register and log in using their phone number and OTP verification through Firebase Phone Auth.
- Ad Posting: Enable users to post classified ads with title, description, images (uploaded to Firebase Storage), and category selection. The ad category must be selected from a pre-approved set.
- Ad Browsing: Allow users to browse ads by category without logging in.
- Membership Plans: Offer membership plans (Silver, Gold, Platinum, Global VIP) that allow unlimited ad postings for a specific duration. Store membership data in Firestore with start and expiry dates.
- Membership Expiry Handling: Automatically block ad posting when a user's membership expires. Use a scheduled task to check expiry dates and update user status. Send expiry notifications as email and SMS reminders before account lock to retain business.
- Banner Ad System: Implement a banner ad system with positions for top, left, right and bottom with defined pricing tiers. Admins are to approve banner uploads prior to listing.
- Payment Processing and Approval: Implement a manual payment approval system with upload support. Supported options: Bank Transfer, eZ Cash and Dialog Genie. Store transaction status until admin approved.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to convey trust and reliability.
- Background color: Very light blue (#E3F2FD) to create a clean, airy feel.
- Accent color: Yellow-orange (#FFB74D) to draw attention to important actions.
- Font pairing: 'PT Sans' (sans-serif) for both headlines and body text.
- Simple, modern icons to represent different ad categories and actions.
- Mobile-first responsive design with a clear and intuitive navigation.
- Subtle animations to indicate state changes or provide feedback to user actions.