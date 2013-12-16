module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n'+
				' * Mike\'s Blog v<%= pkg.version %> by @miguelerm\n' +
				' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>'+
				' *\n' +
				' */\n\n',
		bootstrapBanner: '/*!\n' +
				' * Bootstrap v3.0.2 by @fat and @mdo\n' +
				' * Copyright 2013 Twitter, Inc.\n' +
				' * Licensed under http://www.apache.org/licenses/LICENSE-2.0\n' +
				' *\n' +
				' * Designed and built with all the love in the world by @mdo and @fat.\n' +
				' */\n\n',
		jQueryCheck: 'if (typeof jQuery === "undefined") { throw new Error("Bootstrap requires jQuery") }\n\n',
		concat: {
			options: {
				banner: '<%= banner %><%= bootstrapBanner %>',
				stripBanners: false
			},
			build: {
				src: [
                    'js/jquery/jquery-1.10.2.js',
					'js/bootstrap/transition.js',
					'js/bootstrap/alert.js',
					'js/bootstrap/button.js',
					'js/bootstrap/carousel.js',
					'js/bootstrap/collapse.js',
					'js/bootstrap/dropdown.js',
					'js/bootstrap/modal.js',
					'js/bootstrap/tooltip.js',
					'js/bootstrap/popover.js',
					'js/bootstrap/scrollspy.js',
					'js/bootstrap/tab.js',
					'js/bootstrap/affix.js'
				],
				dest: 'js/main-build.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %><%= bootstrapBanner %>',
				report: 'min'
			},
			build: {
				src: ['<%= concat.build.dest %>'],
				dest: 'js/main-build.min.js'
			}
		},
		recess: {
			options: {
				compile: true,
				banner: '<%= banner %><%= bootstrapBanner %>'
			},
			build: {
				options: {
					compress: true
				},
				src: ['css/desktop-style.less'],
				dest: 'css/desktop-style.min.css'
			}
		},
		jekyll: {
      		build: {}
    	},
	});
	
	// Load the plugin that provides the necessary task.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.loadNpmTasks('grunt-recess');
	
	
	// Default task(s).
	grunt.registerTask('default', ['concat', 'uglify', 'recess', 'jekyll']);

};