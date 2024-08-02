/* Copyright (C) YOOtheme GmbH, YOOtheme Proprietary Use License (http://www.yootheme.com/license) */

jQuery(function($) {

    $(document).ready(onload);

    function onload() {
        var element = document.getElementById('submit-button');
        element.onclick = getContactFormReady;
    }

    function getContactFormReady(){

        var dataForm = $('#sendMessage'),
            errorText,
            modalTitle = $("#modal-title"),
            modalContent = $("#modal-content"),
            modal = UIkit.modal("#standard-modal", {center: true});
        
        dataForm.validate({
            submitHandler: function(form) {
                grecaptcha.execute();
            },
            invalidHandler: function(event, validator) {
                //console.log(validator);
                errorText = 'Please fill all the required fields to send us a message.';

                modalTitle.html('We need more information!');
                modalContent.html(errorText);
                modal.show();
            },
            messages:{
                guestEmail: {
                    required: "We need your email address to get back to you."
                },
                guestName: 'Please fill out your name.',
                content: 'Do you want to send us an empty message? Please type your message above.'
            },
            errorClass: 'uk-text-danger'
        });
    }
});


