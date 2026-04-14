# Plan: UI Separation for Customer and Staff

This plan outlines the steps to separate the Customer UI (Menu, Tracking) from the Staff UI (Kitchen, Admin) by creating distinct layouts and navigation components.

## Objective
- Provide a focused experience for customers by removing staff-only links.
- Create a unified workspace for staff to switch between kitchen monitoring and menu management.

## Key Files & Context
- `src/App.jsx`: Main routing configuration.
- `src/components/layout/`: Directory for layout and navbar components.
- `src/pages/`: Existing page components.

## Implementation Steps

### 1. Create Navbars
- Create `src/components/layout/CustomerNavbar.jsx` with links for Menu and Tracking.
- Create `src/components/layout/StaffNavbar.jsx` with links for Kitchen and Admin.

### 2. Create Layouts
- Create `src/components/layout/CustomerLayout.jsx` using `CustomerNavbar`.
- Create `src/components/layout/StaffLayout.jsx` using `StaffNavbar`.

### 3. Update Routing
- Modify `src/App.jsx` to use the new layouts for their respective routes.

### 4. Cleanup
- Remove legacy `src/components/layout/Layout.jsx` and `src/components/layout/Navbar.jsx`.

## Verification & Testing
- Verify that accessing `/menu` only shows customer-relevant links.
- Verify that accessing `/admin` or `/kitchen` shows staff-relevant links (Kitchen, Admin).
- Ensure navigation between Admin and Kitchen works seamlessly.
