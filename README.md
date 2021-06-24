Product Name
---------------
Robust - Responsive Bootstrap 4 Admin Template + Jade(pug) Builder


Product Description
-------------------
Robust admin is super flexible, powerful, clean & modern responsive bootstrap 4 admin template with unlimited possibilities. It includes 7 pre-built templates with organized folder structure, clean & commented code, 2500+ pages, 1000+ components, 500+ charts, 100+ advance cards (widgets), 100+ plugins – extensions and many more. Robust admin provides internationalization, RTL support, searchable navigation, unique menu layouts, advance cards and incredible support. Robust admin can be used for any type of web applications: Project Management, eCommerce backends, CRM, Analytics, Fitness or any custom admin panels. It comes with 5 niche dashboards. Robust admin template is powered with HTML 5, SASS, GRUNT, JADE [Pug] & Twitter Bootstrap 4 which looks great on Desktops, Tablets, and Mobile Devices. Robust admin comes with starter kit which will help developers to get started quickly.


Online Documentation
--------------------
You will find documentation in your downloaded zip file from ThemeForest. You can access documentation online as well.
Documentation URL: https://pixinvent.com/bootstrap-admin-template/robust/documentation/


7 Pre-Built Admin Templates
----------------------------
1. Default Template: Classic admin template with dark sidebar, fixed semi dark navbar, light footer and searchable navigation
2. Compact Menu: Modern admin template with compact light sidebar, dark navbar with center branding and dark footer
3. Content Menu: Minimal admin template with light sidebar, light navbar which auto hides, light footer and searchable navigation
4. Overlay Menu: Full width admin template with dark sidebar, light navbar with center branding, transparent footer and searchable navigation
5.Multi-level Menu: Unique admin template with dark multi-level menu sidebar, built-in search, fixed navbar and dark footer
6. Horizontal Menu: Centered layout template with light navigation menu, light navbar with center branding and light footer
7. Horizontal Top Icon Menu: Full width admin template with light navigation menu, dark navbar, dropdowns working on hover and dark footer


Prerequisites [To run grunt / gulp]
-----------------------------------
Node JS must be installed on your system to run grunt / gulp template generation and dist commands.
You can download and install nodejs from this URL: https://nodejs.org/en/


Install Required Node Modules
-----------------------------
	1. Grunt
	--------
	- IF you are using grunt copy and paste package.grunt.json file in the root folder and rename it to package.json.
	- Run npm install command to install required node modules

	2. Gulp
	--------
	- IF you are using gulp copy and paste package.gulp.json file in the root folder and rename it to package.json.
	- Run npm install command to install required node modules


Grunt Commands
--------------

	1. Build Template
	-----------------

		Arguments
		-----------
		--Layout - which layout to use from the available 7 pre-built layouts to build your layout
		--LayoutName - Folder name that your html files will be built into.
		--TextDirection - LTR / RTL [Which text direction to use]

		- Vertical Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-html --Layout="vertical-menu-template" --LayoutName="vertical-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt monitor --Layout="vertical-menu-template" --LayoutName="vertical-menu-template" --TextDirection="LTR"

		- Compact Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-html --Layout="vertical-compact-menu-template" --LayoutName="vertical-compact-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt monitor --Layout="vertical-compact-menu-template" --LayoutName="vertical-compact-menu-template" --TextDirection="LTR"

		- Overlay Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-html --Layout="vertical-overlay-menu-template" --LayoutName="vertical-overlay-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt monitor --Layout="vertical-overlay-menu-template" --LayoutName="vertical-overlay-menu-template" --TextDirection="LTR"

		- Content Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-html --Layout="vertical-content-menu-template" --LayoutName="vertical-content-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt monitor --Layout="vertical-content-menu-template" --LayoutName="vertical-content-menu-template" --TextDirection="LTR"

		- Multi Level Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-html --Layout="vertical-multi-level-menu-template" --LayoutName="vertical-multi-level-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt monitor --Layout="vertical-multi-level-menu-template" --LayoutName="vertical-multi-level-menu-template" --TextDirection="LTR"

		- Horizontal Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-html --Layout="horizontal-menu-template" --LayoutName="horizontal-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt monitor --Layout="horizontal-menu-template" --LayoutName="horizontal-menu-template" --TextDirection="LTR"

		- Horizontal Top Icon Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-html --Layout="horizontal-top-icon-menu-template" --LayoutName="horizontal-top-icon-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt monitor --Layout="horizontal-top-icon-menu-template" --LayoutName="horizontal-top-icon-menu-template" --TextDirection="LTR"


	2. Starter Kit
	--------------
		- Vertical Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-sk-html --Layout="vertical-menu-template" --LayoutName="vertical-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt sk-monitor --Layout="vertical-menu-template" --LayoutName="vertical-menu-template" --TextDirection="LTR"

		- Compact Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-sk-html --Layout="vertical-compact-menu-template" --LayoutName="vertical-compact-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt sk-monitor --Layout="vertical-compact-menu-template" --LayoutName="vertical-compact-menu-template" --TextDirection="LTR"

		- Overlay Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-sk-html --Layout="vertical-overlay-menu-template" --LayoutName="vertical-overlay-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt sk-monitor --Layout="vertical-overlay-menu-template" --LayoutName="vertical-overlay-menu-template" --TextDirection="LTR"

		- Content Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-sk-html --Layout="vertical-content-menu-template" --LayoutName="vertical-content-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt sk-monitor --Layout="vertical-content-menu-template" --LayoutName="vertical-content-menu-template" --TextDirection="LTR"

		- Multi Level Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-sk-html --Layout="vertical-multi-level-menu-template" --LayoutName="vertical-multi-level-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt sk-monitor --Layout="vertical-multi-level-menu-template" --LayoutName="vertical-multi-level-menu-template" --TextDirection="LTR"

		- Horizontal Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-sk-html --Layout="horizontal-menu-template" --LayoutName="horizontal-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt sk-monitor --Layout="horizontal-menu-template" --LayoutName="horizontal-menu-template" --TextDirection="LTR"

		- Horizontal Top Icon Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			grunt dist-sk-html --Layout="horizontal-top-icon-menu-template" --LayoutName="horizontal-top-icon-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			grunt sk-monitor --Layout="horizontal-top-icon-menu-template" --LayoutName="horizontal-top-icon-menu-template" --TextDirection="LTR"

	3. Dist
	-------
		- grunt dist [To clean css, js and build distributable css and js files]
		- grunt dist-clean [To clean css, js files]
		- grunt dist-js [To clean js files and build distributable js files]
		- grunt sass-compile [Compile scss files]
		- grunt dist-css [To clean css files and build distributable css files]



Gulp Commands
--------------

	1. Build Template
	-----------------

		Arguments
		-----------
		--Layout - which layout to use from the available 7 pre-built layouts to build your layout
		--LayoutName - Folder name that your html files will be built into.
		--TextDirection - LTR / RTL [Which text direction to use]

		- Vertical Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-html --Layout="vertical-menu-template" --LayoutName="vertical-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp monitor --Layout="vertical-menu-template" --LayoutName="vertical-menu-template" --TextDirection="LTR"

		- Compact Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-html --Layout="vertical-compact-menu-template" --LayoutName="vertical-compact-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp monitor --Layout="vertical-compact-menu-template" --LayoutName="vertical-compact-menu-template" --TextDirection="LTR"

		- Overlay Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-html --Layout="vertical-overlay-menu-template" --LayoutName="vertical-overlay-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp monitor --Layout="vertical-overlay-menu-template" --LayoutName="vertical-overlay-menu-template" --TextDirection="LTR"

		- Content Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-html --Layout="vertical-content-menu-template" --LayoutName="vertical-content-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp monitor --Layout="vertical-content-menu-template" --LayoutName="vertical-content-menu-template" --TextDirection="LTR"

		- Multi Level Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-html --Layout="vertical-multi-level-menu-template" --LayoutName="vertical-multi-level-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp monitor --Layout="vertical-multi-level-menu-template" --LayoutName="vertical-multi-level-menu-template" --TextDirection="LTR"

		- Horizontal Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-html --Layout="horizontal-menu-template" --LayoutName="horizontal-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp monitor --Layout="horizontal-menu-template" --LayoutName="horizontal-menu-template" --TextDirection="LTR"

		- Horizontal Top Icon Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-html --Layout="horizontal-top-icon-menu-template" --LayoutName="horizontal-top-icon-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp monitor --Layout="horizontal-top-icon-menu-template" --LayoutName="horizontal-top-icon-menu-template" --TextDirection="LTR"


	2. Starter Kit
	--------------
		- Vertical Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-sk-html --Layout="vertical-menu-template" --LayoutName="vertical-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp sk-monitor --Layout="vertical-menu-template" --LayoutName="vertical-menu-template" --TextDirection="LTR"

		- Compact Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-sk-html --Layout="vertical-compact-menu-template" --LayoutName="vertical-compact-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp sk-monitor --Layout="vertical-compact-menu-template" --LayoutName="vertical-compact-menu-template" --TextDirection="LTR"

		- Overlay Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-sk-html --Layout="vertical-overlay-menu-template" --LayoutName="vertical-overlay-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp sk-monitor --Layout="vertical-overlay-menu-template" --LayoutName="vertical-overlay-menu-template" --TextDirection="LTR"

		- Content Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-sk-html --Layout="vertical-content-menu-template" --LayoutName="vertical-content-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp sk-monitor --Layout="vertical-content-menu-template" --LayoutName="vertical-content-menu-template" --TextDirection="LTR"

		- Multi Level Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-sk-html --Layout="vertical-multi-level-menu-template" --LayoutName="vertical-multi-level-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp sk-monitor --Layout="vertical-multi-level-menu-template" --LayoutName="vertical-multi-level-menu-template" --TextDirection="LTR"

		- Horizontal Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-sk-html --Layout="horizontal-menu-template" --LayoutName="horizontal-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp sk-monitor --Layout="horizontal-menu-template" --LayoutName="horizontal-menu-template" --TextDirection="LTR"

		- Horizontal Top Icon Menu Template

			Compile Command [HTML Generation command]
			-----------------------------------------
			gulp dist-sk-html --Layout="horizontal-top-icon-menu-template" --LayoutName="horizontal-top-icon-menu-template" --TextDirection="LTR"

			Monitor Command [Watch for any changes in jade file]
			----------------------------------------------------
			gulp sk-monitor --Layout="horizontal-top-icon-menu-template" --LayoutName="horizontal-top-icon-menu-template" --TextDirection="LTR"

	3. Dist
	-------
		- gulp dist [To clean css, js and build distributable css and js files]
		- gulp dist-clean [To clean css, js files]
		- gulp dist-js [To clean js files and build distributable js files]
		- gulp sass-compile [Compile scss files]
		- gulp dist-css [To clean css files and build distributable css files]


Change Log
----------
Read CHANGELOG.md file

License
--------
Read LICENSE.md file# schoolplus-LXP-Voile
