var stripe,
elements,
address_line_1,
countryCode,
smartPhone;

jQuery(function($) {

    var checkinSelector = $('#range-picker-checkin'),
        checkoutSelector = $('#range-picker-checkout'),
        checkindata = $('#checkindata'),
        checkoutdata = $('#checkoutdata'),
        checkindatepicker = $('#checkindatepicker'),
        checkoutdatepicker = $('#checkoutdatepicker'),
        siteStatus = $('#siteStatus').val(),
        mainUser = $('#mainUser').val(),
        step = $("#step"),
        priceItems = $(".price-items"),
        submitButton = $("#submit-button"),
        formContent = $("#form-content"),
        content01 = $("#content01"),
        content02 = $("#content02"),
        listingName = $("#listing-name"),
        contentBody = $(".tm-content"),
        paymentContent = $("#payment-content"),
        checkoutvalue = checkoutSelector.val(),
        checkinvalue = checkinSelector.val(),
        availabilityForm = $('#availability'),
        priceChecked = $('#priceChecked'),
        rangePickers = $('.range-picker'),
        isMobile = false,
        modal = UIkit.modal("#standard-modal", {center: true}),
        modalTitle = $("#modal-title"),
        modalContent = $("#modal-content"),
        houseRules = $('.house-rules'),
        houseRulesContent = $('#houseRules'),
        agreeDiv = $('#agree-div'),
        modalConfirm = UIkit.modal("#confirmation-modal", {center: true}),
        modalPromo = UIkit.modal("#promo-modal", {center: true}),
        clearLink = $("#clear"),
        form = $('#priceChecker'),
        buttonsDiv = $('#call-to-action-div'),
        stripeEnabled = $("#stripeEnabled").val(),
        paypalBox = $("#paypal-buttons"),
        paypalEnabled = $("#paypalEnabled").val(),
        hasCustomTax = $("#hasCustomTax").val(),
        websiteId = $("#websiteId").val(),
        airbnbListingId = $("#airbnbListingId").val(),
        promoLoading = $("#promo-loading"),
        promoInput = $("#promo-field"),
        promoButtons = $(".promo-buttons"),
        sticky_offset,
        original_position_offset,
        contentForm = $("#data-form"),
        pricingData = $('#pricingData'),
        applyPromo = $('#apply-text'),
        taxesField = $('#taxes'),
        availabilityData,
        maxCheckoutDate,
        checkoutStartDate,
        today,
        dateFormat = localStorage['staydirectlyDateFormat'],
        depositToPayData = $('#depositToPayData'),
        minStay,
        paymentAmount,
        paypalClient,
        paypalDescription,
        given_name,
        surname,
        email_address,
        timelineDiv = $('.timeline'),
        modalButton = $('#standard-modal-button');

    if(!dateFormat){
        dateFormat = 'YYYY-MM-DD'
    }

    $(document).ready(function() {

        if( $('#isMobile').css('display')=='none') {
            isMobile = true;

            updateStickyOffset();
            submitButton.css('position', 'fixed');
            submitButton.addClass('scroll-to-down');
        }

        if(stripeEnabled == 1){

            var stripeAccountId = $('#stripeAccountId').val();

            if(siteStatus == 'test' || siteStatus == 'public'){
                if(stripeAccountId == 'self'){
                    stripe = Stripe('pk_test_4GijDFoGKuPHzCt8pyKltbON', {'apiVersion': '2020-03-02'});
                } else {
                    stripe = Stripe('pk_test_4GijDFoGKuPHzCt8pyKltbON', {'apiVersion': '2020-03-02', 'stripeAccount': stripeAccountId});
                }


            } else {
                stripe = Stripe('pk_live_VZwWLbP1ZdVRCAineVJ7c3Kn', {'apiVersion': '2020-03-02', 'stripeAccount': stripeAccountId});

            }


            var fontUrl,
                template = $('#page-template').val();

            if (template == 'volcano'){
                fontUrl = 'https://fonts.googleapis.com/css?family=Merriweather+Sans:400,300';
            } else {
                fontUrl = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300';
            }

            elements = stripe.elements({
                fonts: [
                    {
                        cssSrc: fontUrl
                    }
                ]
            });
        }
    });

    $(window).scroll(function () {

        //TODO: better solution

        if(isMobile == 1) {
            if(step.val() != 4) {
                var sticky_height = submitButton.outerHeight();
                var where_scroll = $(window).scrollTop();
                var window_height = $(window).height();


                if ((where_scroll + window_height) > sticky_offset) {
                    submitButton.css('position', 'relative');
                    submitButton.removeClass('scroll-to-down');
                }

                if ((where_scroll + window_height) < (sticky_offset + sticky_height)) {
                    submitButton.css('position', 'fixed');
                    if (step.val() != 3) {
                        submitButton.addClass('scroll-to-down');
                    }
                }
            } else {
                submitButton.css('position', 'relative');
                submitButton.removeClass('scroll-to-down');
            }
        }

    });

    $(document).on('click', ".refreshMe", function() {
        var successPage = $('#successPage').val();
        window.location.replace(successPage);
    });

    clearLink.click(function(e) {
        var currentStep= step.val();
        checkinSelector.val('');
        checkindata.val('');
        checkoutSelector.val('');
        checkoutdata.val('');
        clearLink.addClass('uk-hidden');
        $('#couponApplied').val(0);

        if (currentStep == 2){
            priceItems.children().addClass('uk-hidden');
            submitButton.html('Check Prices');
            step.val(1);
            rangePickers.prop('disabled', false);
            updateStickyOffset();
        } else if (currentStep == 3){
            priceItems.children().addClass('uk-hidden');
            submitButton.html('Check Prices');
            step.val(1);
            formContent.addClass('uk-hidden');
            houseRules.addClass('uk-hidden');
            content01.removeClass('uk-hidden');
            content02.removeClass('uk-hidden');
            listingName.addClass('uk-hidden');
            rangePickers.prop('disabled', false);

            adjustHeights(contentBody, 3, 'up');
            updateStickyOffset();
        } else if (currentStep == 4){
            priceItems.children().addClass('uk-hidden');
            submitButton.html('Check Prices');
            submitButton.attr("disabled",false);
            step.val(1);
            paymentContent.addClass('uk-hidden');

            agreeDiv.addClass('uk-hidden');
            content01.removeClass('uk-hidden');
            content02.removeClass('uk-hidden');
            listingName.addClass('uk-hidden');
            rangePickers.prop('disabled', false);
            applyPromo.addClass('uk-hidden');
            paypalBox.html('');
            if(paypalEnabled == 1){
                submitButton.show();
            }

            adjustHeights(contentBody, 3, 'up');
            updateStickyOffset();
        }

        $('html, body').animate({
            scrollTop: $(".tm-sidebar-b").offset().top - 80
        }, 1000);
    });

    applyPromo.click(function(e){
        modalPromo.show();
    });

    $("#back-to-listing").click(function(e) {
        var mainBody = $(".tm-main");
        content01.removeClass('uk-hidden');
        content02.removeClass('uk-hidden');
        listingName.addClass('uk-hidden');
        formContent.addClass('uk-hidden');
        submitButton.html('Book Now');
        houseRules.addClass('uk-hidden');
        adjustHeights(contentBody, 3, 'up');
        step.val(2);
        rangePickers.prop('disabled', false);
        if (isMobile){
            $('html, body').animate({
                scrollTop: $(".tm-sidebar-b").offset().top - 80
            }, 1000);
        }

        if(paypalEnabled == 1){
            submitButton.show();
        }
        updateStickyOffset();
    });

    $("#back-to-form").click(function(e) {
        var mainBody = $(".tm-main");
        formContent.removeClass('uk-hidden');
        submitButton.html('Continue to Payment');
        paymentContent.addClass('uk-hidden');
        agreeDiv.addClass('uk-hidden');

        submitButton.attr("disabled",false);
        submitButton.show();
        paypalBox.hide();
        $('html,body').animate({
            scrollTop: mainBody.offset().top - 80
        });
        adjustHeights(contentBody, 3, 'up');
        updateStickyOffset();
        applyPromo.addClass('uk-hidden');
        step.val(3);
    });

    form.submit(function(e) {

        e.preventDefault();
        var form = $(this),
            checkinValue = checkinSelector.val(),
            checkoutValue = checkoutSelector.val(),
            guestsValue = $("#guests").val(),
            paymentForm = $("#paymentForm"),
            dataForm = $('#data-form'),
            buttonFunction = submitButton.hasClass('scroll-to-down');

        if (buttonFunction) {

            $('html, body').animate({
                scrollTop: $(".tm-sidebar-b").offset().top
            }, 2000);


        } else {

        if (step.val() == 1) {
            if (checkinValue == '' || checkoutValue == '') {
                modalTitle.html('We need more information!');
                modalContent.html('Please make sure you enter your <b>check-in</b> and <b>check-out</b> dates to view our rates.');
                modal.show();
            } else if (guestsValue == null) {
                modalTitle.html('We need more information!');
                modalContent.html('Please let us know for <b>how many guests</b> you are planning your trip.');
                modal.show();

            } else {
                updatePricing();
                //rangePickers.prop('disabled', true);
                step.val(2);

                priceChecked.val(1);
            }

        } else if (step.val() == 2) {
            var mainBody = $(".tm-main");

                smartPhone = $("#phoneNumberF").intlTelInput({
                initialCountry: "auto",
                geoIpLookup: function(success, failure) {
                    $.ajax({
                        'type': 'GET',
                        'url': './index.php?option=com_search&task=search.getLocation&format=json',
                        'success': function (data) {
                            success(data.location);
                        },
                        'error': function (data) {
                            success('US');
                        }
                    });
                },
                nationalMode: true,
                autoPlaceholder: "aggressive",
                utilsScript: "build/js/utils.js",
                formatOnDisplay: true
            });

            content01.addClass('uk-hidden');
            content02.addClass('uk-hidden');
            listingName.removeClass('uk-hidden');
            formContent.removeClass('uk-hidden');
            $('html,body').animate({
                scrollTop: mainBody.offset().top - 80
            });

            if (stripeEnabled == 1 || paypalEnabled == 1) {
                submitButton.html('Continue to Payment');
            } else {
                submitButton.html('Send an Inquiry');
                applyPromo.removeClass('uk-hidden');
            }
            if (houseRulesContent.html() != '') {
                houseRules.removeClass('uk-panel-box');
                houseRules.removeClass('uk-hidden');
                if ($('#rules-box').height() != 400) {
                    $('#rule-read-more').addClass('uk-hidden');
                }
            }
            rangePickers.prop('disabled', true);
            adjustHeights(contentBody, 3, 'down');
            updateStickyOffset();
            step.val(3);

        } else if (step.val() == 3) {
            getGuestFormReady();
            var phoneInput = $('#phoneNumber'),
                mainBody = $(".tm-main");

                countryCode = smartPhone.intlTelInput("getSelectedCountryData");
                console.log(countryCode)
                address_line_1 = $('#guestAddress').val();
                $('#country').val(countryCode.iso2.toUpperCase());

            if (dataForm.valid()) {

                applyPromo.removeClass('uk-hidden');

                phoneInput.val(smartPhone.intlTelInput("getNumber"));

                if (stripeEnabled == 0 && paypalEnabled == 0) { // Inquiry

                    var dataUrl = './index.php?option=com_search&task=search.processCC&format=json';
                    dataForm.find("#websiteSettings").val('');
                    dataForm.find("#listingDetails").val('');
                    
                    dataForm.attr('action', dataUrl).submit();
                    
                    console.log(dataForm);

                } else {
                    formContent.addClass('uk-hidden');
                    paymentContent.removeClass('uk-hidden');
                    agreeDiv.removeClass('uk-hidden');

                    if (paypalEnabled == 1) {

                        var initialPayment = $('#initialPayment').val();

                        paymentAmount = $('#depositToPayData').val();
                        paypalClient = $('#paypalClient').val();
                        given_name = $('#guestName').val();
                        surname = $('#guestSurname').val();
                        email_address = $('#user-email').val();

                        if (initialPayment == 100) {
                            paypalDescription = 'Accommodation Fee (Full Amount, fees and taxes)'
                        } else {
                            paypalDescription = 'Accommodation Fee (' + initialPayment + '%)';
                        }

                        paypalDescription = paypalDescription + '- Check-in: ' + checkindata.val() + ' / Check-out: ' + checkoutdata.val();

                        submitButton.hide();

                        if(paypalBox.children().length){
                            paypalBox.show();
                        } else {

                            renderPaypalButtons(paymentAmount, paypalClient, paypalDescription, given_name, surname, email_address);

                        }

                    } else {
                        submitButton.html('Pay Now');
                        submitButton.attr("disabled", true);

                        const originalInput = document.getElementById('cardholder');

                        const inputStyle = getComputedStyle(originalInput);

                        var elementStyles = {
                            base: {
                                backgroundColor: inputStyle.backgroundColor,
                                color: inputStyle.color,
                                fontFamily: inputStyle.fontFamily,
                                fontSize: inputStyle.fontSize,
                                fontSmoothing: inputStyle.fontSmoothing,
                                fontStyle: inputStyle.fontStyle,
                                fontVariant: inputStyle.fontVariant,
                                fontWeight: inputStyle.fontWeight,
                                letterSpacing: inputStyle.letterSpacing,
                                textAlign: inputStyle.textAlign,
                                textDecoration: inputStyle.textDecoration,
                                textShadow: inputStyle.textShadow,
                                textTransform: inputStyle.textTransform,

                                ':focus': {
                                    color: '#e58d10'
                                },

                                '::placeholder': {
                                    color: '#BFBFBF'
                                }
                            }
                        };

                        var elementStylesNP = {
                            base: {
                                backgroundColor: inputStyle.backgroundColor,
                                color: inputStyle.color,
                                fontFamily: inputStyle.fontFamily,
                                fontSize: inputStyle.fontSize,
                                fontSmoothing: inputStyle.fontSmoothing,
                                fontStyle: inputStyle.fontStyle,
                                fontVariant: inputStyle.fontVariant,
                                fontWeight: inputStyle.fontWeight,
                                letterSpacing: inputStyle.letterSpacing,
                                textAlign: inputStyle.textAlign,
                                textDecoration: inputStyle.textDecoration,
                                textShadow: inputStyle.textShadow,
                                textTransform: inputStyle.textTransform,

                                ':focus': {
                                    color: '#e58d10'
                                },
                                '::placeholder': {
                                    color: inputStyle.backgroundColor
                                }
                            }
                        };

                        var elementClasses = {
                            focus: 'stripe-card-div-focus',
                            base: 'stripe-card-div',
                            //empty: 'empty',
                            invalid: 'uk-form-danger'
                        };

                        if ((typeof cardNumber === 'undefined')){

                            cardNumber = elements.create('cardNumber', {
                                style: elementStylesNP,
                                classes: elementClasses
                            });

                            cardExpiry = elements.create('cardExpiry', {
                                style: elementStyles,
                                classes: elementClasses
                            });

                            cardCvc = elements.create('cardCvc', {
                                style: elementStylesNP,
                                classes: elementClasses
                            });

                            cardNumber.mount('#card-number');
                            cardExpiry.mount('#card-expiry');
                            cardCvc.mount('#card-cvc');
                        }

                        var elementGroup = [cardNumber, cardExpiry, cardCvc];

                        var displayError = $('#card-errors');

                        elementGroup.forEach(function(element) {
                            element.addEventListener('change', function(event) {
                                if (event.error) {
                                    displayError.html('<i class="uk-icon-exclamation-circle text-danger"></i> ' + event.error.message);
                                } else {
                                    displayError.html('');
                                }
                            });
                        });
                    }

                    step.val(4);
                    adjustHeights(contentBody, 3, 'down');
                    $('html,body').animate({
                        scrollTop: mainBody.offset().top - 80
                    });
                    updateStickyOffset();
                }
            } else {

            }

        } else if (step.val() == 4) {
            //TODO: Check required payment information

            submitButton.html('Processing...');
            submitButton.attr("disabled", true);

            stripe.createPaymentMethod({
                type: 'card',
                card: cardNumber,
                billing_details: {
                    // Include any additional collected billing details.
                    email: $('#user-email').val(),
                    name: $('#cardholder').val(),
                    phone: $('#phoneNumber').val(),
                    address: {
                        line1: address_line_1,
                        country: countryCode.iso2.toUpperCase()
                    }
                }
            }).then(stripePaymentMethodHandler);

        }
    }
    });

    if (checkindata.val() != ''){ //Coming from landing page with dates

        clearLink.removeClass('uk-hidden');
        submitButton.trigger('click');

    } else {
        checkinSelector.attr('disabled', true);
        checkinSelector.attr('placeholder', 'Loading...');
        getTaxes(true);
    }

    function stripePaymentMethodHandler(result) {
        if (result.error) {
            // Show error in payment form
            modalTitle.html('Something went wrong!');
            modalContent.html(result.error.message);
            modal.show();
            submitButton.attr("disabled",false);
            submitButton.html('Pay Now');
        } else {
            // Send payment method id to server
            var contentForm = $("#data-form"),
                dataUrl = './index.php?option=com_search&task=search.processCC&format=json';

            $("#paymentMethodId").remove();
            contentForm.append('<input type="hidden" id="paymentMethodId" name="paymentMethodId" value="'+result.paymentMethod.id+'">');
            
            var processCCData = jQuery("#data-form").serializeArray();
            var processCCDataArray = processCCData.filter(function(e) { return e.name !== 'websiteSettings' && e.name !== 'listingDetails'})
            console.log(processCCDataArray);
            
            $.ajax({
                'type': 'POST',
                'url': dataUrl,
                'data': processCCDataArray,
                'success': function (data) {
                    if (data.status == 'success') {

                        modalConfirm.show();
                        var params = {};
                        params.transport = 'beacon';
                        ga('send', 'event', 'Conversion', 'Reservation', data.email, parseInt(data.total), params);

                    } else if (data.status == 'verification-payment') {

                        stripe.confirmCardPayment(data.message, {
                            payment_method: result.paymentMethod.id
                        }).then(function(result) {
                            if (result.error) {                                
                                // Show error in payment form
                                modalTitle.html('Something went wrong!');
                                modalContent.html(result.error.message);
                                modal.show();
                                submitButton.attr("disabled",false);
                                submitButton.html('Pay Now');

                                //TODO add store reservation here
                            } else {
                                if (result.paymentIntent.status === 'succeeded') {

                                    $('#intentObject').remove();
                                    contentForm.append('<input type="hidden" id="intentObject" name="intentObject" value="">');
                                    $('#intentObject').val(JSON.stringify(result.paymentIntent));

                                    var processCCData = jQuery("#data-form").serializeArray();
                                    var processCCDataArray = processCCData.filter(function(e) { return e.name !== 'websiteSettings' && e.name !== 'listingDetails'})
                                    console.log(processCCDataArray);
                                    
                                    // Confirm Reservation
                                    $.ajax({
                                        'type': 'POST',
                                        'url': dataUrl,
                                        'data': processCCDataArray,
                                        'success': function (data) {
                                            if (data.status == 'success') {
                                                modalConfirm.show();
                                                var params = {};
                                                params.transport = 'beacon';
                                                ga('send', 'event', 'Conversion', 'Reservation', data.email, parseInt(data.total), params);

                                            } else {
                                                modalTitle.html('Something went wrong!');
                                                modalContent.html(data.message);
                                                modal.show();
                                                submitButton.attr("disabled",false);
                                                submitButton.html('Pay Now');
                                            }
                                        },
                                        'dataType': 'json'
                                    });
                                } else {
                                    // Show error in payment form
                                    modalTitle.html('Something went wrong!');
                                    modalContent.html(result.paymentIntent.last_payment_error.message);
                                    modal.show();
                                    submitButton.attr("disabled",false);
                                    submitButton.html('Pay Now');
                                }
                            }
                        });

                    } else if(data.status == 'verification-setup'){
                        stripe.confirmCardSetup(data.message, {
                            payment_method: result.paymentMethod.id
                        }).then(function(result) {
                            if (result.error) {
                                // Show error in payment form
                                modalTitle.html('Something went wrong!');
                                modalContent.html(result.error.message);
                                modal.show();
                                submitButton.attr("disabled",false);
                                submitButton.html('Pay Now');
                            } else {
                                if (result.setupIntent.status === 'succeeded') {

                                    $('#intentObject').remove();
                                    contentForm.append('<input type="hidden" id="intentObject" name="intentObject" value="">');
                                    $('#intentObject').val(JSON.stringify(result.setupIntent));

                                    var processCCData = jQuery("#data-form").serializeArray();
                                    var processCCDataArray = processCCData.filter(function(e) { return e.name !== 'websiteSettings' && e.name !== 'listingDetails'})
                                    console.log(processCCDataArray);
                                    
                                    // Confirm Reservation
                                    $.ajax({
                                        'type': 'POST',
                                        'url': dataUrl,
                                        'data': processCCDataArray,
                                        'success': function (data) {
                                            if (data.status == 'success') {
                                                modalConfirm.show();
                                                var params = {};
                                                params.transport = 'beacon';
                                                ga('send', 'event', 'Conversion', 'Reservation', data.email, parseInt(data.total), params);

                                            } else {
                                                modalTitle.html('Something went wrong!');
                                                modalContent.html(data.message);
                                                modal.show();
                                                submitButton.attr("disabled",false);
                                                submitButton.html('Pay Now');
                                            }
                                        },
                                        'dataType': 'json'
                                    });
                                } else {
                                    // Show error in payment form
                                    modalTitle.html('Something went wrong!');
                                    modalContent.html(result.paymentIntent.last_payment_error.message);
                                    modal.show();
                                    submitButton.attr("disabled",false);
                                    submitButton.html('Pay Now');
                                }
                            }
                        });

                    } else if(data.status == 'current_availability_failed'){
                        jQuery("#confirmation-modal-title").html('Someone else has booked your dates');
                        jQuery("#confirmation-modal-content").html(data.message);
                        modalConfirm.show();
                    } else {
                        modalTitle.html('Something went wrong!');
                        modalContent.html(data.message);
                        modal.show();
                        submitButton.attr("disabled",false);
                        submitButton.html('Pay Now');
                    }
                },
                'dataType': 'json'
            });
        }
    }

    var priceCheckerData = jQuery("#priceChecker").serializeArray();
    var priceCheckerDataArray = priceCheckerData.filter(function(e) { return e.name !== 'websiteSettings' });
    
    $.ajax({
        'type': 'POST',
        'url': availabilityForm.attr('action'),
        'data': priceCheckerDataArray,
        'success': function (data) {
            availabilityData = data;
            checkinSelector.attr('placeholder', 'Check-in');
            checkinSelector.attr('disabled', false);

            initialCheckinPicker();

            if (checkoutvalue != ''){

                calculatePossibleCheckoutDate(moment(checkinvalue, dateFormat).format('YYYY-MM-DD'));

                initialCheckoutPicker(moment(checkinvalue, dateFormat), moment(checkoutvalue, dateFormat), maxCheckoutDate);

            }
        },
        'dataType': 'json'
    });

    $(function() {

        var $sidebar   = $(".scroll-me"),
            sidebarFull   = $(".tm-sidebar-b"),
            $window    = $(window),
            offset     = $sidebar.offset(),
            topPadding = 40,
            limit = $("#scroll-limit"),
            limitOffset = limit.offset();

            $window.scroll(function () {

                if ($window.scrollTop() > offset.top && sidebarFull.height() > ($sidebar.height() + 170)) {
                    if (content01.is(".uk-hidden") === false) {
                        if (limitOffset.top < $window.scrollTop()) {
                            $sidebar.stop().animate({
                                marginTop: limitOffset.top - offset.top
                            });
                        } else {
                            $sidebar.stop().animate({
                                marginTop: $window.scrollTop() - offset.top + topPadding
                            });
                        }
                    }

                } else {
                    $sidebar.stop().animate({
                        marginTop: 0
                    });
                }

            });

    });

    function adjustHeights(section, steps, direction) {//adjust heights

        var contentHeight = section.height(),
        newHeight = contentHeight,
        scrollHeight = $(".scroll-me").height(),
        houseHeight = houseRules.height(),
        side = $(".tm-sidebar-b"),
        sideHeight = side.height(),
        mobileHeight;

        side.removeAttr('style');
        $(".tm-main").removeAttr('style');

        if(direction == 'down') {
            var otherHeight  = sideHeight + 105;
            if (otherHeight > contentHeight) {
                newHeight = otherHeight;
            }

            newHeight = newHeight + 100;

            if (isMobile){
                newHeight = contentHeight + 15;
                mobileHeight = newHeight + sideHeight + 160;
            }
        } else if (direction == 'up'){
            var otherHeight  = $(".tm-main-bottom").height();

            newHeight = otherHeight + contentHeight + 110;

            if(newHeight < (scrollHeight + houseHeight + 205)){
                newHeight = scrollHeight + houseHeight + 205;
            }

            if (isMobile){
                newHeight = contentHeight + otherHeight + 15;
                mobileHeight = newHeight + sideHeight + 160;
            }
        }

        for (var i = 0; i < steps; i++){
            section.parent().height(newHeight);
            section = section.parent();
            if (isMobile && i == (steps-2)){
                newHeight = mobileHeight;
            }

        }

    }

    function getGuestFormReady(){

        var dataForm = $('#data-form'),
            errorText,
            showRequired,
            showEmail;



        dataForm.validate({
            submitHandler: function(dataForm) {
                if(stripeEnabled == 0 && paypalEnabled == 0){
                    grecaptcha.execute();
                }
            },
            invalidHandler: function(event, validator) {
                errorText = 'In order to make a reservation, please complete the ';
                showRequired = 0;
                showEmail = 0;
                for (var i=0;i<validator.errorList.length;i++){
                    if (validator.errorList[i].method == 'required') {
                        errorText = errorText + '<b>' + validator.errorList[i].message + '</b>';
                        if (validator.errorList.length - 2 == i) { // Two item
                            errorText = errorText + ' and ';
                        }
                        if (validator.errorList.length - 2 > i) { // Multiple item
                            errorText = errorText + ', ';
                        }
                        showRequired = 1;
                    } else if (validator.errorList[i].method == 'email'){
                        showEmail = 1;
                    }
                }

                if (showRequired == 0){
                    errorText = '';
                }
                if (showEmail == 1){
                    if(showRequired == 1){
                        errorText = '<br /><br />';
                    }
                    errorText = errorText + 'Your email seems to be invalid. Please check your email.'
                }
                modalTitle.html('We need more information!');
                modalContent.html(errorText);
                modal.show();
            },
            errorPlacement: function(error,element) {
                return true;
            },
            messages:{
                email: 'email',
                guestName: 'first name',
                guestSurname: 'last name',
                phoneNumberF: 'phone number'
            }
        });

        dataForm.removeClass('porter-validate');
    }

    $('#guests').change(function(){

        $('#guestsdata').val($('#guests').val());

        if ($('#accommodation-row').hasClass('uk-hidden')) {
            // Do nothing initial calculation
        } else {
            priceItems.children().addClass('uk-hidden');
            submitButton.html('Check Prices');
            step.val(1);
        }
        
    });

    $('#agree-text').change(function(){

        if($('#agree-text').is(':checked')) {
            if(paypalEnabled == 1){
                paypalBox.removeClass('disabled-box');
            } else {
                submitButton.attr("disabled",false);
            }

        } else {
            if(paypalEnabled == 1){
                paypalBox.addClass('disabled-box');
            } else {
                submitButton.attr("disabled",true);
            }

        }
    });

    checkinSelector.on('show.daterangepicker', function(ev, picker) {

        //$( ".hover" ).attr('title', 'Hover text.');

        //$( ".hover" ).tooltip({
        //    delay: { show: 200 },
        //    container: '.daterangepicker'
        //});

        if(typeof checkoutSelector.data('daterangepicker') !== 'undefined'){
            checkoutSelector.data('daterangepicker').hide();
        }
    });

    function initialCheckinPicker(){

        today = moment().startOf('day').format("YYYY-MM-DD");
        var startDate;
        if (checkinvalue == ''){
            startDate = false;
        } else {
            startDate = moment(checkinvalue, dateFormat);
        }

        checkinSelector.daterangepicker({
            locale: {
                format: dateFormat,
                firstDay: availabilityData.week
            },
            opens: 'left',
            startDate: startDate,
            autoApply: true,
            autoUpdateInput: false,
            minDate: moment(),
            singleDatePicker: true,
            isInvalidDate: function (date) {
                var formattedDate = date.format("YYYY-MM-DD");

                if(formattedDate >= today){
                    var avaialability = availabilityData.data[formattedDate].availability,
                        allowCheckin = availabilityData['data'][formattedDate]['closed_to_arrival'];
                    if (avaialability == 'unavailable' || allowCheckin == true) {
                        return 'false';
                    }
                }
            }
        }, function(start, end, label) {

            calculatePossibleCheckoutDate(start.format('YYYY-MM-DD'));

            if (checkoutStartDate != undefined){
                clearLink.removeClass('uk-hidden');
                checkinSelector.val(start.format(dateFormat));
                checkindata.val(start.format('YYYY-MM-DD'));

                if ($('#accommodation-row').hasClass('uk-hidden')) {
                    // Do nothing initial calculation
                } else {
                    priceItems.children().addClass('uk-hidden');
                    submitButton.html('Check Prices');
                    step.val(1);
                }
                checkoutSelector.val(checkoutStartDate.format(dateFormat));
                checkoutdata.val(checkoutStartDate.format('YYYY-MM-DD'));
                initialCheckoutPicker(start, start, start);
                checkoutSelector.focus();
            } else {

                //TODO internal pop-up
                alert('Please select another check-in date. For this check-in date the property has '+minStay+ '-nights minimum requirement.');
            }
        });
    }

    function initialCheckoutPicker(minDate, startDate, selectedCheckinDate){
        var checkinFound = false;
        checkoutSelector.daterangepicker({
            locale: {
                format: dateFormat,
                firstDay: availabilityData.week
            },
            opens: 'left',
            autoApply: true,
            autoUpdateInput: false,
            minDate: minDate,
            startDate: startDate,
            singleDatePicker: true,
            maxDate: maxCheckoutDate,
            isInvalidDate: function (date) {
                var formattedDate = moment(date).format("YYYY-MM-DD");

                if(formattedDate >= today){
                    var closedDeparture = availabilityData['data'][formattedDate]['closed_to_departure'];
                    if (closedDeparture == true) {
                        return 'false';
                    }
                }

                if(formattedDate < moment(checkoutStartDate).format("YYYY-MM-DD")){

                    return 'false';

                }
            },
            isCustomDate: function (date) {

                if(!checkinFound){
                    var formattedDate = date.format("YYYY-MM-DD");

                    if(formattedDate == selectedCheckinDate.format('YYYY-MM-DD')){
                        checkinFound = true;
                        return 'selectedcheckin'
                    }
                }

            }
        }, function(start, end, label) {
            checkoutSelector.val(start.format(dateFormat));
            checkoutdata.val(start.format('YYYY-MM-DD'));

            if ($('#accommodation-row').hasClass('uk-hidden')) {
                // Do nothing initial calculation
            } else {
                priceItems.children().addClass('uk-hidden');
                submitButton.html('Check Prices');
                step.val(1);
            }
        });
    }

    function calculatePossibleCheckoutDate(checkinDate){
        var i = 1,
            availability = 'available',
            maxDateFormat,
            maxDays = availabilityData.data[checkinDate]['max_nights'];

        minStay = availabilityData.data[checkinDate]['min_nights'];


        while (availability == 'available'){
            maxCheckoutDate = moment(checkinDate, 'YYYY-MM-DD').add(i, 'days');
            maxDateFormat = maxCheckoutDate.format('YYYY-MM-DD');
            if(typeof(availabilityData.data[maxDateFormat]) != 'undefined' && availabilityData.data[maxDateFormat] !== null &&
                (typeof(maxDays) == 'undefined' || i < maxDays)){
                availability = availabilityData.data[maxDateFormat]['availability'];
            } else {
                availability = 'unavailable';
            }
            i++;
        }

        checkoutStartDate =  moment(checkinDate, 'YYYY-MM-DD').add(minStay, 'days');

        if(minStay >= i){
            console.log('no available checkout date');
            checkoutStartDate = undefined;
        }
    }

    function updatePricing(){

        submitButton.html('Calculating...');
        submitButton.attr("disabled",true);

        checkindatepicker.val(checkindata.val());
        checkoutdatepicker.val(checkoutdata.val());

        if(taxesField.val() == 0){ //request taxes again
            getTaxes(false);
        }
        var getPricingData = jQuery("#priceChecker").serializeArray();
        var getPricingDataArray = getPricingData.filter(function(e) { return e.name !== 'websiteSettings' });
        
        jQuery.ajax({
            'type': 'POST',
            'url': './index.php?option=com_search&task=search.getPricing&format=json',
            'data': getPricingDataArray,
            'success': function (data) {
                if (typeof(data.total) != "undefined" && data.total !== null && data.total.raw != 0) {
                    var accomodationDesc = $('#accomodation-desc'),
                        accomodationValue = $('#accomodation-value'),
                        accommodationRow = $('#accommodation-row'),
                        cleaningValue = $('#cleaning-value'),
                        cleaningRow = $('#cleaning-row'),
                        discountValue = $('#discount-value'),
                        discountRow = $('#discount-row'),
                        totalValue = $('#total-value'),
                        totalRow = $('#total-row'),
                        depositCurrency = $('#depositCurrency'),
                        initialPaymentRaw,
                        initialPaymentText,
                        i,
                        newTimelineDiv,
                        newTimelineContent,
                        timelineDay,
                        beforeText,
                        taxes = data.taxes,
                        lastMinute = $('#lastMinute');

                    accomodationDesc.html(data.accommodation.desc);
                    accomodationValue.html(data.accommodation.value);
                    depositCurrency.html(data.accommodation.currency);
                    initialPaymentRaw = data.initial.raw;
                    initialPaymentText = data.initial.value;
                    accommodationRow.removeClass('uk-hidden');
                    $('#timeline-pre-payment').html(initialPaymentText);
                    depositToPayData.val(initialPaymentRaw);
                    pricingData.val(JSON.stringify(data));
                    lastMinute.val(data.lastMinute);

                    if (data.cleaning.value != "") {
                        cleaningValue.html(data.cleaning.value);
                        cleaningRow.removeClass('uk-hidden');
                    }

                    if (data.discount.value != "") {
                        discountValue.html(data.discount.value);
                        discountRow.removeClass('uk-hidden');
                    }

                    //Show taxes
                    $('.tax-list').remove();
                    for (i = 0; i < taxes.length; ++i) {
                        totalRow.before('<li><span class="uk-text-left tax-list">' + taxes[i].name +
                            '</span><span id="tax-value-'+i+'" class="uk-float-right">'+ taxes[i].value + '</span></li>');
                    }

                    //serviceValue.html(data.service.value);
                    //serviceRow.removeClass('uk-hidden');

                    totalValue.html(data.total.value);
                    totalRow.removeClass('uk-hidden');
                    submitButton.html('Book Now');
                    submitButton.attr("disabled",false);
                } else {
                    modalTitle.html('Something went wrong!');
                    modalContent.html('It seems like something is not working as expected. <br /> Please try again later ' +
                        'and if problem continues, contact us regarding this issue.');
                    modal.show();
                    var currentStep= step.val();
                    checkinSelector.val('');
                    checkindata.val('');
                    checkoutSelector.val('');
                    checkoutdata.val('');
                    submitButton.html('Check Prices');
                    step.val(1);
                    rangePickers.prop('disabled', false);
                    submitButton.prop('disabled', false);
                    clearLink.addClass('uk-hidden');
                }

                var timelineData = data.paymentTimeline,
                    timeline0body;

                if (typeof (timelineData[0].full) != 'undefined'){
                    timeline0body = '<p>Full ';
                } else if (typeof (timelineData[0].pre) != 'undefined'){
                    timeline0body = '<p>Pre-';
                }
                
                timeline0body = timeline0body + 'Payment: <b>' + data.currency + ' <span id="timeline-pre-payment">' + initialPaymentText + '</span></b></p>';

                if (typeof (timelineData[0].secure) != 'undefined'){
                    timeline0body = timeline0body + '<p>Security Deposit: <b>' + data.currency + ' ' + timelineData[0].secure +'</b></p>';
                }

                $('#timeline0').html($(timeline0body));

                timelineDiv.children().not(':first-child').remove();

                $.each(timelineData, function(index, item) {
                    newTimelineDiv = '';

                    if(index != 0){
                        timelineDay = Math.abs(index);

                        if(timelineDay == 0){
                            beforeText = 'On the day of ';
                        } else if (timelineDay == 1){
                            beforeText = '1 day before ';
                        } else {
                            beforeText = timelineDay + ' days before ';
                        }

                        newTimelineContent = '';

                        if (typeof (item.final) != 'undefined'){
                            newTimelineContent = '<p>Final Payment</p>';
                        }

                        if (typeof (item.secure) != 'undefined'){
                            newTimelineContent = newTimelineContent + '<p>Security Deposit: <b>'+ data.currency + ' ' + item.secure + '</b></p>';
                        }

                        newTimelineDiv =
                            '<div class="timeline-item">' +
                                '<div class="timeline-left">' +
                                    '<span class="uk-badge"><i class="uk-icon-check timeline-image"></i></span>' +
                                '</div>' +
                            '<div class="timeline-content">' +
                                '<div class="uk-card uk-card-default">' +
                                    '<div class="uk-card-header uk-flex-middle uk-grid-small">' +
                                        '<h4 class="uk-card-title">' + beforeText + 'check-in</h4>' +
                                    '</div>' +
                                    '<div class="uk-card-body" id="timeline'+index+'">' +
                                        newTimelineContent +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                       '</div>';

                        timelineDiv.append($(newTimelineDiv));
                    }
                });


            },
            'dataType': 'json'
        });
    }

    $(".rules-box .modal-button").click(function() {

        var modalRules = UIkit.modal("#rules-modal", {center: true});

        modalRules.show();

        // prevent jump-down
        return false;

    });

    $("#apply-promo").click(function() {

        var promoForm = $('#promo-form'),
            promoMessageDiv = $('#promo-message');

        promoLoading.removeClass('uk-hidden');
        promoButtons.attr("disabled",true);
        promoInput.attr("disabled",true);

        if(promoForm.length == 0){
            contentForm.append('<input type="hidden" name="promo" id="promo-form" value="' + promoInput.val() + '">');
            contentForm.append('<input type="hidden" name="clientDate" value="' + moment().format('YYYY-MM-DD HH:mm:ss') + '">');
        } else {
            promoForm.val(promoInput.val());
        }
        
        var checkPromoData = jQuery("#data-form").serializeArray();
        var checkPromoDataArray = checkPromoData.filter(function(e) { return e.name !== 'websiteSettings' && e.name !== 'listingDetails' })

        $.ajax({
            'type': 'POST',
            'url': './index.php?option=com_search&task=search.checkPromo&format=json',
            'data': checkPromoDataArray,
            'success': function (data) {
                promoLoading.addClass('uk-hidden');
                promoButtons.attr("disabled",false);

                if(data.valid == false){
                    promoMessageDiv.addClass('uk-text-danger');
                    promoMessageDiv.removeClass('uk-text-success');
                    promoInput.attr("disabled",false);
                    promoForm.val('');
                } else if (data.valid == true){
                    var promoCancel = $('#promo-cancel');
                    $('#couponApplied').val(data.promo.couponCode);
                    promoMessageDiv.removeClass('uk-text-danger');
                    promoMessageDiv.addClass('uk-text-success');
                    $('#apply-promo').addClass('uk-hidden');
                    promoCancel.html('Continue');
                    promoCancel.addClass('uk-button-primary');

                    applyPromo.attr("disabled",true);

                    var afterLine;

                    if(data.promo.discountType == 'flatAmount' || data.promo.discountType == 'accommodationFee'){
                        afterLine =  $('#discount-row');
                    } else {
                        afterLine =  $('#cleaning-row');
                    }
                    afterLine.after(
                        '<li id="promo-row" class="uk-text-primary">' +
                            '<span class="uk-text-left" id="promo-desc">'+data.discount.discountTitle+'</span>' +
                            '<span id="promo-value" class="uk-float-right">'+data.discount.discountFormatted+'</span>' +
                        '</li>'
                    );

                    for (i = 0; i < data.pricingData.taxes.length; ++i) {
                        $('#tax-value-'+i).html(data.pricingData.taxes[i].value);

                    }

                    $('#timeline-pre-payment').html(data.initial.formatted);
                    depositToPayData.val(data.initial.amount);

                    $('#total-value').html(data.pricingData.total.value);
                    pricingData.val(JSON.stringify(data.pricingData));

                    $('#agree-text').attr('checked', false);
                    if (paypalEnabled == 1){
                        paypalBox.html('');
                        renderPaypalButtons(data.initial.amount, paypalClient, paypalDescription, given_name, surname, email_address);
                        paypalBox.addClass('disabled-box');

                    }
                }
                promoMessageDiv.html(data.message);
            },
            'dataType': 'json'
        });

    });

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    function getTaxes(async){
        $.ajax({
            'type': 'POST',
            'url': './index.php?option=com_search&task=search.getListingTaxes&format=json',
            'data': '{"websiteId": "'+websiteId+'", "airbnbListingId": "'+airbnbListingId+'", "hasCustomTax": "'+hasCustomTax+'"}',
            'async': async,
            'success': function (data) {
                if ($.isEmptyObject(data)) {
                    taxesField.val('{}');
                } else {
                    taxesField.val(JSON.stringify(data));

                }
            },
            'contentType': 'application/json',
            'dataType': 'json'
        });
    }

    function updateStickyOffset(){
        if(isMobile == 1){
            original_position_offset = buttonsDiv.offset();
            sticky_offset = original_position_offset.top;
        }
    }

    function renderPaypalButtons(paymentAmount, paypalClient, paypalDescription, given_name, surname, email_address){

        var dataUrl = './index.php?option=com_search&task=search.processCC&format=json',
            contentForm = $("#data-form");
        paypal.Buttons({
            createOrder: function (data, actions) {
                // Set up the transaction
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: paymentAmount
                        },
                        payee: {
                            email_address: paypalClient
                        },
                        description: paypalDescription
                    }],
                    payer: {
                        name: {
                            given_name: given_name,
                            surname: surname
                        },
                        email_address: email_address,
                        address: {
                            address_line_1: address_line_1,
                            country_code: countryCode.iso2.toUpperCase()
                        }
                    }
                }).then(function(order){
                    var paypalStore = $("#paypalStore"),
                        preOrderId = $("#preOrderId");

                    if(preOrderId.length == 0){
                        contentForm.append('<input type="hidden" name="preOrderId" value="' + order + '">');
                    } else {
                        preOrderId.val(order);
                    }
                    
                    var processCCData = jQuery("#data-form").serializeArray();
                    var processCCDataArray = processCCData.filter(function(e) { return e.name !== 'websiteSettings' && e.name !== 'listingDetails'})
                    console.log(processCCDataArray);

                    $.ajax({
                        'type': 'POST',
                        'url': dataUrl+'&store=1',
                        'data': processCCDataArray,
                        'success': function (data) {
                            if(data.status == 'stored'){
                                paypalStore.val(1);
                                $('#inquiryId').val(data.inquiryId);

                            }
                        },
                        'dataType': 'json',
                        'async': true
                    });

                    return order;
                });
            },
            onApprove: function (data, actions) {
                //Block paypal buttons
                paypalBox.addClass('disabled-box');
                //Show loading
                modalTitle.html('Please wait...');
                modalContent.html('We are processing your transaction.');
                modalButton.hide();
                modal.show();

                var listingId = $('#roomId').val(),
                    checkindate = checkindata.val(),
                    calcStart = new Date(checkindate),
                    calcEnd = new Date(checkoutdata.val()),
                    calcDiff = new Date(calcEnd - calcStart),
                    nights = calcDiff/1000/60/60/24,

                availabilityCheckUrl = './index.php?option=com_search&task=search.checkCurrentAvailability&format=json&start_date='+ checkindate +'&nights='+ nights + '&listing_id=' + listingId;

                $.getJSON(availabilityCheckUrl, function(checkData) {
                    if (checkData.available == true) {
                        // Capture the funds from the transaction
                        return actions.order.capture().then(function (details) {
                            // Show a success message to your buyer;

                            contentForm.append('<input type="hidden" name="orderId" value="' + data.orderID + '">');
                            contentForm.append('<input type="hidden" name="payerId" value="' + data.payerID + '">');

                            var processCCData = jQuery("#data-form").serializeArray();
                            var processCCDataArray = processCCData.filter(function(e) { return e.name !== 'websiteSettings' && e.name !== 'listingDetails'})
                            console.log(processCCDataArray);
                            
                            $.ajax({
                                'type': 'POST',
                                'url': dataUrl,
                                'data': processCCDataArray,
                                'success': function (data) {
                                    if (data.status == 'success') {
                                        modal.hide();
                                        modalConfirm.show();
                                        var params = {};
                                        params.transport = 'beacon';
                                        ga('send', 'event', 'Conversion', 'Reservation', data.email, parseInt(data.total), params);

                                    } else {
                                        modalTitle.html('Something went wrong!');
                                        modalContent.html(data.message);
                                        modalButton.show();
                                        paypalBox.removeClass('disabled-box');
                                    }
                                },
                                'dataType': 'json'
                            });
                        });

                    } else {
                        console.log('check availability failed');
                        modalTitle.html('Someone else has booked your dates');
                        modalContent.html('The dates you requested are not available anymore, please try again with different dates.');
                        modalButton.show();
                        modalButton.addClass('refreshMe');
                    }
                });
            },
            onError: function (err) {
                modalTitle.html('Something went wrong!');
                modalContent.html('PayPal Error');
                modal.show();
                console.log(err);

                contentForm.append('<input type="hidden" name="paypalError" value="1">');

                var processCCData = jQuery("#data-form").serializeArray();
                var processCCDataArray = processCCData.filter(function(e) { return e.name !== 'websiteSettings' && e.name !== 'listingDetails'})
                console.log(processCCDataArray);
                
                $.ajax({
                    'type': 'POST',
                    'url': dataUrl,
                    'data': processCCDataArray,
                    'success': function (data) {

                    },
                    'dataType': 'json'
                });
            }
        }).render('#paypal-buttons');
    }
});

function objectifyForm(formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}










