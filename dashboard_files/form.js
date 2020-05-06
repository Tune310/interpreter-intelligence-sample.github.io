function uploadError(response) {
    var asJson;
    //turn off all loading
    $(".loading-bar").hide();
    $("#errorContainer").show();

    //clear button state
    $("form button.btn").button(''); //toggle button state
    $("form button.btn").removeClass('processing'); //register button state for reset

    // bootstrap success / error containers ==============================
    $("#errorContainer").hide();
    $("#successContainer").hide();

    var defaults = {
        className: "alert alert-error",
        header: "Error!"
    };

    try {
        if (response.responseText) {
            asJson = eval("(" + response.responseText + ")");
        } else {
            //assumes response is already as JSON
            asJson = response;
        }
    } catch(err) {

        //catch non-json 500 errors from server
        asJson = { status: 'ERROR',
            code: '500',
            message: 'An unexpected exception has occurred. Please retry your request. Contact your administrator if the problem persists',
            actual: 'An unexpected exception has occurred. Please retry your request. Contact your administrator if the problem persists',
            errors: []
        };
    }

    //handler for bootstrap template (TODO: only parse template once)
    var errorTemplate = JST['common/error/container/show'];

    //process response and output message
    $("#errorContainer").html(errorTemplate(_.extend({obj: asJson}, defaults)));

    //show success
    $("#errorContainer").show();

    //change button back to normal
    $('.processing').button('reset');
    $('.processing').removeClass('processing');
}

function uploadProgress(event, position, total, percentComplete) {
    var percentVal = percentComplete + '%';
    $(".bar").css({width: percentVal});
}


function uploadPre(formData, jqForm, options) {

    $("#errorContainer").hide();
    $("#errorContainer ul li").remove();
    $("#infoContainer").hide();
    $("#infoContainer div").remove();

    //$("#loader").css({top: $(".content").offset().top, left: $(".content").offset().left, width: $(".content").outerWidth(), height: $(".content").outerHeight()});
    $(jqForm).find(".loading-bar").show();

    // bootstrap success / error containers ==============================
    $("#errorContainer").hide();
    $("#successContainer").hide();

    //reset the loading bar
    $(".bar").css({width: '0%'});
    //bar.width('0%');
    //percent.html('0%');
    // formData is an array; here we use $.param to convert it to a string to display it
    // but the form plugin does this for you automatically when it submits the data
    //var queryString = $.param(formData);

    // jqForm is a jQuery object encapsulating the form element.  To access the
    // DOM element for the form do this:
    // var formElement = jqForm[0];

    //console.log('About to submit: \n\n' + queryString);

    // here we could return false to prevent the form from being submitted;
    // returning anything other than false will allow the form submit to continue

    //validate file selected
    var frm = jqForm[0];

    $(frm).find('.control-group').removeClass('error');
    var parentEntityId = $(frm).find("input[name='parentEntityId']").val();
    var parentEntityType = $(frm).find("input[name='parentEntityType']").val();
    var theFile = $(frm).find("input[type='file']").val();
    var fileType = $(frm).find("select[name='type\\.id']").val() || $(frm).find("input[name='type\\.id']").val(); // either select of hidden field
    var parent;

    if (($(frm).find("input[name='parentEntityId']").length > 0) && (parentEntityId === "" || parentEntityId === null || parentEntityId === undefined)) {

        //try and get booking id
        if (parentEntityType == "booking") {
            parent = $.booking.frame.getBooking();
            if (!parent || !parent.id) {
                handleActionError({message: "Please save the booking before uploading a document."});
                return false;
            }

        } else if (parentEntityType == "customer") {
            parent = $.customer.app.getCustomer();
            if (!parent || !parent.id) {
                handleActionError({message: "Please save the customer before uploading a document."});
                return false;
            }

        } else if (parentEntityType == "contact") {
            parent = $.contact.app.getContact();
            if (!parent || !parent.id) {
                handleActionError({message: "Please save the contact before uploading a document."});
                return false;
            }
        }

        //set the parent id
        if (parent) {
            $(frm).find("input[name='parentEntityId']").val(parent.id);
        }
    }

    if (theFile === "" || theFile === null || theFile === undefined) {
        $(frm).find(".control-group").addClass('error');
        handleActionError({message: "Please select a file to upload."});

        return false;
    } else if (($(frm).find("[name='type\\.id']").length > 0) && (fileType === "" || fileType === null || fileType === undefined)) {
        $(frm).find(".control-group").addClass('error');
        handleActionError({message: "Please choose a file type."});

        return false;
    } else {
        $(frm).find("button.btn").button('loading'); //toggle button state
        $(frm).find("button.btn").addClass('processing'); //register button state for reset

        return true;
    }
}

// post-submit callback
function uploadPost(responseText, statusText, xhr, $form)  {
    // for normal html responses, the first argument to the success callback
    // is the XMLHttpRequest object's responseText property

    // if the ajaxForm method was passed an Options Object with the dataType
    // property set to 'xml' then the first argument to the success callback
    // is the XMLHttpRequest object's responseXML property

    // if the ajaxForm method was passed an Options Object with the dataType
    // property set to 'json' then the first argument to the success callback
    // is the json data object returned by the server


    //properly parse the response for IE to avoid popup
    if (jQuery.browser.msie) {
        if(responseText) {
//            responseText = [{message:responseText}]; //text response with ie
            responseText = eval(responseText)[0];
        }
    }

    $form.find(".loading-bar").hide();

    $("#infoContainer").show();
    $("#infoContainer").append("<div>" + _.escape(responseText[0]) + "</div>");

    //console.log('status: ' + statusText + '\n\nresponseText: \n' + responseText + '\n\nThe output div should have already been updated with the responseText.');

    //clear button state
    $("form button.btn").button('reset'); //toggle button state
    $("form button.btn").removeClass('processing'); //register button state for reset

    // bootstrap success / error containers ==============================
    $("#errorContainer").hide();
    $("#successContainer").hide();

    //handler for bootstrap template (TODO: only parse template once)
    var successTemplate = JST['common/success/container/show'];

    //process response and output message
    $("#successContainer").html(successTemplate({obj: (responseText[0] ? responseText[0] : responseText)}));

    //show success
    $("#successContainer").show();

    //change button back to normal
    $('.processing').button('reset');
    $('.processing').removeClass('processing');

    if (this.frame_callback) {
        this.frame_callback(responseText);
    }

}

var uploadOptions = {

    //target: '#info-container',   // target element(s) to be updated with server response
    beforeSubmit: uploadPre,  // pre-submit callback
    success: uploadPost,  // post-submit callback
    error: uploadError,
    uploadProgress: uploadProgress, //callback for upload progress
    // other available options:
    //url:       '${request.contextPath}/upload/contacts',         // override for form's 'action' attribute
    //type:      type        // 'get' or 'post', override for form's 'method' attribute
    dataType:  (jQuery.browser.msie ? 'script' : 'json')        // 'xml', 'script', or 'json' (expected server response type)
//    dataType:  (jQuery.browser.msie ? 'text' : 'json')        // text response for ie
    //clearForm: true        // clear all form fields after successful submit
    //resetForm: true        // reset the form after successful submit

    // $.ajax options can be used here too, for example:
    //timeout:   3000
};
