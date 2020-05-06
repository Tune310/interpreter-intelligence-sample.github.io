/* SEARCH HEADER
 _________ __                                       __  .__                     .__
 /   _____//  |_  ____   ____   ____   ___________ _/  |_|__| ____   ____ _____  |  |
 \_____  \\   __\/  _ \ /    \_/ __ \ /  ___/\__  \\   __\  |/  _ \ /    \\__  \ |  |
 /        \|  | (  <_> )   |  \  ___/ \___ \  / __ \|  | |  (  <_> )   |  \/ __ \|  |__
 /_______  /|__|  \____/|___|  /\___  >____  >(____  /__| |__|\____/|___|  (____  /____/
 Sept 2013
 Bhavior for the search dropdown within _nav-boostrap.gsp
 */

// TODO May need to keep this to handle non HTML5 browsers
//$('#search_content').placeholder();

function validateSearchInput(search_content) {
    //TODO: Find a better way to do this. Maybe backbone's validate??
    search_content = $.trim(search_content);
    if (isNumber(search_content) || search_content.length === 0) {
        $("#search_content").removeClass("error");
        return true;
    } else {
        $("#search_content").addClass("error");
        return false;
    }
}

function submitSearchForm() {
    var search_value = $('#search_form #search_content').attr('value');

    var search_content = $.trim(search_value);

    var search_form_action;
    //Only submit if a value is present and it is indeed a number
    if (validateSearchInput(search_content) && search_content.length > 0) {

        search_form_action = $('#search_form').attr('action');
        //Remove any blank spaces from tip/tail
        $('#search_form #search_content').attr('value', search_content);

        if ($('#search_form #search_type').attr('value') == 'search-job') {
            search_form_action = search_form_action + '/job/show/';
        } else if ($('#search_form #search_type').attr('value') == 'search-booking') {
            search_form_action = search_form_action + '/booking/edit/';
        } else if ($('#search_form #search_type').attr('value') == 'search-contact') {
            search_form_action = search_form_action + '/contact/show/';
        } else if ($('#search_form #search_type').attr('value') == 'search-customer') {
            search_form_action = search_form_action + '/customer/show/';
        }

        //Assign the selected action target in the form & Submit
        $('#search_form').attr('action', search_form_action);
        $('form#search_form').submit();
        document.location.href = search_form_action + search_content;

    }
}

// Reset the default search field value.
$('#search_content').blur(function () {
    // fadeOut the dropdown
    $('#search_dropdown').fadeOut();
    validateSearchInput($('#search_form #search_content').attr('value'));
});

// Function to activate a new element of the search dropdown

function activateDropdownElement(id) {
    var search_value = $('#search_form #search_content').attr('value');

    $('.chosen').attr('class', ''); // deactivate the currently chosen element
    $('#' + id).attr('class', 'chosen'); // activate the new element
    $('input[name=search_type]').val(id); // set the new value of the search_type variable
    if ($.trim(search_value).length === 0) {
        var placeholder_text;
        if (id == 'search-customer') placeholder_text = 'Customer #';
        else if (id == 'search-contact') placeholder_text = 'Contact #';
        else if (id == 'search-booking') placeholder_text = 'Booking #';
        else if (id == 'search-job') placeholder_text = 'Job #';
        $('#search_form #search_content').attr('placeholder', placeholder_text);
    }
}

// Capture keystrokes
$('#search_content').on('keydown', function (e) {

    var search_value = $('#search_form #search_content').attr('value');

    validateSearchInput($.trim(search_value));

    // fadeIn the dropdown
    $('#search_dropdown').fadeIn();

    var keyCode = e.keyCode || e.which;

    // Handle Tab button
    if (keyCode == 9) {
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    }

    // Up arrow
    if (e.keyCode == 38) {

        e.preventDefault();

        if ($('#search-contact').attr('class') == 'chosen') {
            activateDropdownElement('search-customer');
        } else if ($('#search-job').attr('class') == 'chosen') {
            activateDropdownElement('search-contact');
        } else if ($('#search-booking').attr('class') == 'chosen') {
            activateDropdownElement('search-job');
        } else if ($('#search-customer').attr('class') == 'chosen') {
            activateDropdownElement('search-booking');
        } else {
            activateDropdownElement('search-contact');
        }
    }

    // Down arrow.
    if (e.keyCode == 40) {

        e.preventDefault();

        if ($('#search_dropdown #search-contact').attr('class') == 'chosen') {
            activateDropdownElement('search-job');
        } else if ($('#search_dropdown #search-job').attr('class') == 'chosen') {
            activateDropdownElement('search-booking');
        } else if ($('#search_dropdown #search-booking').attr('class') == 'chosen') {
            activateDropdownElement('search-customer');
        } else if ($('#search_dropdown #search-customer').attr('class') == 'chosen') {
            activateDropdownElement('search-contact');
        } else {
            activateDropdownElement('search-job');
        }
    }

    // Tab key
    if (keyCode == 9) {

        // shift Tab key - Scroll through upward
        if (!e) e = window.event;

        if (e.shiftKey) {

            e.preventDefault();

            if ($('#search-contact').attr('class') == 'chosen') {
                activateDropdownElement('search-customer');
            } else if ($('#search-job').attr('class') == 'chosen') {
                activateDropdownElement('search-contact');
            } else if ($('#search-booking').attr('class') == 'chosen') {
                activateDropdownElement('search-job');
            } else if ($('#search-customer').attr('class') == 'chosen') {
                activateDropdownElement('search-booking');
            } else {
                activateDropdownElement('search-contact');
            }
        }

        // no shift Tab key - Scroll through downward
        else {

            e.preventDefault();

            if ($('#search_dropdown #search-contact').attr('class') == 'chosen') {
                activateDropdownElement('search-job');
            } else if ($('#search_dropdown #search-job').attr('class') == 'chosen') {
                activateDropdownElement('search-booking');
            } else if ($('#search_dropdown #search-booking').attr('class') == 'chosen') {
                activateDropdownElement('search-customer');
            } else if ($('#search_dropdown #search-customer').attr('class') == 'chosen') {
                activateDropdownElement('search-contact');
            } else {
                activateDropdownElement('search-job');
            }
        }
    }

    if (!$('.chosen').attr('class')) {
        activateDropdownElement('search-job');
    }

    // Enter key
    if (keyCode == 13) {
        e.preventDefault();
        // optionally, the action of the form can be changed based on the value of the search_type var,
        // which is set when the dropdown selection is changed
        submitSearchForm();
    }

});
//end $('#search_content').on('keydown', function(e)

// Handle clicking an option in the dropdown
$('#search-contact').click(function () {
    activateDropdownElement('search-contact');
    submitSearchForm();
});
$('#search-job').click(function () {
    activateDropdownElement('search-job');
    submitSearchForm();
});
$('#search-customer').click(function () {
    activateDropdownElement('search-customer');
    submitSearchForm();
});
$('#search-booking').click(function () {
    activateDropdownElement('search-booking');
    submitSearchForm();
});
