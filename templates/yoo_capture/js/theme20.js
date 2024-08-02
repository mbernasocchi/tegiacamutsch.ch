/* Copyright (C) YOOtheme GmbH, YOOtheme Proprietary Use License (http://www.yootheme.com/license) */
jQuery(function($) {

	var config = $('html').data('config') || {},
        siteStatus = $('#siteStatus').val(),
        websiteId = $('#websiteId').val(),
        manualWebsiteId = $('#manualWebsiteId').val(),
        showAboutUs = $('#showAboutUs').val(),
        homepageLabel = $('#homePageMenuLabel').val(),
        aboutUsLabel = $('#aboutUsMenuLabel').val(),
        headerImages = $('.headerImageSet'),
        userCountry = localStorage['staydirectlyCountry'];

	// Social buttons
	//$('article[data-permalink]').socialButtons(config);

    if(!userCountry){// no language so far
        console.log('get language');

        $.ajax({
            'type': 'POST',
            'url': './index.php?option=com_search&task=search.recordClient&format=json',
            'data': '{"domain": "'+ document.domain +'"}',
            'contentType': 'application/json',
            'dataType': 'json',
            'success': function (data) {
                localStorage['staydirectlyCountry'] = data.country;
                localStorage['staydirectlyLang'] = data.lang;
                localStorage['staydirectlyWeek'] = data.week;
                localStorage['staydirectlyDateFormat'] = data.dateFormat;
            }
        });
    }

    // parallax effect on elements with class .parallax
    $(".parallax").parallax();


    //Get menu items

    $.ajax({
        'type': 'POST',
        'url': './index.php?option=com_search&task=search.getMenuItems&format=json',
        'data': '{"websiteId": "'+websiteId+'"}',
        'success': function (data) {
            if ($.isEmptyObject(data)) {
            } else {
                var menuFirstItem = $('.uk-navbar-nav li:first'),
                    menuFirstItemMobile = $('.uk-nav-offcanvas li:first'),
                    menuItem,
                    activePage = $('#pageUrl').val();

                $.each(data, function(key,menuObj){
                    // prepare the <li>


                    if(menuObj.pageType === 'link'){
                        menuItem = '<li><a href="'+menuObj.externalLink+'" target="_blank">'+menuObj.menuLabel+'</a></li>';

                    } else if (activePage === menuObj.menuUrl){
                        menuItem = '<li class="uk-active"><a href="./page?p='+menuObj.menuUrl+'">'+menuObj.menuLabel+'</a></li>';
                    } else {
                        menuItem = '<li><a href="./page?p='+menuObj.menuUrl+'">'+menuObj.menuLabel+'</a></li>';
                    }

                    menuFirstItem.after(menuItem);
                    menuFirstItemMobile.after(menuItem);

                });
            }
        },
        'contentType': 'application/json',
        'dataType': 'json'
    }); 


    // Calculate slants
    $(window).on('resize', (function(){

        var fn = function(){

            $('.tm-headerbar.tm-slant-bottom > .tm-slant-block-bottom:before, .tm-slant-top + .tm-block > .tm-slant-block-top, .tm-slant-bottom > .tm-slant-block-bottom').each(function(){

                var elem        = $(this),
                    slantWidth  = elem.parent().outerWidth(),
                    slantHeight = slantWidth / 100 * 2.5,
                    css         = {'border-right-width': slantWidth, 'border-top-width': slantHeight, 'top': -slantHeight+1},
                    mapToggle = $('#show-map-button-div'),
                    contentDiv = $('#map-parent-div');


                if(elem.hasClass("tm-slant-block-bottom")) {
                    css.bottom = css.top;
                    css.top    = "";
                }
                if(slantWidth < 480){
                    slantHeight = -20;
                    contentDiv.css({'margin-top': '15px'});
                } else {
                    contentDiv.css({'margin-top': '0px'});
                }

                mapToggle.css('top', -slantHeight/2);

                elem.css(css);

            });
        };

        fn();

        return fn;

    })());

    //Handle header image
    var mainUser = $('#mainUser').val(),
    menuItems = $('.menu-items'),
    userLink,
    currentLink = menuItems.attr('href');

    headerImages.each(function(i, obj) {

        $(this).css('background-image', 'url(' + $('#' + $(this).attr('id') + '-gallery').attr('href') + ')');
    });

    headerImages.click(function() {

        var clickedPhoto = $(this);

        var clickedPhotoId = clickedPhoto.attr('id');

        var clickedPhotoLinkId = clickedPhotoId + '-gallery';

        var clickedPhotoLinkObject = '#' + clickedPhotoLinkId;

        $(clickedPhotoLinkObject).click();
    });

    $('#main-search').click(function(){

        $(this).html('Searching...');

    });    

    if (siteStatus == 'public'){
        menuItems.each(function(i, obj) {
            currentLink = $(this).attr('href');
            userLink = currentLink + '?u=' + mainUser;

            $(this).attr('href', userLink);
        });
    } else {

        var allListings = $('.all-listings'),
            totalListings = $('#totalListings').val();

        if (totalListings == 1){
            allListings.addClass('uk-hidden');
        }

        if(homepageLabel != ''){
            allListings.html(homepageLabel);
        }

        var aboutUsLink = $('.about-us');
        if (showAboutUs == 0){
            aboutUsLink.addClass('uk-hidden');
        } else if(aboutUsLabel != ''){
            aboutUsLink.html(aboutUsLabel);
        }

        if (manualWebsiteId){
            menuItems.each(function(i, obj) {
                currentLink = $(this).attr('href');
                userLink = currentLink + '?w=' + websiteId;

                $(this).attr('href', userLink);
            });
        }


    }


    var $el, $ps, $up, totalHeight;

    $(".sidebar-box .button").click(function() {

        totalHeight = 0;

        $el = $(this);
        $p  = $el.parent();
        $up = $p.parent();
        $ps = $up.find("p:not('.read-more')");

        // measure how tall inside should be by adding together heights of all inside paragraphs (except read-more paragraph)
        $ps.each(function() {
            totalHeight += $(this).outerHeight();
        });

        $up
            .css({
                // Set height to prevent instant jumpdown when max height is removed
                "height": $up.height(),
                "max-height": 9999
            })
            .animate({
                "height": totalHeight
            });

        // fade out read-more
        $p.fadeOut();

        // prevent jump-down
        return false;

    });

    $("#show-more-amenities").click(function() {
        var moreAmenities = $("#more-amenities"),
            link = $(this);

        moreAmenities.removeClass('uk-hidden');
        link.addClass('uk-hidden');

    });

    $('#style-selector').on('change', function() {
        $('#style-selector-form').submit();
    });

    $(".register-button").click(function(e) {
        // var sourceData = $(this),
         //   sourceForm = $("#source");
        //sourceForm.val(sourceData.attr('id'));
        getFormReady();

    });

    $("#register-form").submit(function(e) {

        e.preventDefault();
        var form = $(this),
            dataFormat = objectifyForm(form.serializeArray()),
            emailField = $('#registeredEmail'),
            forwardLink = $('#forwardLogin'),
            registerButton = $('#register-action-button');

        if(form.valid()){
            registerButton.attr('disabled', 'disabled');
            $.ajax({
                'type': 'POST',
                'url': 'https://api-aws.yourporter.com/register',
                'data': JSON.stringify(dataFormat),
                'success': function (data) {
                    if (data.success) {
                        var params = {};
                        params.transport = 'beacon';
                        emailField.html(dataFormat.email);
                        forwardLink.attr("href", "https://app.yourporter.com/#/unauthenticated/login/" + dataFormat.email);
                        UIkit.modal("#register").hide();
                        UIkit.modal("#alert", {center: true, modal: true}).show();
                        registerButton.removeAttr('disabled', 'disabled');
                    } else {
                        window.alert(data.errorMessage);
                        registerButton.removeAttr('disabled', 'disabled');
                    }
                },
                'contentType': 'application/json',
                'dataType': 'json'
            });
        }

    });

    function getFormReady(){
        var form = jQuery(".porter-validate");
        form.validate({
            rules: {
                password: "required",
                password2: {
                    equalTo: "#password"
                }
            },
            messages: {
                password2: {
                    required: "Please confirm your password.",
                    equalTo: "Passwords do not match."
                },
                email: {
                    required: "You need to enter your email to register."
                },
                firstName: "We need your firstname.",
                lastName: "We need your lastname, as well.",
                password: "Please enter a password."
            }
        });

        form.removeClass('porter-validate');
    }

});

function onSubmitBox(token) {
    
    var form = jQuery("#sendMessage"),
        url  = form.attr( 'action'),
        submitBtn = form.find('button[type=submit]'),
        processingIndicator = form.find('div.processing'),
        formTitle = jQuery("#form-title");

    submitBtn.attr('disabled', 'disabled');
    submitBtn.html('Sending...');
    processingIndicator.removeClass("uk-hidden");
    jQuery.post(
        url,
        form.serialize(),
        function( data ) {
            if(data.status) {
                //submitBtn.removeAttr("disabled", "disabled");
                //processingIndicator.addClass("uk-hidden");
                if(data.status == 202){
                    form.addClass("uk-hidden");
                    formTitle.html('We\'ve received your message! We will get back to you as soon as possible.');
                } else if(data.status == 'box'){
                    window.alert('Please complete robot test. :)')
                } else {
                    form.addClass("uk-hidden");
                    formTitle.html(data.message);
                }
            }
        },
        "json"
    );
}

function sendSecureInquiry(token){
    //console.log('secure inquiry');
    var dataForm = jQuery('#data-form'),
        submitButton = jQuery("#submit-button"),
        modalConfirmContent = jQuery("#confirmation-modal-content"),
        modalConfirmTitle = jQuery("#confirmation-modal-title"),
        modalContent = jQuery("#modal-content"),
        modalConfirm = UIkit.modal("#confirmation-modal", {center: true}),
        modalTitle = jQuery("#modal-title"),
        dataUrl = dataForm.attr('action');

    submitButton.html('Processing...');
    submitButton.attr("disabled",true);

    jQuery.ajax({
        'type': 'POST',
        'url': dataUrl,
        'data': dataForm.serialize(),
        'success': function (data) {
            if (data.status == 'success') {
                modalConfirmContent.html('Your inquiry has been sent! We will get back to you as soon as possible.');
                modalConfirm.show();
                var params = {};
                params.transport = 'beacon';
                ga('send', 'event', 'Conversion', 'Inquiry', data.email, parseInt(data.total), params);

            } else if(data.status == 'box'){
                window.alert('Please complete robot test. :)')
            } else if(data.status == 'current_availability_failed') {
                modalConfirmTitle.html('Someone else has booked your dates');
                modalConfirmContent.html(data.message);
                modalConfirm.show();
            } else {
                modalTitle.html('Something went wrong!');
                modalContent.html(data.message);
                modalConfirm.show();
                submitButton.html('Send an Inquiry');
                submitButton.attr("disabled",false);
            }
        },
        'dataType': 'json'
    });

    return true;

}

function getDateFormat(country){

    var dateArray = {
            "AL": "YYYY-MM-DD",
            "AE": "DD/MM/YYYY",
            "AR": "DD/MM/YYYY",
            "AU": "D/MM/YYYY",
            "AT": "DD.MM.YYYY",
            "BE": "D/MM/YYYY",
            "BG": "YYYY-M-D",
            "BH": "DD/MM/YYYY",
            "BA": "YYYY-MM-DD",
            "BY": "D.M.YYYY",
            "BO": "DD-MM-YYYY",
            "BR": "DD/MM/YYYY",
            "CA": "DD/MM/YYYY",
            "CH": "DD.MM.YYYY",
            "CL": "DD-MM-YYYY",
            "CN": "YYYY-M-D",
            "CO": "D/MM/YYYY",
            "CR": "DD/MM/YYYY",
            "CY": "DD/MM/YYYY",
            "CZ": "D.M.YYYY",
            "DE": "DD.MM.YYYY",
            "DK": "DD-MM-YYYY",
            "DO": "MM/DD/YYYY",
            "DZ": "DD/MM/YYYY",
            "EC": "DD/MM/YYYY",
            "EG": "DD/MM/YYYY",
            "ES": "D/MM/YYYY",
            "EE": "D.MM.YYYY",
            "FI": "D.M.YYYY",
            "FR": "DD/MM/YYYY",
            "GB": "DD/MM/YYYY",
            "GR": "D/M/YYYY",
            "GT": "D/MM/YYYY",
            "HK": "D/M/YYYY",
            "HN": "MM-DD-YYYY",
            "HR": "DD.MM.YYYY.",
            "HU": "YYYY.MM.DD.",
            "ID": "DD/MM/YYYY",
            "IN": "D/M/YYYY",
            "IE": "DD/MM/YYYY",
            "IQ": "DD/MM/YYYY",
            "IS": "D.M.YYYY",
            "IL": "DD/MM/YYYY",
            "IT": "DD/MM/YYYY",
            "JO": "DD/MM/YYYY",
            "JP": "YYYY/MM/DD",
            "KR": "YYYY.M.D",
            "KW": "DD/MM/YYYY",
            "LB": "DD/MM/YYYY",
            "LY": "DD/MM/YYYY",
            "LT": "YYYY.M.D",
            "LU": "DD.MM.YYYY",
            "LV": "YYYY.D.M",
            "MA": "DD/MM/YYYY",
            "MX": "D/MM/YYYY",
            "MK": "D.M.YYYY",
            "MT": "DD/MM/YYYY",
            "ME": "D.M.YYYY.",
            "MY": "DD/MM/YYYY",
            "NI": "MM-DD-YYYY",
            "NL": "D-M-YYYY",
            "NO": "DD.MM.YYYY",
            "NZ": "D/MM/YYYY",
            "OM": "DD/MM/YYYY",
            "PA": "MM/DD/YYYY",
            "PE": "DD/MM/YYYY",
            "PH": "M/D/YYYY",
            "PL": "DD.MM.YYYY",
            "PR": "MM-DD-YYYY",
            "PT": "DD-MM-YYYY",
            "PY": "DD/MM/YYYY",
            "QA": "DD/MM/YYYY",
            "RO": "DD.MM.YYYY",
            "RU": "DD.MM.YYYY",
            "SA": "DD/MM/YYYY",
            "CS": "D.M.YYYY.",
            "SD": "DD/MM/YYYY",
            "SG": "M/D/YYYY",
            "SV": "MM-DD-YYYY",
            "RS": "D.M.YYYY.",
            "SK": "D.M.YYYY",
            "SI": "D.M.YYYY",
            "SE": "YYYY-MM-DD",
            "SY": "DD/MM/YYYY",
            "TH": "D/M/YYYY",
            "TN": "DD/MM/YYYY",
            "TR": "DD.MM.YYYY",
            "TW": "YYYY/M/D",
            "UA": "DD.MM.YYYY",
            "UY": "DD/MM/YYYY",
            "US": "M/D/YYYY",
            "VE": "DD/MM/YYYY",
            "VN": "DD/MM/YYYY",
            "YE": "DD/MM/YYYY",
            "ZA": "YYYY/MM/DD"
        },
        dateFormat;

    if(country.toUpperCase() in dateArray){
        dateFormat = dateArray[country.toUpperCase()];
    } else {
        dateFormat = 'YYYY-MM-DD';
    }

    return dateFormat;
}



