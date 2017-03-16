(function() {
    'use strict';

    var variables = {
        scrollOffset: -30,
        delay: 1000,
        additionalOffset: 10,
        gmap: {
            longitude: 106.7527771,
            latitude: -6.59532584,
            markInfo: '<strong>My House Location: </strong><br>Ciomas Permai, Bogor, West Java, Indonesia<br>'
        },
        ga: {
            gua: 'UA-93589912-1'
        }
    };

    var main = {
        register: function() {
            main.events.register.apply();
        },
        ui: {
            hidePreloader: function() {
                $('#status').fadeOut();

                $('#preloader')
                    .delay(variables.delay)
                    .fadeOut('slow');

                $('body')
                    .delay(variables.delay)
                    .css({
                        'overflow-x': 'hidden',
                        'overflow-y': 'auto'
                    });
            },
            initScrollSpy: function() {
                $('body').scrollspy({ target: '.nav-menu' });

                $('body')
                    .data()['bs.scrollspy']
                    .options
                    .offset = Math.abs(variables.scrollOffset) + variables.additionalOffset;

                $('body')
                    .data()['bs.scrollspy']
                    .process();

                $('body').scrollspy('refresh');
            },
            initWow: function() {
                var wow = new WOW({
                    boxClass: 'wow',
                    animateClass: 'animated',
                    offset: '-200px',
                    mobile: true,
                    live: true
                });

                new WOW().init();
            },
            initSkill: function() {
                $('.skill').circliful({
                    fgcolor: '#E64A3B',
                    fontsize: '20',
                    bgcolor: '#D8CDBB',
                    dimension: '150'
                });

                $('.has-shadow').append('<div class="shadow"></div>');

                if ($('.bg-image[data-bg-image]').length > 0)
                    $('.bg-image[data-bg-image]').each(function() {
                        var el = $(this);
                        var size = main.helper.getImageSize(el, el.attr('data-bg-image'));

                        el.css({
                            'background-position': 'center',
                            'background-image': ['url("', el.attr('data-bg-image'), '")'].join(''),
                            'background-size': 'cover',
                            'background-repeat': 'no-repeat'
                        });
                    });

                if ($('.bg-color[data-bg-color]').length > 0)
                    $('.bg-color[data-bg-color]').each(function() {
                        $(this).css('background-color', $(this).attr('data-bg-color'));
                    });
            },
            initPortfolio: function() {
                if ($('.portfolio-item').length > 0) {
                    var container = $('#portfolio-grid');
                    container.isotope({ filter: '*' });

                    $('.group-selectors a').click(function(e) {
                        e.preventDefault();

                        var that = $(this).attr('data-filter');
                        container.isotope({
                            filter: that,
                            columnWidth: 4
                        });

                        $('.group-selectors a.active').removeClass('active');
                        $(this).toggleClass('active');
                        return false;
                    });

                    $('.group-selectors a').each(function() {
                        $(this).append('<span></span>')
                    });
                }
            },
            initMap: function() {
                var map = new google.maps.Map(
                    document.getElementById('gmap_canvas'), {
                        zoom: 13,
                        center: new google.maps.LatLng(variables.gmap.latitude, variables.gmap.longitude),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                );

                var marker = new google.maps.Marker({
                    map: map,
                    position: new google.maps.LatLng(variables.gmap.latitude, variables.gmap.longitude)
                });

                var infowindow = new google.maps.InfoWindow({
                    content: variables.gmap.markInfo
                });

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                });

                infowindow.open(map, marker);
            },
            formControlsCleanser: function() {
                $('[data-placeholder]')
                    .parents('form')
                    .submit(function() {
                        $(this)
                            .find('[data-placeholder]')
                            .each(function() {
                                var that = $(this);
                                if (that.val() == that.attr('data-placeholder'))
                                    that.val('');
                            });
                    });
            },
            putTargetForOutLink: function() {
                $('body a[href]').each(function(idx, el) {
                    if ($(el).attr('href').charAt(0) !== '#')
                        $(el).attr('target', '_blank');
                });
            }
        },
        events: {
            register: function() {
                main.events.window.onLoad.apply();
                main.events.window.onReady.apply();
                main.events.window.onResize.apply();
                main.events.crossBrowserHandler.requestAnimationFrame.apply();
            },
            window: {
                onLoad: function() {
                    $(window).bind('load', function() {
                        main.ui.hidePreloader.apply();
                        main.ui.initScrollSpy.apply();
                        main.events.stickyNav.apply();
                    });
                },
                onReady: function() {
                    $(window).ready(function() {
                        main.ui.initWow.apply();
                        main.ui.initSkill.apply();
                        main.ui.initPortfolio.apply();
                        main.events.formControls.focus.apply();
                        main.events.formControls.blur.apply();
                        main.ui.formControlsCleanser.apply();
                        main.events.gotoTop.apply();
                        main.ui.putTargetForOutLink.apply();

                        main.ui.initMap.apply();
                        main.helper.googleAnalytic.init.apply();

                        main.events.navigations.apply();

                        setTimeout(function() {
                            $(window).trigger('resize');
                        }, 500)
                    });
                },
                onResize: function() {
                    $(window).bind('resize', function() {
                        main.helper.changePage.apply();
                    });
                }
            },
            crossBrowserHandler: {
                requestAnimationFrame: function() {
                    if (!window.requestAnimationFrame)
                        window.requestAnimationFrame = (function() {
                            return w.webkitRequestAnimationFrame ||
                                w.mozRequestAnimationFrame ||
                                w.oRequestAnimationFrame ||
                                w.msRequestAnimationFrame ||
                                function( /* function FrameRequestCallback / callback, / DOMElement Element */ element) {};
                        })(w);
                }
            },
            gotoTop: function() {
                $('.goto-top').click(function(e) {
                    e.preventDefault();
                    $('html,body').animate({
                        scrollTop: 0
                    }, 2000);
                });
            },
            // for both anchor & dropdown
            navigations: function() {
                $('.nav-menu a').address(window.location.hash.substr(2));

                $('.top-drop-menu').on('change', function() {
                    $('.nav-menu a').address($(this).find('option:selected').val());
                });

                $.address.change(function(e) {
                    var pageID = e.value.split('/')[1];

                    if (pageID != '' && pageID.indexOf('.') === -1) {
                        var el = $('.nav-menu a[href="#' + pageID + '"]');

                        $('.nav-menu .active').removeClass('active');
                        el.parent().addClass('active');

                        $('select.nav option').each(function() {
                            var val = $(this).val();
                            if (val === ['#', pageID].join('')) {
                                $('select.nav option:selected').removeAttr('selected');
                                $(this).attr('selected', 'selected');
                            }
                        });

                        main.helper.scrollToSection(['#', pageID].join(''));
                    } else {
                        if (pageID.indexOf('.') > -1)
                            window.location = pageID;
                    }
                });

                $('select.nav').change(function() {
                    main.helper.scrollToSection($(this).find('option:selected').val());
                });

                $('.nav-menu a')
                    .bind('click', function(e) {
                        e.preventDefault();
                        var that = $(this);

                        $('.nav-menu .active').toggleClass('active');
                        that.parent().toggleClass('active');

                        main.helper.scrollToSection(that.attr('href'));
                    });
            },
            stickyNav: function() {
                $(window).scroll(function(e) {
                    $('.goto-top').css('opacity', $(this).scrollTop() >= 500 ? 1 : 0);

                    if ($(this).scrollTop() >= $('header').height())
                        $('.top-menu-holder').addClass('split');
                    else
                        $('.top-menu-holder').removeClass('split');
                });
            },
            formControls: {
                focus: function() {
                    $('[data-placeholder]').focus(function() {
                        var that = $(this);
                        if (that.val() == input.attr('data-placeholder'))
                            that.val('');
                    });
                },
                blur: function() {
                    $('[data-placeholder]')
                        .blur(function() {
                            var that = $(this);
                            if (that.val() == '' || that.val() == input.attr('data-placeholder'))
                                that
                                .addClass('placeholder')
                                .val(that.attr('data-placeholder'));
                        })
                        .blur();
                }
            }
        },
        helper: {
            changePage: function() {
                var pageID = window.location.hash.substr(2);

                if (pageID != '' && pageID != undefined) {
                    var el = $('.nav-menu a[href="#' + pageID + '"]');
                    el.trigger('click');
                }
            },
            getImageSize: function(el, imgSource) {
                var img = new Image();
                img.onload = function() {
                    el.css('height', img.height);
                }
                img.src = imgSource;
            },
            scrollToSection: function(sect) {
                $('html, body')
                    .stop()
                    .animate({
                            scrollTop: $(sect).offset().top + variables.scrollOffset
                        },
                        2000,
                        'easeInOutExpo'
                    );
            },
            googleAnalytic: {
                init: function() {
                    (function(i, s, o, g, r, a, m) {
                        i['GoogleAnalyticsObject'] = r;

                        i[r] = i[r] || function() {
                            (i[r].q = i[r].q || []).push(arguments)
                        }, i[r].l = 1 * new Date();

                        a = s.createElement(o),
                            m = s.getElementsByTagName(o)[0];
                        a.async = 1;
                        a.src = g;
                        m.parentNode.insertBefore(a, m)
                    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

                    ga('create', variables.ga.gua, 'auto');
                    ga('send', 'pageview');
                }
            }
        }
    };

    main.register.apply();
})();