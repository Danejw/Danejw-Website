# Site Map - Dane Willacker Portfolio

**Base URL:** https://danejw.com  
**Last Updated:** January 27, 2025

## Main Pages

### Primary Navigation
- **Home** - `/`  
  Portfolio landing page with hero section, featured projects, services overview, and contact form.

- **About** - `/about`  
  Information about Dane Willacker, background, and expertise.

- **Contact** - `/contact`  
  Contact information and inquiry form.

- **Services** - `/services`  
  Overview of services offered including AI Knowledge Base and Web Application Development.

- **Hire Me** - `/hire-me`  
  Information about hiring Dane for projects.

## Articles

### Articles Index
- **Articles** - `/articles`  
  Blog and article listing page.

### Individual Articles
- **Automating Repetitive Administrative Tasks and Communications**  
  `/articles/automating-repetitive-administrative-tasks`  
  Published: June 3, 2025

- **Enhancing Customer Interaction and Support**  
  `/articles/enhancing-customer-interaction-and-support`  
  Published: June 3, 2025

- **Improving Bid Accuracy and Turnaround**  
  `/articles/improving-bid-accuracy-and-turnaround`  
  Published: June 3, 2025

- **AI Customer Support for Supabase Integration**  
  `/articles/ai-customer-support-for-supabase-integration`  
  Published: June 5, 2025

- **Automating AI Music Video Publishing to Save Time and Effort**  
  `/articles/automating-ai-music-video-publishing`  
  Published: June 8, 2025

## Services

### Services Overview
- **Services** - `/services`  
  Main services page with links to detailed service pages.

### Service Pages
- **AI Knowledge Base** - `/services/knowledge-base`  
  Transform scattered files into an intelligent, searchable resource for your team.

- **Web Application Development** - `/services/web-app-development`  
  Custom web-app creation with guided planning and pricing tiers for any size business.

- **Web App Estimator** - `/services/webapp/estimator`  
  Tool for estimating web application development costs.

## Utility Pages

- **Form** - `/form`  
  General form page.

- **Newsletter Signup** - `/newsletter-signup`  
  Newsletter subscription page.

- **Customer Feedback** - `/customer-feedback`  
  Customer feedback and testimonial submission page.

- **Template** - `/template`  
  Template page (internal use).

## Home Page Sections (Anchor Links)

The home page (`/`) includes the following sections accessible via anchor links:

- **Hero Section** - `/#hero`  
  Introduction and main value proposition.

- **Build Section** - `/#build`  
  Three key value propositions: Build Custom Software, Solve your Niche, Make It Personal.

- **Tech Stack Marquee** - `/#tech`  
  Technologies and tools used.

- **Portfolio/Work** - `/#work`  
  Featured projects and case studies.

- **Questions Section** - `/#questions`  
  Reflection questions for potential clients.

- **Contact Section** - `/#contact`  
  Contact form and information.

## API Routes

- **Send Email API** - `/api/send-email`  
  POST endpoint for handling contact form submissions.

## Site Structure Summary

```
/
├── /about
├── /contact
├── /articles
│   ├── /automating-repetitive-administrative-tasks
│   ├── /enhancing-customer-interaction-and-support
│   ├── /improving-bid-accuracy-and-turnaround
│   ├── /ai-customer-support-for-supabase-integration
│   └── /automating-ai-music-video-publishing
├── /services
│   ├── /knowledge-base
│   ├── /web-app-development
│   └── /webapp
│       └── /estimator
├── /hire-me
├── /form
├── /newsletter-signup
├── /customer-feedback
└── /template
```

## Notes

- The site is built with Next.js and uses the App Router.
- All pages are server-rendered for optimal SEO.
- The home page is a single-page application with smooth scrolling between sections.
- Contact form submissions are handled via the `/api/send-email` endpoint.
- The site uses metadata from `app/layout.tsx` with base URL: https://danejw.com
