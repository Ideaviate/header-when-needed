# header-when-needed - jQuery-plugin

Using a fixed header navigation on your website is a convenient to let the user have 
quick access to the navigation, no matter if they scroll down your page or not.
This is especially true when it comes to pages with a long, single-page layout.
The draw back of this is that the navigation take up valuable space in the 
viewport, that otherwise could have been used for your content.

header-when-needed is a jQuery plugin that show your fixed header navigation whenever 
the user scroll the page, and hide it again when it is no longer needed, to give room 
for more content. The idea is that scrolling the page is an indication that the user 
want to navigate away from her current position, and therefore might be in need of 
the navigation. Whenever she stops, that particular content is of interest, and the
navigation is hidden to give room for the content.

## Requirements

1. The plugin require that you use jQuery version 1.7 or later
2. The header navigation have to use fixed positioning (`position: fixed;`)

## Usage

Reference the jQuery library and, `header-when-needed.js` or `header-when-needed.min.js`.

To initialize the plugin, select your navigation-element and call the `.headerWhenNeeded()`
method. Make sure you wait for the DOM-ready event, befor you initialize the plugin:

    $(function () {
        $("#id-of-navigation-element").headerWhenNeeded();
	});

### Customizing your navigation

`.headerWhenNeeded()` takes an optional object as a single parameter, with which you
can customize the navigation.

Possible options are:

* activationElement
* activationYOffset
* visible
* animationDuration
* keepWhenHover

#### activationElement

Sometimes you only want to hide the navigation when the user has scrolled passed a certain
element. The `activationElement` option can take any valid jQuery selector as a string.
If the selector match more than one element in the DOM, the first element will be used
as a trigger point.

    // Only hide the navigation when the user has scrolled passed element with id: some-element-id
	$("#id-of-navigation-element").headerWhenNeeded({ activationElement: "#some-element-id" });

#### activationYOffset

Sometimes you only want to hide the navigation when the user has scrolled passed a certain
point of the document. The `activationYOffset` takes a positive integer and uses it as the
vertical trigger point, given in pixels from the top of the document.

    // Only hide the navigation when the user has scrolled more than 100 px down the document
	$("#id-of-navigation-element").headerWhenNeeded({ activationYOffset: 100 });

If both `activationElement` and `activationYOffset` is set, then `activationElement` has
precedence.

#### visble

The `visible` option specify for how long the navigation should be visible after the user stop
scrolling. The value should be a positive integer, and specify the number of milliseconds the
element should remain visible.

	// Show the element for 3 seconds after the user has stopped scrolling
	$("#id-of-navigation-element").headerWhenNeeded({ visible: 3000 });

Default value: `2000`

#### animationDuration

The `animationDuration` option specify for how long the animation effect should run when
the navigation is shown/hidden. The value should be a positive integer, and specify the 
number of milliseconds the animation should run.

	// It should take 200 milliseonds to show/hide the navigation
	$("#id-of-navigation-element").headerWhenNeeded({ animationDuration: 200 });

Default value: `500`

#### keepWhenHover

The `keepWhenHover` option specify whether the navigation should remain visible as long as
the navigation is hovered, or not. The value should be a boolean. If set to `false`, the
navigation will disappear after X milliseonds (as specified by the `visible` option), 
even if the user hover the navigation.

	// Hide navigation even if it is hovered
	$("#id-of-navigation-element").headerWhenNeeded({ keepWhenHover: false });

Default value: `true`