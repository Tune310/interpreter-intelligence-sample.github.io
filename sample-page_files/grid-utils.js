/* enable strict mode */
"use strict"; //# sourceURL=app/grid-utils.js

/**
 * Escapes text to prevent possible script-injection into HTML code.
 *
 * @param textToEscape
 *            the text string to escape.
 * @param handleNewLines
 *            whether new-lines in the text should be preserved. Optional, defaults to false.
 * @returns escaped text.
 */
function /*String*/ htmlEscape(/*String*/ textToEscape, /*bool*/ handleNewLines/* = false*/) {
    if (handleNewLines === undefined || handleNewLines === null) {
        handleNewLines = false;
    }

    var text = "";

    // test for text present
    if (!textToEscape) {
        return text;
    }

    for (var i = 0; i < textToEscape.length; ++i) {
        var ch = textToEscape.charAt(i);

        if (ch === '<') {
            text += "&lt;";
        } else if (ch === '>') {
            text += "&gt;";
        } else if (ch === '&') {
            text += "&amp;";
        } else if (ch === '"') {
            text += "&quot;";
        } else if (ch === "'") {
            text += "&apos;";
        } else if (handleNewLines && (ch === '\n' || ch === '\r')) {
            text += "<br />";
        } else {
            text += ch;
        }
    }

    return text;
}

/**
 * leave the cell value as it is, unless the value is missing.
 *
 * if the value is missing output a div with the value of an alternate column defined by the
 * formatter option formatteroptions.col if it's defined and highlight in bold red font.
 *
 * otherwise write out the default error exclamation mark.
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function missingFormatter(cellValue, options, rowObject) {

    var title = cellValue;

    if (options.colModel.formatteroptions.tooltip) {
        title = rowObject[options.colModel.formatteroptions.tooltip];
    }

    if (cellValue == null || cellValue.length == 0) {

        if (options.colModel.formatteroptions.col) {


            return "<div style='color: red; font-weight: bold;' title='" + title + "'>" + rowObject[options.colModel.formatteroptions.col]  + "</div>";

        } else {

            return "<div class='field-error'>&nbsp;</div>";

        }

    } else {

        return "<div title='" + title + "'>" + cellValue + "</div>";

    }
}

/**
 * return the unformatted cell value for editing purposes
 *
 * @param cellValue	original value of the cell
 * @param options	grid options
 *
 * @returns unformatted cell value
 */
function missingUnFormatter(cellValue, options, cellObject) {

    //alert(cellValue + options + rowObject);

    //writeObject("CV: " + $(cellObject).attr());
//	writeObject("OP: " + options);
//	writeObject("RO: " + rowObject);
    return cellValue;
}

/**
 * return the id of the selected option for editing
 *
 * @param cellValue	original value of the cell
 * @param options	grid options
 *
 * @returns unformatted cell value
 */
function selectUnFormatter(cellValue, options, cellObject) {

    var id = $(cellObject).find("div").attr('id');

    return id;
}

function archiveFormatter(cellValue, options, rowObject) {

    if (cellValue) {

        return "<div title='Archived'><i class='icon icon-folder-open'></i></div>";

    } else {

        return "<div title='Pending Review'><i class='icon icon-eye-open'></i></div>";

    }
}

function durationFormatter(cellValue, options, rowObject) {

    if (!rowObject["expectedDurationHrs"] || !rowObject["actualDurationHrs"]) {

        return "<div style='color: red; font-weight: bold;' title='Expected Duration'>" + rowObject["expectedDuration"] + "</div>";

    } else if (rowObject["expectedDuration"] !== rowObject["actualDuration"]) {

        return "<div title='Variation from Expected'><i class='icon icon-resize-full'></i> " + rowObject["actualDuration"] + "</div>";

    } else {

        return cellValue;

    }
}

/**
 * formatter for notes field where "more ..." link is displayed to show the notes and references
 * in a pop up window.
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function notesFormatter(cellValue, options, rowObject) {

    var title = rowObject["requestedBy"] ? rowObject["requestedBy"] : rowObject["requestor.label"];

    if (rowObject.hasMoreInfo || rowObject.hasMoreInfo == "true") {

        if (!cellValue) {

            cellValue = "<div style='text-align: center;'><a href='javascript:openColorBox(" + rowObject.id + ")'>more ...</a></div>";

        } else {

            cellValue = "<a href='javascript:openColorBox(" + rowObject.id + ")'>" + cellValue + "</a>";

        }

    } else {

        //don't add link to show references
        cellValue = "<div style='text-align: center;'><div style='text-align: center;'><a href='javascript:openColorBox(" + rowObject.id + ")'>add ...</a></div>";

    }

    return cellValue;
}

/**
 * formatter for booking requirements
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function bookingCriteriaFormatter(cellValue, options, rowObject) {

    var cell = "";

    if (cellValue && cellValue.length) {

        for (var i = 0; i < cellValue.length; i++) {

            // check for non-null (can be returned from hibernate when searching across list
            if (cellValue[i] && cellValue[i].criteria) {
                cell += cellValue[i].criteria.name;

                if (i < (cellValue.length - 1)) {
                    cell += " / ";
                }
            }
        }
    } else {
        cell = "-";
    }

    return cell;
}

/**
 * formatter based on the payment eligibility of a booking.
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function eligibleFormatter(cellValue, options, rowObject) {

    return "<div id='eligible-" + rowObject.id + "' style='cursor: pointer;' class='eligible " + getBookingPaymentEligibilityCss(rowObject["status.id"]) + "' title='click to verify booking for payment'>&nbsp;&nbsp;</div>";
}

/**
 * formatter based on the invoice eligibility of a booking.
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function eligibleInvoiceFormatter(cellValue, options, rowObject) {

    return "<div id='eligible-" + rowObject.id + "' style='cursor: pointer;' class='eligible " + getBookingInvoiceEligibilityCss(rowObject["status.id"]) + "' title='Invoice eligibility'>&nbsp;</div>";
}

/**
 * formatter for users employment eligibility status
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function employmentEligibilityFormatter(cellValue, options, rowObject) {

    var css = 'eligible-warning';
    var title = 'Eligibility warning. Click for details.';

    if (cellValue && (cellValue == 'fail')) {
        css = 'eligible-fail';
        title = 'Eligibility failure. Click for details.';
    } else if (cellValue && (cellValue == 'pass')) {
        css = 'eligible-pass';
        title = 'Eligible. Click for details.';
    }

    return "<div style='cursor: pointer;' class='eligible " + css + "' title='Employment Eligibility'><a class='gridEligibilityPopup' href='" + options.colModel.formatteroptions.context + "/contact/eligibility/" + rowObject.id + "' title='" + title + "'>&nbsp;&nbsp;</a></div>";
}

/**
 * leave the cell value as it is, unless the value is missing.
 *
 * includes options for truncating the length of cell value and / or wrapping the cell value
 * in a url link.
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function genericFormatter(cellValue, options, rowObject) {
    var actualCellValue = cellValue;
    var actualCellValueTruncated = false;

    // set escapehtml attribute if doesn't exist already
    if (options.colModel.formatteroptions) {
        if (!options.colModel.formatteroptions.hasOwnProperty('escapeHtml')) {
            // always be true unless explicitly defined
            options.colModel.formatteroptions.escapeHtml = true;
        }
    }

    if (cellValue != null && options.colModel.formatteroptions && options.colModel.formatteroptions.length && cellValue.length > options.colModel.formatteroptions.length) {
        actualCellValueTruncated = true;
        if (options.colModel.formatteroptions.escapeHtml) {
            cellValue = htmlEscape(cellValue.substring(0, options.colModel.formatteroptions.length-3)) + "...";
        }
    }

    if (cellValue == null || cellValue.length == 0) {

        cellValue = "<div class='field-error'>&nbsp;</div>";
    }

    if (options.colModel.formatteroptions && options.colModel.formatteroptions.url) {

        var url = options.colModel.formatteroptions.url;
        // create the url
        if (options.colModel.formatteroptions.id) {

            if (url.indexOf("{id}") != -1) {
                // replace the id
                url = url.replace("{id}", rowObject[options.colModel.formatteroptions.id]);
            } else {
                // append to end
                url = url + rowObject[options.colModel.formatteroptions.id];
            }
        }

        if (options.colModel.formatteroptions.cssClass) {
            cellValue = "<a class='" + options.colModel.formatteroptions.cssClass + "' href='" + url + "'>" + cellValue + "</a>";
        } else {
            cellValue = "<a class='gridPopup' href='" + url + "'>" + cellValue + "</a>";
        }

    }

    if (options.colModel.formatteroptions && options.colModel.formatteroptions.append) {

        cellValue = cellValue + " (" + rowObject[options.colModel.formatteroptions.append] + ")";

    }

    if (options.colModel.formatteroptions && options.colModel.formatteroptions.provideFullTextInTooltip) {
        if (actualCellValueTruncated) {
            if (options.colModel.formatteroptions.escapeHtml) {
                cellValue = "<div title='" + htmlEscape(actualCellValue) + "' style='display: inline;'>" + cellValue + "</div>";
            }
        }
    } else if (options.colModel.formatteroptions && options.colModel.formatteroptions.tooltip) {
        if(options.colModel.formatteroptions.tooltip == "duration") {
            var expectedStart = rowObject["startTime"];
            var expectedEnd = rowObject["endTime"];
            var actualStart = rowObject["actStartTime"];
            var actualEnd = rowObject["actEndTime"];
            if(!actualStart || !actualEnd) {
                cellValue = "<div title='" + rowObject['timeZone'] + "&#013;Expected: " + expectedStart + " - " + expectedEnd + "' style='display: inline;'>" + cellValue + "</div>";
            } else {
                cellValue = "<div title='" + rowObject['timeZone'] + "&#013;Expected: " + expectedStart + " - " + expectedEnd + "&#013;Actual: " + actualStart + " - " + actualEnd +  "' style='display: inline;'>" + cellValue + "</div>";
            }
        } else {
            cellValue = "<div title='" + rowObject[options.colModel.formatteroptions.tooltip] + "' style='display: inline;'>" + cellValue + "</div>";
        }
    }

    return cellValue;
}


/**
 * call generic formatter and show lock icon if the job is being edited.
 *
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function jobEditingFormatter(cellValue, options, rowObject) {

    cellValue = genericFormatter(cellValue, options, rowObject);

    if (rowObject.preventEdit) {
        cellValue = "<div title='Opened for Edit: " + rowObject.userEditing + " (" + rowObject.startEditing + ")'><i class='icon-lock'></i> " + cellValue + "</div>";

    }

    return cellValue;

};

/**
 * leave the cell value as it is, if the value is missing just return a string. Example usage - Contact Region on the contact list does not need an error, as it is not required
 *
 * includes options for truncating the length of cell value and / or wrapping the cell value
 * in a url link.
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function notRequiredFormatter(cellValue, options, rowObject) {
    var actualCellValue = cellValue;
    var actualCellValueTruncated = false;

    if (cellValue != null && options.colModel.formatteroptions && options.colModel.formatteroptions.length && cellValue.length > options.colModel.formatteroptions.length) {
        cellValue = htmlEscape(cellValue.substring(0, options.colModel.formatteroptions.length-3)) + "...";
        actualCellValueTruncated = true;
    }

    if (cellValue == null || cellValue.length == 0) {

        cellValue = "";
    }

    if (options.colModel.formatteroptions && options.colModel.formatteroptions.url) {

        var url = options.colModel.formatteroptions.url;
        // create the url
        if (options.colModel.formatteroptions.id) {

            if (url.indexOf("{id}") != -1) {
                // replace the id
                url = url.replace("{id}", rowObject[options.colModel.formatteroptions.id]);
            } else {
                // append to end
                url = url + rowObject[options.colModel.formatteroptions.id];
            }
        }

        if (options.colModel.formatteroptions.cssClass) {
            cellValue = "<a class='" + options.colModel.formatteroptions.cssClass + "' href='" + url + "'>" + cellValue + "</a>";
        } else {
            cellValue = "<a class='gridPopup' href='" + url + "'>" + cellValue + "</a>";
        }

    }

    if (options.colModel.formatteroptions && options.colModel.formatteroptions.append) {

        cellValue = cellValue + " (" + rowObject[options.colModel.formatteroptions.append] + ")";

    }

    if (options.colModel.formatteroptions && options.colModel.formatteroptions.provideFullTextInTooltip) {
        if (actualCellValueTruncated) {
            cellValue = "<div title='" + htmlEscape(actualCellValue) + "' style='display: inline;'>" + cellValue + "</div>";
        }
    } else if (options.colModel.formatteroptions && options.colModel.formatteroptions.tooltip) {
        cellValue = "<div title='" + rowObject[options.colModel.formatteroptions.tooltip] + "' style='display: inline;'>" + cellValue + "</div>";
    }

    return cellValue;
}

/**
 * decorator around genericFormatter which also displays the repeat icon before the customer
 * name if the booking is part of a recurring booking
 *
 * includes options for truncating the length of cell value and / or wrapping the cell value
 * in a url link.
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function recurringDecoratorFormatter(cellValue, options, rowObject) {

    cellValue = genericFormatter(cellValue, options, rowObject);

    // if (rowObject["recurringGroup.id"]) {
    // show calendar if more than one booking
    if (rowObject["superBookingVisits"] && rowObject["superBookingVisits"] > 1) {

        cellValue = "<a class='gridiFramePopup' href='" + App.config.context + "/calendar/recurring/" + rowObject["id"] + "' title='Recurring Jobs (Booking #" + rowObject["superBooking.id"] + ")'><i class='icon-calendar'></i>&nbsp;</a>" + cellValue;

    }

    return cellValue;
}

/**
 * show language code plus the number of other languages spoken
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function languageFormatter(cellValue, options, rowObject) {

    if (cellValue == null || cellValue.length == 0) {

        cellValue = "<div class='field-error'>&nbsp;</div>";
    } else {

        cellValue = "<a class='gridPopup' href='" + App.config.context + "/contact/languages/" + rowObject.id + "' title='" + rowObject["language"] + "'>" + rowObject["languageCode"] + " " + rowObject["moreLanguages"] + "</a>";
    }

    return cellValue;
}


/**
 * return the unformatted cell value for editing purposes
 *
 * @param cellValue	original value of the cell
 * @param options	grid options
 *
 * @returns unformatted cell value
 */
function genericUnFormatter(cellValue, options) {

    return cellValue;
}

/**
 * format the customer status column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function customerStatusFormatter(cellValue, options, rowObject) {

    if (cellValue == App.dict.customerStatus['active'].id || cellValue == App.dict.customerStatus['active'].name) {
        cellValue = "Y";
    } else if (cellValue == App.dict.customerStatus['inactive'].id || cellValue == App.dict.customerStatus['inactive'].name) {
        cellValue = "N";
    } else {
        cellValue = "";
    }

    return cellValue;
}

/**
 * format the customer status column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function booleanFormatter(cellValue, options, rowObject) {

    if (cellValue == true) {
        cellValue = "Y";
    } else if (cellValue == false) {
        cellValue = "N";
    } else {
        cellValue = "";
    }

    return cellValue;
}

/**
 * format the interaction complaint received column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function interactionComplaintFormatter(cellValue, options, rowObject) {

    if (cellValue == 1) {
        cellValue = "Y";
    } else if (cellValue == 0) {
        cellValue = "N";
    } else {
        cellValue = "";
    }

    return cellValue;
}

/**
 * format the booking status column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function bookingStatusFormatter(cellValue, options, rowObject) {

    if (cellValue == App.dict.bookingStatus['new'].id || cellValue == App.dict.bookingStatus['new'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-new' title='New'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (cellValue == App.dict.bookingStatus['open'].id || cellValue == App.dict.bookingStatus['open'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-open' title='Open'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (cellValue == App.dict.bookingStatus['assigned'].id || cellValue == App.dict.bookingStatus['assigned'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-assigned' title='Assigned'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (cellValue == App.dict.bookingStatus['confirmed'].id || cellValue == App.dict.bookingStatus['confirmed'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-confirmed' title='Confirmed'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (cellValue == App.dict.bookingStatus['declined'].id || cellValue == App.dict.bookingStatus['declined'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-declined' title='Unfulfilled'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (cellValue == App.dict.bookingStatus['nonattendance'].id || cellValue == App.dict.bookingStatus['nonattendance'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-nonattendance' title='No Attendance'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (cellValue == App.dict.bookingStatus['cancelled'].id || cellValue == App.dict.bookingStatus['cancelled'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-cancelled' title='Cancelled'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (cellValue == App.dict.bookingStatus['closed'].id || cellValue == App.dict.bookingStatus['closed'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-closed' title='Closed'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (cellValue == App.dict.bookingStatus['offered'].id || cellValue == App.dict.bookingStatus['offered'].name) {
        cellValue = "<div id='" + cellValue + "' class='status status-offered' title='Offered'>" + getAbbreviationByStatus(getStatusAttributeById(App.dict.bookingStatus, cellValue, "nameKey")) + "</div>";
    } else if (_.isNull(cellValue)) {
        cellValue = "<div class='status status-mixed' title='Mixed'></div>";
    }

    return cellValue;

}

/**
 * format the billing method column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function billingMethodFormatter(cellValue, options, rowObject) {

    if (cellValue == App.dict.billingMethod['email'].id || cellValue == App.dict.billingMethod['email'].id.name) {
        cellValue = "<div id='" + cellValue + "' class='billling-method-email' title='Email'>&nbsp;</div>";
    } else if (cellValue == App.dict.billingMethod['mail'].id || cellValue == App.dict.billingMethod['mail'].id.name) {
        cellValue = "<div id='" + cellValue + "' class='billling-method-mail' title='Standard Mail'>&nbsp;</div>";
    }

    return cellValue;

}

/**
 * booking mode formatter
 *
 * @param cellValue
 * @param options
 * @param rowObject
 * @returns {*}
 */
function bookingModeFormatter(cellValue, options, rowObject) {
    var finalHtml = "";

    if (!_.isObject(cellValue)) {
        return;
    }

    if (cellValue.id === App.dict.bookingMode['inperson'].id || cellValue.name === App.dict.bookingMode['inperson'].name) {
        finalHtml = "<div class='person service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['video'] && (cellValue.id === App.dict.bookingMode['video'].id || cellValue.name === App.dict.bookingMode['video'].name)) {
        finalHtml = "<div class='video service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['vri'] && (cellValue.id === App.dict.bookingMode['vri'].id || cellValue.name === App.dict.bookingMode['vri'].name)) {
        finalHtml = "<div class='video service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['phone'] && (cellValue.id === App.dict.bookingMode['phone'].id || cellValue.name === App.dict.bookingMode['phone'].name)) {
        finalHtml = "<div class='phone service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['phoneScheduled'] && (cellValue.id === App.dict.bookingMode['phoneScheduled'].id || cellValue.name === App.dict.bookingMode['phoneScheduled'].name)) {
        finalHtml = "<div class='phone service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['video3rd'] && (cellValue.id === App.dict.bookingMode['video3rd'].id || cellValue.name === App.dict.bookingMode['video3rd'].name)) {
        finalHtml = "<div class='video service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['phone3rd'] && (cellValue.id === App.dict.bookingMode['phone3rd'].id || cellValue.name === App.dict.bookingMode['phone3rd'].name)) {
        finalHtml = "<div class='phone service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['opi'] && (cellValue.id === App.dict.bookingMode['opi'].id || cellValue.name === App.dict.bookingMode['opi'].name)) {
        finalHtml = "<div class='phone service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['mr'] && (cellValue.id === App.dict.bookingMode['mr'].id || cellValue.name === App.dict.bookingMode['mr'].name)) {
        finalHtml = "<div class='envelope service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['cmr'] && (cellValue.id === App.dict.bookingMode['cmr'].id || cellValue.name === App.dict.bookingMode['cmr'].name)) {
        finalHtml = "<div class='envelope service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['court'] && (cellValue.id === App.dict.bookingMode['court'].id || cellValue.name === App.dict.bookingMode['court'].name)) {
        finalHtml = "<div class='legal service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['conference'] && (cellValue.id === App.dict.bookingMode['conference'].id || cellValue.name === App.dict.bookingMode['conference'].name)) {
        finalHtml = "<div class='group service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['group'] && (cellValue.id === App.dict.bookingMode['group'].id || cellValue.name === App.dict.bookingMode['group'].name)) {
        finalHtml = "<div class='group service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";
    } else if (App.dict.bookingMode['simultaneous'] && (cellValue.id === App.dict.bookingMode['simultaneous'].id || cellValue.name === App.dict.bookingMode['simultaneous'].name)) {
        finalHtml = "<div class='group service-type-icon service-type-" + cellValue.nameKey + " bg-centered bg-only' title='" + cellValue.name + "'>&nbsp;</div>";

    } else {
        finalHtml = cellValue.name;
    }

    return finalHtml;

}



/**
 * cancel reason formatter
 *
 * @param cellValue
 * @param options
 * @param rowObject
 * @returns {*}
 */
function cancellationReasonFormatter(cellValue, options, rowObject) {
    for(var i=0; i<App.dict.cancellationReasons; i++){
        if(cellValue == (App.dict.cancellationReasons[i].id || App.dict.cancellationReasons[i].name)){
            cellValue = "<div id ='" + cellValue + "' class='' title='" + App.dict.cancellationReasons[i].description + "'>" + App.dict.cancellationReasons[i].name + "</div>";
        }
    }
    return cellValue;
}

/**
 * gender formatter
 *
 * @param cellValue
 * @param options
 * @param rowObject
 * @returns {*}
 */
 function genderSelectFormatter(cellValue, options, rowObject){
    if(cellValue === (App.dict.gender.m.id || App.dict.gender.m.name)){
        cellValue = "<div id ='" + cellValue + "' class='' title='" + App.dict.gender.m.name  + "'>" + App.dict.gender.m.name + "</div>";
    }
    else if(cellValue === (App.dict.gender.f.id || App.dict.gender.f.name)){
        cellValue = "<div id ='" + cellValue + "' class='' title='" + App.dict.gender.f.name  + "'>" + App.dict.gender.f.name + "</div>";
    }
    return cellValue
}
/**
 * format the payment status column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function paymentStatusFormatter(cellValue, options, rowObject) {

    if (cellValue == App.dict.paymentStatus['payable'].id || cellValue == App.dict.paymentStatus['payable'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status payment-status-payable' title='Payable'>&nbsp;</div>";
    } else if (cellValue == App.dict.paymentStatus['notpayable'].id || cellValue == App.dict.paymentStatus['notpayable'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status payment-status-notpayable' title='Not Payable'>&nbsp;</div>";
    } else if (cellValue == App.dict.paymentStatus['pending'].id || cellValue == App.dict.paymentStatus['pending'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status payment-status-pending' title='Pending Payment'>&nbsp;</div>";
    } else if (cellValue == App.dict.paymentStatus['paidpayment'].id || cellValue == App.dict.paymentStatus['paidpayment'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status payment-status-paidpayment' title='Paid'>&nbsp;</div>";
    } else if (cellValue == App.dict.paymentStatus['failed'].id || cellValue == App.dict.paymentStatus['failed'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status field-error' title='Payment Failed'>&nbsp;</div>";
    } else if (cellValue == App.dict.paymentStatus['cancelled'].id || cellValue == App.dict.paymentStatus['cancelled'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status payment-status-cancelled' title='Payment Cancelled'>&nbsp;</div>";
    } else if (cellValue == App.dict.paymentStatus['reviewedandapproved'].id || cellValue == App.dict.paymentStatus['reviewedandapproved'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status payment-status-approved' title='Payment Reviewed and Approved'>&nbsp;</div>";
    } else if (cellValue == App.dict.paymentStatus['paymentonhold'].id || cellValue == App.dict.paymentStatus['paymentonhold'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status payment-status-paymentonhold' title='Payment On Hold'>&nbsp;</div>";
    } else if (cellValue == App.dict.paymentStatus['holdpayment'].id || cellValue == App.dict.paymentStatus['holdpayment'].name) {
        cellValue = "<div id='" + cellValue + "' class='payment-status payment-status-holdpayment' title='Hold Payment'>&nbsp;</div>";
    }

    return cellValue;
}

/**
 * format the address type column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function addressTypeFormatter(cellValue, options, rowObject) {

    if (cellValue == App.dict.addressType['home'].id || cellValue == App.dict.addressType['home'].name) {
        cellValue = "<div id='" + cellValue + "' class='address-type-home' title='Home'>&nbsp;</div>";
    } else if (cellValue == App.dict.addressType['billing'].id || cellValue == App.dict.addressType['billing'].name) {
        cellValue = "<div id='" + cellValue + "' class='address-type-billing' title='Billing'>&nbsp;</div>";
    } else if (cellValue == App.dict.addressType['business'].id || cellValue == App.dict.addressType['business'].name) {
        cellValue = "<div id='" + cellValue + "' class='address-type-business' title='Business'>&nbsp;</div>";
    } else if (cellValue == App.dict.addressType['other'].id || cellValue == App.dict.addressType['other'].name) {
        cellValue = "<div id='" + cellValue + "' class='address-type-other' title='Other'>&nbsp;</div>";
    } else {
        cellValue = "";
    }

    return cellValue;
}

/**
 * format the invoice status column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function invoiceStatusFormatter(cellValue, options, rowObject) {

    if (cellValue == App.dict.invoiceStatus['invoiceable'].id || cellValue == App.dict.invoiceStatus['invoiceable'].name) {
        cellValue = "<div id='" + cellValue + "' class='invoice-status invoice-status-invoiceable' title='Invoiceable'>&nbsp;</div>";
    } else if (cellValue == App.dict.invoiceStatus['notinvoiceable'].id || cellValue == App.dict.invoiceStatus['notinvoiceable'].name) {
        cellValue = "<div id='" + cellValue + "' class='invoice-status invoice-status-notinvoiceable' title='Not Invoiceable'>&nbsp;</div>";
    } else if (cellValue == App.dict.invoiceStatus['invoiced'].id || cellValue == App.dict.invoiceStatus['invoiced'].name) {
        cellValue = "<div id='" + cellValue + "' class='invoice-status invoice-status-invoiced' title='Invoiced (Pending Payment)'>&nbsp;</div>";
    } else if (cellValue == App.dict.invoiceStatus['paidinvoice'].id || cellValue == App.dict.invoiceStatus['paidinvoice'].name) {
        cellValue = "<div id='" + cellValue + "' class='invoice-status invoice-status-paidinvoice' title='Invoice Paid'>&nbsp;</div>";
    } else if (cellValue == App.dict.invoiceStatus['failed'].id || cellValue == App.dict.invoiceStatus['failed'].name) {
        cellValue = "<div id='" + cellValue + "' class='invoice-status field-error' title='Invoice Failed'>&nbsp;</div>";
    } else if (cellValue == App.dict.invoiceStatus['cancelled'].id || cellValue == App.dict.invoiceStatus['cancelled'].name) {
        cellValue = "<div id='" + cellValue + "' class='invoice-status invoice-status-cancelled' title='Invoice Cancelled'>&nbsp;</div>";
    } else if (cellValue == App.dict.invoiceStatus['reviewedandapproved'].id || cellValue == App.dict.invoiceStatus['reviewedandapproved'].name) {
        cellValue = "<div id='" + cellValue + "' class='invoice-status invoice-status-approved' title='Invoice Reviewed and Approved'>&nbsp;</div>";
    }

    return cellValue;
}

/**
 * format the payment method
 *
 * This method will try to find the cellValue value in any property defined at options.findValueIn, within
 * options.source object, and
 *
 * @param cellValue	value of the cell
 * @param options	grid options with the following structure:
 *
 *   {
 *       "findValueIn":  The options.source properties where we should look for cellValue value
 *       "propToDisplay: The property to be displayed in the cell.
 *       "cssClass":     The class name to be assigned to the cell.
 *       "render":       The HTML template to be injected in the cell.
 *       "source":       The App.dict object that we should look at. (mandatory) For instance: App.dict.paymentMethod
 *   }
 *
 *   options.source structure must be as follows:
 *
 *   {
 *      "key1": {
 *          "prop1": prop1_value,
 *          "prop2": prop2_value,
 *          ...
 *      },
 *      "key2": {
 *          "prop1": prop1_value,
 *          "prop2": prop2_value,
 *          ...
 *      },
 *      ...
 *   }
 *
 * @returns {string} value to show in the cell
 */
var genericCellFormatter = (function(){
    function renderObject(obj) {
        return obj ? config.render({
            'cssClass': obj.nameKey ? config.cssClass + " " + obj.nameKey : config.cssClass,
            'title': obj.description || "",
            'content': obj[config.propToDisplay] || ""
        }) : "";
    }

    function setPropToDisplay(config) {
        // Checks if propToDisplay exists in source
        if (!_.has(_.first(_.collect(source)), config.propToDisplay)) {
            config.propToDisplay = defaults.propToDisplay;
        }
    }

    var source = {};
    var config = {};
    var defaults = {
        "findValueIn": ['id', 'name', 'nameKey'],
        "propToDisplay": "name",
        "cssClass": "",
        "render": _.template("<div class='<@- cssClass @>' title='<@- title @>'><@- content @></div>")
    };

    // Finds within source any object with a property (one of those config.findValueIn) equal to cellValue
    // Uses memoization for improving performance, and a resolver with cacheKey to prevent collisions with other columns
    //
    // @returns {object} or {undefined}
    var findObjectWith = _.memoize(function (cellValue) {
        return _.find(source, function (item) {
            return _.find(item, function(value, prop) {
                return cellValue === value && _.contains(config.findValueIn, prop);
            });
        });
    }, function resolver(cellValue) {
        return config.cacheKey + "_" + cellValue;
    });

    return function init(cellValue, options) {
        source = options.source || (options.colModel && options.colModel.source);

        // jqGrid   requires options.source
        // Backgrid requires options.colModel.source
        if (!source) {
            return "";
        }

        if (cellValue === "" || cellValue === undefined || cellValue === null) {
            return "";
        }

        // options.formatteroptions overwrites defaults
        // jqGrid   requires options.colModel.formatteroptions
        // Backgrid requires options.formatteroptions
        config = _.merge(defaults, options.formatteroptions || options.colModel.formatteroptions);

        setPropToDisplay(config);
        return _.isNull(cellValue) ? "" : renderObject(findObjectWith(cellValue, config.cacheKey));
    }
}());

/**
 * employment category formatter
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function employmentCategoryFormatter(cellValue, options, rowObject) {

    if (cellValue == App.dict.employmentCategory['fte'].id || cellValue == App.dict.employmentCategory['fte'].name || cellValue == App.dict.employmentCategory['fte'].nameKey) {
        cellValue = "<div id='" + cellValue + "' class='' title='" + App.dict.employmentCategory['fte'].description + "'>" + App.dict.employmentCategory['fte'].nameKey + "</div>";
    } else if (cellValue == App.dict.employmentCategory['pte'].id || cellValue == App.dict.employmentCategory['pte'].name || cellValue == App.dict.employmentCategory['pte'].nameKey) {
        cellValue = "<div id='" + cellValue + "' class='' title='" + App.dict.employmentCategory['pte'].description + "'>" + App.dict.employmentCategory['pte'].nameKey + "</div>";
    } else if (cellValue == App.dict.employmentCategory['temp'].id || cellValue == App.dict.employmentCategory['temp'].name || cellValue == App.dict.employmentCategory['temp'].nameKey) {
        cellValue = "<div id='" + cellValue + "' class='' title='" + App.dict.employmentCategory['temp'].description + "'>" + App.dict.employmentCategory['temp'].nameKey + "</div>";
    } else if (cellValue == App.dict.employmentCategory['con'].id || cellValue == App.dict.employmentCategory['con'].name || cellValue == App.dict.employmentCategory['con'].nameKey) {
        cellValue = "<div id='" + cellValue + "' class='' title='" + App.dict.employmentCategory['con'].description + "'>" + App.dict.employmentCategory['con'].nameKey + "</div>";
    } else if (cellValue == App.dict.employmentCategory['ven'].id || cellValue == App.dict.employmentCategory['ven'].name || cellValue == App.dict.employmentCategory['ven'].nameKey) {
        cellValue = "<div id='" + cellValue + "' class='' title='" + App.dict.employmentCategory['ven'].description + "'>" + App.dict.employmentCategory['ven'].nameKey + "</div>";
    }

    return cellValue;
}

/**
 * format the invoice status column
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function locationFormatter(cellValue, options, rowObject) {
    if (cellValue == null || cellValue.length === 0) {
        return "<div class='field-error'>&nbsp;</div>";
    } else {

        // truncate text if configured
        cellValue = genericFormatter(cellValue, options, rowObject);

        if (rowObject.isTelephoneTranslation || rowObject.isTelephoneTranslation === "true") {
            var tooltip = "";
            if (rowObject.actualLocation) {
                if (options.formatteroptions && options.formatteroptions.tooltip) {
                    tooltip = rowObject[options.formatteroptions.tooltip];
                } else {
                    tooltip = rowObject.actualLocation.displayLabel;
                }
                return "<div class='phone' title='" + tooltip +"'>" + cellValue + "</div>";
            } else {
                return "<div class='phone' title='No location selected'>" + cellValue + "</div>";
            }
        } else if (App.dict.bookingMode["inperson"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["inperson"].id)) {
            return "<div class='person'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["video"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["video"].id)) {
            return "<div class='video'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["vri"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["vri"].id)) {
            return "<div class='video'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["phone"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["phone"].id)) {
            return "<div class='phone'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["phoneScheduled"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["phoneScheduled"].id)) {
            return "<div class='phone'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["video3rd"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["video3rd"].id)) {
            return "<div class='video'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["phone3rd"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["phone3rd"].id)) {
            return "<div class='phone'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["opi"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["opi"].id)) {
            return "<div class='phone'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["mr"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["mr"].id)) {
            return "<div class='envelope'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["cmr"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["cmr"].id)) {
            return "<div class='envelope'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["court"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["court"].id)) {
            return "<div class='legal'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["conference"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["conference"].id)) {
            return "<div class='group'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["group"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["group"].id)) {
            return "<div class='group'>" + cellValue + "</div>";
        } else if (App.dict.bookingMode["simultaneous"] && (rowObject["bookingMode.id"] === App.dict.bookingMode["simultaneous"].id)) {
            return "<div class='group'>" + cellValue + "</div>";
        } else {
            return "<div class='generic'>" + cellValue + "</div>";
        }
    }
}

/**
 * format the interpreter column. this function is not to be used on the customer portal as it includes phone number
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function interpreterFormatter(cellValue, options, rowObject) {

    if (cellValue == null || cellValue.length == 0) {

        return "<div class='field-error'>&nbsp;</div>";

    } else {
        // Allow for situation where interpreter object is passed in as attribute of rowObject eg Manage Interactions
        if (rowObject["interpreter"]){
            cellValue = "<div>";
            cellValue += rowObject["interpreter"]["displayName"];
            cellValue += "(<a class='calendarViewPopUp' title='Interpreter Jobs'><span id='" + rowObject["interpreter"]["id"] + "' style='display: inline-block; vertical-align: middle;' class='icon ui-icon ui-icon-clock'></span>...</a>)";
            cellValue += "</div>";
        }else{
            // Allow for situation where interpreter attributes are attributes of the rowObject
            cellValue = "<div>";
            cellValue += "<a class='gridPopup' href='" + App.config.context + "/contact/numbers/" + rowObject["interpreter.id"] + "' title='Contact Details'>";
            cellValue += htmlEscape(rowObject["interpreter.label"]);
            if (rowObject["interpreter.primaryNumber"]) {

                cellValue += " (" + htmlEscape(rowObject["interpreter.primaryNumber"]) + ")";
            }
            cellValue += "</a>";
            cellValue += "(<a class='calendarViewPopUp' title='Interpreter Jobs'><span style='display: inline-block; vertical-align: middle;' class='icon ui-icon ui-icon-clock'></span>...</a>)";
            cellValue += "</div>";
        }
    }

    return cellValue;
}

/**
 * format the contact column name from list of contacts.
 * <p>
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function contactFormatter(cellValue, options, rowObject) {

    if (cellValue == null || cellValue.length == 0) {

        return "<div class='field-error'>&nbsp;</div>";

    } else {

        cellValue = "<div>";
        cellValue += "<a class='gridPopup' href='" + App.config.context + "/contact/summary/" + rowObject["id"] + "' title='Contact Summary'>" + rowObject["name"] + "</a>";
        cellValue += "(<a class='calendarViewPopUp' title='Interpreter Jobs'><span style='display: inline-block; vertical-align: middle;' class='icon ui-icon ui-icon-clock'></span>...</a>)";
        cellValue += "</div>";
    }
    /*
    * From a cellValue: href='" + App.config.context + "/calendar/interpreter/" + rowObject["id"] + "/bookings'
    * */

    return cellValue;
}

/**
 * format the due in column, showing how soon a column is from now
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function dueInFormatter(cellValue, options, rowObject) {

    var now = new Date();

    var timeDiffMs = rowObject[options.colModel.formatteroptions.compareTo] - now.getTime();
    var timeDiffMins = timeDiffMs / (1000 * 60);
    var alreadyStarted = false;
    if(timeDiffMins < 0) {
        timeDiffMins = timeDiffMins * -1;
        alreadyStarted = true;
    }
    var hours = Math.floor(timeDiffMins/60);
    var mins = Math.floor(timeDiffMins%60);
    var time = padHours(hours) + padMins(mins);

    if (alreadyStarted) {
        cellValue = "started " + time;
    } else {
        cellValue = time;
    }

    return cellValue;
}


/**
 * format the action column.
 *
 * this only writes out the icon, the context menu must be passed after the grid has been completed
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function actionsFormatter(cellValue, options, rowObject) {
    var container = $(options.colModel.formatteroptions.template).clone();
    var actionsIcon = container.find(".actionsIcon");

    actionsIcon
        .attr('id', options.colModel.formatteroptions.grid + '-actions-' + rowObject.id)
        .attr('title', options.colModel.formatteroptions.title + rowObject.id);

    // These attributes are only present on booking actions
    if (rowObject['bookingMode.label']) {
        actionsIcon.attr('data-booking-mode', rowObject['bookingMode.label']);
    }

    // Add booking id so job controller uses this in booking action menu
    if (rowObject['id']) {
        actionsIcon.attr('data-booking-id', rowObject['id']);
    }

    return container.html();
}

function rateFormatter(cellValue, options, rowObject) {
    var container = $(options.colModel.formatteroptions.template).clone();
    var $rateContainer = container.find(".rateContainer");
    var $rateFetcherButton = container.find(".rateFetcherButton").attr("data-contactid", rowObject.id);
    var key = App.config.booking["bookingMode.nameKey"]; // must be inperson
    var rateValues = _.isObject(cellValue) && _.isString(key) ? cellValue[key] : "";

    var standardRate = null;
    var premiumRate = null;
    var platinumRate = null;

    if (!key) {
        $rateContainer.html("summary unavailable");
    }  else if (_.isObject(rateValues)){
        standardRate = rateValues.standard;
        premiumRate = rateValues.premium;
        platinumRate = rateValues.platinum;
        $rateContainer.html(standardRate + " / " + premiumRate + " / " + platinumRate);
    }

    return container.html();
}

function marginFormatter(cellValue, options, rowObject) {
    var container = $(options.colModel.formatteroptions.template).clone();
    var $marginContainer = container.find(".marginContainer");
    var key = App.config.booking["bookingMode.nameKey"]; // It could be "inperson", "video", "phone", "mr", "cmr", "group", etc.
    var marginValues = _.isObject(cellValue) && _.isString(key) ? cellValue[key] : "";

    var standardMargin = null;
    var premiumMargin = null;
    var platinumMargin = null;

    if (!key) {
        $marginContainer.html("summary unavailable");
    } else if (_.isObject(marginValues)){
        standardMargin = marginValues.standard;
        premiumMargin = marginValues.premium;
        platinumMargin = marginValues.platinum;
        $marginContainer.html(standardMargin + "% / " + premiumMargin + "% / " + platinumMargin + "%");
    }

    return container.html();
}

/**
 * format the column containing the element to drag to the hierarchy
 *
 * @param cellValue	value of the cell
 * @param options	grid options
 * @param rowObject	representation of all columns in the row
 *
 * @returns value to show in the cell
 */
function dragRowFormatter(cellValue, options, rowObject) {

    var container = $(options.colModel.formatteroptions.template).clone();

    /*
    container.find(".draggable").draggable({
        revert: true,
        cursor: "move",
        cursorAt: { top: 0, left: 0 },
        helper: function(evt) {
            return $( "<div class='ui-widget-header'>DRAG ME BABY</div>" );
        }
    });//.attr("title", "Drag this location to a node on the hierarchy.");
    */

    container.find("i").attr("id", rowObject.id);
    container.find("i").attr("title", "Drag this location to a node on the hierarchy.");

    return container.html();
}

/**
 * UTC date formatter
 *
 * @param cellValue
 * @param options
 * @param rowObject
 * @returns {*}
 */
function utcDateFormatter(cellValue, options, rowObject) {

    var timeZone = App.config.company.config.timeZone;
    var templateHelpers = $.app.mixins.templateHelpersMixin;
    return templateHelpers.formatDate(cellValue, timeZone);

}


/**
 * make a list for a select control for the grid bascellVed on an object containing the list.
 *
 * @param arrayList object containing the different options
 *
 * @returns string representing the list to show
 */
function makeEditList(arrayList) {

    var editList = "all:";

    var listKeys = keys(arrayList);

    for (var i = 0; i < listKeys.length; i++) {

        editList += ";" + arrayList[listKeys[i]].id + ":" + arrayList[listKeys[i]].name;
    }

    return editList;
}

function makeEditListSorted(arrayList, sortBy) {

    var editList = "all:";

    arrayList = _.sortBy(arrayList, "name");

    var listKeys = keys(arrayList);

    for (var i = 0; i < listKeys.length; i++) {

        editList += ";" + arrayList[listKeys[i]].id + ":" + arrayList[listKeys[i]].name;
    }

    return editList;
}

/**
 * make a list for a select control for back grid based on an object containing the list.
 *
 * @param arrayList object containing the different options
 *
 * @returns string representing the list to show
 */
function makeBackgridEditList(arrayList) {

    var editList = new Array();

    editList.push(["all", ""]);

    var listKeys = keys(arrayList);

    for (var i = 0; i < listKeys.length; i++) {

        editList.push([arrayList[listKeys[i]].id, arrayList[listKeys[i]].name]);
    }

    return editList;
}

/**
 * make a select control from a list of objects.
 * <p>
 * each object must have an id and a name property.
 *
 * @param name (id) name to call the control
 * @param arrayList
 * @param selected id of the selected value
 * @returns {String}
 */
function makeSelectFromList(name, arrayList, selected) {

    var listKeys = keys(arrayList);

    var select = "<select id='" + name + "' name='" + name + "'>"

    for (var i = 0; i < listKeys.length; i++) {

        var selectedOn = "";
        if (selected == arrayList[listKeys[i]].id) {

            selectedOn = "selected";
        }
        select += "<option " + selectedOn + " value='" + arrayList[listKeys[i]].id + "'>" + arrayList[listKeys[i]].name + "</option>";

    }

    select += "</select>";

    return select;
}

/**
 * method to populate the grid preferences cookie so that the grid parameters and search strings
 * can be shown to the user when they return to the page.
 * <p>
 * Usually invoked from onunload method on page.
 *
 * @param jQuery selector for the grid
 */
function populateSearchDefaults(gridSelector, prefsName) {

    var postData = $(gridSelector).jqGrid('getGridParam', 'postData');

    var filtersJSON = {
        rules: []
    };

    if (postData.filters) {
        filtersJSON = JSON.parse(postData.filters);
    }

    var defaults = {};

    // populate the defaults
    for (var i = 0; i < filtersJSON.rules.length; i++) {
        defaults[filtersJSON.rules[i].field] = filtersJSON.rules[i].data;
    }

    var thePrefs = new Prefs({name: prefsName, data: {}});
    thePrefs.data = {
        defaults: defaults,
        filters: JSON.stringify(filtersJSON, null, "\t"),
        scol: $(gridSelector).jqGrid('getGridParam', 'sortname'),
        sord: $(gridSelector).jqGrid('getGridParam', 'sortorder'),
        page: $(gridSelector).jqGrid('getGridParam', 'page'),
        rows: $(gridSelector).jqGrid('getGridParam', 'rowNum')
    };

    return thePrefs;

}

/**
 * initialization for time picker in grid
 */
var timeSearchInit = function(elem) {

    $(elem).timeEntry({
        spinnerImage: '',
        ampmPrefix: ' ',
        defaultTime: new Date().clearTime(), // use current time with time cleared so always defaults to morning
        how24Hours: App.config.company.config.isTimeFormat24Hour
    });
}


var successfunc = function(rowid, data) {

    alert(rowid + ", " + data);
}

function aftersavefunc(rowid, data) {

    alert(rowid + ", " + data);
}

function errorfunc(rowid, data) {

    alert(rowid + ", " + data);
}

var bookingActionsBindings = {
    'assign': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        window.parent.location.href = App.config.context + '/booking/select/' + id;

        //$(event.target).parent("tr").attr("id")
    },
    'select': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.parent.$.colorbox({iframe:true, innerWidth:App.config.popups.msgs.width, innerHeight:App.config.popups.msgs.height, open:true, href: App.config.context + '/booking/manager/select/' + id, returnFocus: false, title: 'Select Job'});
        //$(event.target).parent("tr").attr("id")
    },
    'view-more': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });

        bookingModel.fetch({
            success: function (model, response) {

                var viewMore = new $.common.JobModalView({
                    model: model
                });
                viewMore.render();

            }
        });
    },
    'view-min': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.parent.$.colorbox({
            iframe: true,
            open: true,
            href: App.config.context + '/interpreter/offer/' + id,
            innerWidth: App.config.popups.cal.width,
            innerHeight: App.config.popups.cal.height,
            returnFocus: false,
            title: 'Available Jobs Details',
            onCleanup: function () {

            }
        });
    },
    'edit-full': function(t) {
        var id = $(t).data('booking-id');
        //window.parent.location.href = App.config.context + '/visit/edit/' + id;
        window.parent.location.href = App.config.context + '/job/edit/' + id;
        //$(event.target).parent("tr").attr("id")
    },
    'edit-in-place': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        jQuery('#' + grid).jqGrid('editRow', id, true);
    },
    'view-full': function(t) {
        //var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var id = $(t).data('booking-id');
        //window.parent.location.href = App.config.context + '/booking/show/' + id;
        window.parent.location.href = App.config.context + '/job/show/' + id;
    },
    'confirm-interpreter': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });

        bookingModel.fetch().done(function () {
            bookingModel.confirmInterpreter();
        });
    },
    'confirm-customer': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });

        bookingModel.fetch().done(function () {
            bookingModel.confirmCustomer();
        });
    },
    'confirm-requestor': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });

        bookingModel.fetch().done(function () {
            bookingModel.confirmRequestor();
        });
    },
    'close-booking': function(t) {
        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": $(t).data("bookingId")
        });
        var companyConfig = App.config.company.config;

        bookingModel.fetch({
            success: function (response) {
                var close = new $.closing.init({
                    job: bookingModel,
                    companyConfig: companyConfig,
                    debug: false
                });
                close.render();
            }
        });
    },
    'view-vos': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.parent.$.colorbox({iframe:true, innerWidth:App.config.popups.doc.width, innerHeight:App.config.popups.doc.height, open:true, href: App.config.context + '/booking/vos/' + id, returnFocus: false, title: 'Verification of Service'});
    },
    'upload-document':function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var view = new $.common.AddFileView({
            model: new  $.core.Document(),
            options: {
                parentEntityId: id,
                parentEntityClass: 'com.ngs.id.model.Booking',
                parentEntityType: 'booking',
                documentType: App.dict.documentType.vossigned.id
            }
        });
        var modal = new Backbone.BootstrapModal({
            content: view,
            okText: "Cancel",
            cancelText: ""
        });
        modal.open();
        modal.listenTo(view, 'upload:complete', function (document) {
            modal.close();
            Backbone.trigger("refreshMissingDocument");
        });
    },
    'decline-booking': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });

        bookingModel.fetch().done(function () {

            var view = new $.common.BookingDeclineView({
                model: bookingModel
            });
            view.render();
        });
    },
    'decline-offer': function(t) {

        // TODO: this is no longer used. confirm.
        var jobOffers, jobOffer, jobId, filters;
        jobId = t.id.substr(t.id.lastIndexOf("-") + 1);

        // Logic here: we know the job id and contact id, so we do a query for all joboffers filtered by those parameters.
        // There should only be one result. Get it, set the declined flag, and PUT it back.
        jobOffers = new $.core.JobOfferCollection();

        filters = {
            "rules":
                [{
                    "field": "job.id",
                    "op": "eq",
                    "data": jobId
                }, {
                    "field": "interpreter.id",
                    "op": "eq",
                    "data": App.config.interpreter.id
                }]
        };

        jobOffers.queryParams.filters = JSON.stringify(filters);
        jobOffers.fetch().done(function () {
            if (jobOffers.length === 1) {
                jobOffer = jobOffers.at(0)
                jobOffer.set("declined", true);
                jobOffer.save().done(function () {
                    handleSuccess(jobOffer);
                    // TODO decouple this from the offered bookings table?
                    // Perhaps use a marionette event.
                    $("#offered-bookings").trigger('reloadGrid');
                }).fail(function (response) {
                    handleError({}, response);
                });
            } else {
                // We either have no job offers with that job and terp, or more than one.
                // Either one indicates an unrecoverable error.
                handleError({}, { status: 'ERROR',
                    message: 'Unexpected number of job offers found',
                    actual: 'Unexpected number of job offers found',
                    errors: []
                });
            }
        }).fail(function (response) {
            // Failed fetching job offers
            handleError({}, response);
        });
    },
    'cancel-booking': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });

        bookingModel.fetch().done(function () {
            var view = new $.common.BookingCancelView({
                model: bookingModel
            });
            view.render();
        });
    },

    'repeat':function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });

        bookingModel.fetch().done(function () {
                var visitModel = $.core.JobModel.findOrCreate({
                    id: bookingModel.get("visit").id
                });

                visitModel.fetch().done(function () {
                    var view = new $.common.VisitRepeatView({
                        disableVos: true,
                        model: visitModel
                    });
                    view.render();
                });
        });
    },

    'duplicate': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });
        bookingModel.fetch().done(function () {
            var visitModel = $.core.JobModel.findOrCreate({
                id: bookingModel.get("visit").id
            });
            visitModel.createFollowUp();
        });
    },

    'clone': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        var bookingModel = new $.visit.v2.InterpreterVisitModel({
            "id": id
        });
        bookingModel.fetch().done(function () {
            var visitModel = $.core.JobModel.findOrCreate({
                id: bookingModel.get("visit").id
            });
            visitModel.duplicate();
        })
    },

    'delete': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        if (confirm("Are you sure you want to delete the interpreter Job?\n\nThis action is not reversible.")) {

            //window.location.href = App.config.context + '/booking/delete/' + id;
            var booking = new $.core.Booking({id: id});
            booking.destroy(popupFetchOptions);

        };
    },
    'verify': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $('#' + grid).jqGrid('editRow',id, true);
        $('#' + grid).jqGrid('saveRow',id, /*succesfunc*/function() { $("#ui-datepicker-div").hide(); $('#' + grid).jqGrid().trigger('reloadGrid'); });//, url, extraparam, aftersavefunc,errorfunc, afterrestorefunc);

    },
    'prepare-payment': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.parent.$.colorbox({iframe:true, innerWidth: App.config.popups.app.width, innerHeight: App.config.popups.app.height, open:true, href: App.config.context + '/payment/preprepare/' + id, returnFocus: false, title: 'Prepare Job for Payment'});
    },
    'prepare-invoice': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.parent.$.colorbox({iframe:true, innerWidth: App.config.popups.app.width, innerHeight: App.config.popups.app.height, open:true, href: App.config.context + '/invoice/preprepare/' + id, returnFocus: false, title: 'Prepare Job for Invoice'});
    },
    'unverify': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.ajax({
            url: App.config.context + '/booking/manager/unverify',
                dataType: 'json',
                data: {
                id: id,
                    "company.id": App.config.company.id
                },
                success: function(doc) {

                    $("#" + grid).jqGrid().trigger('reloadGrid');

                },
                error: function(doc) {

                    alert("an error occurred un verifying the booking.");

                }
        }); //end $.ajax
    },
    'create-interaction': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        //var contactIds = [id];

        //var target = JSON.stringify(contactIds);

        $.colorbox({
            iframe:true,
            innerWidth:App.config.popups.message.width,
            innerHeight:App.config.popups.message.height,
            open:false,
            returnFocus: false,
            title: 'New Interaction',
            href: App.config.context + '/interaction/quickadd/?job.id=' + id
        });
    },
    'preview-invoice': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        var bookingsParams = "&bookings.id=" + id;

        window.parent.$.colorbox({iframe:true, innerWidth: App.config.popups.app.width, innerHeight: App.config.popups.app.height, open:true, href: App.config.context + '/invoice/preview/?customer.id=' + $("#customers").jqGrid('getGridParam', 'selrow') + bookingsParams + '&periodStart=' + $("#periodStart").val() + '&periodEnd=' + $("#periodEnd").val(), returnFocus: false, title: 'Preview Invoice'});
    },
    'preview-payment': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        var bookingsParams = "&bookings.id=" + id;

        window.parent.$.colorbox({iframe:true, innerWidth: App.config.popups.app.width, innerHeight: App.config.popups.app.height, open:true, href: App.config.context + '/payment/preview/?interpreter.id=' + $("#interpreters").jqGrid('getGridParam', 'selrow') + bookingsParams + '&periodStart=' + $("#periodStart").val() + '&periodEnd=' + $("#periodEnd").val(), returnFocus: false, title: 'Preview Payment'});
    },
    'post': function(t) {
        alert("Coming soon.");
    },
    'close': function(t) { },
    'start-video': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        window.parent.location.href = App.config.context + '/scheduledVideo/proxy/' + id;
    }
};

var bookingUpdatesActionsBindings = {
    'archive': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.ajax({
            url: App.config.context + '/api/booking/audit/' + id,
            dataType: 'json',
            type: 'PUT',
            success: function(doc) {

                // update all grids on page
                jQuery(".ui-jqgrid-btable").trigger('reloadGrid');

            },
            error: function(xhr, status, error) {

                handleError({}, xhr);

            }
        }); //end $.ajax
    }
};

var paymentActionsBindings = {
    'view': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.colorbox({iframe:true, innerWidth: App.config.popups.app.width, innerHeight: App.config.popups.app.height, open:true, href: App.config.context + '/payment/show/' + id, returnFocus: false, title: 'View Payment'});

    },
    'history': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.colorbox({iframe:false, open:true, href: App.config.context + '/payment/history/' + id, returnFocus: false, title: 'Payment History'});

    },
    'refresh': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.ajax({
            url: App.config.context + '/payment/refresh',
            dataType: 'json',
            data: {
                id: id,
                "company.id": App.config.company.id
            },
            success: function(doc) {

                $("#" + grid).jqGrid().trigger('reloadGrid');

            },
            error: function(doc) {

                alert("an error occurred refreshing the payment.");

            }
        }); //end $.ajax

    },
    'delete': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        if (confirm("Are you sure you want to delete the payment?\n\nThis action is not reversible.")) {

            $.ajax({
                url: App.config.context + '/payment/delete',
                dataType: 'json',
                data: {
                    id: id,
                    "company.id": App.config.company.id
                },
                success: function(doc) {

                    $("#" + grid).jqGrid().trigger('reloadGrid');

                },
                error: function(doc) {

                    alert("an error occurred deleting the payment.");

                }
            }); //end $.ajax
        }

    },
    'close': function(t) {
    }
};

var invoiceActionsBindings = {
    'view': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.colorbox({iframe:true, innerWidth: App.config.popups.app.width, innerHeight: App.config.popups.app.height, open:true, href: App.config.context + '/invoice/show/' + id, returnFocus: false, title: 'View Invoice'});

    },
    'history': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.colorbox({iframe:false, open:true, href: App.config.context + '/invoice/history/' + id, returnFocus: false, title: 'Invoice History'});

    },
    'refresh': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.ajax({
            url: App.config.context + '/invoice/refresh',
            dataType: 'json',
            data: {
                id: id,
                "company.id": App.config.company.id
            },
            success: function(doc) {

                $("#" + grid).jqGrid().trigger('reloadGrid');

            },
            error: function(doc) {

                alert("an error occurred refreshing the invoice.");

            }
        }); //end $.ajax

    },
    'inline': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        $.colorbox({iframe:true, innerWidth: App.config.popups.app.width, innerHeight: App.config.popups.app.height, open:true, href: App.config.context + '/invoice/inline/' + id, returnFocus: false, title: 'View Invoice'});

    },
    'delete': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        if (confirm("Are you sure you want to delete the invoice?\n\nThis action is not reversible.")) {

            $.ajax({
                url: App.config.context + '/invoice/delete',
                dataType: 'json',
                data: {
                    id: id,
                    "company.id": App.config.company.id
                },
                success: function(doc) {

                    $("#" + grid).jqGrid().trigger('reloadGrid');

                },
                error: function(doc) {

                    alert("an error occurred deleting the invoice.");

                }
            }); //end $.ajax
        }

    },
    'close': function(t) {
    }
};

var addressActionsBindings = {
    'validate': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        //validate
        //$.colorbox({iframe:true, width: 900, height: 900, open:true, href: App.config.context + '/invoice/show/' + id, returnFocus: false, title: 'View Invoice'});
        $.colorbox({
                innerWidth: "1010",
                iframe: false,
                open: true,
                //inline: true,
                href: App.config.context + '/address/geocode/' + id,
                onCleanup: function() {

                    var addrFormatted = $("#geocoder #address\\.addrFormatted").val();
                    var lat = $("#geocoder #address\\.lat").val();
                    var lng = $("#geocoder #address\\.lng").val();
                    var valid = $("#geocoder #address\\.valid").val();
                    var validationStatus = $("#geocoder #address\\.validationStatus").val();

                    //alert(addrFormatted + ", " + lat + ", " + lng + ", " +  valid + ", " +  validationStatus);
                    //alert($("#" + grid + " " + id).html());

                    //var rows= $("#" + grid).jqGrid('getRowData');
                    $("#" + grid).setCell(id, "addrFormatted", addrFormatted);
                    $("#" + grid).setCell(id, "lat", lat);
                    $("#" + grid).setCell(id, "lng", lng);
                    $("#" + grid).setCell(id, "valid", valid);
                    $("#" + grid).setCell(id, "validationStatus", validationStatus);

                    $('#' + grid).jqGrid('editRow',id, true);
                    $('#' + grid).jqGrid('saveRow',id, /*succesfunc*/function() { $('#' + grid).jqGrid().trigger('...reloadGrid'); });//, url, extraparam, aftersavefunc,errorfunc, afterrestorefunc);

                }
            });
    },
    'view-map': function(t) {

        alert("Coming soon.");
    },
    'close': function(t) {
    }
};

var userActionsBindings = {

    'roles': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        alert("coming soon");
    },
    'actions': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        alert("coming soon");
    },
    'access': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        alert("coming soon");
    },
    'close': function(t) {
    }
};

var contactActionsBindings = {

    'view-more': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        $.colorbox({iframe:true, innerWidth:App.config.popups.legacy.width, innerHeight:App.config.popups.legacy.height, open:true, href: App.config.context + '/contact/bare/' + id + '#ssstabs-5', maxHeight: '500px', returnFocus: false, title: 'Contact Details'});
    },
    'edit-full': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.location.href = App.config.context + '/contact/edit/' + id;
    },
    'edit-in-place': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        jQuery('#' + grid).jqGrid('editRow', id, true);
    },
    'bookings': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var presetFilters = [{
            field: "interpreters",
            op: "eq",
            data: id
        }];
        var bookings = new $.visit.v2.InterpreterVisitCollection();
        $("#modalContainer").modal("show");
        var calendarView = new $.common.CalendarView({
            el: $("#modalContainer"),
            showExport: true,
            collection: bookings,
            key: "InterpreterBookingsPopUp",
            eventBinding: "job",
            presetFilters: presetFilters,
            view: 'month',
            templateFile: "common/calendar/modalcalendar"
        });
        calendarView.render();
    },
    'delete': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        if (confirm("Are you sure you want to delete the contact?\n\nThis action is not reversible.")) {

            //window.location.href = App.config.context + '/contact/delete/' + id;

            var contact = new $.core.Contact({id: id});
            contact.destroy(popupFetchOptions);
        }
    },
    'create-interaction': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        //var contactIds = [id];

        //var target = JSON.stringify(contactIds);

        $.colorbox({
            iframe:true,
            innerWidth:App.config.popups.message.width,
            innerHeight:App.config.popups.message.height,
            open:false,
            returnFocus: false,
            title: 'New Interaction',
            href: App.config.context + '/interaction/quickadd/?interpreter.id=' + id
        });
    },
    'send-message': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        var contactIds = [id];

        var target = encodeURIComponent(JSON.stringify(contactIds));

        $.colorbox({
            iframe:true,
            innerWidth:App.config.popups.message.width,
            innerHeight:App.config.popups.message.height,
            open:false,
            returnFocus: false,
            title: 'Message form',
            href: App.config.context + '/admin/message?target=' + target
        });
    },
    'view-map': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        //TODO: fix so this can be passed as parameter rather than hardcoded
        $.booking.assign.frame.viewOnMap(id);

    },
    'view-bookings': function(t) {

        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        var grid = t.id.substr(0, t.id.indexOf("-"));

        var intName = jQuery('#' + grid).jqGrid ('getCell', id, 'name');
        $.booking.assign.frame.viewBookings(id, intName);
    },
    'assign': function(t) {

        var interpreterId = t.id.substr(t.id.lastIndexOf("-") + 1);
        // TODO: access this via model directly, parameter or container
        var jobId = $("#id").val();

        if ($.visit && $.visit.v2 && $.visit.v2.frame){
            var visit = $.visit.v2.frame.getVisit();

            //TODO: this makes me cry
            if (!visit.id) {
                // Shouldn't happen.
                handleActionError({message: "Please save the job first."});
            } else {
                $("#assignForm #id").val(visit.id);
                $("#assignForm #interpreter\\.id").val(interpreterId);
                $("#assignForm").trigger("submit");
            }

        } else {

            var interpreterJob = new $.visit.v2.InterpreterVisitModel({id: jobId});

            // fetch the job
            // TODO: remove this when have direct access to the model
            interpreterJob.fetch().done(function() {

                // if more than 1 job in recurring group
                if (interpreterJob.get("numJobs") > 1) {

                    var assignView = new $.common.RecurringBookingGroupAssignView({
                        model: interpreterJob,
                        // options for assign
                        "interpreter.id": interpreterId,
                        "ignoreAssignment": true,
                        "returnUrl": $("input[name=context]").val() // TODO: find a way to pass this
                    });

                    var modalView = new Backbone.BootstrapModal({
                        title: "Recurring Job Assignment",
                        content: assignView,
                        okText: "Assign",
                        cancelText: "Cancel"
                    });

                    modalView.open();

                } else {

                    interpreterJob.assign({
                        "interpreter.id": interpreterId,
                        "ignoreAssignment": true,
                        "returnUrl": $("input[name=context]").val() // TODO: find a way to pass this
                    });
                }

            });

        }
    },
    'close': function(t) {

    },
    'mark-unavailable': function(t) {
        var jobId = $("#id").val();
        var interpreterId = t.id.substr(t.id.lastIndexOf("-") + 1);

        $.colorbox({
            iframe:true,
            innerWidth:App.config.popups.message.width,
            innerHeight:App.config.popups.message.height,
            open:false,
            returnFocus: false,
            title: 'Mark Unavailable',
            href: App.config.context + '/interaction/preMarkUnavailable?job.id=' + jobId + '&interpreter.id=' + interpreterId + '&createDeclinedOffer=' + $("#mark-unavailable").data("assign_page")
        });
    },
    'offer-email': function(t) {
        var jobId = $("#id").val();
        var interpreterId = t.id.substr(t.id.lastIndexOf("-") + 1);

        $.colorbox({
            iframe: true,
            innerWidth: App.config.popups.msgs.width,
            innerHeight: App.config.popups.msgs.height,
            open: false,
            href: App.config.context + '/booking/preNotify/' + jobId + "?contact.id="+interpreterId,
            returnFocus: false,
            title: 'Offer Interpreters',
            onClosed: function () {
                $("#"+interpreterId).addClass("updated");
            }
        });
    },
    'offer-sms': function(t) {
        var jobId = $("#id").val();
        var interpreterId = t.id.substr(t.id.lastIndexOf("-") + 1);

        $.colorbox({
            iframe: true,
            innerWidth: App.config.popups.msgs.width,
            innerHeight: App.config.popups.msgs.height,
            open: false,
            href: App.config.context + '/booking/preNotifySms/' + jobId + "?contact.id="+interpreterId,
            returnFocus: false,
            title: 'Offer Interpreters',
            onClosed: function () {
                $("#"+interpreterId).addClass("updated");
            }
        });
    },
    'called': function(t) {
        var jobId = $("#id").val();
        var interpreterId = t.id.substr(t.id.lastIndexOf("-") + 1);

        $.colorbox({
            iframe: true,
            innerWidth: App.config.popups.msgs.width,
            innerHeight: App.config.popups.msgs.height,
            open: false,
            href: App.config.context + '/booking/preNotifyCall/' + jobId + "?contact.id="+interpreterId,
            returnFocus: false,
            title: 'Offer Interpreters',
            onClosed: function () {
                $("#"+interpreterId).addClass("updated");
            }
        });

    },
    'voice-message': function(t) {
        var jobId = $("#id").val();
        var interpreterId = t.id.substr(t.id.lastIndexOf("-") + 1);

        $.colorbox({
            iframe: true,
            innerWidth: App.config.popups.msgs.width,
            innerHeight: App.config.popups.msgs.height,
            open: false,
            href: App.config.context + '/booking/preNotifyVoiceMessage/' + jobId + "?contact.id="+interpreterId,
            returnFocus: false,
            title: 'Offer Interpreters',
            onClosed: function () {
                $("#"+interpreterId).addClass("updated");
            }
        });
    },

    'view-offers': function(t) {
        var contactId = t.id.substr(t.id.lastIndexOf("-") + 1);
        var fullContact = $.core.Contact.findOrCreate({
            id: contactId
        });

        fullContact.fetch({
            success: function (model, response) {
                $("#modalContainer").modal("show");
                var jobOffersCollection = new $.core.JobOfferCollection();
                var jobOffersView = new $.common.JobOffersForContactView({
                    el: $("#modalContainer"),
                    contactId: contactId,
                    contactName: model.get("displayName"),
                    collection: jobOffersCollection
                });
                jobOffersView.render();
            },
            error: function (model, response) {
                handleActionError({
                    message: "An error was encountered retrieving the contact. Please contact the administrator if the problem persists."
                });
            }
        });
    }
};

var customerActionsBindings = {

    'view': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        $.colorbox({iframe:true, innerWidth:App.config.popups.cal.width, innerHeight:App.config.popups.cal.height, open:true, href: App.config.context + '/customer/bare/' + id + '#ssstabs-5', maxHeight: '500px', returnFocus: false, title: 'Customer Details'});
    },
    'edit-full': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.location.href = App.config.context + '/customer/edit/' + id;
    },
    'view-full': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.location.href = App.config.context + '/customer/show/' + id;
    },
    'bookings': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        //$.colorbox({iframe:true, innerWidth:App.config.popups.cal.width, innerHeight:App.config.popups.cal.height, open:false, returnFocus: false, title: 'Customer Job', href: App.config.context + '/calendar/customer/' + id + '/bookings'});
        var presetFilters = [{
            field: "customer.id",
            op: "eq",
            data: id
        }];
        var bookings = new $.visit.v2.InterpreterVisitCollection();
        $("#modalContainer").modal("show");
        var calendarView = new $.common.CalendarView({
            el: $("#modalContainer"),
            showExport: true,
            collection: bookings,
            key: "InterpreterBookingsPopUp",
            eventBinding: "job",
            presetFilters: presetFilters,
            view: 'month',
            templateFile: "common/calendar/modalcalendar"
        });
        calendarView.render();
    },
    'create-booking': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.location.href = App.config.context + '/booking/create/?customer.id=' + id;
    },
    'create-interaction': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        //var contactIds = [id];

        //var target = JSON.stringify(contactIds);

        $.colorbox({
            iframe:true,
            innerWidth:App.config.popups.message.width,
            innerHeight:App.config.popups.message.height,
            open:false,
            returnFocus: false,
            title: 'New Interaction',
            href: App.config.context + '/interaction/quickadd/?customer.id=' + id
        });
    },
    'delete': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        if (confirm("Are you sure you want to delete the customer?\n\nThis action is not reversible.")) {

            //window.location.href = App.config.context + '/customer/delete/' + id;

            var customer = new $.core.Customer({id: id});
            customer.destroy(popupFetchOptions);

        }
    },
    'close': function(t) {
    }
};


var consumerActionBindings = {

    'view': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        $.colorbox({iframe:true, innerWidth:App.config.popups.cal.width, innerHeight:App.config.popups.cal.height, open:true, href: App.config.context + '/consumer/bare/' + id + '#ssstabs-5', maxHeight: '500px', returnFocus: false, title: 'Consumer Details'});
    },
    'edit-full': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.location.href = App.config.context + '/consumer/edit/' + id;
    },
    'create-interaction': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        //var contactIds = [id];

        //var target = JSON.stringify(contactIds);

        $.colorbox({
            iframe:true,
            innerWidth:App.config.popups.message.width,
            innerHeight:App.config.popups.message.height,
            open:false,
            returnFocus: false,
            title: 'New Interaction',
            href: App.config.context + '/interaction/quickadd/?consumer.id=' + id
        });
    },
    'delete': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        if (confirm("Are you sure you want to delete the consumer?\n\nThis action is not reversible.")) {
            var consumer = new $.core.Consumer({id: id});
            consumer.destroy(popupFetchOptions);
        }
    },
    'close': function(t) {
    }
};

var interactionActionBindings = {

    'view': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        $.colorbox({iframe:true, innerWidth:App.config.popups.cal.width, innerHeight:App.config.popups.cal.height, open:true, href: App.config.context + '/interaction/bare/' + id + '#ssstabs-5', maxHeight: '500px', returnFocus: false, title: 'Interaction Details'});
    },
    'edit-full': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.location.href = App.config.context + '/interaction/edit/' + id;
    },
    'delete': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        if (confirm("Are you sure you want to delete the interaction?\n\nThis action is not reversible.")) {
            var interaction = new $.core.Interaction({id: id});
            interaction.destroy(popupFetchOptions);
        }
    },
    'close': function(t) {
    },
    'close-interaction': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);

        var interactionModel = new $.core.Interaction({id: id});

        interactionModel.fetch().done(function () {
            interactionModel.set({
                "status": {id:2}, "unread" : false
            }, {
                silent: true
            });

            interactionModel.save(null, popupFetchOptions);
        }).fail(function () {
            handleActionError({
                message: "An error was encountered retrieving the interaction. Please contact the administrator if the problem persists."
            });
        });
    }
};

var requestorActionBindings = {

    'view': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        $.colorbox({iframe:true, innerWidth:App.config.popups.cal.width, innerHeight:App.config.popups.cal.height, open:true, href: App.config.context + '/requestor/bare/' + id + '#ssstabs-5', maxHeight: '500px', returnFocus: false, title: 'Requestor Details'});
    },
    'edit-full': function(t) {
        var id = t.id.substr(t.id.lastIndexOf("-") + 1);
        window.location.href = App.config.context + '/requestor/edit/' + id;
    }
};

// why is this global?
var actionsMenu;

/**
 * invoked after a job has been placed on the calendar in its final position. the method is used to attach
 * any handlers to the job.
 *
 * @param event the job (calendar event) being displayed on the calendar
 * @param element DOM element container displaying the job
 * @param view info about the current calendar view
 * @param collection collection of jobs being displayed
 * @param groupAttr distinguishing attribute to pull from job to distinguish / group elements
 */
function calendarEventBindings(event, element, view, collection, groupAttr) {

    // set the id on the element for the job actions
    $(element).attr("id", event.title + "-actions-" + event[groupAttr]);

    // add common class for selection later on. this class is used to look up and add / remove another class
    $(element).addClass("calendarGroup-" + event[groupAttr]);

    // insert icon prior to description
    if (App.dict.bookingMode['phone'] && event['bookingMode.id'] === App.dict.bookingMode['phone'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-phone'></i>");
    } else if (App.dict.bookingMode['phoneScheduled'] && event['bookingMode.id'] === App.dict.bookingMode['phoneScheduled'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-phone'></i>");
    } else if (App.dict.bookingMode['video3rd'] && event['bookingMode.id'] === App.dict.bookingMode['video3rd'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-video'></i>");
    } else if (App.dict.bookingMode['phone3rd'] && event['bookingMode.id'] === App.dict.bookingMode['phone3rd'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-video'></i>");
    } else if (App.dict.bookingMode['opi'] && event['bookingMode.id'] === App.dict.bookingMode['opi'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-phone'></i>");
    } else if (App.dict.bookingMode['video'] && event['bookingMode.id'] === App.dict.bookingMode['video'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-facetime-video'></i>");
    } else if (App.dict.bookingMode['vri'] && event['bookingMode.id'] === App.dict.bookingMode['vri'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-facetime-video'></i>");
    } else if (App.dict.bookingMode['inperson'] && event['bookingMode.id'] === App.dict.bookingMode['inperson'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-user'></i>");
    } else if (App.dict.bookingMode['mr'] && event['bookingMode.id'] === App.dict.bookingMode['mr'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-envelope'></i>");
    } else if (App.dict.bookingMode['cmr'] && event['bookingMode.id'] === App.dict.bookingMode['cmr'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-envelope'></i>");
    } else if (App.dict.bookingMode['court'] && event['bookingMode.id'] === App.dict.bookingMode['court'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-legal'></i>");
    } else if (App.dict.bookingMode['conference'] && event['bookingMode.id'] === App.dict.bookingMode['conference'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-group'></i>");
    } else if (App.dict.bookingMode['group'] && event['bookingMode.id'] === App.dict.bookingMode['group'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-group'></i>");
    } else if (App.dict.bookingMode['simultaneous'] && event['bookingMode.id'] === App.dict.bookingMode['simultaneous'].id) {
        $(element).find('.fc-event-time').append(" <i class='icon icon-group'></i>");
    } else {
        $(element).find('.fc-event-time').append(" <i class='icon icon-asterisk'></i>");
    }

    // save event with different name to use in following qtip definition
    var calEvt = event;

    // add qtip popup to job
    element.qtip({
        //content: event.description,
        content: {
            text: 'Loading ...',
            button: true
        },
        style: {
            name: 'light'
        },
        position: {
            corner: {
                target: 'centerMiddle',
                tooltip: 'leftTop'
            },
            adjust: {
                screen: true
            }
        },
        show: {
            delay: 250
        },
        api: {
            // Retrieve the content when tooltip is first rendered
            onRender: function () {

                var that = this;

                // fetch job and render popup view
                var job = new $.visit.v2.InterpreterVisitModel({id: calEvt.id});
                var jobPopupView = new $.common.CalendarJobPopupView({model: job});
                job.fetch({
                    beforeSend: function () {
                        // hide loader for usability. don't want to show loader as user moves mouse over calendar quickly
                        $("#loader").hide();
                    },
                    success: function() {
                        that.updateContent(jobPopupView.el, true);
                    }
                });

            }
        }
    });

    var frameConfig = new Backbone.Model({
        companyConfig: '',
        customerConfig: '',
        customerNotes: '',
        jobCreateEnabled: '',
        jobUpdateEnabled: '',
        isView: '',
        originalVisitId: '',
        createOrigin: '',
        jobContextId: '',
        preventEditing: ''
    });

    // attach job actions
    $(element).on("click", function(e) {
        if(actionsMenu){
            actionsMenu.undelegateEvents();
        }

        $("#actions").empty();
        var id = event.id;
        var job = collection.get(id);
        actionsMenu = new $.common.CalendarJobActionsView({
            el: "#actions",
            model: job,
            frameConfig: frameConfig
        });
        actionsMenu.render();
        $("#actions").css({
            position: "absolute",
            display: "block",
            left: e.pageX,
            top: e.pageY
        });
        $("#calendarActions").css({
            display: "block"
        });
        return false;
    });

    $(document).click(function(){
        $("#actions").css({
            display: "none"
        });

    });

    // add hover effect to group similar elements
    $(element).hover(function() {
        $(".calendarGroup-" + event[groupAttr]).addClass("calendarGroup-hover");

    }, function() {
        $(".calendarGroup-" + event[groupAttr]).removeClass("calendarGroup-hover");

    });
};

function calendarLoading(bool) {

  if (bool) {

     $("#calendar").addClass("curtain");

  } else {

      $("#calendar").removeClass("curtain");

    var evts = $(this).fullCalendar('clientEvents');
    if (evts.length == 0) {

        //remove any existing one
            $("#calendar .fc-header-title h2 div.alert").remove();
            $("#calendar .fc-header-title h2").append("<div class='alert alert-warn' style='text-align: center;'>No Jobs Found</div>");

        } else {

              //remove old error message
            $("#calendar .fc-header-title h2 div.alert").remove();

          }
    }
}

/**
 * populate the events array based on the response from the server
 */
function initializeCalendarEvents(doc) {

    var events = [];

    for (var i = 0; i < doc.rows.length; i++) {

        var cl = '';
        if (doc.rows[i]["status.id"] == App.dict.bookingStatus['new'].id) {
            cl = '#FF8300'; //orange
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['open'].id) {
            cl = '#6B119C'; //purple
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['assigned'].id) {
            cl = '#5e5e5f'; //grey
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['confirmed'].id) {
            cl = '#00af33'; //green
        //} else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['verified'].id) {
        //    cl = '#5aa500'; //verified
        } else 	if (doc.rows[i]["status.id"] == App.dict.bookingStatus['declined'].id) {
            cl = '#D00072'; //magenta
        } else 	 if (doc.rows[i]["status.id"] == App.dict.bookingStatus['nonattendance'].id) {
            cl = '#fcd116'; //yellow
        } else	if (doc.rows[i]["status.id"] == App.dict.bookingStatus['cancelled'].id) {
            cl = '#fe2600'; //red
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['closed'].id) {
            cl = '#0010da'; //blue
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['offered'].id) {
            cl = '#01C4CD'; //light blue
        }

        var promotedRef = _.find(doc.rows[i].refs, function(ref) { return ref && ref.config && ref.config.promote });

        var displayLabel;

        if (promotedRef) {

            displayLabel = promotedRef.ref + " (" + "#" + doc.rows[i].id + ")";

        } else {

            displayLabel = "#" + doc.rows[i].id + " - ";
        }
        /*
        if (doc.rows[i].isTelephoneTranslation == true) {
            displayLabel += "Phone:";

        }  else if (doc.rows[i]['bookingMode.id'] = App.dict.bookingMode['video'].id) {

            displayLabel += "Video:";

        } else {
            displayLabel += "";
        }
        */

        if (doc.rows[i].actualLocationDisplayLabel != null) {

            displayLabel = displayLabel + " " + doc.rows[i].actualLocationDisplayLabel;
            if (displayLabel.length > 25) {
                displayLabel = displayLabel.substring(0, 22);
                displayLabel = displayLabel + "...";
            }
        }
        if (doc.rows[i].language != null) {

            displayLabel = displayLabel + " (" + doc.rows[i].languageCode + ")";
        }

        events.push({
            id: doc.rows[i].id,
            title: displayLabel, //lang & int
            start: (new Date(doc.rows[i].expectedStartDateMs).getTime()) / 1000,
            end: (new Date(doc.rows[i].expectedEndDateMs).getTime()) / 1000,
            editable: true,
            allDay: false,
            color: cl,
            description: getEventDescription(doc.rows[i]),
            "interpreter.id": doc.rows[i]["interpreter.id"],
            "bookingMode.id": doc.rows[i]["bookingMode.id"],
            "visit.id": doc.rows[i]["visit.id"],
            "preventEdit": doc.rows[i]["preventEdit"],
            "userEditing": doc.rows[i]["userEditing"],
            "startEditing": doc.rows[i]["startEditing"]
        });
     }

    return events;
};


function initializeSchedulerEventsJSON(bookings){
    var events = [];
    for (var i =0; i<bookings.length; i++){
        events.push(initializeSchedulerEventJSON(bookings[i]));
    }
    return events;
}
function initializeSchedulerEventJSON(booking) {
    var status = '';
    var cl = '';
    if (booking.attributes.status.id == App.dict.bookingStatus['new'].id) {
        cl = '#FF8300'; //orange
        status = "Unassigned";
    } else if (booking.attributes.status.id == App.dict.bookingStatus['open'].id) {
        cl = '#6B119C'; //purple
        status = "Unassigned";
    } else if (booking.attributes.status.id == App.dict.bookingStatus['assigned'].id) {
        cl = '#5e5e5f'; //grey
    } else if (booking.attributes.status.id == App.dict.bookingStatus['confirmed'].id) {
        cl = '#00af33'; //green
        //} else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['verified'].id) {
        //    cl = '#5aa500'; //verified
    } else 	if (booking.attributes.status.id == App.dict.bookingStatus['declined'].id) {
        cl = '#D00072'; //magenta
    } else 	 if (booking.attributes.status.id == App.dict.bookingStatus['nonattendance'].id) {
        cl = '#fcd116'; //yellow
    } else	if (booking.attributes.status.id == App.dict.bookingStatus['cancelled'].id) {
        cl = '#fe2600'; //red
    } else if (booking.attributes.status.id == App.dict.bookingStatus['closed'].id) {
        cl = '#0010da'; //blue
    } else if (booking.attributes.status.id == App.dict.bookingStatus['offered'].id) {
        cl = '#01C4CD'; //light blue
        status = "Offered";
    }

    var promotedRef = _.find(booking.attributes.refs, function(ref) { return ref && ref.config && ref.config.promote });

    var displayLabel;

    if (promotedRef) {

        displayLabel = promotedRef.ref + " (" + "#" + booking.attributes.id + ")";

    } else {

        displayLabel = "#" + booking.attributes.id + " - ";
    }
    /*
     if (doc.rows[i].isTelephoneTranslation == true) {
     displayLabel += "Phone:";

     }  else if (doc.rows[i]['bookingMode.id'] = App.dict.bookingMode['video'].id) {

     displayLabel += "Video:";

     } else {
     displayLabel += "";
     }
     */
    if (booking.attributes.actualLocation && booking.attributes.actualLocation.displayLabel != null) {

        displayLabel = displayLabel + " " + booking.attributes.actualLocation.displayLabel;
        if (displayLabel.length > 25) {
            displayLabel = displayLabel.substring(0, 22);
            displayLabel = displayLabel + "...";
        }
    }
    /* if (booking[i].attributes.language != null) {

     displayLabel = displayLabel + " (" + booking[i].attributes.language.iso639_3Tag + ")";
     } */

    return {
        id: booking.id,
        title: displayLabel, //lang & int
        start: Date.fromISOString(booking.attributes.expectedStartDate),
        end: Date.fromISOString(booking.attributes.expectedEndDate),
        editable: false,
        allDay: false,
        color: cl,
        status: booking.attributes.status.name,
        resourceId: booking.attributes.interpreter ? booking.attributes.interpreter.id : booking.id,
        description: getEventDescriptionJSON(booking.attributes),
        "interpreter.id": booking.attributes.interpreter ? booking.attributes.interpreter.id : null,
        "bookingMode.id": booking.attributes.bookingMode.id,
        "visit.id": booking.attributes.visit.id,
        "preventEdit": booking.attributes.preventEdit,
        "userEditing": booking.attributes.userEditing,
        "startEditing": booking.attributes.startEditing,
        "customer.id": booking.attributes.customer.id
    };
}

function initializeAvailabilityEventsJSON(availabilities, startDate, endDate){
    var sundayMidnight = moment(startDate).startOf("week");
    // calculate for how many weeks we are going to generate events
    var weeks = moment(endDate).diff(sundayMidnight, "weeks");

    var events = [];
    for (var i = 0; i <= weeks; i++) {
        var start = moment(startDate).add(i, "week").toDate();
        availabilities.forEach(function (availability) {
            events.push(initializeAvailabilityEventJSON(availability, start));
        });
    }

    return events;
}
function initializeAvailabilityEventJSON(availability, startDate) {
    var sundayMidnight = moment(startDate).startOf("week");
    var start = sundayMidnight
        .clone()
        .add(availability.get("offset"), "minutes")
        .subtract(new Date().getTimezoneOffset(), "minutes")
        .toDate();
    var end = moment(start)
        .add(availability.get("length"), "minutes")
        .subtract(1, "second")
        .toDate();

    // description for pop-over
    var description = availability.attributes.type ? availability.attributes.type.name : "Recurring Availability";
    if (availability.attributes.notes) {
        description += ": " + availability.attributes.notes;
    }

    return {
        id: availability.id,
        title: availability.attributes.type ? availability.attributes.type.name : "Recurring Availability",
        description: description,
        type: availability.attributes.type,
        available: availability.attributes.type ? availability.attributes.type.available : true, // if no type, assume to be available
        recurring: true, // flag as recurring
        start: start,
        end: end,
        editable: false,
        allDay: false,
        className: !(availability.attributes.type) ? "scheduler-availability" : "", // set class if no type
        resourceId: availability.attributes.interpreter ? availability.attributes.interpreter.id : availability,
        rendering: 'background',
        dow: null,
        color: availability.attributes.type ? availability.attributes.type.colorHex : ""
    };
}

function initializeAvailabilityRangeEventsJSON(nonAvailabilities){
    var events = [];
    for (var i =0; i<nonAvailabilities.length; i++){
        events.push(initializeAvailabilityRangeEventJSON(nonAvailabilities[i]));
    }
    return events;
}
function initializeAvailabilityRangeEventJSON(availabilityRange) {
    var cl = "#";
    if (availabilityRange.attributes.type) {
        // if (nonAvailability.attributes.description.name == "Time Off") {
        //     cl += "35aa25";
        // } else if (nonAvailability.attributes.description.name == "Day Off") {
        //     cl += "ffff00";
        // } else if (nonAvailability.attributes.description.name == "Reserved") {
        //     cl += "ff00bf";
        // } else if (nonAvailability.attributes.description.name == "Call Out") {
        //     cl += "3333ff";
        // }
        cl = availabilityRange.attributes.type.colorHex;
    } else {
        cl = "#d3d3d3";
    }

    // description for pop-over
    var description = availabilityRange.attributes.type ? availabilityRange.attributes.type.name : "Availability Range";
    if (availabilityRange.attributes.notes) {
        description += ": " + availabilityRange.attributes.notes;
    }

    return {
        id: availabilityRange.id,
        title: availabilityRange.attributes.type ? availabilityRange.attributes.type.name : "Availability Range",
        description: description,
        type: availabilityRange.attributes.type,
        available: availabilityRange.attributes.type ? availabilityRange.attributes.type.available : false, // if no type, assume to be not-available
        recurring: false, // flag as range
        rangeId: availabilityRange.attributes.id, // shouldn't this be the ID?
        start: Date.fromISOString(availabilityRange.attributes.startDate),
        end: Date.fromISOString(availabilityRange.attributes.endDate),
        editable: false,
        allDay: false,
        className: "scheduler-availability-range",
        resourceId: availabilityRange.attributes.interpreter.id,
        color: cl,
        rendering: 'background'
    };
}

function stringToColorCode(str) {
    var code = crc32(str).toString(16);
    code = code.substring(0, 6);
    return code;
}

/**
 * credit: http://erlycoder.com/121/javascript-crc32-that-mathes-php-crc32-and-works-well-with-unicode
 * @param s
 * @return {Number}
 */
function crc32(s) {
    s = String(s);
    var c=0, i=0, j=0;
    var polynomial = arguments.length < 2 ? 0x04C11DB7 : arguments[1],
        initialValue = arguments.length < 3 ? 0xFFFFFFFF : arguments[2],
        finalXORValue = arguments.length < 4 ? 0xFFFFFFFF : arguments[3],
        crc = initialValue,
        table = [], i, j, c;

    function reverse(x, n) {
        var b = 0;
        while (n) {
            b = b * 2 + x % 2;
            x /= 2;
            x -= x % 1;
            n--;
        }
        return b;
    }

    var range = 255, c=0;
    for (i = 0; i < s.length; i++){
        c = s.charCodeAt(i);
        if(c>range){ range=c; }
    }

    for (i = range; i >= 0; i--) {
        c = reverse(i, 32);

        for (j = 0; j < 8; j++) {
            c = ((c * 2) ^ (((c >>> 31) % 2) * polynomial)) >>> 0;
        }

        table[i] = reverse(c, 32);
    }

    for (i = 0; i < s.length; i++) {
        c = s.charCodeAt(i);
        if (c > range) {
            throw new RangeError();
        }
        j = (crc % 256) ^ c;
        crc = ((crc / 256) ^ table[j]) >>> 0;
    }

    return (crc ^ finalXORValue) >>> 0;
}

/**
 * populate the events array based on the response from the server.
 * <p>
 * this differs from the bookings events in that the interpreter details are shown in the
 * event information rather than the booking.
 */
function initializeCalendarContactEvents(doc) {

    var events = [];

    for (var i = 0; i < doc.rows.length; i++) {


        var cl = "#" + stringToColorCode(doc.rows[i]["interpreter.label"]); //'#197b30'; //green

        /*
        if (doc.rows[i]["status.id"] == App.dict.bookingStatus['new'].id) {
            cl = '#197b30'; //green
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['open'].id) {
            cl = '#00af33'; //green 2
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['assigned'].id) {
            cl = '#5e5e5f'; //grey
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['confirmed'].id) {
            cl = '#006400'; //green 3
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['verified'].id) {
            cl = '#5aa500'; //verified
        } else 	if (doc.rows[i]["status.id"] == App.dict.bookingStatus['declined'].id) {
            cl = '#005492'; //dark blue
        } else 	 if (doc.rows[i]["status.id"] == App.dict.bookingStatus['nonattendance'].id) {
            cl = '#fcd116'; //yellow
        } else	if (doc.rows[i]["status.id"] == App.dict.bookingStatus['cancelled'].id) {
            cl = '#fe2600'; //red
        } else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['closed'].id) {
            cl = '#0010da'; //blue
        }
        */


        var displayLabel = doc.rows[i]["interpreter.label"] ? doc.rows[i]["interpreter.label"] : "Unassigned";

        // Formatting Cancelled Jobs
        var text = "";

        if (doc.rows[i].isTelephoneTranslation == true) {
            displayLabel += "Phone:";

        } else {
            displayLabel += "";
        }

        if (doc.rows[i].actualLocationDisplayLabel != null) {

            displayLabel = displayLabel + " " + doc.rows[i].actualLocationDisplayLabel;
            if (displayLabel.length > 25) {
                displayLabel = displayLabel.substring(0, 22);
                displayLabel = displayLabel + "..."
            }
        }

        // Highlight Cancelled Jobs
        if (doc.rows[i]["status.id"] == App.dict.bookingStatus['cancelled'].id) {
            cl = '#fe2600'; //color red
            text = '#000';
        }

        events.push({
            id: doc.rows[i].id,
            title: displayLabel, //interpreter & language
            start: (new Date(doc.rows[i].expectedStartDateMs).getTime()) / 1000,
            end: (new Date(doc.rows[i].expectedEndDateMs).getTime()) / 1000,
            editable: true,
            allDay: false,
            color: cl,
            textColor: text,
            description: getEventDescription(doc.rows[i]),
            "interpreter.id": doc.rows[i]["interpreter.id"],
            "bookingMode.id": doc.rows[i]["bookingMode.id"],
            "bookingStatus.id": doc.rows[i]["status.id"]
        });
    }

    return events;
}

/**
 * invoked when a collection of jobs are successfully returned for display on the calendar.
 * <p>
 * the method takes a array of jobs and adapts them to an array of calendar event objects
 * for display.
 *
 * @param jobs array of job models
 * @param label attribute name of for label to be used on event. Can use object.name.name to retrieve nested object
 * @param defaultLabel label to display if attribute is not defined
 * @param color color to be used to display. Can be a function or css color.
 * @returns {Array} of adapated events to display on the calendar
 */
function adaptJobModelsToCalendarEvents(jobs, label, defaultLabel, color){
    var events = [];
    for (var i = 0; i < jobs.length; i++){
        events.push(adaptJobModelToCalendarEvent(
            jobs[i],
            getAttributeFromModel(jobs[i], label, defaultLabel),
            color)
        );
    }
    return events;
}

/**
 * adapt a single job model to a calendar event.
 *
 * @param job job model to adapt to calendar event
 * @param label label to display on event. Can be function callback
 * @param color color to display on event. Can be a function callback. Not passed will default to stringToColorCode()
 * @returns adapted event for the job model
 */
function adaptJobModelToCalendarEvent(job, label, color) {

    var displayLabel;

    // check for promoted reference field to display initially
    var promotedRef = job.attributes.primaryRef ? (job.attributes.primaryRef.promote ? job.attributes.primaryRef : null) : _.find(job.attributes.refs, function(ref) { return ref && ref.config && ref.config.promote });

    // generate label
    if (_.isUndefined(label) || _.isNull(label)) {
        if (promotedRef) {
            displayLabel = promotedRef.ref + " (Undefined)";
        } else {
            displayLabel = "Undefined";
        }
    } else if (_.isFunction(label)) {
        if (promotedRef) {
            displayLabel = promotedRef.ref + " (" + label(job) + ")";
        } else {
            displayLabel = label(job);
        }
    } else {
        if (promotedRef) {
            displayLabel = promotedRef.ref + " (" + label + ")";
        } else {
            displayLabel = label;
        }
    }

    displayLabel += " - ";

    var cl;

    // generate color
    if (job.attributes.status.id == App.dict.bookingStatus['cancelled'].id) {
        // always set to red for cancelled jobs
        cl = "#" + 'fe2600'; //red
    } else if (_.isUndefined(color) || _.isNull(color)) {
        // if not defined use default based on label
        cl = "#" + stringToColorCode(label);
    } else if (_.isFunction(color)) {
        // else invoke function
        cl = "#" + color(job);
    } else {
        // else assume color is passed in directly
        cl = "#" + color;
    }

    // additional label prefix for mode
    if (job.attributes.isTelephoneTranslation == true) {
        displayLabel += "Phone:";

    } else {
        displayLabel += "";
    }

    // truncate label
    if (job.attributes.actualLocation && job.attributes.actualLocation.displayLabel != null) {

        displayLabel = displayLabel + " " + job.attributes.actualLocation.displayLabel;
        if (displayLabel.length > 25) {
            displayLabel = displayLabel.substring(0, 22);
            displayLabel = displayLabel + "..."
        }
    }

    return {
        id: job.attributes.id,
        title: displayLabel,
        start: Date.fromISOString(job.attributes.expectedStartDate),
        end: Date.fromISOString(job.attributes.expectedEndDate),
        editable: true,
        allDay: false,
        color: cl,
        description: getEventDescriptionJSON(job.attributes),
        "customer.id": job.attributes.customer ? job.attributes.customer.id : null,
        "language.id": job.attributes.language ? job.attributes.language.id : null,
        "employmentCategory.id": job.attributes.employmentCategory ? job.attributes.employmentCategory.id : null,
        "bookingMode.id": job.attributes.bookingMode.id,
        "interpreter.id": job.attributes.interpreter ? job.attributes.interpreter.id : null,
        "bookingStatus.id": job.attributes.status.id,
        "visit.id": job.attributes.visit.id,
        "preventEdit": job.attributes.preventEdit,
        "userEditing": job.attributes.userEditing,
        "startEditing": job.attributes.startEditing
    };
}

/**
 * utility method to retrieve an attribute from a model using dot notation e.g. object.name.name
 * <p>
 * method will retrieve attribute from model and then continue down the object tree for each
 * . separator.
 *
 * @param model model to retrieve attribute for
 * @param attributeName name of the attribute to retrieve. uses dot notation
 * @param defaultValue default value to return if attribute is not defined
 * @returns {*} the value or the default value
 */
function getAttributeFromModel(model, attributeName, defaultValue) {

    var attributeElements = attributeName.split(".");

    if (attributeElements.length == 0) {

        return defaultValue;

    } else if (attributeElements.length == 1) {

        return model.get(attributeElements[0]) || defaultValue;

    } else {

        var attribute = model.get(attributeElements[0]);

        for (var i = 1; i < attributeElements.length;  i++) {

            if (_.isUndefined(attribute) || _.isNull(attribute) ) {
                return defaultValue;
            }

            attribute = attribute[attributeElements[i]];
        }

        return attribute || defaultValue;
    }
}


/**
 * return the css color for the status on the job model.
 *
 * @param job job model
 * @returns {string} css color string, exlcuding the #
 */
function getJobStatusCssColorFromJobModel(job) {
    var cl = '';
    if (job.attributes.status.id == App.dict.bookingStatus['new'].id) {
        cl = 'FF8300'; //orange
    } else if (job.attributes.status.id == App.dict.bookingStatus['open'].id) {
        cl = '6B119C'; //purple
    } else if (job.attributes.status.id == App.dict.bookingStatus['assigned'].id) {
        cl = '5e5e5f'; //grey
    } else if (job.attributes.status.id == App.dict.bookingStatus['confirmed'].id) {
        cl = '00af33'; //green
        //} else if (doc.rows[i]["status.id"] == App.dict.bookingStatus['verified'].id) {
        //    cl = '5aa500'; //verified
    } else 	if (job.attributes.status.id == App.dict.bookingStatus['declined'].id) {
        cl = 'D00072'; //magenta
    } else 	 if (job.attributes.status.id == App.dict.bookingStatus['nonattendance'].id) {
        cl = 'fcd116'; //yellow
    } else	if (job.attributes.status.id == App.dict.bookingStatus['cancelled'].id) {
        cl = 'fe2600'; //red
    } else if (job.attributes.status.id == App.dict.bookingStatus['closed'].id) {
        cl = '0010da'; //blue
    } else if (job.attributes.status.id == App.dict.bookingStatus['offered'].id) {
        cl = '01C4CD'; //light blue
    }

    return cl;
}

/**
 * get the css class representing the status of the booking
 *
 * @param status id of the booking status
 * @returns {String}
 */
function getBookingStatusCss(status) {

    if (status == App.dict.bookingStatus['new'].id) {
        return 'status-new';
    } else if (status == App.dict.bookingStatus['assigned'].id) {
        return 'status-assigned';
    } else if (status == App.dict.bookingStatus['open'].id) {
        return 'status-open';
    } else if (status == App.dict.bookingStatus['confirmed'].id) {
        return 'status-confirmed';
    //} else if (status == App.dict.bookingStatus['verified'].id) {
    //    return 'status-verified';
    } else if (status == App.dict.bookingStatus['declined'].id) {
        return 'status-declined';
    } else if (status == App.dict.bookingStatus['nonattendance'].id) {
        return 'status-nonattendance';
    } else if (status == App.dict.bookingStatus['cancelled'].id) {
        return 'status-cancelled';
    } else if (status == App.dict.bookingStatus['closed'].id) {
        return 'status-closed';
    } else if (status == App.dict.bookingStatus['invoiced'].id) {
        return 'status-invoiced';
    } else if (status == App.dict.bookingStatus['paid'].id) {
        return 'status-paid';
    } else if (status == App.dict.bookingStatus['billed'].id) {
        return 'status-billed';
    } else {
        return 'field-error';
    }
}

/**
 * is booking eligible for payment
 * @param status id of the payment status
 * @returns {Boolean}
 */
function isBookingPaymentEligible(status) {

    if (status == App.dict.bookingStatus['new'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['assigned'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['open'].id) {
        return 'status-open';
    } else if (status == App.dict.bookingStatus['confirmed'].id) {
        return false;
    //} else if (status == App.dict.bookingStatus['verified'].id) {
    //    return true;
    } else if (status == App.dict.bookingStatus['declined'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['nonattendance'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['cancelled'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['closed'].id) {
        return false;
    } /*else if (status == App.dict.bookingStatus['invoiced'].id) {
        return true;
    } else if (status == App.dict.bookingStatus['paid'].id) {
        return true;
    } else if (status == App.dict.bookingStatus['billed'].id) {
        return true;
    } */else {
        return false;
    }

}

/**
 * is booking eligible for invoice
 * @param status id of the invoice status
 * @returns {Boolean}
 */
function isBookingInvoiceEligible(status) {

    if (status == App.dict.bookingStatus['new'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['assigned'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['open'].id) {
        return 'status-open';
    } else if (status == App.dict.bookingStatus['confirmed'].id) {
        return false;
    //} else if (status == App.dict.bookingStatus['verified'].id) {
    //    return true;
    } else if (status == App.dict.bookingStatus['declined'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['nonattendance'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['cancelled'].id) {
        return false;
    } else if (status == App.dict.bookingStatus['closed'].id) {
        return false;
    } /*else if (status == App.dict.bookingStatus['invoiced'].id) {
        return true;
    } else if (status == App.dict.bookingStatus['paid'].id) {
        return true;
    } else if (status == App.dict.bookingStatus['billed'].id) {
        return true;
    }*/ else {
        return false;
    }

}

/**
 * determine the css class representing eligibility of booking for payment
 * @param status id of the payment status
 * @returns {String} name of css class
 */
function getBookingPaymentEligibilityCss(status) {

    if (isBookingPaymentEligible(status)) {


        return 'field-check';

    } else {

        return 'field-error';
    }

}

/**
 * determine the css class representing eligibility of booking for invoicing
 * @param status id of the invoice status
 * @returns {String} name of css class
 */
function getBookingInvoiceEligibilityCss(status) {

    if (isBookingInvoiceEligible(status)) {

        return 'field-check';

    } else {

        return 'field-error';
    }

}

function padMins(number) {
    var result = "" + number;

    if (result.length < 2) {
        result = "0" + result;
    }

    if(number == 1){
        return result + " min";
    } else {
        return result + " mins";
    }
}

function padHours(number) {
    var result = "";

    if(number == 0) {
        return result;
    } else if(number == 1){
        return number + " hour ";
    } else {
        return number + " hours ";
    }

}
