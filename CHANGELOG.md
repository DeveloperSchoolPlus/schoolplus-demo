# Robust - Responsive Bootstrap 4 Admin Template + Build System

V1.0 : [01/11/2017] : Initial Release

V1.1 : [02/05/2017] : Minor bug fix and enhancements
-----------------------------------------------------
Fixed: Horizontal layout small screen which space issue between top navbar and content
Fixed: Coming soon page with bg video option for RTL
Fixed: Missing css, js & images files.
Fixed: Console error for missing file and js issues
Fixed: Invoice list page table responsive and select all issue
Fixed: Horizontal timeline shadow and improve spacing
Fixed: RTL right sticky sidebar hidden on scroll
Fixed: Horizontal scrollbar issue where dropzone used
Fixed: Navigation icon right side icon alignment
Fixed: Perfect scrollbar, page should scroll after content scroll
Fixed: RTL Knob js icon center alignment
Fixed: RTL Social card carousal
Fixed: RTL Custom radio checkbox
Fixed: RTL Full-screen search horizontal scroll
Fixed: RTL Alert icons not coming in with arrow alert
Enhancement: Improved all charts js file and loading time
Enhancement: Megamenu components support
Enhancement: Improved all starter kit pages.
Enhancement: Removed functionality specific css/js include from common style/script file and included on requirement basis to improve loading speed
Added: Navbar with components

V1.2 : [03/16/2017] : Structural Changes and enhancements
---------------------------------------------------------
[New]
- Added Gulp support for template generation
- Optimized and distributed grunt file
- Include csscomb for beautiful css code.
- New JADE structure &b variables for better performance and template generation.

[Enhancement]
- CSS & JS Optimization for better performance and speed.
- Created new src folder for sourcs files and moved jade, scss and core js files in it.
- Renamed folder robust-assets to app-assets
- Renamed folder robust-builder to template-builder
- Renamed demo-data folder to data
- Vendor CSS and JS files moved to app-assets/vendors folder
- Folder locales  moved to data
- Folder ico moved to images
- Folder doc-images moved to images
- Renamed components.scss, robust-variables.scss file to app.scss, app-variables.scss
- Renamed bootstrap-robust.scss file to bootstrap-extended.scss
- Renamed robust.js & robust-menu.js to app.js & app-menu.js
- Renamed robust to app everywhare in css and js classes (.robust-content, .robust-shape changesd to .app-content, .app-shape).

[Fixed]
- Active menu class for compact menu items and sub menu items.
- Open selected menu by default for compact menu.
- jQuery dialog
- Advance cards menu
- jQuery file upload console error
- echarts console error
- Table components console error

[Removed]
- Removed page & plugin scss includes from old components.scss and include only required CSS and JS on page specific only to improve speed.
- Removed base64 encoding from font css file icomoon.css for and adde FF warning
- Removed hamburgers plugins, and provided scss support for it.