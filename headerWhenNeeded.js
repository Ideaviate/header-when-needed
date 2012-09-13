/*
 * Copyright (C) 2012 Ideaviate AB
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all 
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function ($) {
        // Declare a namespace used for all events, for convenience
    var namespace = "headerWhenNeeded",
        // Holds a reference to the timeout for this instance
        timeout,
        // Hold all options, so they are available to the entire plugin
        opts,
        // Wrap all public methods that we want to expose
        methods = {
            // Initializes a new instance of the plugin
            init: function (options) {
                // Keep a reference to this, but skip all elements
                // that doesn't have fixed positioning
                var that = $(this).filter(function () {
                        return $(this).css("position") === "fixed";
                    }),
                    // Declare some defaults to fall back to
                    defaults = {
                        activationYOffset: 100,
                        visible: 2000,
                        animationDuration: 500,
                        keepWhenHover: true
                    };
                    // Use options over defaults if available
                    opts = $.extend({}, defaults, options);

                // Bind the scroll event
                $(window).on("scroll." + namespace, privateMethods.scroll(that));
                // Keep track of if the element is hover or not
                privateMethods.addHoverTracker(that);
                // Set a data-attribute that the element is in viewport
                $(this).data("visible", true);
                return that;
            },
            // Destroy the plugin instance and clean up
            destroy: function () {
                // Let's get rid of the bindings we've added
                $(window).off('.' + namespace);
                // Clear any active timeouts
                clearTimeout(timeout);
                return this;
            },
            // Programatically trigger the header to show
            show: function () {
                return this.each(function (i, elm) {
                    $(elm).animate({
                        marginTop: "0"
                    }, 
                    opts.animationDuration,
                    function () {
                        $(this).data("visible", true);
                    });
                });
            },
            // Programatically trigger the header to hide
            hide: function () {
                return this.each(function (i, elm) {
                    // Slide up if element isn't hovered, or if the keepWhenHover
                    // options is set to false
                    if (!$(elm).data("hover") || !opts.keepWhenHover) {
                        $(elm).animate({
                            marginTop: "-" + $(this).outerHeight() + "px"
                        },
                        opts.animationDuration,
                        function () {
                            $(this).data("visible", false);
                        });
                    // If hovered, slide up when mouse leaves
                    } else {
                        $(elm).on("mouseleave." + namespace, privateMethods.scroll($(this)));
                    }
                });
            }
        },
        // Wrap methods we don't want to expose
        privateMethods = {
            // Callback function for the scroll event
            scroll: function (that) {
                // jQuery callbacks wants a function pointer, so lets return that
                return function () {
                    // Check if we are passed the activation point
                    if ($(window).scrollTop() > privateMethods.activationPoint()) {
                        // Clear existing hide timeout
                        clearTimeout(timeout);
                        // Show the header if hidden
                        if (!$(that).data("visible")) {
                            methods["show"].apply(that);
                        }
                        // Set a timeout to hide the header
                        timeout = setTimeout(function () { methods["hide"].apply(that) }, opts.visible);
                    } else {
                        clearTimeout(timeout);
                        methods["show"].apply(that);
                    }
                };
            },
            // Calculate the proper activation point for the plugin
            activationPoint: function () {
                // If an activation element is provided, then use the value
                // for when it is no longer in the viewport as the activation point
                if (opts.activationElement) {
                    var elm = $(opts.activationElement).first();
                    return elm.height();
                // Use the YOffset provided by the user, if it is a valid integer
                } else if (privateMethods.isPositiveInteger(opts.activationYOffset)) {
                    return opts.activationYOffset;
                // Throw an error if neither the activationElement nor the
                // nor the activationYOffset value can be used
                } else {
                    $.error("Neither the activationElement- nor the activationYOffset option can be used, make sure your options are correct.");
                }
            },
            // Check if a value is a positive integer
            isPositiveInteger: function (value) {
                return /^\d+$/.test(value);
            },
            // Keep track of whether an element is hovered or not
            addHoverTracker: function (that) {
                // Attach a data-attribute to the element that holds the hover state
                that.on("mouseenter." + namespace, function () { $(this).data('hover', true); })
                    .on("mouseleave." + namespace, function () { $(this).data('hover', false); })
                    .data('hover', false);
            }
        };

    $.fn.headerWhenNeeded = function (method) {
        // If method is a valid public method, then call it
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        // If method is an object, then call the initialize method, 
        // and pass the object as options
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        // If method is neither a valid method nor an object, then throw an error
        } else {
            $.error('The plugin does not have a method called ' + method);
        }
    };
})(jQuery);