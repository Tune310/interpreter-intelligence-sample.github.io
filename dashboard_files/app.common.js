/*
 * Copyright (C) 2012 Interpreter Intelligence <support@interpreterintelligence.com>
 *
 * <copyright notice>
 */

(function ($) { //# sourceURL=app/common/app.common.js
    /* enable strict mode */
    "use strict";

    // namespace for common elements
    if (!$.app) $.app = {};
    if (!$.app.common) $.app.common = {};
    if (!$.app.common.backgrid) $.app.common.backgrid = {};

    // views (local) ////////////////////////////////////////////////////////

    // models (local) ////////////////////////////////////////////////////////

    // router ////////////////////////////////////////////////////////

    $.app.common.Router = Backbone.Router.extend({

        routes: {}
    });

    // common frame

    $.app.common.backgrid.jobColumns = {
        checkbox: {
            name: "",
            id: "checkbox",
            label: "",
            editable: false,
            filterable: false,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: "select-row",
            headerCell: "select-all"
        },
        action: {
            name: "action",
            id: "action",
            label: "",
            editable: false,
            filterable: false,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.BookingActionCell
        },
        id: {
            name: "id",
            id: "id",
            searchName: "id",
            label: "ID",
            sortName: "id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.BookingIDCell.extend({
                cellFormatter: "jobEditingFormatter"
            })
        },
        superBooking: {
            name: "superBooking",
            id: "superBooking",
            searchName: "superBooking.id",
            label: "Bking ID",
            sortName: "superBooking.id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.SuperBookingIDCell
        },
        actualDurationHrs: {
            id: "actualDurationHrs",
            name: "actualDurationHrs",
            label: "Act. Dur. Hrs.",
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.NumberCell
        },
        actualDurationMins: {
            id: "actualDirationMins",
            name: "actualDurationMins",
            label: "Act. Dur. Mins.",
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.IntegerCell
        },
        actualStartDate: {
            id: "actualStartDate",
            name: "actualStartDate",
            //sortName: "expectedStartDate",
            //searchName: "expectedStartDate",
            label: "Act.Date",
            editable: false,
            filterable: true,
            renderable: true,
            searchable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell,
            formatterOptions: {
                whenEmptyShowError: false,
                tooltip: "timeZone"
            }
        },
        actualStartTime: {
            id: "actualStartTime",
            name: "actualStartTime",
            searchName: "actualStartDate",
            label: "Act.Time",
            editable: false,
            filterable: true,
            renderable: true,
            sortable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                whenEmptyShowError: false
            }
        },
        contactArrivalDate: {
            id: "contactArrivalDate",
            name: "contactArrivalDate",
            //sortName: "expectedStartDate",
            //searchName: "expectedStartDate",
            label: "Arr.Date",
            editable: false,
            filterable: true,
            renderable: true,
            searchable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell,
            formatterOptions: {
                whenEmptyShowError: false,
                tooltip: "timeZone"
            }
        },
        contactArrivalTime: {
            id: "contactArrivalTime",
            name: "contactArrivalTime",
            searchName: 'contactArrivalDate',
            sortName: 'contactArrivalDate',
            label: "Arr.Tm.",
            editable: false,
            filterable: true,
            renderable: true,
            sortable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                whenEmptyShowError: false
            }
        },
        appointmentDetails: {
            id: "bookingDetails",
            name: 'bookingDetails',
            label: 'Appointment Details',
            serchName: 'bookingDetails',
            op: "bw",
            editable: false,
            searchable: true,
            sortable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        assignmentDate: {
            id: "assignmentDate",
            name: 'assignmentDate',
            label: 'Assign. Date',
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell
        },
        billingLocation: {
            id: "billingLocation",
            name: 'billingLocation',
            label: 'Billing Location',
            searchName: 'billingLocation.description',
            sortName: 'billingLocation.description',
            op: "bw",
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.LocationCell
        },
        billingNotes: {
            id: "billingNotes",
            name: 'billingNotes',
            label: 'Billing Notes',
            searchName: 'billingNotes',
            sortable: false,
            op: 'bw',
            editable: false,
            filterable: true,
            searchable: true,
            renderable: true,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.BillingNotesCell
        },
        bookingDate: {
            id: "bookingDate",
            name: 'bookingDate',
            label: 'Booking Date',
            searchName: 'visit.bookingDate',
            sortName: 'visit.bookingDate',
            editable: false,
            filterable: true,
            renderable: true,
            searchable: true,
            sortable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell
        },
        bookingTime: {
            id: "bookingTime",
            name: "bookingTime",
            searchName: 'visit.bookingDate',
            sortName: 'visit.bookingDate',
            label: "Bkg. Tm.",
            editable: false,
            filterable: true,
            renderable: true,
            sortable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                whenEmptyShowError: false
            }
        },
        bookingMode: {
            id: "bookingMode",
            name: 'bookingMode',
            label: 'Type',
            searchName: 'bookingMode.id',
            sortable: false,
            editable: false,
            filterable: true,
            searchable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.BookingModeCell
        },
        cancellationDate: {
            id: "cancellationDate",
            name: 'cancellationDate',
            label: 'Cancel Date',
            searchName: 'cancellationDate',
            sortName: 'cancellationDate',
            editable: false,
            filterable: true,
            renderable: true,
            searchable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell
        },
        cancellationReason: {
            id: "cancellationReason",
            name: 'cancellationReason',
            label: 'Cancel Reason',
            searchName: 'cancellationReason.id',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.CancellationReasonCell
        },
        client: {
            id: "client",
            name: 'client',
            label: 'Client',
            searchName: 'client.name',
            sortName: 'client.name',
            op: 'bw',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.ClientCell
        },
        comments: {
            id: "comments",
            name: 'comments',
            label: 'Cmts',
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.CommentsCell
        },
        confirmationDate: {
            id: "confirmationDate",
            name: 'confirmationDate',
            label: 'Confirm. Date',
            searchName: 'confirmationDate',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell
        },
        consumer: {
            id: "consumer",
            name: 'consumer',
            label: 'Consumer',
            searchName: 'consumer.name',
            sortName: 'consumer.name',
            op: 'bw',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.ConsumerCell
        },
        createdBy: {
            id: "createdBy",
            name: 'createdBy',
            label: 'Created By',
            searchName: 'createdBy',
            sortName: 'createdBy',
            editable: false,
            op: 'bw',
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        createdDate: {
            id: "createdDate",
            name: 'createdDate',
            label: 'Created On',
            searchName: 'createdDate',
            sortName: 'createdDate',
            sortable: true,
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell
        },
        customer: {
            id: "customer",
            name: "customer",
            sortName: "customer.name",
            searchName: "customer.name",
            op: 'bw',
            label: "Customer",
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.CustomerCell
        },
        billingCustomer: {
            id: "billingCustomer",
            name: "billingCustomer",
            sortName: "billingCustomer.name",
            searchName: "billingCustomer.name",
            op: 'bw',
            label: "Customer (Bill To)",
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.BillingCustomerCell
        },
        defaultLanguage: {
            id: "defaultLanguage",
            name: 'defaultLanguage',
            label: 'Default Lang.',
            searchName: 'language.description',
            sortName: "language.description",
            op: 'bw',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DefaultLanguage
        },
        due: {
            id: "due",
            name: 'due',
            label: "Due in",
            editable: false,
            searchable: false,
            sortable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DueInCell
        },
        employmentCategory: {
            id: "employmentCategory",
            name: 'employmentCategory',
            searchName: 'employmentCategory.id',
            sortName: 'employmentCategory',
            label: 'Emp.Cat.',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.EmploymentCategoryCell
        },
        excludeFromAutoOffer: {
            id: "excludeFromAutoOffer",
            name: 'excludeFromAutoOffer',
            label: 'Ex/Offer',
            sortName: 'excludeFromAutoOffer',
            editable: false,
            filterable: true,
            renderable: false,
            searchable: true,
            roles: ["comp"],
            cell: $.app.backgrid.JobOfferExcludeFromCell
        },
        excludeFromJobOfferPool: {
            id: "excludeFromJobOfferPool",
            name: 'excludeFromJobOfferPool',
            label: 'Ex/Pool',
            sortName: 'excludeFromJobOfferPool',
            editable: false,
            filterable: true,
            renderable: false,
            searchable: true,
            roles: ["comp"],
            cell: $.app.backgrid.JobOfferExcludeFromCell
        },
        esignatureRequired: {
            id: "esignatureRequired",
            name: 'esignatureRequired',
            label: 'E-Signature',
            editable: false,
            sortable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.VerifiedCell
        },
        expectedDurationHrs: {
            id: "expectedDurationHrs",
            name: "expectedDurationHrs",
            label: "Ex. Dur. Hrs.",
            editable: false,
            sortable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.NumberCell
        },
        expectedDurationMins: {
            id: "expectedDurationMins",
            name: "expectedDurationMins",
            label: "Ex. Dur. Mins.",
            editable: false,
            sortable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.IntegerCell
        },
        expectedEndDate: {
            id: "expectedEndDate",
            name: 'expectedEndDate',
            label: 'Expected End Date',
            sortName: 'expectedEndDate',
            editable: false,
            filterable: true,
            renderable: true,
            searchable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell,
            formatterOptions: {
                whenEmptyShowError: false
            }
        },
        expectedStartDate: {
            id: "expectedStartDate",
            name: 'expectedStartDate',
            label: 'Date',
            sortName: 'expectedStartDate',
            editable: false,
            filterable: true,
            renderable: true,
            searchable: true,
            direction: "descending",
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.DateCell,
            tooltip: "timeZone",
            formatterOptions: {
                whenEmptyShowError: false
            }
        },
        expectedStartTime: {
            id: "expectedStartTime",
            name: 'expectedStartTime',
            label: 'Time',
            sortName: 'expectedStartDate',
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                whenEmptyShowError: false
            }
        },
        interpreterExpectedStartTime: {
            id: "interpreterExpectedStartTime",
            name: 'interpreterExpectedStartTime',
            label: 'Int.Time',
            sortName: 'expectedStartDate',
            editable: false,
            filterable: true,
            renderable: !App.config.company.config.showColInterpreterTimezone,
            roles: ["admin", "cont", "comp"],
            cell: $.app.backgrid.InterpreterTimeCell,
            formatterOptions: {
                whenEmptyShowError: false
            }
        },
        finalNotes: {
            id: "finalNotes",
            name: 'finalNotes',
            label: 'Final Notes',
            searchName: 'finalNotes',
            op: 'bw',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        firstAssignmentDate: {
            id: "firstAssignmentDate",
            name: 'firstAssignmentDate',
            label: 'First Assign. Date',
            sortName: 'firstAssignmentDate',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.DateCell
        },
        firstConfirmationDate: {
            id: "firstConfirmationDate",
            name: 'firstConfirmationDate',
            label: 'First Confirm. Date',
            sortName: 'firstConfirmationDate',
            editable: false,
            filterable: true,
            searchable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.DateCell
        },
        flagForFinance: {
            id: "flagForFinance",
            name: 'flagForFinance',
            label: 'Fi.',
            sortable: false,
            filterable: true,
            renderable: true,
            editable: false,
            roles: ["admin", "cont", "comp"],
            cell: $.app.backgrid.FlagForFinanceCell
        },
        genderRequirement: {
            id: "genderRequirement",
            name: 'genderRequirement',
            label: 'Gender Requirement',
            searchName: 'genderRequirement.id',
            editable: false,
            op: 'bw',
            searchable: true,
            sortable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.GenderCell
        },
        interpreter: {
            id: "interpreter",
            name: "interpreter",
            searchName: "interpreter.name",
            sortName: "interpreter.name",
            label: "Interpreter",
            editable: false,
            op: 'bw',
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp", "cont"],
            cell: $.app.backgrid.InterpreterCell.extend({
                cellFormatter: "interpreterFormatter"
            })
        },
        interpreterNotes: {
            id: "interpreterNotes",
            name: "interpreterNotes",
            label: "Interpreter Notes",
            searchName: 'interpreterNotes',
            editable: false,
            searchable: true,
            op: 'bw',
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.NotesCell
        },
        interpreterSubmitted: {
            id: "interpreterSubmitted",
            name: 'interpreterSubmitted',
            label: 'Interpreter Closed',
            searchName: 'interpreterSubmitted',
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.VerifiedCell
        },
        invoiceStatus: {
            id: "invoiceStatus",
            name: 'invoiceStatus',
            label: "Inv.St.",
            searchName: "invoiceStatus.id",
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.InvoiceStatusCell
        },
        invalidFields: {
            id: "invalidFields",
            name: "invalidFields",
            label: "Dcs.",
            editable: false,
            searchable: false,
            filterable: true,
            sortable: false,
            renderable: true,
            cell: $.app.backgrid.InvalidFieldsCell
        },
        isVerified: {
            id: "isVerified",
            name: 'isVerified',
            label: 'Is Vfd.',
            filterable: true,
            renderable: true,
            editable: false,
            searchable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.BooleanCell.extend({
                render: $.app.backgrid.VerifiedCell.prototype.render
            })
        },
        jobCompleteEmailSent: {
            id: "jobCompleteEmailSent",
            name: 'jobCompleteEmailSent',
            label: 'Job Completed Email',
            filterable: true,
            renderable: true,
            editable: false,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.VerifiedCell
        },
        jobDetails: {
            id: "visitDetails",
            name: 'visitDetails',
            label: 'Job Details',
            searchName: 'visitDetails',
            editable: false,
            op: 'bw',
            sortable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.NotesCell
        },
        jobNotes: {
            id: "visitNotes",
            name: 'visitNotes',
            label: 'Job Notes',
            searchName: 'visitNotes',
            editable: false,
            op: 'bw',
            searchable: true,
            sortable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.NotesCell
        },
        jobOffers: {
            id: "offeredInterpreter",
            name: 'offeredInterpreter',
            label: 'Job Offers',
            searchName: 'offeredInterpreter',
            sortName: 'offeredInterpreter',
            op: 'bw',
            searchable: true,
            sortable: false,
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["comp", "admin"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    // always be empty cell value
                    // column is for filtering jobs by jobOffer
                    return "";
                }
            })
        },
        language: {
            id: "language",
            name: "language",
            searchName: "language.description",
            sortName: "language.description",
            label: "Language",
            editable: false,
            searchable: true,
            op: 'bw',
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.CompanyLanguageCell
        },
        languageCode: {
            id: "languageCode",
            name: "languageCode",
            searchName: "languageCode.description",
            sortName: "language.description",
            label: "Lng.",
            editable: false,
            op: 'bw',
            searchable: true,
            sortable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.LanguageCell
        },
        languageRating: {
            id: "languageRating",
            name: "languageRating",
            searchName: "interpreter.languageMappings.rating",
            label: "Lng. Rating",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.InterpreterLanguageMappingRatingCell
        },
        lastModifiedBy: {
            id: "lastModifiedBy",
            name: 'lastModifiedBy',
            label: 'Last Modified by',
            searchName: 'lastModifiedBy',
            sortName: 'lastModifiedBy',
            editable: false,
            op: 'bw',
            filterable: true,
            searchable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: Backgrid.StringCell
        },
        lastModifiedDate: {
            id: "lastModifiedDate",
            name: 'lastModifiedDate',
            label: 'Last Modified',
            sortName: 'lastModifiedDate',
            searchName: 'lastModifiedDate',
            searchable: true,
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.DateCell
        },
        location: {
            id: "actualLocationDisplayLabel",
            name: "actualLocationDisplayLabel",
            sortName: "location.description",
            searchName: "location.description",
            op: "bw",
            label: "Location",
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.LocationCell
        },
        locationNote: {
            id: "locationNote",
            name: 'locationNote',
            label: 'Location Note',
            locationNote: 'locationNote',
            searchName: 'locationNote',
            editable: false,
            op: 'bw',
            searchable: true,
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        mileage: {
            id: "mileage",
            name: 'mileage',
            label: 'Mileage',
            searchName: 'mileage',
            editable: false,
            searchable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        notes: {
            id: "notes",
            name: 'notes',
            label: 'Notes',
            searchName: 'notes',
            editable: 'false',
            op: 'bw',
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.NotesCell
        },
        notificationEmail: {
            id: "notificationEmail",
            name: 'notificationEmail',
            label: 'Notification E-mail',
            searchName: 'notificationEmail',
            sortName: 'superBooking.notificationEmail',
            sortable: true,
            editable: false,
            searchable: true,
            op: 'bw',
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: Backgrid.StringCell
        },
        numJobs: {
            id: "numJobs",
            name: 'numJobs',
            label: 'Num. Jobs',
            sortable: false,
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: Backgrid.IntegerCell
        },
        originOfRequest: {
            id: "originOfRequest",
            name: 'originOfRequest',
            label: 'Origin Of Request',
            searchName: 'originOfRequest',
            editable: false,
            op: 'bw',
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: Backgrid.StringCell
        },
        paymentStatus: {
            id: "paymentStatus",
            name: 'paymentStatus',
            label: 'Pay.St.',
            searchName: 'paymentStatus.id',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["admin", "cont", "comp"],
            cell: $.app.backgrid.PaymentStatusCell
        },
        placeOfAppointment: {
            id: "placeOfAppointment",
            name: 'placeOfAppointment',
            label: 'Place Of Appoint.',
            searchName: 'placeOfAppointment',
            editable: false,
            op: 'bw',
            searchable: true,
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        preferredInterpreter: {
            id: "preferredInterpreter",
            name: 'preferredInterpreter',
            label: 'Preferred Inter.',
            searchName: 'preferredInterpreter.name',
            sortName: 'preferredInterpreter.name',
            editable: false,
            op: 'bw',
            searchable: true,
            filterable: true,
            renderable: true,
            sortable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.InterpreterCell.extend({
                cellFormatter: "preferredInterpreterFormatter"
            })
        },
        primaryRef: {
            id: "primaryRef",
            name: 'primaryRef',
            label: 'Primary Ref.',
            searchName: 'refs',
            sortName: 'refs.ref',
            editable: false,
            op: 'bw',
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.ReferenceCell
        },
        refs: {
            id: "refs",
            name: 'refs',
            label: 'Reference',
            searchName: 'refs',
            sortName: 'refs.ref',
            editable: false,
            op: 'bw',
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.ReferenceCell
        },
        requestor: {
            id: "requestor",
            name: 'requestor',
            label: 'Requestor',
            searchName: 'requestor.name',
            sortName: 'superBooking.requestor',
            editable: false,
            op: 'bw',
            searchable: true,
            filterable: true,
            renderable: true,
            sortable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.RequestorCell
        },
        requirement: {
            id: "requirement",
            name: 'requirements',
            label: 'Requirement',
            searchName: 'requirements',
            sortName: 'requirements.id',
            editable: false,
            op: 'bw',
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "comp"],
            cell: $.app.backgrid.RequirementCell
        },
        siteContact: {
            id: "siteContact",
            name: 'siteContact',
            label: 'Site Contact',
            searchName: 'siteContact',
            editable: false,
            op: 'bw',
            sortable: false,
            filterable: true,
            renderable: true,
            searchable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        companySpecialInstructions: {
            id: "companySpecialInstructions",
            name: 'companySpecialInstructions',
            label: 'Sp.I - Admin',
            searchName: 'superBooking.companySpecialInstructions',
            editable: false,
            searchable: true,
            op: 'bw',
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["admin", "comp", "fina"],
            cell: $.app.backgrid.NotesCell
        },
        customerSpecialInstructions: {
            id: "customerSpecialInstructions",
            name: 'customerSpecialInstructions',
            label: 'Sp.I - Cust',
            searchName: 'superBooking.customerSpecialInstructions',
            editable: false,
            searchable: true,
            op: 'bw',
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["admin", "comp", "fina", "cust"],
            cell: $.app.backgrid.NotesCell
        },
        contactSpecialInstructions: {
            id: "contactSpecialInstructions",
            name: 'contactSpecialInstructions',
            label: 'Sp.I - Interp',
            searchName: 'superBooking.contactSpecialInstructions',
            editable: false,
            searchable: true,
            op: 'bw',
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["admin", "comp", "fina", "cont"],
            cell: $.app.backgrid.NotesCell
        },
        status: {
            id: "status",
            name: "status",
            searchName: "status.id",
            label: "Stat.",
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.BookingStatusCell
        },
        subLocation: {
            id: "subLocation",
            name: "subLocation",
            label: "Sub Location",
            searchName: 'subLocation.description',
            sortName: 'subLocation.description',
            editable: false,
            op: 'bw',
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.LocationCell
        },
        teamSize: {
            id: "teamSize",
            name: 'teamSize',
            label: 'Team Size',
            editable: false,
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.IntegerCell.extend({
                orderSeparator: ''
            })
        },
        timeZone: {
            id: "timeZone",
            name: 'timeZone',
            label: 'Time Zone',
            editable: false,
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        timeZoneDisplayName: {
            id: "timeZoneDisplayName",
            name: 'timeZoneDisplayName',
            label: 'Time Zone Display',
            editable: false,
            filterable: true,
            renderable: true,
            sortable: false,
            roles: ["cust", "admin", "cont", "comp"],
            cell: Backgrid.StringCell
        },
        unfulfilledReasonDate: {
            id: "unfulfilledDate",
            name: 'unfulfilledDate',
            label: 'Unfulfilled Date',
            searchName: 'unfulfilledDate',
            sortName: 'unfulfilledDate',
            editable: false,
            filterable: true,
            renderable: true,
            searchable: true,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.DateCell
        },
        unfulfilledReason: {
            id: "unfulfilledReason",
            name: 'unfulfilledReason',
            label: 'Unfulfilled Reason',
            searchName: 'unfulfilledReason.id',
            editable: false,
            searchable: true,
            filterable: true,
            renderable: true,
            roles: ["admin", "comp"],
            cell: $.app.backgrid.UnfulfilledReasonCell
        },
        vosRequired: {
            id: "vosRequired",
            name: 'vosRequired',
            label: 'VoS',
            editable: false,
            filterable: true,
            renderable: true,
            roles: ["cust", "admin", "cont", "comp"],
            cell: $.app.backgrid.VerifiedCell
        }
    };

    $.app.common.backgrid.ivrCallColumns = {
        action: {
            name: "action",
            id: "action",
            label: "",
            editable: false,
            filterable: false,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.IvrCallActionCell
        },
        id: {
            name: "id",
            id: "id",
            searchName: "id",
            label: "ID",
            sortName: "id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell
        },
        createdDate: {
            name: "createdDate",
            id: "createdDate",
            searchName: "createdDate",
            label: "Created",
            sortName: "createdDate",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.DateCell,
            formatterOptions: {
                tooltip: "timeZone"
            },
            op: "eqd"
        },
        createdTime: {
            name: "createdDate",
            id: "createdTime",
            searchName: "createdDate",
            label: "Created Time",
            sortName: "createdDate",
            editable: false,
            searchable: false,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                tooltip: "timeZone"
            }
        },
        status: {
            name: "status",
            id: "status",
            searchName: "status",
            label: "App Status",
            sortName: "status",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        job: {
            name: "job",
            id: "job",
            searchName: "job.id",
            label: "Job",
            sortName: "job.id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    return rawValue ? rawValue.id : "";
                }
            })
        },
        currentStep: {
            name: "currentStep",
            id: "currentStep",
            searchName: "currentStep",
            label: "Current Step",
            sortName: "currentStep",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        operatorReason: {
            name: "operatorReason",
            id: "operatorReason",
            searchName: "operatorReason",
            label: "Operator Reason",
            sortName: "operatorReason",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        // application fields populated
        customer: {
            name: "customer",
            id: "customer",
            searchName: "customer.name",
            label: "Customer",
            sortName: "customer.name",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    return rawValue ? rawValue.name : "";
                }
            }),
            op: 'bw'
        },
        client: {
            name: "client",
            id: "client",
            searchName: "client.name",
            label: "Client",
            sortName: "client.name",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    return rawValue ? rawValue.name : "";
                }
            }),
            op: 'bw'
        },
        language: {
            name: "language",
            id: "language",
            searchName: "language.description",
            label: "Language",
            sortName: "language.description",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    return rawValue ? rawValue.description : "";
                }
            }),
            op: 'bw'
        },
        gender: {
            name: "gender",
            id: "gender",
            searchName: "gender.id",
            label: "Gender",
            sortName: "gender.id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.GenderCell
        },
        intervieweeGender: {
            name: "intervieweeGender",
            id: "intervieweeGender",
            searchName: "intervieweeGender.id",
            label: "Interviewee Gender",
            sortName: "intervieweeGender.id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.GenderCell
        },
        // vendor attributes
        callDuration: {
            name: "callDuration",
            id: "callDuration",
            searchName: "callDuration",
            label: "Call Duration",
            sortName: "callDuration",
            editable: false,
            searchable: false,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell
        },
        callSid: {
            name: "callSid",
            id: "callSid",
            searchName: "callSid",
            label: "Call ID",
            sortName: "callSid",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        accountSid: {
            name: "accountSid",
            id: "accountSid",
            searchName: "accountSid",
            label: "Acc. ID",
            sortName: "accountSid",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        callFrom: {
            name: "callFrom",
            id: "callFrom",
            searchName: "callFrom",
            label: "From",
            sortName: "callFrom",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        callTo: {
            name: "callTo",
            id: "callTo",
            searchName: "callTo",
            label: "To",
            sortName: "callTo",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        callStatus: {
            name: "callStatus",
            id: "callStatus",
            searchName: "callStatus",
            label: "Vendor Status",
            sortName: "callStatus",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        apiVersion: {
            name: "apiVersion",
            id: "apiVersion",
            searchName: "apiVersion",
            label: "API",
            sortName: "apiVersion",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        direction: {
            name: "direction",
            id: "direction",
            searchName: "direction",
            label: "Direction",
            sortName: "direction",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        forwardedFrom: {
            name: "forwardedFrom",
            id: "forwardedFrom",
            searchName: "forwardedFrom",
            label: "Fwd. From",
            sortName: "forwardedFrom",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        callerName: {
            name: "callerName",
            id: "callerName",
            searchName: "callerName",
            label: "Caller Name",
            sortName: "callerName",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        // optional attributes
        fromCity: {
            name: "fromCity",
            id: "fromCity",
            searchName: "fromCity",
            label: "From City",
            sortName: "fromCity",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        fromState: {
            name: "fromState",
            id: "fromState",
            searchName: "fromState",
            label: "From State",
            sortName: "fromState",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        fromZip: {
            name: "fromZip",
            id: "fromZip",
            searchName: "fromZip",
            label: "From Zip",
            sortName: "fromZip",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        fromCountry: {
            name: "fromCountry",
            id: "fromCountry",
            searchName: "fromCountry",
            label: "From Country",
            sortName: "fromCountry",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        toCity: {
            name: "toCity",
            id: "toCity",
            searchName: "toCity",
            label: "To City",
            sortName: "toCity",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        toState: {
            name: "toState",
            id: "toState",
            searchName: "toState",
            label: "To State",
            sortName: "toState",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        toZip: {
            name: "toZip",
            id: "toZip",
            searchName: "toZip",
            label: "To Zip",
            sortName: "toZip",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        toCountry: {
            name: "toCountry",
            id: "toCountry",
            searchName: "toCountry",
            label: "To Country",
            sortName: "toCountry",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        // optional sip
        sipDomain: {
            name: "sipDomain",
            id: "sipDomain",
            searchName: "sipDomain",
            label: "Sip Domain",
            sortName: "sipDomain",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        sipUsername: {
            name: "sipUsername",
            id: "sipUsername",
            searchName: "sipUsername",
            label: "SIP Username",
            sortName: "sipUsername",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        sipCallId: {
            name: "sipCallId",
            id: "sipCallId",
            searchName: "sipCallId",
            label: "SIP Called ID",
            sortName: "sipCallId",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        sipSourceIp: {
            name: "sipSourceIp",
            id: "sipSourceIp",
            searchName: "sipSourceIp",
            label: "SIP Source IP",
            sortName: "sipSourceIp",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        }
    };

    $.app.common.backgrid.contactWorkerColumns = {
        action: {
            name: "action",
            id: "action",
            label: "",
            editable: false,
            filterable: false,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.ContactWorkerActionCell
        },
        id: {
            name: "id",
            id: "id",
            searchName: "id",
            label: "ID",
            sortName: "id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell
        },
        createdDate: {
            name: "createdDate",
            id: "createdDate",
            searchName: "createdDate",
            label: "Created",
            sortName: "createdDate",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.DateCell,
            formatterOptions: {
                tooltip: "timeZone"
            },
            op: "eqd"
        },
        createdTime: {
            name: "createdDate",
            id: "createdTime",
            searchName: "createdDate",
            label: "Created Time",
            sortName: "createdDate",
            editable: false,
            searchable: false,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                tooltip: "timeZone"
            }
        },
        createdBy: {
            name: "createdBy",
            id: "createdBy",
            searchName: "createdBy",
            label: "Created By",
            sortName: "createdBy",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        interpreter: {
            name: "interpreter",
            id: "interpreter",
            searchName: "interpreter.name",
            label: "Interpreter",
            sortName: "interpreter.name",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    return rawValue ? rawValue.name : "";
                }
            }),
            op: 'bw'
        },
        lastModifiedDate: {
            name: "lastModifiedDate",
            id: "lastModifiedDate",
            searchName: "lastModifiedDate",
            label: "Modified",
            sortName: "lastModifiedDate",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.DateCell,
            formatterOptions: {
                tooltip: "timeZone"
            },
            op: "eqd"
        },
        lastModifiedTime: {
            name: "lastModifiedDate",
            id: "lastModifiedTime",
            searchName: "lastModifiedDate",
            label: "Modified Time",
            sortName: "lastModifiedDate",
            editable: false,
            searchable: false,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                tooltip: "timeZone"
            }
        },
        lastModifiedBy: {
            name: "lastModifiedBy",
            id: "lastModifiedBy",
            searchName: "lastModifiedBy",
            label: "Modified By",
            sortName: "lastModifiedBy",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        workerSid: {
            name: "workerSid",
            id: "workerSid",
            searchName: "workerSid",
            label: "Worker SID",
            sortName: "workerSid",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        deviceId: {
            name: "deviceId",
            id: "deviceId",
            searchName: "deviceId",
            label: "Device ID",
            sortName: "deviceId",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        }
    };

    /*
    "id": 944,
    "uri": "https://demo.interpreterintelligence.com:443/api/videoSession/944",
    "versionValue": 0,
    "company": {
      "id": 2,
      "uri": "https://demo.interpreterintelligence.com:443/api/company/2",
      "description": "Demo Interpreting Agency",
      "name": "Languages Worldwide (Demo)",
      "uuid": "d724859a-ac78-400b-867f-17d9feca6461"
    },
    "createdBy": "agency.admin@interpreterintelligence.com",
    "createdDate": "2018-12-14T21:56:36Z",
    "customer": null,
    "interpreter": null,
    "job": null,
    "lastModifiedBy": "agency.admin@interpreterintelligence.com",
    "lastModifiedDate": "2018-12-14T21:56:36Z",
    "providerId": null,
    "providerSessionIdentifier": null,
    "reminderEmailSent": null,
    "status": "null",
    "taskSid": null,
    "uuid": "e33d1609-9387-40f4-8be6-7de2b0acdf06"
     */
    $.app.common.backgrid.vriSessionColumns = {
        action: {
            name: "action",
            id: "action",
            label: "",
            editable: false,
            filterable: false,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.VriSessionActionCell
        },
        id: {
            name: "id",
            id: "id",
            searchName: "id",
            label: "ID",
            sortName: "id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell
        },
        createdDate: {
            name: "createdDate",
            id: "createdDate",
            searchName: "createdDate",
            label: "Created",
            sortName: "createdDate",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.DateCell,
            formatterOptions: {
                tooltip: "timeZone"
            },
            op: "eqd"
        },
        createdTime: {
            name: "createdDate",
            id: "createdTime",
            searchName: "createdDate",
            label: "Created Time",
            sortName: "createdDate",
            editable: false,
            searchable: false,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                tooltip: "timeZone"
            }
        },
        createdBy: {
            name: "createdBy",
            id: "createdBy",
            searchName: "createdBy",
            label: "Created By",
            sortName: "createdBy",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        customer: {
            name: "customer",
            id: "customer",
            searchName: "customer.name",
            label: "Customer",
            sortName: "customer.name",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    return rawValue ? rawValue.name : "";
                }
            }),
            op: 'bw'
        },
        interpreter: {
            name: "interpreter",
            id: "interpreter",
            searchName: "interpreter.name",
            label: "Interpreter",
            sortName: "interpreter.name",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    return rawValue ? rawValue.name : "";
                }
            }),
            op: 'bw'
        },
        job: {
            name: "job",
            id: "job",
            searchName: "job.id",
            label: "Job #",
            sortName: "job.id",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            formatter: _.extend({}, Backgrid.CellFormatter.prototype, {
                fromRaw: function (rawValue, model) {
                    return rawValue ? rawValue.id : "";
                }
            }),
            op: 'eq'
        },
        lastModifiedDate: {
            name: "lastModifiedDate",
            id: "lastModifiedDate",
            searchName: "lastModifiedDate",
            label: "Modified",
            sortName: "lastModifiedDate",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.DateCell,
            formatterOptions: {
                tooltip: "timeZone"
            },
            op: "eqd"
        },
        lastModifiedTime: {
            name: "lastModifiedDate",
            id: "lastModifiedTime",
            searchName: "lastModifiedDate",
            label: "Modified Time",
            sortName: "lastModifiedDate",
            editable: false,
            searchable: false,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.TimeCell,
            formatterOptions: {
                tooltip: "timeZone"
            }
        },
        lastModifiedBy: {
            name: "lastModifiedBy",
            id: "lastModifiedBy",
            searchName: "lastModifiedBy",
            label: "Modified By",
            sortName: "lastModifiedBy",
            editable: false,
            searchable: true,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: Backgrid.StringCell,
            op: 'bw'
        },
        taskSid: {
            name: "taskSid",
            id: "taskSid",
            searchName: "taskSid",
            label: "Task SID",
            sortName: "taskSid",
            editable: false,
            searchable: false,
            sortable: true,
            filterable: true,
            renderable: true,
            roles: ["comp"],
            cell: $.app.backgrid.TaskSidCell,
            op: 'bw'
        }
    };

    $.app.common.bootstrap = function () {

        // local variables

        // initialize the application frame
        // @param obj optional primary object the frame is interacting with (maybe prepopulated and passed from gsp page)
        // @param options optional options (name / value object) passed to the frame
        $.app.common.init = function (obj, options) {


        }; // end init

        $.app.common.save = function save(key, obj) {
            localStorage.setItem(key, JSON.stringify(obj));
        };

        $.app.common.load = function load(key) {
            if (localStorage.getItem(key)) {
                return localStorage.getItem(key);
            } else {
                return null;
            }
        };

        /**
         * initializes the new bookings grid for use on a page
         */
        $.app.common.init_new_bookings = function (elemTable, elemPager, elemCaption, hoursSince, gridRefreshInterval) {

            //show last refesh
            $(elemCaption).html("since " + (new Date()).addHours(hoursSince * -1).toString(App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat) + " (refreshed every " + (gridRefreshInterval / 1000 / 60) + " mins)");

            $(elemTable).jqGrid({
                url: App.config.context + '/api/company/' + App.config.company.id + '/booking',
                datatype: "json",
                height: "100%",
                width: "100%",
                autowidth: true,
                rowattr: function (rd) {
                    if (!rd.valid && rd.invalidFields.indexOf("vosForm") != -1) {
                        return {
                            "class": "invalid"
                        };
                    } else if (rd.visitUpdatedFields && rd.visitUpdatedFields.length) {
                        return {
                            "class": "updated"
                        };
                    }
                },
                colNames: ['', 'ID', 'Date', 'Time', 'Customer ID', 'Customer', 'Sz.', 'Location', 'is Telephone Translation', 'Lang.', 'Language', 'visitUpdatedFields', 'valid', 'invalidFields'],
                colModel: [{
                    name: 'action',
                    index: 'action',
                    width: 20,
                    fixed: false,
                    align: "center",
                    sortable: false,
                    formatter: actionsFormatter,
                    formatteroptions: {
                        grid: "new-bookings",
                        template: "#actionsContainerTemplate",
                        title: "Job #: "
                    },
                    search: false,
                    editable: false
                }, {
                    name: 'id',
                    index: 'id',
                    hidden: false,
                    width: 60,
                    fixed: true,
                    align: "center",
                    formatter: jobEditingFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridiFramePopup',
                        url: App.config.context + '/booking/bare/',
                        id: 'id'
                    }
                }, {
                    name: 'startDate',
                    index: 'expectedStartDate',
                    width: 80,
                    fixed: false,
                    align: "center",
                    sortable: true,
                    sorttype: "date",
                    resizable: false,
                    formatter: genericFormatter,
                    formatteroptions: {
                        col: "startDate",
                        tooltip: 'duration'
                    },
                    unformat: missingUnFormatter,
                    search: false,
                    editable: false
                }, {
                    name: 'startTime',
                    index: 'expectedStartDate',
                    width: 60,
                    fixed: false,
                    align: "center",
                    sorttype: "date",
                    resizable: false,
                    sortable: true,
                    formatter: genericFormatter,
                    formatteroptions: {
                        col: "startTime",
                        tooltip: 'duration'
                    },
                    unformat: missingUnFormatter,
                    search: false,
                    editable: true,
                    editoptions: {
                        dataInit: timeSearchInit,
                        attr: {
                            title: 'Select Time'
                        }
                    }
                }, {
                    name: 'customer.id',
                    index: 'customer.id',
                    hidden: true
                }, {
                    name: 'customer.label',
                    index: 'customer.name',
                    fixed: false,
                    width: 220,
                    formatter: recurringDecoratorFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridiFramePopup',
                        length: 20,
                        provideFullTextInTooltip: true,
                        url: App.config.context + '/calendar/customer/{id}/bookings/',
                        id: 'customer.id'
                    },
                    search: true,
                    editable: false
                }, {
                    name: 'teamSize',
                    index: 'teamSize',
                    width: 25,
                    fixed: true,
                    align: "center",
                    search: false,
                    sortable: false
                }, {
                    name: 'actualLocationDisplayLabel',
                    index: 'location.description',
                    hidden: true,
                    width: 150,
                    formatter: locationFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        length: 20,
                        provideFullTextInTooltip: true
                    },
                    search: true,
                    editable: false
                }, {
                    name: 'isTelephoneTranslation',
                    hidden: true
                }, {
                    name: 'languageCode',
                    index: 'language.description',
                    fixed: true,
                    width: 50,
                    align: "center",
                    resizable: false,
                    formatter: genericFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridPopup',
                        url: App.config.context + '/language/summary/',
                        id: 'languageCode',
                        tooltip: 'language.label'
                    },
                    sortable: true,
                    sorttype: "string"
                }, {
                    name: 'language.label',
                    index: 'language.description',
                    width: 180,
                    sortable: false,
                    formatter: genericFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridPopup',
                        url: App.config.context + '/language/summary/',
                        id: 'languageCode',
                        tooltip: 'language.label'
                    }
                }, {
                    name: 'visitUpdatedFields',
                    index: 'visitUpdatedFields',
                    hidden: true
                }, {
                    name: 'valid',
                    index: 'valid',
                    hidden: true
                }, {
                    name: 'invalidFields',
                    index: 'invalidFields',
                    hidden: true
                }],
                multiselect: false,
                pager: '#new-bookings-pager',
                rowNum: 10,
                rowList: [10, 20, 30, 50, 100],
                sortname: 'expectedStartDate',
                sortorder: 'asc',
                viewrecords: true,
                /*caption: "New Visits (since  " + (new Date()).addHours(hoursSince).toString("HH:mm") + " (refresh every " + gridRefreshInterval / 1000 / 60 + " mins))",*/
                onSelectRow: function (id) {},
                jsonReader: {
                    repeatitems: false
                },
                loadComplete: function (data) {
                    var newBookings = data.records;

                    if (newBookings > 0) {

                        $(".new-bookings-count").text(newBookings);
                        $("#new-bookings-container").fadeIn(500);
                    }
                },
                gridComplete: function () {

                    $(".gridPopup").colorbox();
                    $(".gridiFramePopup").colorbox({
                        iframe: true,
                        innerWidth: App.config.popups.cal.width,
                        innerHeight: App.config.popups.cal.height,
                        open: false,
                        returnFocus: false
                    });

                    //bind the context menu to the actions
                    $(".actionsIcon", $(this)).contextMenu('bookingActions', {
                        menuStyle: {
                            width: '150px'
                        },
                        bindings: bookingActionsBindings,
                        onShowMenu: function (evt, menu) {
                            if ($(evt.currentTarget).attr('data-booking-mode') === "Video") {
                                $('.menu-start-video', $(menu)).show();
                            } else {
                                $('.menu-start-video', $(menu)).hide();
                            }
                            return menu;
                        }
                    }); //end context menu
                },
                beforeRequest: function () {

                    var postData = $(this).jqGrid('getGridParam', 'postData');
                    var filters;
                    var filtersJSON;

                    if (postData.filters) {

                        filtersJSON = JSON.parse(postData.filters);

                    } else {

                        filtersJSON = {
                            groupOp: "AND",
                            rules: []
                        };
                    }

                    // filter for new bookings
                    filtersJSON = addOrUpdateFilter(filtersJSON, "status.ids", "eq", "" + App.dict.bookingStatus['new'].id + "," + App.dict.bookingStatus.open.id + "");
                    // filter for new bookings created since
                    filtersJSON = addOrUpdateFilter(filtersJSON, "createdDate", "ge", (new Date()).addHours(hoursSince * -1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);
                    // filter for new bookings created up to
                    filtersJSON = addOrUpdateFilter(filtersJSON, "createdDate", "le", (new Date()).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);

                    // decorate all date filters
                    decorateFilter(filtersJSON, "expectedStartDate", "date", App.config.company.config.dateFormat);

                    filters = JSON.stringify(filtersJSON, null, "\t");

                    filters = addOrRemoveBusinessUnitFilter(filters, "customer");

                    postData.filters = filters;

                    $(this).setGridParam({
                        postData: postData
                    });
                }
            });

            $(elemTable).jqGrid('navGrid', elemPager, {
                search: false,
                edit: false,
                add: false,
                del: false,
                refresh: false
            }, {}, {}, {}, {
                multipleSearch: true
            });
            $(elemTable).jqGrid('filterToolbar', {
                stringResult: true,
                searchOnEnter: false,
                autosearch: true
            });

            //set the refresh interval
            setInterval(function () {
                $.app.common.refresh_new_bookings(elemTable, hoursSince, gridRefreshInterval);
            }, gridRefreshInterval);

        };

        /**
         * initializes the new bookings grid for use on a page
         */
        $.app.common.init_offers = function (elemTable, elemPager) {

            // job offers > 24 hours
            $(elemTable).jqGrid({
                url: App.config.context + '/api/company/' + App.config.company.id + '/booking',
                datatype: "json",
                height: "100%",
                width: "100%",
                autowidth: true,
                rowattr: function (rd) {
                    if (!rd.valid && rd.invalidFields.indexOf("vosForm") != -1) {
                        return {
                            "class": "invalid"
                        };
                    } else if (rd.visitUpdatedFields && rd.visitUpdatedFields.length) {
                        return {
                            "class": "updated"
                        };
                    }
                },
                colNames: ['' /* Action */ , 'ID', 'Date', 'Time', 'Int.Tm.', 'Customer ID', 'Customer', 'Location', 'Phone Translation', 'Lang.', 'St.', /*'Time',*/ 'Interpreter', 'Interpreter ID', 'Sz.', 'Reference', 'Requirement', 'hasMoreInfo', 'visitUpdatedFields', 'valid', 'invalidFields'],
                colModel: [{
                    name: 'action',
                    index: 'action',
                    width: 20,
                    fixed: true,
                    align: "center",
                    sortable: false,
                    formatter: actionsFormatter,
                    formatteroptions: {
                        grid: "offers-bookings",
                        template: "#actionsContainerTemplate",
                        title: "Job #: "
                    },
                    search: false,
                    editable: false
                }, {
                    name: 'id',
                    index: 'id',
                    hidden: false,
                    width: 60,
                    fixed: true,
                    align: "center",
                    formatter: jobEditingFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridiFramePopup',
                        url: App.config.context + '/booking/bare/',
                        id: 'id'
                    },
                    search: true
                }, {
                    name: 'startDate',
                    index: 'expectedStartDate',
                    hidden: false,
                    width: 65,
                    fixed: true,
                    align: "center",
                    sortable: true,
                    sorttype: "date",
                    resizable: false,
                    formatter: genericFormatter,
                    formatteroptions: {
                        col: "startDate",
                        tooltip: 'duration'
                    },
                    unformat: missingUnFormatter,
                    search: false,
                    searchoptions: {
                        //dataInit: $.booking.dashboard.frame.dateSearchInit,
                        attr: {
                            title: 'Select Date'
                        }
                    },
                    editable: true,
                    editoptions: {
                        //dataInit: $.booking.dashboard.frame.dateSearchInit,
                        attr: {
                            title: 'Select Date'
                        }
                    }
                }, {
                    name: 'startTime',
                    index: 'expectedStartDate',
                    width: 50,
                    fixed: true,
                    align: "center",
                    sorttype: "date",
                    resizable: false,
                    sortable: true,
                    formatter: genericFormatter,
                    formatteroptions: {
                        col: "startTime",
                        tooltip: 'duration'
                    },
                    unformat: missingUnFormatter,
                    search: false,
                    editable: true,
                    editoptions: {
                        dataInit: timeSearchInit,
                        attr: {
                            title: 'Select Time'
                        }
                    }
                }, {
                    name: 'terpStartTime',
                    index: 'expectedStartDate',
                    hidden: !App.config.company.config.showColInterpreterTimezone,
                    width: 50,
                    fixed: true,
                    align: "center",
                    sorttype: "date",
                    resizable: false,
                    sortable: true,
                    formatter: genericFormatter,
                    formatteroptions: {
                        col: "terpStartTime",
                        tooltip: 'terpTimeZone'
                    },
                    unformat: missingUnFormatter,
                    search: false,
                    editable: true,
                    editoptions: {
                        dataInit: timeSearchInit,
                        attr: {
                            title: 'Select Time'
                        }
                    }
                }, {
                    name: 'customer.id',
                    index: 'customer.id',
                    hidden: true
                }, {
                    name: 'customer.label',
                    index: 'customer.name',
                    hidden: false,
                    fixed: true,
                    width: 140,
                    formatter: recurringDecoratorFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridiFramePopup',
                        length: 20,
                        provideFullTextInTooltip: true,
                        url: App.config.context + '/calendar/customer/{id}/bookings/',
                        id: 'customer.id'
                    },
                    search: true,
                    editable: false
                }, {
                    name: 'actualLocationDisplayLabel',
                    index: 'location.description',
                    hidden: false,
                    width: 140,
                    formatter: locationFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        length: 20,
                        provideFullTextInTooltip: true
                    },
                    search: true,
                    editable: false
                }, {
                    name: 'isTelephoneTranslation',
                    hidden: true
                }, {
                    name: 'languageCode',
                    index: 'language.description',
                    hidden: true,
                    width: 40,
                    align: "center",
                    resizable: false,
                    formatter: genericFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridPopup',
                        url: App.config.context + '/language/summary/',
                        id: 'languageCode',
                        tooltip: 'language.label'
                    },
                    sorttype: "string"
                }, {
                    name: 'status.id',
                    index: 'status.id',
                    width: 40,
                    fixed: true,
                    formatter: bookingStatusFormatter,
                    unformat: selectUnFormatter,
                    //formatter: 'select',
                    search: false,
                    stype: "select",
                    searchoptions: {
                        value: makeEditList(App.dict.bookingStatus)
                    },
                    editable: false,
                    edittype: "select",
                    editoptions: {
                        value: makeEditList(App.dict.bookingStatus)
                    }
                }, {
                    name: 'interpreter.label',
                    index: 'interpreter.name',
                    width: 150,
                    hidden: true,
                    formatter: interpreterFormatter,
                    unformat: genericUnFormatter,
                    sortable: true,
                    sorttype: "string"
                }, {
                    name: 'interpreter.id',
                    index: 'interpreter.id',
                    hidden: true
                }, {
                    name: 'teamSize',
                    index: 'teamSize',
                    width: 25,
                    fixed: true,
                    align: "center",
                    search: false,
                    sortable: false
                }, {
                    name: 'ref',
                    index: 'refs.ref',
                    hidden: false,
                    width: 100,
                    fixed: true,
                    align: "center",
                    resizable: false,
                    formatter: notesFormatter,
                    formatteroptions: {
                        context: App.config.context
                    },
                    unformat: genericUnFormatter,
                    sortable: true,
                    sorttype: "string"
                }, {
                    name: 'requirements',
                    index: 'requirements.name',
                    hidden: false,
                    width: 100,
                    fixed: true,
                    align: "center",
                    resizable: false,
                    formatter: bookingCriteriaFormatter,
                    formatteroptions: {
                        context: App.config.context
                    },
                    unformat: genericUnFormatter,
                    sortable: true,
                    sorttype: "string"
                }, {
                    name: 'hasMoreInfo',
                    index: 'hasMoreInfo',
                    hidden: true
                }, {
                    name: 'visitUpdatedFields',
                    index: 'visitUpdatedFields',
                    hidden: true
                }, {
                    name: 'valid',
                    index: 'valid',
                    hidden: true
                }, {
                    name: 'invalidFields',
                    index: 'invalidFields',
                    hidden: true
                }],
                multiselect: false,
                pager: elemPager,
                rowNum: 30,
                rowList: [10, 20, 30, 50, 100],
                sortname: "expectedStartDate",
                sortorder: "asc",
                page: 1,
                viewrecords: true,
                onSelectRow: function (id) {},
                jsonReader: {
                    repeatitems: false
                },
                beforeRequest: function () {

                    var postData = $(this).jqGrid('getGridParam', 'postData');
                    var filters;
                    var filtersJSON;

                    if (postData.filters) {

                        filtersJSON = JSON.parse(postData.filters);

                    } else {

                        filtersJSON = {
                            groupOp: "AND",
                            rules: []
                        };
                    }

                    var dt = $("#calendar").datepicker('getDate');

                    if (dt === undefined || dt === null) {
                        dt = new Date();
                    }

                    filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", App.dict.bookingStatus.offered.id);
                    // since 24 hours ago
                    filtersJSON = addOrUpdateFilter(filtersJSON, "jobOffers.createdDate", "le", dt.addDays(-1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);

                    filters = JSON.stringify(filtersJSON, null, "\t");

                    filters = addOrRemoveBusinessUnitFilter(filters, "customer");

                    postData.filters = filters;

                    $(this).setGridParam({
                        postData: postData
                    });
                },
                postData: {
                    //filters: dashboardPrefs.data.filters
                },
                excel: true,
                gridComplete: function () {

                    //$(".gridPopup").colorbox({width: 650, height: 400});
                    $(".gridPopup").colorbox();
                    $(".gridiFramePopup").colorbox({
                        iframe: true,
                        innerWidth: App.config.popups.cal.width,
                        innerHeight: App.config.popups.cal.height,
                        open: false,
                        returnFocus: false
                    });

                    //bind the context menu to the actions
                    $(".actionsIcon", $(this)).contextMenu('bookingActions', {
                        menuStyle: {
                            width: '150px'
                        },
                        bindings: bookingActionsBindings,
                        onShowMenu: function (evt, menu) {
                            if ($(evt.currentTarget).attr('data-booking-mode') === "Video") {
                                $('.menu-start-video', $(menu)).show();
                            } else {
                                $('.menu-start-video', $(menu)).hide();
                            }
                            return menu;
                        }
                    }); //end context menu
                }
            });

            $(elemTable).jqGrid('navGrid', elemPager, {
                search: false,
                edit: false,
                add: false,
                del: false,
                refresh: false
            }, {}, {}, {}, {
                multipleSearch: true
            });
            // add custom button to export the data to csv
            $(elemTable).jqGrid('navButtonAdd', elemPager, {
                caption: "Export to Excel",
                onClickButton: function () {

                    var format = "xlsx";

                    var postData = $(this).jqGrid('getGridParam', 'postData');
                    var filters;
                    var filtersJSON;

                    if (postData.filters) {

                        filtersJSON = JSON.parse(postData.filters);

                    } else {

                        filtersJSON = {
                            groupOp: "AND",
                            rules: []
                        };
                    }

                    var params = {
                        "company.id": App.config.company.id,
                        "export": "all",
                        "rows": 2000,
                        "page": 1,
                        "sidx": "expectedStartDate",
                        "oper": "excel",
                        "filters": JSON.stringify(filtersJSON, null, "\t")
                    };

                    // booking export
                    var bookings = new $.report.Runner({
                        baseUrl: App.config.context + '/api/export/bookings',
                        format: format,
                        params: params,
                        asynch: true
                    });

                    // export
                    bookings.exprt();

                }
            });
            $(elemTable).jqGrid('filterToolbar', {
                stringResult: true,
                searchOnEnter: false,
                autosearch: true
            });
        };

        /**
         * initializes the new bookings grid for use on a page
         */
        $.app.common.init_unconfirmed = function (elemTable, elemPager) {

            //
            // unconfirmed jobs > 24 hours
            $(elemTable).jqGrid({
                url: App.config.context + '/api/company/' + App.config.company.id + '/booking',
                datatype: "json",
                height: "100%",
                width: "100%",
                autowidth: true,
                rowattr: function (rd) {
                    if (!rd.valid && rd.invalidFields.indexOf("vosForm") != -1) {
                        return {
                            "class": "invalid"
                        };
                    } else if (rd.visitUpdatedFields && rd.visitUpdatedFields.length) {
                        return {
                            "class": "updated"
                        };
                    }
                },
                colNames: ['' /* Action */ , 'ID', 'Date', 'Time', 'Int.Tm.', 'Customer ID', 'Customer', 'Location', 'Phone Translation', 'Lang.', 'St.', /*'Time',*/ 'Interpreter', 'Interpreter ID', 'Sz.', 'Reference', 'Requirement', 'hasMoreInfo', 'visitUpdatedFields', 'valid', 'invalidFields'],
                colModel: [{
                    name: 'action',
                    index: 'action',
                    width: 20,
                    fixed: true,
                    align: "center",
                    sortable: false,
                    formatter: actionsFormatter,
                    formatteroptions: {
                        grid: "unconfirmed-bookings",
                        template: "#actionsContainerTemplate",
                        title: "Job #: "
                    },
                    search: false,
                    editable: false
                }, {
                    name: 'id',
                    index: 'id',
                    hidden: false,
                    width: 60,
                    fixed: true,
                    align: "center",
                    formatter: jobEditingFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridiFramePopup',
                        url: App.config.context + '/booking/bare/',
                        id: 'id'
                    },
                    search: true
                }, {
                    name: 'startDate',
                    index: 'expectedStartDate',
                    hidden: false,
                    width: 65,
                    fixed: true,
                    align: "center",
                    sortable: true,
                    sorttype: "date",
                    resizable: false,
                    formatter: genericFormatter,
                    formatteroptions: {
                        col: "startDate",
                        tooltip: 'duration'
                    },
                    unformat: missingUnFormatter,
                    search: false,
                    searchoptions: {
                        //dataInit: $.booking.dashboard.frame.dateSearchInit,
                        attr: {
                            title: 'Select Date'
                        }
                    },
                    editable: true,
                    editoptions: {
                        //dataInit: $.booking.dashboard.frame.dateSearchInit,
                        attr: {
                            title: 'Select Date'
                        }
                    }
                }, {
                    name: 'startTime',
                    index: 'expectedStartDate',
                    width: 50,
                    fixed: true,
                    align: "center",
                    sorttype: "date",
                    resizable: false,
                    sortable: true,
                    formatter: genericFormatter,
                    formatteroptions: {
                        col: "startTime",
                        tooltip: 'duration'
                    },
                    unformat: missingUnFormatter,
                    search: false,
                    editable: true,
                    editoptions: {
                        dataInit: timeSearchInit,
                        attr: {
                            title: 'Select Time'
                        }
                    }
                }, {
                    name: 'terpStartTime',
                    index: 'expectedStartDate',
                    hidden: !App.config.company.config.showColInterpreterTimezone,
                    width: 50,
                    fixed: true,
                    align: "center",
                    sorttype: "date",
                    resizable: false,
                    sortable: true,
                    formatter: genericFormatter,
                    formatteroptions: {
                        col: "terpStartTime",
                        tooltip: 'terpTimeZone'
                    },
                    unformat: missingUnFormatter,
                    search: false,
                    editable: true,
                    editoptions: {
                        dataInit: timeSearchInit,
                        attr: {
                            title: 'Select Time'
                        }
                    }
                }, {
                    name: 'customer.id',
                    index: 'customer.id',
                    hidden: true
                }, {
                    name: 'customer.label',
                    index: 'customer.name',
                    hidden: false,
                    fixed: true,
                    width: 140,
                    formatter: recurringDecoratorFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridiFramePopup',
                        length: 20,
                        provideFullTextInTooltip: true,
                        url: App.config.context + '/calendar/customer/{id}/bookings/',
                        id: 'customer.id'
                    },
                    search: true,
                    editable: false
                }, {
                    name: 'actualLocationDisplayLabel',
                    index: 'location.description',
                    hidden: false,
                    width: 140,
                    formatter: locationFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        length: 20,
                        provideFullTextInTooltip: true
                    },
                    search: true,
                    editable: false
                }, {
                    name: 'isTelephoneTranslation',
                    hidden: true
                }, {
                    name: 'languageCode',
                    index: 'language.description',
                    hidden: true,
                    width: 40,
                    align: "center",
                    resizable: false,
                    formatter: genericFormatter,
                    unformat: genericUnFormatter,
                    formatteroptions: {
                        cssClass: 'gridPopup',
                        url: App.config.context + '/language/summary/',
                        id: 'languageCode',
                        tooltip: 'language.label'
                    },
                    sorttype: "string"
                }, {
                    name: 'status.id',
                    index: 'status.id',
                    width: 40,
                    fixed: true,
                    formatter: bookingStatusFormatter,
                    unformat: selectUnFormatter,
                    //formatter: 'select',
                    search: false,
                    stype: "select",
                    searchoptions: {
                        value: makeEditList(App.dict.bookingStatus)
                    },
                    editable: false,
                    edittype: "select",
                    editoptions: {
                        value: makeEditList(App.dict.bookingStatus)
                    }
                }, {
                    name: 'interpreter.label',
                    index: 'interpreter.name',
                    width: 150,
                    hidden: false,
                    formatter: interpreterFormatter,
                    unformat: genericUnFormatter,
                    sortable: true,
                    sorttype: "string"
                }, {
                    name: 'interpreter.id',
                    index: 'interpreter.id',
                    hidden: true
                }, {
                    name: 'teamSize',
                    index: 'teamSize',
                    width: 25,
                    fixed: true,
                    align: "center",
                    search: false,
                    sortable: false
                }, {
                    name: 'ref',
                    index: 'refs.ref',
                    hidden: false,
                    width: 100,
                    fixed: true,
                    align: "center",
                    resizable: false,
                    formatter: notesFormatter,
                    formatteroptions: {
                        context: App.config.context
                    },
                    unformat: genericUnFormatter,
                    sortable: true,
                    sorttype: "string"
                }, {
                    name: 'requirements',
                    index: 'requirements.name',
                    hidden: false,
                    width: 100,
                    fixed: true,
                    align: "center",
                    resizable: false,
                    formatter: bookingCriteriaFormatter,
                    formatteroptions: {
                        context: App.config.context
                    },
                    unformat: genericUnFormatter,
                    sortable: true,
                    sorttype: "string"
                }, {
                    name: 'hasMoreInfo',
                    index: 'hasMoreInfo',
                    hidden: true
                }, {
                    name: 'visitUpdatedFields',
                    index: 'visitUpdatedFields',
                    hidden: true
                }, {
                    name: 'valid',
                    index: 'valid',
                    hidden: true
                }, {
                    name: 'invalidFields',
                    index: 'invalidFields',
                    hidden: true
                }],
                multiselect: false,
                pager: elemPager,
                rowNum: 30,
                rowList: [10, 20, 30, 50, 100],
                sortname: "expectedStartDate",
                sortorder: "asc",
                page: 1,
                viewrecords: true,
                onSelectRow: function (id) {},
                jsonReader: {
                    repeatitems: false
                },
                beforeRequest: function () {

                    var postData = $(this).jqGrid('getGridParam', 'postData');
                    var filters;
                    var filtersJSON;

                    if (postData.filters) {

                        filtersJSON = JSON.parse(postData.filters);

                    } else {

                        filtersJSON = {
                            groupOp: "AND",
                            rules: []
                        };
                    }

                    var dt = $("#calendar").datepicker('getDate');

                    if (dt === undefined || dt === null) {
                        dt = new Date();
                    }

                    filtersJSON = addOrUpdateFilter(filtersJSON, "status.id", "eq", App.dict.bookingStatus.assigned.id);
                    // since 24 hours ago
                    filtersJSON = addOrUpdateFilter(filtersJSON, "assignmentDate", "le", dt.addDays(-1).toString(App.config.company.config.calDateTimeFormat), "date", App.config.company.config.dateTimeFormat);

                    filters = JSON.stringify(filtersJSON, null, "\t");

                    filters = addOrRemoveBusinessUnitFilter(filters, "customer");

                    postData.filters = filters;

                    $(this).setGridParam({
                        postData: postData
                    });
                },
                postData: {
                    //filters: dashboardPrefs.data.filters
                },
                excel: true,
                gridComplete: function () {

                    //$(".gridPopup").colorbox({width: 650, height: 400});
                    $(".gridPopup").colorbox();
                    $(".gridiFramePopup").colorbox({
                        iframe: true,
                        innerWidth: App.config.popups.cal.width,
                        innerHeight: App.config.popups.cal.height,
                        open: false,
                        returnFocus: false
                    });

                    //bind the context menu to the actions
                    $(".actionsIcon", $(this)).contextMenu('bookingActions', {
                        menuStyle: {
                            width: '150px'
                        },
                        bindings: bookingActionsBindings,
                        onShowMenu: function (evt, menu) {
                            if ($(evt.currentTarget).attr('data-booking-mode') === "Video") {
                                $('.menu-start-video', $(menu)).show();
                            } else {
                                $('.menu-start-video', $(menu)).hide();
                            }
                            return menu;
                        }
                    }); //end context menu
                }
            });

            $(elemTable).jqGrid('navGrid', elemPager, {
                search: false,
                edit: false,
                add: false,
                del: false,
                refresh: false
            }, {}, {}, {}, {
                multipleSearch: true
            });
            // add custom button to export the data to csv
            $(elemTable).jqGrid('navButtonAdd', elemPager, {
                caption: "Export to Excel",
                onClickButton: function () {

                    var format = "xlsx";

                    var postData = $(this).jqGrid('getGridParam', 'postData');
                    var filters;
                    var filtersJSON;

                    if (postData.filters) {

                        filtersJSON = JSON.parse(postData.filters);

                    } else {

                        filtersJSON = {
                            groupOp: "AND",
                            rules: []
                        };
                    }

                    var params = {
                        "company.id": App.config.company.id,
                        "export": "all",
                        "rows": 2000,
                        "page": 1,
                        "sidx": "expectedStartDate",
                        "oper": "excel",
                        "filters": JSON.stringify(filtersJSON, null, "\t")
                    };

                    // booking export
                    var bookings = new $.report.Runner({
                        baseUrl: App.config.context + '/api/export/bookings',
                        format: format,
                        params: params,
                        asynch: true
                    });

                    // export
                    bookings.exprt();

                }
            });
            $(elemTable).jqGrid('filterToolbar', {
                stringResult: true,
                searchOnEnter: false,
                autosearch: true
            });

        };

        /**
         *
         * @param elemTable
         * @param hoursSince
         * @param gridRefreshInterval
         */
        $.app.common.refresh_new_bookings = function (elemTable, hoursSince, gridRefreshInterval) {
            var now = new Date();

            var postData = $(elemTable).jqGrid('getGridParam', 'postData');

            var filters = postData.filters;

            filters = addOrRemoveBusinessUnitFilter(filters, "customer");

            postData.filters = filters;

            $(elemTable).jqGrid('setGridParam', {
                url: App.config.context + '/api/company/' + App.config.company.id + '/booking',
                postData: postData,
                caption: "New Jobs (since  " + (new Date()).addHours(hoursSince * -1).toString(App.config.company.config.dateFormat + " " + App.config.company.config.jsTimeFormat) + " (refresh every " + gridRefreshInterval / 1000 / 60 + " mins))"
            }).trigger('reloadGrid');
        };


        $.app.common.refresh_jqGrid = function (elemTable, postData, type) {

            postData.filters = addOrRemoveBusinessUnitFilter(postData.filters, type);

            $(elemTable).jqGrid('setGridParam', {
                datatype: "json",
                postData: postData
            }).trigger('reloadGrid');
        };

    }; // end bootstrap

})(jQuery);
