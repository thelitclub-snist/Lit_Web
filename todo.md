# Literary Club Website - Project TODO

## Database & Schema
- [x] Design and implement Lit Weekly issues table
- [x] Design and implement articles table
- [x] Design and implement books table
- [x] Design and implement book borrowing records table
- [x] Run database migrations

## Backend API (tRPC)
- [x] Create Lit Weekly procedures (list, get single, create, update, delete)
- [x] Create articles procedures (list, create, update, delete)
- [x] Create books procedures (add, list, get, update)
- [x] Create book borrowing procedures (borrow, list borrowed, return)
- [x] Add admin-only access control for management procedures
- [x] Write vitest tests for all procedures

## Frontend - Public Pages
- [x] Design and implement Home page with literary theme
- [x] Design and implement Lit Weekly archive page
- [x] Design and implement individual issue page
- [x] Design and implement book borrowing page
- [x] Design and implement 404 not-found page

## Frontend - Admin Dashboard
- [x] Create admin layout with sidebar navigation
- [x] Implement Lit Weekly management (create, edit, delete issues)
- [ ] Implement article management within issues
- [x] Implement book management (add books)
- [x] Implement borrowed books view and return functionality
- [x] Add admin-only route protection

## Styling & Design
- [x] Choose and implement literary-themed color palette
- [x] Set up elegant typography with serif fonts
- [x] Create responsive layout components
- [x] Ensure accessibility standards

## Testing & Deployment
- [ ] Test all public pages and flows
- [ ] Test admin dashboard functionality
- [ ] Test book lending system
- [ ] Fix any bugs and edge cases
- [ ] Create final checkpoint


## New Features - Phase 2
- [ ] Add isPublished field to lit_weekly_issues table
- [ ] Update database schema with draft/publish status
- [ ] Create About/Vision page with club information
- [ ] Implement empty-state UI components for all pages
- [ ] Add draft/publish toggle to admin dashboard
- [ ] Update Lit Weekly list to show only published issues publicly
- [ ] Add draft issues view in admin panel
- [ ] Test draft/publish workflow
- [ ] Test empty states on all pages
