












//<![CDATA[
/* enable strict mode */
"use strict"; //# sourceURL=app/common/init.js

var App = App || {};

//check debug flag
App.dbg = false;

/* dictionary object */
App.dict = App.dict || {};
App.dict.bookingStatus = {};

//depends on underscore templating
_.templateSettings = {
    escape: /<\@-(.+?)\@>/gim,
    interpolate: /<\@\=(.+?)\@>/gim,
    evaluate: /<\@(.+?)\@>/gim
};


    App.dict.bookingStatus['new'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 1,
  "defaultOption": true,
  "description": "New job, recently opened, awaiting confirmation.",
  "inOrder": 1,
  "l10nKey": null,
  "name": "New",
  "nameKey": "new"
};

    App.dict.bookingStatus['open'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 2,
  "defaultOption": false,
  "description": "Job awaiting assignment.",
  "inOrder": 2,
  "l10nKey": null,
  "name": "Open",
  "nameKey": "open"
};

    App.dict.bookingStatus['offered'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 10,
  "defaultOption": null,
  "description": "Job Offered to interpreter(s)",
  "inOrder": 3,
  "l10nKey": null,
  "name": "Offered",
  "nameKey": "offered"
};

    App.dict.bookingStatus['assigned'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 3,
  "defaultOption": false,
  "description": "Interpreter assigned",
  "inOrder": 4,
  "l10nKey": null,
  "name": "Assigned",
  "nameKey": "assigned"
};

    App.dict.bookingStatus['confirmed'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 4,
  "defaultOption": false,
  "description": "Job confirmed by the interpreter.",
  "inOrder": 5,
  "l10nKey": null,
  "name": "Confirmed",
  "nameKey": "confirmed"
};

    App.dict.bookingStatus['closed'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 9,
  "defaultOption": false,
  "description": "Job closed.",
  "inOrder": 6,
  "l10nKey": null,
  "name": "Closed",
  "nameKey": "closed"
};

    App.dict.bookingStatus['cancelled'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 8,
  "defaultOption": false,
  "description": "Job has been cancelled by company or customer.",
  "inOrder": 8,
  "l10nKey": null,
  "name": "Cancelled",
  "nameKey": "cancelled"
};

    App.dict.bookingStatus['declined'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 6,
  "defaultOption": false,
  "description": "Job has been unfulfilled by company.",
  "inOrder": 9,
  "l10nKey": null,
  "name": "Unfulfilled",
  "nameKey": "declined"
};

    App.dict.bookingStatus['nonattendance'] = {
  "class": "com.ngs.id.model.type.BookingStatus",
  "id": 7,
  "defaultOption": false,
  "description": "Interpreter did not show",
  "inOrder": 10,
  "l10nKey": null,
  "name": "Non-Attendance",
  "nameKey": "nonattendance"
};


App.dict.yesNoType = {};



    App.dict.yesNoType['y'] = {
  "class": "com.ngs.id.model.type.YesNoType",
  "id": 1,
  "defaultOption": true,
  "description": null,
  "l10nKey": null,
  "name": "Yes",
  "nameKey": "y"
};

    App.dict.yesNoType['n'] = {
  "class": "com.ngs.id.model.type.YesNoType",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "No",
  "nameKey": "n"
};


App.dict.paymentStatus = {};


    App.dict.paymentStatus['payable'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 1,
  "defaultOption": true,
  "description": "Eligible for payment",
  "l10nKey": null,
  "name": "Payable",
  "nameKey": "payable"
};

    App.dict.paymentStatus['notpayable'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 2,
  "defaultOption": false,
  "description": "Not eligible for payment",
  "l10nKey": null,
  "name": "Not Payable",
  "nameKey": "notpayable"
};

    App.dict.paymentStatus['pending'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 3,
  "defaultOption": false,
  "description": "Payment Pending",
  "l10nKey": null,
  "name": "Pending",
  "nameKey": "pending"
};

    App.dict.paymentStatus['paidpayment'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 4,
  "defaultOption": false,
  "description": "Payment Paid",
  "l10nKey": null,
  "name": "Paid",
  "nameKey": "paidpayment"
};

    App.dict.paymentStatus['failed'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 5,
  "defaultOption": false,
  "description": "Payment Failed",
  "l10nKey": null,
  "name": "Failed",
  "nameKey": "failed"
};

    App.dict.paymentStatus['cancelled'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 6,
  "defaultOption": false,
  "description": "Payment Cancelled",
  "l10nKey": null,
  "name": "Cancelled",
  "nameKey": "cancelled"
};

    App.dict.paymentStatus['reviewedandapproved'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 7,
  "defaultOption": false,
  "description": "Reviewed and Approved",
  "l10nKey": null,
  "name": "Reviewed and Approved",
  "nameKey": "reviewedandapproved"
};

    App.dict.paymentStatus['paymentonhold'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 8,
  "defaultOption": false,
  "description": "Payment On Hold",
  "l10nKey": null,
  "name": "Payment On Hold",
  "nameKey": "paymentonhold"
};

    App.dict.paymentStatus['holdpayment'] = {
  "class": "com.ngs.id.model.type.PaymentStatus",
  "id": 9,
  "defaultOption": false,
  "description": "Hold Payment",
  "l10nKey": null,
  "name": "Hold Payment",
  "nameKey": "holdpayment"
};


App.dict.invoiceStatus = {};


    App.dict.invoiceStatus['invoiceable'] = {
  "class": "com.ngs.id.model.type.InvoiceStatus",
  "id": 1,
  "defaultOption": true,
  "description": "Eligible for invoicing",
  "l10nKey": null,
  "name": "Invoiceable",
  "nameKey": "invoiceable"
};

    App.dict.invoiceStatus['notinvoiceable'] = {
  "class": "com.ngs.id.model.type.InvoiceStatus",
  "id": 2,
  "defaultOption": false,
  "description": "Not eligible for invoicing",
  "l10nKey": null,
  "name": "Not Invoiceable",
  "nameKey": "notinvoiceable"
};

    App.dict.invoiceStatus['invoiced'] = {
  "class": "com.ngs.id.model.type.InvoiceStatus",
  "id": 3,
  "defaultOption": false,
  "description": "Invoiced, payment pending",
  "l10nKey": null,
  "name": "Invoiced",
  "nameKey": "invoiced"
};

    App.dict.invoiceStatus['paidinvoice'] = {
  "class": "com.ngs.id.model.type.InvoiceStatus",
  "id": 4,
  "defaultOption": false,
  "description": "Invoice Paid",
  "l10nKey": null,
  "name": "Paid Invoice",
  "nameKey": "paidinvoice"
};

    App.dict.invoiceStatus['failed'] = {
  "class": "com.ngs.id.model.type.InvoiceStatus",
  "id": 5,
  "defaultOption": false,
  "description": "Invoice Failed",
  "l10nKey": null,
  "name": "Failed",
  "nameKey": "failed"
};

    App.dict.invoiceStatus['cancelled'] = {
  "class": "com.ngs.id.model.type.InvoiceStatus",
  "id": 6,
  "defaultOption": false,
  "description": "Invoice Cancelled",
  "l10nKey": null,
  "name": "Cancelled",
  "nameKey": "cancelled"
};

    App.dict.invoiceStatus['reviewedandapproved'] = {
  "class": "com.ngs.id.model.type.InvoiceStatus",
  "id": 7,
  "defaultOption": false,
  "description": "Reviewed and Approved",
  "l10nKey": null,
  "name": "Reviewed and Approved",
  "nameKey": "reviewedandapproved"
};


App.dict.employmentEligibilityStates = {};


    App.dict.employmentEligibilityStates['valid'] = {
  "class": "com.ngs.id.model.type.EmploymentEligibilityStatus",
  "id": 2,
  "defaultOption": false,
  "description": "Validated employment eligibility",
  "l10nKey": null,
  "name": "Valid",
  "nameKey": "valid"
};

    App.dict.employmentEligibilityStates['pending'] = {
  "class": "com.ngs.id.model.type.EmploymentEligibilityStatus",
  "id": 1,
  "defaultOption": false,
  "description": "Pending employment eligibility",
  "l10nKey": null,
  "name": "Pending",
  "nameKey": "pending"
};

    App.dict.employmentEligibilityStates['notstarted'] = {
  "class": "com.ngs.id.model.type.EmploymentEligibilityStatus",
  "id": 4,
  "defaultOption": false,
  "description": "Not Started",
  "l10nKey": null,
  "name": "Not Started",
  "nameKey": "notstarted"
};

    App.dict.employmentEligibilityStates['invalid'] = {
  "class": "com.ngs.id.model.type.EmploymentEligibilityStatus",
  "id": 3,
  "defaultOption": false,
  "description": "Invalidated employment eligibility",
  "l10nKey": null,
  "name": "Invalid",
  "nameKey": "invalid"
};


App.dict.paymentMethod = {};


    App.dict.paymentMethod['emp'] = {
  "class": "com.ngs.id.model.type.PaymentMethod",
  "id": 1,
  "defaultOption": true,
  "description": "Paid via payroll system",
  "l10nKey": null,
  "name": "Payroll (Employee)",
  "nameKey": "emp"
};

    App.dict.paymentMethod['ltd'] = {
  "class": "com.ngs.id.model.type.PaymentMethod",
  "id": 2,
  "defaultOption": false,
  "description": "Paid to corporation",
  "l10nKey": null,
  "name": "Vendor (Corp-to-Corp)",
  "nameKey": "ltd"
};

    App.dict.paymentMethod['con'] = {
  "class": "com.ngs.id.model.type.PaymentMethod",
  "id": 3,
  "defaultOption": false,
  "description": "Sub-contractor",
  "l10nKey": null,
  "name": "Contractor",
  "nameKey": "con"
};

    App.dict.paymentMethod['os'] = {
  "class": "com.ngs.id.model.type.PaymentMethod",
  "id": 4,
  "defaultOption": false,
  "description": "Overseas entity",
  "l10nKey": null,
  "name": "Overseas",
  "nameKey": "os"
};

    App.dict.paymentMethod['eft'] = {
  "class": "com.ngs.id.model.type.PaymentMethod",
  "id": 5,
  "defaultOption": false,
  "description": "Electronic funds transfer",
  "l10nKey": null,
  "name": "EFT",
  "nameKey": "eft"
};

    App.dict.paymentMethod['paypal'] = {
  "class": "com.ngs.id.model.type.PaymentMethod",
  "id": 6,
  "defaultOption": false,
  "description": "Paypal",
  "l10nKey": null,
  "name": "Paypal",
  "nameKey": "paypal"
};

    App.dict.paymentMethod['check'] = {
  "class": "com.ngs.id.model.type.PaymentMethod",
  "id": 7,
  "defaultOption": false,
  "description": "Check",
  "l10nKey": null,
  "name": "Check",
  "nameKey": "check"
};

    App.dict.paymentMethod['ext'] = {
  "class": "com.ngs.id.model.type.PaymentMethod",
  "id": 8,
  "defaultOption": false,
  "description": "External Agency",
  "l10nKey": null,
  "name": "External Agency",
  "nameKey": "ext"
};


App.dict.ratingScale = {};


    App.dict.ratingScale['1'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 1,
  "defaultOption": false,
  "description": "Highest rating",
  "l10nKey": null,
  "name": "1",
  "nameKey": "1"
};

    App.dict.ratingScale['2'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "2",
  "nameKey": "2"
};

    App.dict.ratingScale['3'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 3,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "3",
  "nameKey": "3"
};

    App.dict.ratingScale['4'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 4,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "4",
  "nameKey": "4"
};

    App.dict.ratingScale['5'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 5,
  "defaultOption": true,
  "description": "Average rating",
  "l10nKey": null,
  "name": "5",
  "nameKey": "5"
};

    App.dict.ratingScale['6'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 6,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "6",
  "nameKey": "6"
};

    App.dict.ratingScale['7'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 7,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "7",
  "nameKey": "7"
};

    App.dict.ratingScale['8'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 8,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "8",
  "nameKey": "8"
};

    App.dict.ratingScale['9'] = {
  "class": "com.ngs.id.model.type.RatingScale",
  "id": 9,
  "defaultOption": false,
  "description": "Lowest rating",
  "l10nKey": null,
  "name": "9",
  "nameKey": "9"
};


App.dict.assignmentTiers = {};


    App.dict.assignmentTiers['emp-pre'] = {
  "class": "com.ngs.id.model.type.AssignmentTier",
  "id": 1,
  "defaultOption": false,
  "description": "Preferred employee",
  "l10nKey": null,
  "name": "Employee (Preferred)",
  "nameKey": "emp-pre"
};

    App.dict.assignmentTiers['emp'] = {
  "class": "com.ngs.id.model.type.AssignmentTier",
  "id": 2,
  "defaultOption": true,
  "description": "Employee",
  "l10nKey": null,
  "name": "Employee",
  "nameKey": "emp"
};

    App.dict.assignmentTiers['con-pre'] = {
  "class": "com.ngs.id.model.type.AssignmentTier",
  "id": 3,
  "defaultOption": false,
  "description": "Preferred contractor",
  "l10nKey": null,
  "name": "Contractor (Preferred)",
  "nameKey": "con-pre"
};

    App.dict.assignmentTiers['con'] = {
  "class": "com.ngs.id.model.type.AssignmentTier",
  "id": 4,
  "defaultOption": false,
  "description": "Contractor",
  "l10nKey": null,
  "name": "Contractor",
  "nameKey": "con"
};

    App.dict.assignmentTiers['ven-pre'] = {
  "class": "com.ngs.id.model.type.AssignmentTier",
  "id": 5,
  "defaultOption": false,
  "description": "Vendor preferred",
  "l10nKey": null,
  "name": "Vendor (Preferred)",
  "nameKey": "ven-pre"
};

    App.dict.assignmentTiers['ven'] = {
  "class": "com.ngs.id.model.type.AssignmentTier",
  "id": 6,
  "defaultOption": false,
  "description": "Vendor",
  "l10nKey": null,
  "name": "Vendor",
  "nameKey": "ven"
};

    App.dict.assignmentTiers['exclude'] = {
  "class": "com.ngs.id.model.type.AssignmentTier",
  "id": 7,
  "defaultOption": false,
  "description": "Excluded from automatic assignment",
  "l10nKey": null,
  "name": "Excluded",
  "nameKey": "exclude"
};


App.dict.contactType = {};


    App.dict.contactType['interpreter'] = {
  "class": "com.ngs.id.model.type.ContactType",
  "id": 1,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Interpreter",
  "nameKey": "interpreter"
};

    App.dict.contactType['translator'] = {
  "class": "com.ngs.id.model.type.ContactType",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Translator",
  "nameKey": "translator"
};

    App.dict.contactType['customer'] = {
  "class": "com.ngs.id.model.type.ContactType",
  "id": 3,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Customer",
  "nameKey": "customer"
};

    App.dict.contactType['vendor'] = {
  "class": "com.ngs.id.model.type.ContactType",
  "id": 4,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Vendor (Supplier)",
  "nameKey": "vendor"
};

    App.dict.contactType['other'] = {
  "class": "com.ngs.id.model.type.ContactType",
  "id": 5,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Other",
  "nameKey": "other"
};

    App.dict.contactType['overflow'] = {
  "class": "com.ngs.id.model.type.ContactType",
  "id": 6,
  "defaultOption": null,
  "description": "overflow",
  "l10nKey": null,
  "name": "overflow",
  "nameKey": "overflow"
};


App.dict.contractType = {};


    App.dict.contractType['contract'] = {
  "class": "com.ngs.id.model.type.ContractType",
  "id": 1,
  "defaultOption": true,
  "description": "Under contract",
  "l10nKey": null,
  "name": "Contract",
  "nameKey": "contract"
};

    App.dict.contractType['adhoc'] = {
  "class": "com.ngs.id.model.type.ContractType",
  "id": 2,
  "defaultOption": false,
  "description": "Ad-hoc relationship",
  "l10nKey": null,
  "name": "Ad-hoc",
  "nameKey": "adhoc"
};


App.dict.contactStatus = {};


    App.dict.contactStatus['induction'] = {
  "class": "com.ngs.id.model.type.InductionContactStatus",
  "id": 1,
  "defaultOption": true,
  "description": "Initial state",
  "l10nKey": null,
  "name": "Induction",
  "nameKey": "induction"
};

    App.dict.contactStatus['active'] = {
  "class": "com.ngs.id.model.type.ActiveContactStatus",
  "id": 2,
  "defaultOption": false,
  "description": "Active",
  "l10nKey": null,
  "name": "Active",
  "nameKey": "active"
};

    App.dict.contactStatus['under_review'] = {
  "class": "com.ngs.id.model.type.UnderReviewContactStatus",
  "id": 3,
  "defaultOption": false,
  "description": "Under Review",
  "l10nKey": null,
  "name": "Under Review",
  "nameKey": "under_review"
};

    App.dict.contactStatus['inactive'] = {
  "class": "com.ngs.id.model.type.InactiveStatus",
  "id": 4,
  "defaultOption": false,
  "description": "Inactive",
  "l10nKey": null,
  "name": "Inactive",
  "nameKey": "inactive"
};


App.dict.addressType = {};


    App.dict.addressType['home'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 1,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Home",
  "nameKey": "home"
};

    App.dict.addressType['business'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Business",
  "nameKey": "business"
};

    App.dict.addressType['billing'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 3,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Billing",
  "nameKey": "billing"
};

    App.dict.addressType['service'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 4,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Service Location",
  "nameKey": "service"
};

    App.dict.addressType['other'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 5,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Other",
  "nameKey": "other"
};


App.dict.yesNoType = {};


    App.dict.yesNoType['y'] = {
  "class": "com.ngs.id.model.type.YesNoType",
  "id": 1,
  "defaultOption": true,
  "description": null,
  "l10nKey": null,
  "name": "Yes",
  "nameKey": "y"
};

    App.dict.yesNoType['n'] = {
  "class": "com.ngs.id.model.type.YesNoType",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "No",
  "nameKey": "n"
};


App.dict.enforcementPolicy = {};


    App.dict.enforcementPolicy['strict'] = {
  "class": "com.ngs.id.model.type.EnforcementPolicy",
  "id": 1,
  "defaultOption": false,
  "description": "Strictly enforced",
  "l10nKey": null,
  "name": "Strict",
  "nameKey": "strict"
};

    App.dict.enforcementPolicy['lenient'] = {
  "class": "com.ngs.id.model.type.EnforcementPolicy",
  "id": 2,
  "defaultOption": false,
  "description": "Leniently enforced",
  "l10nKey": null,
  "name": "Lenient",
  "nameKey": "lenient"
};

    App.dict.enforcementPolicy['info'] = {
  "class": "com.ngs.id.model.type.EnforcementPolicy",
  "id": 3,
  "defaultOption": true,
  "description": "Informational purposes",
  "l10nKey": null,
  "name": "Info",
  "nameKey": "info"
};


App.dict.ratePlanType = {};


    App.dict.ratePlanType['interpreter'] = {
  "class": "com.ngs.id.model.type.RatePlanType",
  "id": 1,
  "defaultOption": true,
  "description": "Interpreter rate plan",
  "l10nKey": null,
  "name": "Interpreter",
  "nameKey": "interpreter"
};

    App.dict.ratePlanType['customer'] = {
  "class": "com.ngs.id.model.type.RatePlanType",
  "id": 2,
  "defaultOption": false,
  "description": "Customer rate plan",
  "l10nKey": null,
  "name": "Customer",
  "nameKey": "customer"
};


App.dict.rateZoneType = {};


    App.dict.rateZoneType['offpeak'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 1,
  "defaultOption": true,
  "description": "Standard rate zone (business hours)",
  "l10nKey": null,
  "name": "Standard",
  "nameKey": "offpeak"
};

    App.dict.rateZoneType['peak'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 2,
  "defaultOption": false,
  "description": "Premium rate zone (outside business hours). Include exceptions to standard.",
  "l10nKey": null,
  "name": "Premium",
  "nameKey": "peak"
};

    App.dict.rateZoneType['platinum'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 3,
  "defaultOption": false,
  "description": "Platinum rate zone",
  "l10nKey": null,
  "name": "Platinum",
  "nameKey": "platinum"
};

    App.dict.rateZoneType['stdon'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 4,
  "defaultOption": false,
  "description": "Standard Overnight",
  "l10nKey": null,
  "name": "Standard Overnight",
  "nameKey": "stdon"
};

    App.dict.rateZoneType['stdn'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 5,
  "defaultOption": false,
  "description": "Standard Night",
  "l10nKey": null,
  "name": "Standard Night",
  "nameKey": "stdn"
};

    App.dict.rateZoneType['premon'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 6,
  "defaultOption": false,
  "description": "Premium Overnight",
  "l10nKey": null,
  "name": "Premium Overnight",
  "nameKey": "premon"
};

    App.dict.rateZoneType['premn'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 7,
  "defaultOption": false,
  "description": "Premium Night",
  "l10nKey": null,
  "name": "Premium Night",
  "nameKey": "premn"
};

    App.dict.rateZoneType['platon'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 8,
  "defaultOption": false,
  "description": "Platinum Overnight",
  "l10nKey": null,
  "name": "Platinum Overnight",
  "nameKey": "platon"
};

    App.dict.rateZoneType['platn'] = {
  "class": "com.ngs.id.model.type.RateZoneType",
  "id": 9,
  "defaultOption": false,
  "description": "Platinum Night",
  "l10nKey": null,
  "name": "Platinum Night",
  "nameKey": "platn"
};


App.dict.day = {};


    App.dict.day['monday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 1,
  "defaultOption": true,
  "description": "Monday",
  "l10nKey": null,
  "name": "Monday",
  "nameKey": "monday"
};

    App.dict.day['tuesday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 2,
  "defaultOption": false,
  "description": "Tuesday",
  "l10nKey": null,
  "name": "Tuesday",
  "nameKey": "tuesday"
};

    App.dict.day['wednesday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 3,
  "defaultOption": false,
  "description": "Wednesday",
  "l10nKey": null,
  "name": "Wednesday",
  "nameKey": "wednesday"
};

    App.dict.day['thursday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 4,
  "defaultOption": false,
  "description": "Thursday",
  "l10nKey": null,
  "name": "Thursday",
  "nameKey": "thursday"
};

    App.dict.day['friday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 5,
  "defaultOption": false,
  "description": "Friday",
  "l10nKey": null,
  "name": "Friday",
  "nameKey": "friday"
};

    App.dict.day['saturday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 6,
  "defaultOption": false,
  "description": "Saturday",
  "l10nKey": null,
  "name": "Saturday",
  "nameKey": "saturday"
};

    App.dict.day['sunday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 7,
  "defaultOption": false,
  "description": "Sunday",
  "l10nKey": null,
  "name": "Sunday",
  "nameKey": "sunday"
};


App.dict.auditEventType = {};


    App.dict.auditEventType['create'] = {
  "class": "com.ngs.id.model.type.AuditEventType",
  "id": 1,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Create",
  "nameKey": "create"
};

    App.dict.auditEventType['update'] = {
  "class": "com.ngs.id.model.type.AuditEventType",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Update",
  "nameKey": "update"
};

    App.dict.auditEventType['delete'] = {
  "class": "com.ngs.id.model.type.AuditEventType",
  "id": 3,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Delete",
  "nameKey": "delete"
};

    App.dict.auditEventType['login'] = {
  "class": "com.ngs.id.model.type.AuditEventType",
  "id": 4,
  "defaultOption": false,
  "description": "User login",
  "l10nKey": null,
  "name": "Login",
  "nameKey": "login"
};

    App.dict.auditEventType['close'] = {
  "class": "com.ngs.id.model.type.AuditEventType",
  "id": 5,
  "defaultOption": false,
  "description": "Close job",
  "l10nKey": null,
  "name": "Close",
  "nameKey": "close"
};

    App.dict.auditEventType['assignment'] = {
  "class": "com.ngs.id.model.type.AuditEventType",
  "id": 6,
  "defaultOption": false,
  "description": "Interpreter assignment",
  "l10nKey": null,
  "name": "Assignment",
  "nameKey": "assignment"
};

    App.dict.auditEventType['selfassignment'] = {
  "class": "com.ngs.id.model.type.AuditEventType",
  "id": 7,
  "defaultOption": false,
  "description": "Interpreter self assignment",
  "l10nKey": null,
  "name": "Self Assignment",
  "nameKey": "selfassignment"
};

    App.dict.auditEventType['open'] = {
  "class": "com.ngs.id.model.type.AuditEventType",
  "id": 8,
  "defaultOption": false,
  "description": "Open job",
  "l10nKey": null,
  "name": "Open",
  "nameKey": "open"
};


App.dict.billHoursUsing = {};


    App.dict.billHoursUsing['avg'] = {
  "class": "com.ngs.id.model.type.BillHoursUsing",
  "id": 1,
  "defaultOption": null,
  "description": "Use Average Rate",
  "l10nKey": null,
  "name": "Use Average",
  "nameKey": "avg"
};

    App.dict.billHoursUsing['first'] = {
  "class": "com.ngs.id.model.type.BillHoursUsing",
  "id": 2,
  "defaultOption": null,
  "description": "Use First Rate",
  "l10nKey": null,
  "name": "Use First",
  "nameKey": "first"
};

    App.dict.billHoursUsing['split'] = {
  "class": "com.ngs.id.model.type.BillHoursUsing",
  "id": 3,
  "defaultOption": null,
  "description": "Split First / Last",
  "l10nKey": null,
  "name": "Split",
  "nameKey": "split"
};

    App.dict.billHoursUsing['std'] = {
  "class": "com.ngs.id.model.type.BillHoursUsing",
  "id": 4,
  "defaultOption": null,
  "description": "Use Standard Rate",
  "l10nKey": null,
  "name": "Use Standard",
  "nameKey": "std"
};

    App.dict.billHoursUsing['flat'] = {
  "class": "com.ngs.id.model.type.BillHoursUsing",
  "id": 5,
  "defaultOption": null,
  "description": "Use FLat Rate",
  "l10nKey": null,
  "name": "Use Flat",
  "nameKey": "flat"
};

    App.dict.billHoursUsing['travel'] = {
  "class": "com.ngs.id.model.type.BillHoursUsing",
  "id": 6,
  "defaultOption": null,
  "description": "Use Travel Rate",
  "l10nKey": null,
  "name": "Use Travel Rate",
  "nameKey": "travel"
};


App.dict.criteriaType = {};


    App.dict.criteriaType['criteria'] = {
  "class": "com.ngs.id.model.type.EmploymentCriteriaType",
  "id": 1,
  "defaultOption": true,
  "description": "HR employment criteria",
  "l10nKey": null,
  "name": "Employment Criteria",
  "nameKey": "criteria"
};

    App.dict.criteriaType['qualification'] = {
  "class": "com.ngs.id.model.type.EmploymentCriteriaType",
  "id": 2,
  "defaultOption": false,
  "description": "Qualification / certification",
  "l10nKey": null,
  "name": "Qualification / Certification",
  "nameKey": "qualification"
};

    App.dict.criteriaType['hierarchy'] = {
  "class": "com.ngs.id.model.type.EmploymentCriteriaType",
  "id": 3,
  "defaultOption": false,
  "description": "Criteria Hierarchy",
  "l10nKey": null,
  "name": "Criteria Hierarchy",
  "nameKey": "hierarchy"
};


App.dict.messageType = {};


    App.dict.messageType['alert'] = {
  "class": "com.ngs.id.model.type.MessageType",
  "id": 1,
  "defaultOption": false,
  "description": "Alert message",
  "l10nKey": null,
  "name": "Alert",
  "nameKey": "alert"
};

    App.dict.messageType['message'] = {
  "class": "com.ngs.id.model.type.MessageType",
  "id": 2,
  "defaultOption": true,
  "description": "Regular message",
  "l10nKey": null,
  "name": "Message",
  "nameKey": "message"
};

    App.dict.messageType['action'] = {
  "class": "com.ngs.id.model.type.MessageType",
  "id": 3,
  "defaultOption": false,
  "description": "Action message",
  "l10nKey": null,
  "name": "Action",
  "nameKey": "action"
};


App.dict.messageAudience = {};


    App.dict.messageAudience['internal'] = {
  "class": "com.ngs.id.model.type.MessageAudience",
  "id": 1,
  "defaultOption": true,
  "description": "Internal audience",
  "l10nKey": null,
  "name": "Internal",
  "nameKey": "internal"
};

    App.dict.messageAudience['contacts'] = {
  "class": "com.ngs.id.model.type.MessageAudience",
  "id": 2,
  "defaultOption": false,
  "description": "All contacts",
  "l10nKey": null,
  "name": "Contacts",
  "nameKey": "contacts"
};

    App.dict.messageAudience['customers'] = {
  "class": "com.ngs.id.model.type.MessageAudience",
  "id": 3,
  "defaultOption": false,
  "description": "All customers",
  "l10nKey": null,
  "name": "Customers",
  "nameKey": "customers"
};

    App.dict.messageAudience['all'] = {
  "class": "com.ngs.id.model.type.MessageAudience",
  "id": 4,
  "defaultOption": false,
  "description": "All users of the system",
  "l10nKey": null,
  "name": "All",
  "nameKey": "all"
};

    App.dict.messageAudience['custom'] = {
  "class": "com.ngs.id.model.type.MessageAudience",
  "id": 5,
  "defaultOption": false,
  "description": "Custom audience",
  "l10nKey": null,
  "name": "Custom",
  "nameKey": "custom"
};


App.dict.documentType = {};


    App.dict.documentType['vos'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 1,
  "defaultOption": false,
  "description": "Verification of service form",
  "l10nKey": null,
  "name": "Verification of Service",
  "nameKey": "vos"
};

    App.dict.documentType['vossigned'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 2,
  "defaultOption": true,
  "description": "Signed verification of service form",
  "l10nKey": null,
  "name": "Verification of Service (Signed)",
  "nameKey": "vossigned"
};

    App.dict.documentType['report'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 3,
  "defaultOption": false,
  "description": "Custom report for download",
  "l10nKey": null,
  "name": "Report",
  "nameKey": "report"
};

    App.dict.documentType['customerconf'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 4,
  "defaultOption": false,
  "description": "Customer confirmation",
  "l10nKey": null,
  "name": "Customer Confirmation",
  "nameKey": "customerconf"
};

    App.dict.documentType['interpreterconf'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 5,
  "defaultOption": false,
  "description": "Interpreter confirmation",
  "l10nKey": null,
  "name": "Interpreter Confirmation",
  "nameKey": "interpreterconf"
};

    App.dict.documentType['misc'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 6,
  "defaultOption": false,
  "description": "Miscellaneous document",
  "l10nKey": null,
  "name": "Miscellaneous",
  "nameKey": "misc"
};

    App.dict.documentType['invoice'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 7,
  "defaultOption": false,
  "description": "Invoice",
  "l10nKey": null,
  "name": "Invoice",
  "nameKey": "invoice"
};

    App.dict.documentType['payment'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 8,
  "defaultOption": false,
  "description": "Payment",
  "l10nKey": null,
  "name": "Payment",
  "nameKey": "payment"
};

    App.dict.documentType['export'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 11,
  "defaultOption": false,
  "description": "Export",
  "l10nKey": null,
  "name": "Export",
  "nameKey": "export"
};

    App.dict.documentType['image'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 12,
  "defaultOption": false,
  "description": "Image",
  "l10nKey": null,
  "name": "Image",
  "nameKey": "image"
};

    App.dict.documentType['contract'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 13,
  "defaultOption": false,
  "description": "Contract",
  "l10nKey": null,
  "name": "Contract",
  "nameKey": "contract"
};

    App.dict.documentType['activation'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 14,
  "defaultOption": false,
  "description": "Activation",
  "l10nKey": null,
  "name": "Activation",
  "nameKey": "activation"
};

    App.dict.documentType['medicalrequirements'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 15,
  "defaultOption": false,
  "description": "Medical Requirements",
  "l10nKey": null,
  "name": "Medical Requirements",
  "nameKey": "medicalrequirements"
};

    App.dict.documentType['training'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 16,
  "defaultOption": false,
  "description": "Training / Continuing Education",
  "l10nKey": null,
  "name": "Training / Continuing Education",
  "nameKey": "training"
};

    App.dict.documentType['assessments'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 17,
  "defaultOption": false,
  "description": "Assessments",
  "l10nKey": null,
  "name": "Assessments",
  "nameKey": "assessments"
};

    App.dict.documentType['receipt'] = {
  "class": "com.ngs.id.model.type.DocumentType",
  "id": 18,
  "defaultOption": false,
  "description": "Receipt to accompany incidental",
  "l10nKey": null,
  "name": "Receipt",
  "nameKey": "receipt"
};


App.dict.distanceUnitType = {};


    App.dict.distanceUnitType['kms'] = {
  "class": "com.ngs.id.model.type.DistanceUnitType",
  "id": 1,
  "defaultOption": true,
  "description": "Metric system",
  "l10nKey": null,
  "name": "Metric (KMs)",
  "nameKey": "kms"
};

    App.dict.distanceUnitType['miles'] = {
  "class": "com.ngs.id.model.type.DistanceUnitType",
  "id": 2,
  "defaultOption": false,
  "description": "Imperial system",
  "l10nKey": null,
  "name": "Imperial",
  "nameKey": "miles"
};


App.dict.employmentCategory = {};


    App.dict.employmentCategory['fte'] = {
  "class": "com.ngs.id.model.type.EmploymentCategory",
  "id": 1,
  "defaultOption": true,
  "description": "Full time employee",
  "inOrder": 0,
  "l10nKey": null,
  "name": "Employee (Full Time)",
  "nameKey": "fte"
};

    App.dict.employmentCategory['pte'] = {
  "class": "com.ngs.id.model.type.EmploymentCategory",
  "id": 2,
  "defaultOption": false,
  "description": "Part time employee",
  "inOrder": 1,
  "l10nKey": null,
  "name": "Employee (Part Time)",
  "nameKey": "pte"
};

    App.dict.employmentCategory['flxte'] = {
  "class": "com.ngs.id.model.type.EmploymentCategory",
  "id": 8,
  "defaultOption": false,
  "description": "Employee flexible work schedule",
  "inOrder": 2,
  "l10nKey": null,
  "name": "Employee (Flex)",
  "nameKey": "flxte"
};

    App.dict.employmentCategory['temp'] = {
  "class": "com.ngs.id.model.type.EmploymentCategory",
  "id": 3,
  "defaultOption": false,
  "description": "Temporary Worker",
  "inOrder": 3,
  "l10nKey": null,
  "name": "Temp",
  "nameKey": "temp"
};

    App.dict.employmentCategory['con'] = {
  "class": "com.ngs.id.model.type.EmploymentCategory",
  "id": 4,
  "defaultOption": false,
  "description": "Preferred contractor",
  "inOrder": 4,
  "l10nKey": null,
  "name": "Contractor",
  "nameKey": "con"
};

    App.dict.employmentCategory['ven'] = {
  "class": "com.ngs.id.model.type.EmploymentCategory",
  "id": 5,
  "defaultOption": false,
  "description": "Vendor",
  "inOrder": 5,
  "l10nKey": null,
  "name": "Vendor",
  "nameKey": "ven"
};

    App.dict.employmentCategory['int'] = {
  "class": "com.ngs.id.model.type.EmploymentCategory",
  "id": 6,
  "defaultOption": false,
  "description": "Intern",
  "inOrder": 6,
  "l10nKey": null,
  "name": "Intern",
  "nameKey": "int"
};

    App.dict.employmentCategory['vol'] = {
  "class": "com.ngs.id.model.type.EmploymentCategory",
  "id": 7,
  "defaultOption": false,
  "description": "Volunteer",
  "inOrder": 7,
  "l10nKey": null,
  "name": "Volunteer",
  "nameKey": "vol"
};


App.dict.feeType = {};


    App.dict.feeType['cancel'] = {
  "class": "com.ngs.id.model.type.FeeType",
  "id": 1,
  "defaultOption": false,
  "description": "Cancellation fee",
  "l10nKey": null,
  "name": "Cancellation Fee",
  "nameKey": "cancel"
};

    App.dict.feeType['rush'] = {
  "class": "com.ngs.id.model.type.FeeType",
  "id": 2,
  "defaultOption": false,
  "description": "Rush fee",
  "l10nKey": null,
  "name": "Rush Fee",
  "nameKey": "rush"
};

    App.dict.feeType['booking'] = {
  "class": "com.ngs.id.model.type.FeeType",
  "id": 3,
  "defaultOption": false,
  "description": "Booking fee",
  "l10nKey": null,
  "name": "Booking Fee",
  "nameKey": "booking"
};

    App.dict.feeType['misc'] = {
  "class": "com.ngs.id.model.type.FeeType",
  "id": 4,
  "defaultOption": false,
  "description": "Miscellaneous Fee",
  "l10nKey": null,
  "name": "Miscellaneous Fee",
  "nameKey": "misc"
};

    App.dict.feeType['custom'] = {
  "class": "com.ngs.id.model.type.FeeType",
  "id": 5,
  "defaultOption": false,
  "description": "Custom Fee",
  "l10nKey": null,
  "name": "Custom Fee",
  "nameKey": "custom"
};


App.dict.chargeType = {};


    App.dict.chargeType['flat'] = {
  "class": "com.ngs.id.model.type.ChargeType",
  "id": 1,
  "defaultOption": false,
  "l10nKey": null,
  "name": "Flat Fee",
  "nameKey": "flat"
};

    App.dict.chargeType['percent'] = {
  "class": "com.ngs.id.model.type.ChargeType",
  "id": 2,
  "defaultOption": false,
  "l10nKey": null,
  "name": "% Total",
  "nameKey": "percent"
};

    App.dict.chargeType['hourly'] = {
  "class": "com.ngs.id.model.type.ChargeType",
  "id": 3,
  "defaultOption": false,
  "l10nKey": null,
  "name": "Per Hour",
  "nameKey": "hourly"
};

    App.dict.chargeType['hours'] = {
  "class": "com.ngs.id.model.type.ChargeType",
  "id": 4,
  "defaultOption": false,
  "l10nKey": null,
  "name": "Flat Hour(s)",
  "nameKey": "hours"
};

    App.dict.chargeType['rate'] = {
  "class": "com.ngs.id.model.type.ChargeType",
  "id": 5,
  "defaultOption": null,
  "l10nKey": null,
  "name": "Use Rate",
  "nameKey": "rate"
};

    App.dict.chargeType['minimum'] = {
  "class": "com.ngs.id.model.type.ChargeType",
  "id": 6,
  "defaultOption": false,
  "l10nKey": null,
  "name": "Minimum Dur.",
  "nameKey": "minimum"
};


App.dict.periodRule = {};


    App.dict.periodRule['business_days'] = {
  "class": "com.ngs.id.model.type.PeriodRule",
  "id": 1,
  "defaultOption": false,
  "description": "Business days",
  "l10nKey": null,
  "name": "Business Days",
  "nameKey": "business_days"
};

    App.dict.periodRule['calendar_days'] = {
  "class": "com.ngs.id.model.type.PeriodRule",
  "id": 2,
  "defaultOption": false,
  "description": "Calendar days",
  "l10nKey": null,
  "name": "Calendar Days",
  "nameKey": "calendar_days"
};

    App.dict.periodRule['business_hours'] = {
  "class": "com.ngs.id.model.type.PeriodRule",
  "id": 3,
  "defaultOption": false,
  "description": "Business hours",
  "l10nKey": null,
  "name": "Business Hours",
  "nameKey": "business_hours"
};


App.dict.gender = {};


    App.dict.gender['m'] = {
  "class": "com.ngs.id.model.type.Gender",
  "id": 1,
  "defaultOption": true,
  "description": null,
  "l10nKey": null,
  "name": "Male",
  "nameKey": "m"
};

    App.dict.gender['f'] = {
  "class": "com.ngs.id.model.type.Gender",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Female",
  "nameKey": "f"
};


App.dict.payableItemType = {};


    App.dict.payableItemType['serviceint'] = {
  "id": 7,
  "description": "Service interpretation",
  "name": "Interpretation",
  "nameKey": "serviceint",
  "unitDescription": "$"
};

    App.dict.payableItemType['servicetrans'] = {
  "id": 8,
  "description": "Service translation",
  "name": "Translation",
  "nameKey": "servicetrans",
  "unitDescription": "$"
};

    App.dict.payableItemType['feerush'] = {
  "id": 9,
  "description": "Rush fee",
  "name": "Rush Fee",
  "nameKey": "feerush",
  "unitDescription": "$"
};

    App.dict.payableItemType['feecancel'] = {
  "id": 10,
  "description": "Cancel fee",
  "name": "Cancel Fee",
  "nameKey": "feecancel",
  "unitDescription": "$"
};

    App.dict.payableItemType['mileage'] = {
  "id": 1,
  "description": "Mileage for travel",
  "name": "Mileage",
  "nameKey": "mileage",
  "unitDescription": null
};

    App.dict.payableItemType['travel'] = {
  "id": 2,
  "description": "Miscellaneous travel",
  "name": "Travel (Misc)",
  "nameKey": "travel",
  "unitDescription": "$"
};

    App.dict.payableItemType['taxi'] = {
  "id": 3,
  "description": "Taxi",
  "name": "Taxi",
  "nameKey": "taxi",
  "unitDescription": "$"
};

    App.dict.payableItemType['hotel'] = {
  "id": 4,
  "description": "Hotel",
  "name": "Hotel",
  "nameKey": "hotel",
  "unitDescription": "$"
};

    App.dict.payableItemType['parking'] = {
  "id": 11,
  "description": "Parking",
  "name": "Parking",
  "nameKey": "parking",
  "unitDescription": "$"
};

    App.dict.payableItemType['tolls'] = {
  "id": 12,
  "description": "Tolls",
  "name": "Tolls",
  "nameKey": "tolls",
  "unitDescription": "$"
};

    App.dict.payableItemType['fooddrink'] = {
  "id": 5,
  "description": "Food and drink",
  "name": "Food & Drink",
  "nameKey": "fooddrink",
  "unitDescription": "$"
};

    App.dict.payableItemType['misc'] = {
  "id": 6,
  "description": "Miscellaneous expense",
  "name": "Miscellaneous",
  "nameKey": "misc",
  "unitDescription": "$"
};

    App.dict.payableItemType['tax'] = {
  "id": 13,
  "description": "Tax",
  "name": "Tax",
  "nameKey": "tax",
  "unitDescription": "$"
};

    App.dict.payableItemType['credit'] = {
  "id": 14,
  "description": "Credit",
  "name": "Credit",
  "nameKey": "credit",
  "unitDescription": "$"
};

    App.dict.payableItemType['deduction'] = {
  "id": 15,
  "description": "Deduction",
  "name": "Deduction",
  "nameKey": "deduction",
  "unitDescription": "$"
};

    App.dict.payableItemType['feemisc'] = {
  "id": 16,
  "description": "Miscellaneous Fee",
  "name": "Misc. Fee",
  "nameKey": "feemisc",
  "unitDescription": "$"
};

    App.dict.payableItemType['deductionhours'] = {
  "id": 21,
  "description": "Deduction (Hours)",
  "name": "Deduction (Hours)",
  "nameKey": "deductionhours",
  "unitDescription": "Hours"
};

    App.dict.payableItemType['mischours'] = {
  "id": 17,
  "description": "Miscellaneous (Hours)",
  "name": "Misc. (Hours)",
  "nameKey": "mischours",
  "unitDescription": "Hours"
};

    App.dict.payableItemType['traveltime'] = {
  "id": 18,
  "description": "Travel Time (Hours)",
  "name": "Travel Time (Hours)",
  "nameKey": "traveltime",
  "unitDescription": "Hours"
};

    App.dict.payableItemType['translation'] = {
  "id": 19,
  "description": "Translation (Number of Words)",
  "name": "Translation (Number of Words)",
  "nameKey": "translation",
  "unitDescription": "Words"
};

    App.dict.payableItemType['clockhours'] = {
  "id": 20,
  "description": "Clock (Hours)",
  "name": "Clock (Hours)",
  "nameKey": "clockhours",
  "unitDescription": "Hours"
};

    App.dict.payableItemType['mealhours'] = {
  "id": 22,
  "description": "Meal Break (Hours)",
  "name": "Meal Break (Hours)",
  "nameKey": "mealhours",
  "unitDescription": "Hours"
};


App.dict.groupingHierarchyType = {};

App.dict.groupingHierarchyType['combined'] = {
  "class": "com.ngs.id.model.type.GroupingHierarchyType",
  "id": 1,
  "defaultOption": true,
  "description": "Combine All",
  "l10nKey": null,
  "name": "Combined",
  "nameKey": "combined"
};

App.dict.groupingHierarchyType['individual'] = {
  "class": "com.ngs.id.model.type.GroupingHierarchyType",
  "id": 2,
  "defaultOption": false,
  "description": "Separate Individually",
  "l10nKey": null,
  "name": "Individual",
  "nameKey": "individual"
};

App.dict.groupingHierarchyType['hierarchy'] = {
  "class": "com.ngs.id.model.type.GroupingHierarchyType",
  "id": 3,
  "defaultOption": false,
  "description": "Hierarchy Aligned",
  "l10nKey": null,
  "name": "Hierarchy",
  "nameKey": "hierarchy"
};


App.dict.currencyCode = {};


    App.dict.currencyCode['AUD'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 6,
  "defaultOption": false,
  "description": "Australian Dollar",
  "l10nKey": null,
  "name": "AUD",
  "nameKey": "AUD"
};

    App.dict.currencyCode['BRL'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 17,
  "defaultOption": false,
  "description": "Brazilian Real",
  "l10nKey": null,
  "name": "BRL",
  "nameKey": "BRL"
};

    App.dict.currencyCode['CAD'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 18,
  "defaultOption": false,
  "description": "Canadian Dollar",
  "l10nKey": null,
  "name": "CAD",
  "nameKey": "CAD"
};

    App.dict.currencyCode['CHF'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 12,
  "defaultOption": false,
  "description": "Swiss Franc",
  "l10nKey": null,
  "name": "CHF",
  "nameKey": "CHF"
};

    App.dict.currencyCode['DKK'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 10,
  "defaultOption": false,
  "description": "Danish Krone",
  "l10nKey": null,
  "name": "DKK",
  "nameKey": "DKK"
};

    App.dict.currencyCode['EUR'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 1,
  "defaultOption": false,
  "description": "Euro",
  "l10nKey": null,
  "name": "EUR",
  "nameKey": "EUR"
};

    App.dict.currencyCode['GBP'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 11,
  "defaultOption": false,
  "description": "Pund Sterling",
  "l10nKey": null,
  "name": "GBP",
  "nameKey": "GBP"
};

    App.dict.currencyCode['ILS'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 14,
  "defaultOption": false,
  "description": "Isralei New Shekel",
  "l10nKey": null,
  "name": "ILS",
  "nameKey": "ILS"
};

    App.dict.currencyCode['MAD'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 9,
  "defaultOption": false,
  "description": "Moroccan Dirham",
  "l10nKey": null,
  "name": "MAD",
  "nameKey": "MAD"
};

    App.dict.currencyCode['NOK'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 5,
  "defaultOption": false,
  "description": "Norweigan Krone",
  "l10nKey": null,
  "name": "NOK",
  "nameKey": "NOK"
};

    App.dict.currencyCode['NZD'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 8,
  "defaultOption": false,
  "description": "New Zealand Dollar",
  "l10nKey": null,
  "name": "NZD",
  "nameKey": "NZD"
};

    App.dict.currencyCode['ROL'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 15,
  "defaultOption": false,
  "description": "Romanian Leu",
  "l10nKey": null,
  "name": "ROL",
  "nameKey": "ROL"
};

    App.dict.currencyCode['TRL'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 16,
  "defaultOption": false,
  "description": "Turkish Lira",
  "l10nKey": null,
  "name": "TRL",
  "nameKey": "TRL"
};

    App.dict.currencyCode['USD'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 3,
  "defaultOption": false,
  "description": "US Dollar",
  "l10nKey": null,
  "name": "USD",
  "nameKey": "USD"
};

    App.dict.currencyCode['XAF'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 7,
  "defaultOption": false,
  "description": "Central African CFP Franc",
  "l10nKey": null,
  "name": "XAF",
  "nameKey": "XAF"
};

    App.dict.currencyCode['XCD'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 2,
  "defaultOption": false,
  "description": "East Caribbean Dollar",
  "l10nKey": null,
  "name": "XCD",
  "nameKey": "XCD"
};

    App.dict.currencyCode['XOF'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 4,
  "defaultOption": false,
  "description": "West African CFA Franc",
  "l10nKey": null,
  "name": "XOF",
  "nameKey": "XOF"
};

    App.dict.currencyCode['XPF'] = {
  "class": "com.ngs.id.model.type.CurrencyCode",
  "id": 13,
  "defaultOption": false,
  "description": "Pacific CFP Franc",
  "l10nKey": null,
  "name": "XPF",
  "nameKey": "XPF"
};


App.dict.numberType = {};


    App.dict.numberType['home'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 1,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Home",
  "nameKey": "home"
};

    App.dict.numberType['homeother'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Home Other",
  "nameKey": "homeother"
};

    App.dict.numberType['business'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 3,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Business",
  "nameKey": "business"
};

    App.dict.numberType['businessother'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 4,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Business Other",
  "nameKey": "businessother"
};

    App.dict.numberType['businessfax'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 5,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Business Fax",
  "nameKey": "businessfax"
};

    App.dict.numberType['carphone'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 6,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Car Phone",
  "nameKey": "carphone"
};

    App.dict.numberType['mobile'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 7,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Mobile",
  "nameKey": "mobile"
};

    App.dict.numberType['mobileother'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 8,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Mobile Other",
  "nameKey": "mobileother"
};

    App.dict.numberType['mobileother2'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 9,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Mobile Other 2",
  "nameKey": "mobileother2"
};

    App.dict.numberType['other'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 10,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Other",
  "nameKey": "other"
};

    App.dict.numberType['internetphone'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 11,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Internet Phone",
  "nameKey": "internetphone"
};

    App.dict.numberType['billing'] = {
  "class": "com.ngs.id.model.type.NumberType",
  "id": 12,
  "defaultOption": null,
  "description": "Billing",
  "l10nKey": null,
  "name": "Billing",
  "nameKey": "billing"
};


App.dict.billingMethod = {};


    App.dict.billingMethod['email'] = {
  "class": "com.ngs.id.model.type.BillingMethod",
  "id": 1,
  "defaultOption": true,
  "description": "Email",
  "l10nKey": null,
  "name": "Email",
  "nameKey": "email"
};

    App.dict.billingMethod['mail'] = {
  "class": "com.ngs.id.model.type.BillingMethod",
  "id": 2,
  "defaultOption": true,
  "description": "Standard Mail",
  "l10nKey": null,
  "name": "Standard Mail",
  "nameKey": "mail"
};

    App.dict.billingMethod['special'] = {
  "class": "com.ngs.id.model.type.BillingMethod",
  "id": 3,
  "defaultOption": false,
  "description": "Special handling billing",
  "l10nKey": null,
  "name": "Special",
  "nameKey": "special"
};


App.dict.emailType = {};


    App.dict.emailType['personal'] = {
  "class": "com.ngs.id.model.type.EmailType",
  "id": 1,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Personal",
  "nameKey": "personal"
};

    App.dict.emailType['business'] = {
  "class": "com.ngs.id.model.type.EmailType",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Business",
  "nameKey": "business"
};

    App.dict.emailType['other'] = {
  "class": "com.ngs.id.model.type.EmailType",
  "id": 3,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Other",
  "nameKey": "other"
};

    App.dict.emailType['personalother'] = {
  "class": "com.ngs.id.model.type.EmailType",
  "id": 4,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Personal Other",
  "nameKey": "personalother"
};

    App.dict.emailType['workother'] = {
  "class": "com.ngs.id.model.type.EmailType",
  "id": 5,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Work Other",
  "nameKey": "workother"
};

    App.dict.emailType['billing'] = {
  "class": "com.ngs.id.model.type.EmailType",
  "id": 6,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Billing",
  "nameKey": "billing"
};

    App.dict.emailType['sms'] = {
  "class": "com.ngs.id.model.type.EmailType",
  "id": 7,
  "defaultOption": true,
  "description": "SMS",
  "l10nKey": null,
  "name": "SMS",
  "nameKey": "sms"
};


App.dict.rateType = {};


    App.dict.rateType['std'] = {
  "class": "com.ngs.id.model.type.RateType",
  "id": 1,
  "defaultOption": true,
  "description": "Standard rate type",
  "l10nKey": null,
  "name": "Standard",
  "nameKey": "std"
};

    App.dict.rateType['pre'] = {
  "class": "com.ngs.id.model.type.RateType",
  "id": 2,
  "defaultOption": false,
  "description": "Premium rate type",
  "l10nKey": null,
  "name": "Premium",
  "nameKey": "pre"
};


App.dict.emailTemplateType = {};


    App.dict.emailTemplateType['request'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 1,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter notifying them of an available booking",
  "l10nKey": null,
  "name": "Booking Request",
  "nameKey": "request"
};

    App.dict.emailTemplateType['cancelInterpreter'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 2,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter to notify them of a cancelled booking",
  "l10nKey": null,
  "name": "Booking Cancellation (Interpreter)",
  "nameKey": "cancelInterpreter"
};

    App.dict.emailTemplateType['confirmInterpreter'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 3,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter to confirm an assigned booking for them",
  "l10nKey": null,
  "name": "Booking Confirmation (Interpreter)",
  "nameKey": "confirmInterpreter"
};

    App.dict.emailTemplateType['cancelCustomer'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 4,
  "defaultOption": false,
  "description": "Used when an email is sent to a customer to notify them of a cancelled booking",
  "l10nKey": null,
  "name": "Booking Cancellation (Customer)",
  "nameKey": "cancelCustomer"
};

    App.dict.emailTemplateType['confirmCustomer'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 5,
  "defaultOption": false,
  "description": "Used when an email is sent to a customer to confirm an assigned booking for them",
  "l10nKey": null,
  "name": "Booking Confirmation (Customer)",
  "nameKey": "confirmCustomer"
};

    App.dict.emailTemplateType['quoteCustomer'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 6,
  "defaultOption": false,
  "description": "Used when an email is sent to a customer with a booking quotation",
  "l10nKey": null,
  "name": "Booking Quotation (Customer)",
  "nameKey": "quoteCustomer"
};

    App.dict.emailTemplateType['quoteInterpreter'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 7,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter with a booking quotation",
  "l10nKey": null,
  "name": "Booking Quotation (Interpreter)",
  "nameKey": "quoteInterpreter"
};

    App.dict.emailTemplateType['declineCustomer'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 8,
  "defaultOption": false,
  "description": "Used when an email is sent to a customer to notify them of a unfulfilled booking",
  "l10nKey": null,
  "name": "Booking Unfulfilled (Customer)",
  "nameKey": "declineCustomer"
};

    App.dict.emailTemplateType['bookingUpdate'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 9,
  "defaultOption": false,
  "description": "Used when an important update is made to a booking. Customers, interpreters and internal people will receive the same notification.",
  "l10nKey": null,
  "name": "Booking Update",
  "nameKey": "bookingUpdate"
};

    App.dict.emailTemplateType['videoReadyCustomer'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 10,
  "defaultOption": false,
  "description": "Used when an email is sent to a customer to remind them of an upcoming video session",
  "l10nKey": null,
  "name": "Video Ready (Customer)",
  "nameKey": "videoReadyCustomer"
};

    App.dict.emailTemplateType['invoice'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 11,
  "defaultOption": true,
  "description": "Invoice",
  "l10nKey": null,
  "name": "Invoice",
  "nameKey": "invoice"
};

    App.dict.emailTemplateType['payment'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 12,
  "defaultOption": true,
  "description": "Payment",
  "l10nKey": null,
  "name": "Payment",
  "nameKey": "payment"
};

    App.dict.emailTemplateType['bookingNew'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 13,
  "defaultOption": false,
  "description": "Used when an email is sent to a customer to notify them of a new booking",
  "l10nKey": null,
  "name": "New Booking (Customer)",
  "nameKey": "bookingNew"
};

    App.dict.emailTemplateType['bookingCloseReminder'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 14,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter to remind them to close a booking",
  "l10nKey": null,
  "name": "Booking Close Reminder (Interpreter)",
  "nameKey": "bookingCloseReminder"
};

    App.dict.emailTemplateType['bookingUpcomingReminder'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 15,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter to remind them of an upcoming booking",
  "l10nKey": null,
  "name": "Booking Upcoming Reminder (Interpreter)",
  "nameKey": "bookingUpcomingReminder"
};

    App.dict.emailTemplateType['eligibilityExpirationNotification'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 16,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter to notify them of an expired eligibility or qualification",
  "l10nKey": null,
  "name": "Eligibility Expiration (Interpreter)",
  "nameKey": "eligibilityExpirationNotification"
};

    App.dict.emailTemplateType['bookingConfirmReminder'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 17,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter to remind them to close some bookings",
  "l10nKey": null,
  "name": "Bookings Confirm Reminder (Interpreter)",
  "nameKey": "bookingConfirmReminder"
};

    App.dict.emailTemplateType['confirmInterpreterAvailability'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 18,
  "defaultOption": false,
  "description": "Used when an email is sent to an interpreter to confirm changes to their availability",
  "l10nKey": null,
  "name": "Interpreter Availability Confirmation",
  "nameKey": "confirmInterpreterAvailability"
};

    App.dict.emailTemplateType['jobCompleteCustomer'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 19,
  "defaultOption": false,
  "description": "Used when an email is sent to a customer to notify that a job is complete",
  "l10nKey": null,
  "name": "Job Complete (Customer)",
  "nameKey": "jobCompleteCustomer"
};

    App.dict.emailTemplateType['invoiceCreditMemo'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 20,
  "defaultOption": true,
  "description": "Credit Memo (Invoice)",
  "l10nKey": null,
  "name": "Invoice Credit Memo",
  "nameKey": "invoiceCreditMemo"
};

    App.dict.emailTemplateType['paymentCreditMemo'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 21,
  "defaultOption": true,
  "description": "Credit Memo (Payment)",
  "l10nKey": null,
  "name": "Payment Credit Memo",
  "nameKey": "paymentCreditMemo"
};

    App.dict.emailTemplateType['jobUnassignContact'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 22,
  "defaultOption": false,
  "description": "Used when an unassign email is sent to the interpreter",
  "l10nKey": null,
  "name": "Job Unassign (Interpreter)",
  "nameKey": "jobUnassignContact"
};

    App.dict.emailTemplateType['jobUnassignCustomer'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 23,
  "defaultOption": false,
  "description": "Used when an unassign email is sent to the requestor",
  "l10nKey": null,
  "name": "Job Unassign (Customer)",
  "nameKey": "jobUnassignCustomer"
};

    App.dict.emailTemplateType['jobStatusUpdate'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 24,
  "defaultOption": false,
  "description": "Used when a job(s) status update email is sent to the requestor",
  "l10nKey": null,
  "name": "Job Status Update",
  "nameKey": "jobStatusUpdate"
};

    App.dict.emailTemplateType['phoneReady'] = {
  "class": "com.ngs.id.model.type.EmailTemplateType",
  "id": 25,
  "defaultOption": false,
  "description": "Used when an email is sent to the customer, interpreter and optionally the consumer to remind them of an upcoming scheduled phone call",
  "l10nKey": null,
  "name": "Phone Ready",
  "nameKey": "phoneReady"
};


App.dict.smsTemplateType = {};


    App.dict.smsTemplateType['offer'] = {
  "class": "com.ngs.id.model.type.SmsTemplateType",
  "id": 1,
  "defaultOption": false,
  "description": "Job offer to interpreter",
  "l10nKey": null,
  "name": "Offer",
  "nameKey": "offer"
};

    App.dict.smsTemplateType['confirmation'] = {
  "class": "com.ngs.id.model.type.SmsTemplateType",
  "id": 2,
  "defaultOption": false,
  "description": "Job confirmation to interpreter",
  "l10nKey": null,
  "name": "Confirmation",
  "nameKey": "confirmation"
};

    App.dict.smsTemplateType['autoreply'] = {
  "class": "com.ngs.id.model.type.SmsTemplateType",
  "id": 3,
  "defaultOption": false,
  "description": "SMS auto reply for conversational messages when \"enable offer action sms\" is not enabled",
  "l10nKey": null,
  "name": "Auto reply",
  "nameKey": "autoreply"
};


App.dict.customerStatus = {};


    App.dict.customerStatus['active'] = {
  "class": "com.ngs.id.model.type.CustomerStatus",
  "id": 1,
  "defaultOption": true,
  "description": null,
  "l10nKey": null,
  "name": "Active",
  "nameKey": "active"
};

    App.dict.customerStatus['inactive'] = {
  "class": "com.ngs.id.model.type.CustomerStatus",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Inactive",
  "nameKey": "inactive"
};


App.dict.addressType = {};


    App.dict.addressType['home'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 1,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Home",
  "nameKey": "home"
};

    App.dict.addressType['business'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 2,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Business",
  "nameKey": "business"
};

    App.dict.addressType['billing'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 3,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Billing",
  "nameKey": "billing"
};

    App.dict.addressType['service'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 4,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Service Location",
  "nameKey": "service"
};

    App.dict.addressType['other'] = {
  "class": "com.ngs.id.model.type.AddressType",
  "id": 5,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": "Other",
  "nameKey": "other"
};


App.dict.days = {};


    App.dict.days['monday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 1,
  "defaultOption": true,
  "description": "Monday",
  "l10nKey": null,
  "name": "Monday",
  "nameKey": "monday"
};

    App.dict.days['tuesday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 2,
  "defaultOption": false,
  "description": "Tuesday",
  "l10nKey": null,
  "name": "Tuesday",
  "nameKey": "tuesday"
};

    App.dict.days['wednesday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 3,
  "defaultOption": false,
  "description": "Wednesday",
  "l10nKey": null,
  "name": "Wednesday",
  "nameKey": "wednesday"
};

    App.dict.days['thursday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 4,
  "defaultOption": false,
  "description": "Thursday",
  "l10nKey": null,
  "name": "Thursday",
  "nameKey": "thursday"
};

    App.dict.days['friday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 5,
  "defaultOption": false,
  "description": "Friday",
  "l10nKey": null,
  "name": "Friday",
  "nameKey": "friday"
};

    App.dict.days['saturday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 6,
  "defaultOption": false,
  "description": "Saturday",
  "l10nKey": null,
  "name": "Saturday",
  "nameKey": "saturday"
};

    App.dict.days['sunday'] = {
  "class": "com.ngs.id.model.type.Day",
  "id": 7,
  "defaultOption": false,
  "description": "Sunday",
  "l10nKey": null,
  "name": "Sunday",
  "nameKey": "sunday"
};


App.dict.hours = {};


    App.dict.hours[0] = {id: 0, name: '0'};

    App.dict.hours[1] = {id: 1, name: '1'};

    App.dict.hours[2] = {id: 2, name: '2'};

    App.dict.hours[3] = {id: 3, name: '3'};

    App.dict.hours[4] = {id: 4, name: '4'};

    App.dict.hours[5] = {id: 5, name: '5'};

    App.dict.hours[6] = {id: 6, name: '6'};

    App.dict.hours[7] = {id: 7, name: '7'};

    App.dict.hours[8] = {id: 8, name: '8'};

    App.dict.hours[9] = {id: 9, name: '9'};

    App.dict.hours[10] = {id: 10, name: '10'};

    App.dict.hours[11] = {id: 11, name: '11'};

    App.dict.hours[12] = {id: 12, name: '12'};

    App.dict.hours[13] = {id: 13, name: '13'};

    App.dict.hours[14] = {id: 14, name: '14'};

    App.dict.hours[15] = {id: 15, name: '15'};

    App.dict.hours[16] = {id: 16, name: '16'};

    App.dict.hours[17] = {id: 17, name: '17'};

    App.dict.hours[18] = {id: 18, name: '18'};

    App.dict.hours[19] = {id: 19, name: '19'};

    App.dict.hours[20] = {id: 20, name: '20'};

    App.dict.hours[21] = {id: 21, name: '21'};

    App.dict.hours[22] = {id: 22, name: '22'};

    App.dict.hours[23] = {id: 23, name: '23'};


App.dict.hoursAnd16Days = {};


    App.dict.hoursAnd16Days[0] = {id: 0, name: '0'};

    App.dict.hoursAnd16Days[1] = {id: 1, name: '1'};

    App.dict.hoursAnd16Days[2] = {id: 2, name: '2'};

    App.dict.hoursAnd16Days[3] = {id: 3, name: '3'};

    App.dict.hoursAnd16Days[4] = {id: 4, name: '4'};

    App.dict.hoursAnd16Days[5] = {id: 5, name: '5'};

    App.dict.hoursAnd16Days[6] = {id: 6, name: '6'};

    App.dict.hoursAnd16Days[7] = {id: 7, name: '7'};

    App.dict.hoursAnd16Days[8] = {id: 8, name: '8'};

    App.dict.hoursAnd16Days[9] = {id: 9, name: '9'};

    App.dict.hoursAnd16Days[10] = {id: 10, name: '10'};

    App.dict.hoursAnd16Days[11] = {id: 11, name: '11'};

    App.dict.hoursAnd16Days[12] = {id: 12, name: '12'};

    App.dict.hoursAnd16Days[13] = {id: 13, name: '13'};

    App.dict.hoursAnd16Days[14] = {id: 14, name: '14'};

    App.dict.hoursAnd16Days[15] = {id: 15, name: '15'};

    App.dict.hoursAnd16Days[16] = {id: 16, name: '16'};

    App.dict.hoursAnd16Days[17] = {id: 17, name: '17'};

    App.dict.hoursAnd16Days[18] = {id: 18, name: '18'};

    App.dict.hoursAnd16Days[19] = {id: 19, name: '19'};

    App.dict.hoursAnd16Days[20] = {id: 20, name: '20'};

    App.dict.hoursAnd16Days[21] = {id: 21, name: '21'};

    App.dict.hoursAnd16Days[22] = {id: 22, name: '22'};

    App.dict.hoursAnd16Days[23] = {id: 23, name: '23'};


    App.dict.hoursAnd16Days[24] = {id: 24, name: '24'};

    App.dict.hoursAnd16Days[48] = {id: 48, name: '48'};

    App.dict.hoursAnd16Days[72] = {id: 72, name: '72'};

    App.dict.hoursAnd16Days[96] = {id: 96, name: '96'};

    App.dict.hoursAnd16Days[120] = {id: 120, name: '120'};

    App.dict.hoursAnd16Days[144] = {id: 144, name: '144'};

    App.dict.hoursAnd16Days[168] = {id: 168, name: '168'};

    App.dict.hoursAnd16Days[192] = {id: 192, name: '192'};

    App.dict.hoursAnd16Days[216] = {id: 216, name: '216'};

    App.dict.hoursAnd16Days[240] = {id: 240, name: '240'};

    App.dict.hoursAnd16Days[264] = {id: 264, name: '264'};

    App.dict.hoursAnd16Days[288] = {id: 288, name: '288'};

    App.dict.hoursAnd16Days[312] = {id: 312, name: '312'};

    App.dict.hoursAnd16Days[336] = {id: 336, name: '336'};

    App.dict.hoursAnd16Days[360] = {id: 360, name: '360'};

    App.dict.hoursAnd16Days[384] = {id: 384, name: '384'};


App.dict.minutes = {};


    App.dict.minutes[0] = {id: 0, name: '00'};

    App.dict.minutes[1] = {id: 1, name: '01'};

    App.dict.minutes[2] = {id: 2, name: '02'};

    App.dict.minutes[3] = {id: 3, name: '03'};

    App.dict.minutes[4] = {id: 4, name: '04'};

    App.dict.minutes[5] = {id: 5, name: '05'};

    App.dict.minutes[6] = {id: 6, name: '06'};

    App.dict.minutes[7] = {id: 7, name: '07'};

    App.dict.minutes[8] = {id: 8, name: '08'};

    App.dict.minutes[9] = {id: 9, name: '09'};

    App.dict.minutes[10] = {id: 10, name: '10'};

    App.dict.minutes[11] = {id: 11, name: '11'};

    App.dict.minutes[12] = {id: 12, name: '12'};

    App.dict.minutes[13] = {id: 13, name: '13'};

    App.dict.minutes[14] = {id: 14, name: '14'};

    App.dict.minutes[15] = {id: 15, name: '15'};

    App.dict.minutes[16] = {id: 16, name: '16'};

    App.dict.minutes[17] = {id: 17, name: '17'};

    App.dict.minutes[18] = {id: 18, name: '18'};

    App.dict.minutes[19] = {id: 19, name: '19'};

    App.dict.minutes[20] = {id: 20, name: '20'};

    App.dict.minutes[21] = {id: 21, name: '21'};

    App.dict.minutes[22] = {id: 22, name: '22'};

    App.dict.minutes[23] = {id: 23, name: '23'};

    App.dict.minutes[24] = {id: 24, name: '24'};

    App.dict.minutes[25] = {id: 25, name: '25'};

    App.dict.minutes[26] = {id: 26, name: '26'};

    App.dict.minutes[27] = {id: 27, name: '27'};

    App.dict.minutes[28] = {id: 28, name: '28'};

    App.dict.minutes[29] = {id: 29, name: '29'};

    App.dict.minutes[30] = {id: 30, name: '30'};

    App.dict.minutes[31] = {id: 31, name: '31'};

    App.dict.minutes[32] = {id: 32, name: '32'};

    App.dict.minutes[33] = {id: 33, name: '33'};

    App.dict.minutes[34] = {id: 34, name: '34'};

    App.dict.minutes[35] = {id: 35, name: '35'};

    App.dict.minutes[36] = {id: 36, name: '36'};

    App.dict.minutes[37] = {id: 37, name: '37'};

    App.dict.minutes[38] = {id: 38, name: '38'};

    App.dict.minutes[39] = {id: 39, name: '39'};

    App.dict.minutes[40] = {id: 40, name: '40'};

    App.dict.minutes[41] = {id: 41, name: '41'};

    App.dict.minutes[42] = {id: 42, name: '42'};

    App.dict.minutes[43] = {id: 43, name: '43'};

    App.dict.minutes[44] = {id: 44, name: '44'};

    App.dict.minutes[45] = {id: 45, name: '45'};

    App.dict.minutes[46] = {id: 46, name: '46'};

    App.dict.minutes[47] = {id: 47, name: '47'};

    App.dict.minutes[48] = {id: 48, name: '48'};

    App.dict.minutes[49] = {id: 49, name: '49'};

    App.dict.minutes[50] = {id: 50, name: '50'};

    App.dict.minutes[51] = {id: 51, name: '51'};

    App.dict.minutes[52] = {id: 52, name: '52'};

    App.dict.minutes[53] = {id: 53, name: '53'};

    App.dict.minutes[54] = {id: 54, name: '54'};

    App.dict.minutes[55] = {id: 55, name: '55'};

    App.dict.minutes[56] = {id: 56, name: '56'};

    App.dict.minutes[57] = {id: 57, name: '57'};

    App.dict.minutes[58] = {id: 58, name: '58'};

    App.dict.minutes[59] = {id: 59, name: '59'};


App.dict.dozen = {};


    App.dict.dozen[1] = {id: 1, name: '1'};

    App.dict.dozen[2] = {id: 2, name: '2'};

    App.dict.dozen[3] = {id: 3, name: '3'};

    App.dict.dozen[4] = {id: 4, name: '4'};

    App.dict.dozen[5] = {id: 5, name: '5'};

    App.dict.dozen[6] = {id: 6, name: '6'};

    App.dict.dozen[7] = {id: 7, name: '7'};

    App.dict.dozen[8] = {id: 8, name: '8'};

    App.dict.dozen[9] = {id: 9, name: '9'};

    App.dict.dozen[10] = {id: 10, name: '10'};

    App.dict.dozen[11] = {id: 11, name: '11'};

    App.dict.dozen[12] = {id: 12, name: '12'};


App.dict.consumerCount = {};


    App.dict.consumerCount[0] = {id: 0, name: '0'};;

    App.dict.consumerCount[1] = {id: 1, name: '1'};;

    App.dict.consumerCount[2] = {id: 2, name: '2'};;

    App.dict.consumerCount[3] = {id: 3, name: '3'};;

    App.dict.consumerCount[4] = {id: 4, name: '4'};;

    App.dict.consumerCount[5] = {id: 5, name: '5'};;

    App.dict.consumerCount[6] = {id: 6, name: '6'};;

    App.dict.consumerCount[7] = {id: 7, name: '7'};;

    App.dict.consumerCount[8] = {id: 8, name: '8'};;

    App.dict.consumerCount[9] = {id: 9, name: '9'};;

    App.dict.consumerCount[10] = {id: 10, name: '10'};;

    App.dict.consumerCount[11] = {id: 11, name: '11'};;

    App.dict.consumerCount[12] = {id: 12, name: '12'};;

    App.dict.consumerCount[13] = {id: 13, name: '13'};;

    App.dict.consumerCount[14] = {id: 14, name: '14'};;

    App.dict.consumerCount[15] = {id: 15, name: '15'};;

    App.dict.consumerCount[16] = {id: 16, name: '16'};;

    App.dict.consumerCount[17] = {id: 17, name: '17'};;

    App.dict.consumerCount[18] = {id: 18, name: '18'};;

    App.dict.consumerCount[19] = {id: 19, name: '19'};;

    App.dict.consumerCount[20] = {id: 20, name: '20'};;

    App.dict.consumerCount[21] = {id: 21, name: '21'};;

    App.dict.consumerCount[22] = {id: 22, name: '22'};;

    App.dict.consumerCount[23] = {id: 23, name: '23'};;


App.dict.interactionCategory = {};


    App.dict.interactionCategory['communication'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 1,
  "defaultOption": false,
  "description": "Communication",
  "l10nKey": null,
  "name": "Communication",
  "nameKey": "communication",
  "parent": null
};

    App.dict.interactionCategory['complaint'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 2,
  "defaultOption": false,
  "description": "Complaint",
  "l10nKey": null,
  "name": "Complaint",
  "nameKey": "complaint",
  "parent": null
};

    App.dict.interactionCategory['issue'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 3,
  "defaultOption": false,
  "description": "Issue",
  "l10nKey": null,
  "name": "Issue",
  "nameKey": "issue",
  "parent": null
};

    App.dict.interactionCategory['deactivated'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 4,
  "defaultOption": false,
  "description": "Mark Deactivated",
  "l10nKey": null,
  "name": "Mark Deactivated",
  "nameKey": "deactivated",
  "parent": null
};

    App.dict.interactionCategory['unavailable'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 5,
  "defaultOption": false,
  "description": "Mark Unavailable",
  "l10nKey": null,
  "name": "Mark Unavailable",
  "nameKey": "unavailable",
  "parent": null
};

    App.dict.interactionCategory['sub_status_cancellation'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 6,
  "defaultOption": false,
  "description": "Sub-status Cancellation",
  "l10nKey": null,
  "name": "Sub-status Cancellation",
  "nameKey": "sub_status_cancellation",
  "parent": null
};


App.dict.interactionSubCategory = {};


    App.dict.interactionSubCategory['commendation_feedback'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 7,
  "defaultOption": false,
  "description": "Commendation/Feedback",
  "l10nKey": null,
  "name": "Commendation/Feedback",
  "nameKey": "commendation_feedback",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['communication_detail_below'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 8,
  "defaultOption": false,
  "description": "Communication (Detail below)",
  "l10nKey": null,
  "name": "Communication (Detail below)",
  "nameKey": "communication_detail_below",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['booking_volume'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 9,
  "defaultOption": false,
  "description": "Booking Volume",
  "l10nKey": null,
  "name": "Booking Volume",
  "nameKey": "booking_volume",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['difficult_booking'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 10,
  "defaultOption": false,
  "description": "Difficult Booking",
  "l10nKey": null,
  "name": "Difficult Booking",
  "nameKey": "difficult_booking",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['pay_rate_issues'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 11,
  "defaultOption": false,
  "description": "Pay Rate Issues",
  "l10nKey": null,
  "name": "Pay Rate Issues",
  "nameKey": "pay_rate_issues",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['location_availability_issues'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 12,
  "defaultOption": false,
  "description": "Location/Availability Issues",
  "l10nKey": null,
  "name": "Location/Availability Issues",
  "nameKey": "location_availability_issues",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['disciplinary_meeting '] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 13,
  "defaultOption": false,
  "description": "Disciplinary Meeting ",
  "l10nKey": null,
  "name": "Disciplinary Meeting ",
  "nameKey": "disciplinary_meeting ",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['interpreter_complaint'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 14,
  "defaultOption": false,
  "description": "Interpreter Complaint",
  "l10nKey": null,
  "name": "Interpreter Complaint",
  "nameKey": "interpreter_complaint",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['general'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 15,
  "defaultOption": false,
  "description": "General",
  "l10nKey": null,
  "name": "General",
  "nameKey": "general",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['iol_issue'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 16,
  "defaultOption": false,
  "description": "IOL Issue",
  "l10nKey": null,
  "name": "IOL Issue",
  "nameKey": "iol_issue",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['bsl_issue'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 17,
  "defaultOption": false,
  "description": "BSL Issue",
  "l10nKey": null,
  "name": "BSL Issue",
  "nameKey": "bsl_issue",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 1
  }
};

    App.dict.interactionSubCategory['interpreter_late_complaint'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 18,
  "defaultOption": false,
  "description": "Interpreter Late",
  "l10nKey": null,
  "name": "Interpreter Late",
  "nameKey": "interpreter_late_complaint",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 2
  }
};

    App.dict.interactionSubCategory['interpreter_no_show_complaint'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 19,
  "defaultOption": false,
  "description": "Interpreter No Show",
  "l10nKey": null,
  "name": "Interpreter No Show",
  "nameKey": "interpreter_no_show_complaint",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 2
  }
};

    App.dict.interactionSubCategory['professional_conduct_complaint'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 20,
  "defaultOption": false,
  "description": "Professional Conduct",
  "l10nKey": null,
  "name": "Professional Conduct",
  "nameKey": "professional_conduct_complaint",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 2
  }
};

    App.dict.interactionSubCategory['language_ability'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 21,
  "defaultOption": false,
  "description": "Language Ability",
  "l10nKey": null,
  "name": "Language Ability",
  "nameKey": "language_ability",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 2
  }
};

    App.dict.interactionSubCategory['session_management'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 22,
  "defaultOption": false,
  "description": "Session Management",
  "l10nKey": null,
  "name": "Session Management",
  "nameKey": "session_management",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 2
  }
};

    App.dict.interactionSubCategory['other_complaint'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 23,
  "defaultOption": false,
  "description": "Other",
  "l10nKey": null,
  "name": "Other",
  "nameKey": "other_complaint",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 2
  }
};

    App.dict.interactionSubCategory['breach_of_code_of_ethics'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 24,
  "defaultOption": false,
  "description": "Breach of Code of Ethics",
  "l10nKey": null,
  "name": "Breach of Code of Ethics",
  "nameKey": "breach_of_code_of_ethics",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 2
  }
};

    App.dict.interactionSubCategory['code_of_ethics_lang_skills'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 25,
  "defaultOption": false,
  "description": "Code of Ethics - Lang Skills",
  "l10nKey": null,
  "name": "Code of Ethics - Lang Skills",
  "nameKey": "code_of_ethics_lang_skills",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['documentation_form_issues'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 26,
  "defaultOption": false,
  "description": "Documentation - Form Issues",
  "l10nKey": null,
  "name": "Documentation - Form Issues",
  "nameKey": "documentation_form_issues",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['documentation_failure_to_provide'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 27,
  "defaultOption": false,
  "description": "Documentation - Failure To Provide",
  "l10nKey": null,
  "name": "Documentation - Failure To Provide",
  "nameKey": "documentation_failure_to_provide",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['reliability_email_cancellation'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 28,
  "defaultOption": false,
  "description": "Reliability Email Cancellation",
  "l10nKey": null,
  "name": "Reliability Email Cancellation",
  "nameKey": "reliability_email_cancellation",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['professional_conduct'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 29,
  "defaultOption": false,
  "description": "Professional Conduct",
  "l10nKey": null,
  "name": "Professional Conduct",
  "nameKey": "professional_conduct",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['contact_issues'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 30,
  "defaultOption": false,
  "description": "Contact Issues",
  "l10nKey": null,
  "name": "Contact Issues",
  "nameKey": "contact_issues",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['reliability_late_cancellation_48_hrs'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 31,
  "defaultOption": false,
  "description": "Reliability - Late Cancellation (48 hrs)",
  "l10nKey": null,
  "name": "Reliability - Late Cancellation (48 hrs)",
  "nameKey": "reliability_late_cancellation_48_hrs",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['reliability_late'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 32,
  "defaultOption": false,
  "description": "Reliability - Late",
  "l10nKey": null,
  "name": "Reliability - Late",
  "nameKey": "reliability_late",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['reliability_ongoing_issues'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 33,
  "defaultOption": false,
  "description": "Reliability - Ongoing Issues",
  "l10nKey": null,
  "name": "Reliability - Ongoing Issues",
  "nameKey": "reliability_ongoing_issues",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['deactivated_sub'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 34,
  "defaultOption": false,
  "description": "Deactivated",
  "l10nKey": null,
  "name": "Deactivated",
  "nameKey": "deactivated_sub",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 4
  }
};

    App.dict.interactionSubCategory['availability_hours_reduced'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 35,
  "defaultOption": false,
  "description": "Availability - Hours Reduced",
  "l10nKey": null,
  "name": "Availability - Hours Reduced",
  "nameKey": "availability_hours_reduced",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 5
  }
};

    App.dict.interactionSubCategory['availability_other_obligation'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 36,
  "defaultOption": false,
  "description": "Availability - Other Obligation",
  "l10nKey": null,
  "name": "Availability - Other Obligation",
  "nameKey": "availability_other_obligation",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 5
  }
};

    App.dict.interactionSubCategory['availability_location'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 37,
  "defaultOption": false,
  "description": "Availability - Location",
  "l10nKey": null,
  "name": "Availability - Location",
  "nameKey": "availability_location",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 5
  }
};

    App.dict.interactionSubCategory['availability_pay_related'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 38,
  "defaultOption": false,
  "description": "Availability - Pay Related",
  "l10nKey": null,
  "name": "Availability - Pay Related",
  "nameKey": "availability_pay_related",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 5
  }
};

    App.dict.interactionSubCategory['other'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 39,
  "defaultOption": false,
  "description": "Other",
  "l10nKey": null,
  "name": "Other",
  "nameKey": "other",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 5
  }
};

    App.dict.interactionSubCategory['pay_rate_no_travel_time_exp'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 40,
  "defaultOption": false,
  "description": "Pay Rate - No travel time/Exp",
  "l10nKey": null,
  "name": "Pay Rate - No travel time/Exp",
  "nameKey": "pay_rate_no_travel_time_exp",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 5
  }
};

    App.dict.interactionSubCategory['pay_rate_estimated_duration'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 41,
  "defaultOption": false,
  "description": "Pay Rate - Estimated duration",
  "l10nKey": null,
  "name": "Pay Rate - Estimated duration",
  "nameKey": "pay_rate_estimated_duration",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 5
  }
};

    App.dict.interactionSubCategory['no_show_denied_allocation'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 42,
  "defaultOption": false,
  "description": "No Show - Denied Allocation",
  "l10nKey": null,
  "name": "No Show - Denied Allocation",
  "nameKey": "no_show_denied_allocation",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['no_show_diary_management'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 43,
  "defaultOption": false,
  "description": "No Show - Diary Management",
  "l10nKey": null,
  "name": "No Show - Diary Management",
  "nameKey": "no_show_diary_management",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['no_show_health_personal'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 44,
  "defaultOption": false,
  "description": "No Show - Health/Personal",
  "l10nKey": null,
  "name": "No Show - Health/Personal",
  "nameKey": "no_show_health_personal",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['no_show_late_cancellation'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 45,
  "defaultOption": false,
  "description": "No Show - Late Cancellation",
  "l10nKey": null,
  "name": "No Show - Late Cancellation",
  "nameKey": "no_show_late_cancellation",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['no_show_late_travel_lost'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 46,
  "defaultOption": false,
  "description": "No Show - Late Travel/Lost",
  "l10nKey": null,
  "name": "No Show - Late Travel/Lost",
  "nameKey": "no_show_late_travel_lost",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['no_show_other_'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 47,
  "defaultOption": false,
  "description": "No Show - Other ",
  "l10nKey": null,
  "name": "No Show - Other ",
  "nameKey": "no_show_other_",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['no_interpreter_available'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 48,
  "defaultOption": false,
  "description": "No Interpreter Available",
  "l10nKey": null,
  "name": "No Interpreter Available",
  "nameKey": "no_interpreter_available",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['interpreter_no_show'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 49,
  "defaultOption": false,
  "description": "Interpreter No Show",
  "l10nKey": null,
  "name": "Interpreter No Show",
  "nameKey": "interpreter_no_show",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['late_interpreter_cancellation'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 50,
  "defaultOption": false,
  "description": "Late Interpreter Cancellation",
  "l10nKey": null,
  "name": "Late Interpreter Cancellation",
  "nameKey": "late_interpreter_cancellation",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['admin_error'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 51,
  "defaultOption": false,
  "description": "Admin Error",
  "l10nKey": null,
  "name": "Admin Error",
  "nameKey": "admin_error",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['cancelled_late_invoice_client'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 52,
  "defaultOption": false,
  "description": "Cancelled Late - Invoice Client",
  "l10nKey": null,
  "name": "Cancelled Late - Invoice Client",
  "nameKey": "cancelled_late_invoice_client",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['cancelled_late_pay_interpreter'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 53,
  "defaultOption": false,
  "description": "Cancelled Late - Pay Interpreter",
  "l10nKey": null,
  "name": "Cancelled Late - Pay Interpreter",
  "nameKey": "cancelled_late_pay_interpreter",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['late_police_cancellation'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 54,
  "defaultOption": false,
  "description": "Late Police Cancellation",
  "l10nKey": null,
  "name": "Late Police Cancellation",
  "nameKey": "late_police_cancellation",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['cancelled'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 55,
  "defaultOption": false,
  "description": "Cancelled",
  "l10nKey": null,
  "name": "Cancelled",
  "nameKey": "cancelled",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['interpreter_late'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 56,
  "defaultOption": false,
  "description": "Interpreter Late",
  "l10nKey": null,
  "name": "Interpreter Late",
  "nameKey": "interpreter_late",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 6
  }
};

    App.dict.interactionSubCategory['reliability_early_cancellation'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 57,
  "defaultOption": false,
  "description": "Reliability - Early Cancellation",
  "l10nKey": null,
  "name": "Reliability - Early Cancellation",
  "nameKey": "reliability_early_cancellation",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};

    App.dict.interactionSubCategory['self_financing_error'] = {
  "class": "com.ngs.id.model.type.InteractionCategory",
  "id": 58,
  "defaultOption": true,
  "description": "Self-Financing Error",
  "l10nKey": null,
  "name": "Self-Financing Error",
  "nameKey": "self_financing_error",
  "parent": {
    "class": "com.ngs.id.model.type.InteractionCategory",
    "id": 3
  }
};


App.dict.interactionOutcome = {};


    App.dict.interactionOutcome['first_warning'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 1,
  "defaultOption": false,
  "description": "1st Warning",
  "l10nKey": null,
  "name": "1st Warning",
  "nameKey": "first_warning"
};

    App.dict.interactionOutcome['second_warning'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 2,
  "defaultOption": false,
  "description": "2nd Warning",
  "l10nKey": null,
  "name": "2nd Warning",
  "nameKey": "second_warning"
};

    App.dict.interactionOutcome['final_warning'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 3,
  "defaultOption": false,
  "description": "Final Warning",
  "l10nKey": null,
  "name": "Final Warning",
  "nameKey": "final_warning"
};

    App.dict.interactionOutcome['deactivation'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 4,
  "defaultOption": false,
  "description": "Deactivation",
  "l10nKey": null,
  "name": "Deactivation",
  "nameKey": "deactivation"
};

    App.dict.interactionOutcome['monitor'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 5,
  "defaultOption": false,
  "description": "Monitor",
  "l10nKey": null,
  "name": "Monitor",
  "nameKey": "monitor"
};

    App.dict.interactionOutcome['no_action_required'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 6,
  "defaultOption": false,
  "description": "No Action Required",
  "l10nKey": null,
  "name": "No Action Required",
  "nameKey": "no_action_required"
};

    App.dict.interactionOutcome['training_required'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 7,
  "defaultOption": false,
  "description": "Training Required",
  "l10nKey": null,
  "name": "Training Required",
  "nameKey": "training_required"
};

    App.dict.interactionOutcome['no_action_needed'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 8,
  "defaultOption": false,
  "description": "No Action Needed",
  "l10nKey": null,
  "name": "No Action Needed",
  "nameKey": "no_action_needed"
};

    App.dict.interactionOutcome['disciplinary'] = {
  "class": "com.ngs.id.model.type.InteractionOutcome",
  "id": 9,
  "defaultOption": false,
  "description": "Disciplinary",
  "l10nKey": null,
  "name": "Disciplinary",
  "nameKey": "disciplinary"
};


App.dict.interactionStatus = {};


    App.dict.interactionStatus['open'] = {
  "class": "com.ngs.id.model.type.InteractionStatus",
  "id": 1,
  "defaultOption": true,
  "description": "Open",
  "l10nKey": null,
  "name": "Open",
  "nameKey": "open"
};

    App.dict.interactionStatus['closed'] = {
  "class": "com.ngs.id.model.type.InteractionStatus",
  "id": 2,
  "defaultOption": false,
  "description": "Closed",
  "l10nKey": null,
  "name": "Closed",
  "nameKey": "closed"
};


App.dict.timeZones = 
[
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Midway",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Samoa Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -39600000
    },
    "id": "Pacific/Midway",
    "shortName": "SST",
    "longName": "Samoa Standard Time",
    "utcOffset": "(UTC-23:00) Pacific/Midway SST - Samoa Standard Time ",
    "gmtOffset": "GMT-11:00 Pacific/Midway SST - Samoa Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Niue",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Niue Time",
      "lastRuleInstance": null,
      "rawOffset": -39600000
    },
    "id": "Pacific/Niue",
    "shortName": "NUT",
    "longName": "Niue Time",
    "utcOffset": "(UTC-23:00) Pacific/Niue NUT - Niue Time ",
    "gmtOffset": "GMT-11:00 Pacific/Niue NUT - Niue Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Pago_Pago",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Samoa Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -39600000
    },
    "id": "Pacific/Pago_Pago",
    "shortName": "SST",
    "longName": "Samoa Standard Time",
    "utcOffset": "(UTC-23:00) Pacific/Pago_Pago SST - Samoa Standard Time ",
    "gmtOffset": "GMT-11:00 Pacific/Pago_Pago SST - Samoa Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Samoa",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Samoa Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -39600000
    },
    "id": "Pacific/Samoa",
    "shortName": "SST",
    "longName": "Samoa Standard Time",
    "utcOffset": "(UTC-23:00) Pacific/Samoa SST - Samoa Standard Time ",
    "gmtOffset": "GMT-11:00 Pacific/Samoa SST - Samoa Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Adak",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Hawaii Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Adak",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Hawaii Standard Time",
        "rawOffset": -36000000
      },
      "rawOffset": -36000000
    },
    "id": "America/Adak",
    "shortName": "HDT",
    "longName": "Hawaii Daylight Time",
    "utcOffset": "(UTC-22:00) America/Adak HDT - Hawaii Daylight Time ",
    "gmtOffset": "GMT-10:00 America/Adak HDT - Hawaii Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Atka",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Hawaii Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Atka",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Hawaii Standard Time",
        "rawOffset": -36000000
      },
      "rawOffset": -36000000
    },
    "id": "America/Atka",
    "shortName": "HDT",
    "longName": "Hawaii Daylight Time",
    "utcOffset": "(UTC-22:00) America/Atka HDT - Hawaii Daylight Time ",
    "gmtOffset": "GMT-10:00 America/Atka HDT - Hawaii Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Honolulu",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Hawaii Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -36000000
    },
    "id": "Pacific/Honolulu",
    "shortName": "HST",
    "longName": "Hawaii Standard Time",
    "utcOffset": "(UTC-22:00) Pacific/Honolulu HST - Hawaii Standard Time ",
    "gmtOffset": "GMT-10:00 Pacific/Honolulu HST - Hawaii Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Johnston",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Hawaii Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -36000000
    },
    "id": "Pacific/Johnston",
    "shortName": "HST",
    "longName": "Hawaii Standard Time",
    "utcOffset": "(UTC-22:00) Pacific/Johnston HST - Hawaii Standard Time ",
    "gmtOffset": "GMT-10:00 Pacific/Johnston HST - Hawaii Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Rarotonga",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Cook Is. Time",
      "lastRuleInstance": null,
      "rawOffset": -36000000
    },
    "id": "Pacific/Rarotonga",
    "shortName": "CKT",
    "longName": "Cook Is. Time",
    "utcOffset": "(UTC-22:00) Pacific/Rarotonga CKT - Cook Is. Time ",
    "gmtOffset": "GMT-10:00 Pacific/Rarotonga CKT - Cook Is. Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Tahiti",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Tahiti Time",
      "lastRuleInstance": null,
      "rawOffset": -36000000
    },
    "id": "Pacific/Tahiti",
    "shortName": "TAHT",
    "longName": "Tahiti Time",
    "utcOffset": "(UTC-22:00) Pacific/Tahiti TAHT - Tahiti Time ",
    "gmtOffset": "GMT-10:00 Pacific/Tahiti TAHT - Tahiti Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Marquesas",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Marquesas Time",
      "lastRuleInstance": null,
      "rawOffset": -34200000
    },
    "id": "Pacific/Marquesas",
    "shortName": "MART",
    "longName": "Marquesas Time",
    "utcOffset": "(UTC-21:30) Pacific/Marquesas MART - Marquesas Time ",
    "gmtOffset": "GMT-09:30 Pacific/Marquesas MART - Marquesas Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Anchorage",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Alaska Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Anchorage",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Alaska Standard Time",
        "rawOffset": -32400000
      },
      "rawOffset": -32400000
    },
    "id": "America/Anchorage",
    "shortName": "AKDT",
    "longName": "Alaska Daylight Time",
    "utcOffset": "(UTC-21:00) America/Anchorage AKDT - Alaska Daylight Time ",
    "gmtOffset": "GMT-09:00 America/Anchorage AKDT - Alaska Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Juneau",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Alaska Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Juneau",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Alaska Standard Time",
        "rawOffset": -32400000
      },
      "rawOffset": -32400000
    },
    "id": "America/Juneau",
    "shortName": "AKDT",
    "longName": "Alaska Daylight Time",
    "utcOffset": "(UTC-21:00) America/Juneau AKDT - Alaska Daylight Time ",
    "gmtOffset": "GMT-09:00 America/Juneau AKDT - Alaska Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Metlakatla",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Alaska Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Metlakatla",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Alaska Standard Time",
        "rawOffset": -32400000
      },
      "rawOffset": -32400000
    },
    "id": "America/Metlakatla",
    "shortName": "AKDT",
    "longName": "Alaska Daylight Time",
    "utcOffset": "(UTC-21:00) America/Metlakatla AKDT - Alaska Daylight Time ",
    "gmtOffset": "GMT-09:00 America/Metlakatla AKDT - Alaska Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Nome",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Alaska Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Nome",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Alaska Standard Time",
        "rawOffset": -32400000
      },
      "rawOffset": -32400000
    },
    "id": "America/Nome",
    "shortName": "AKDT",
    "longName": "Alaska Daylight Time",
    "utcOffset": "(UTC-21:00) America/Nome AKDT - Alaska Daylight Time ",
    "gmtOffset": "GMT-09:00 America/Nome AKDT - Alaska Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Sitka",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Alaska Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Sitka",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Alaska Standard Time",
        "rawOffset": -32400000
      },
      "rawOffset": -32400000
    },
    "id": "America/Sitka",
    "shortName": "AKDT",
    "longName": "Alaska Daylight Time",
    "utcOffset": "(UTC-21:00) America/Sitka AKDT - Alaska Daylight Time ",
    "gmtOffset": "GMT-09:00 America/Sitka AKDT - Alaska Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Yakutat",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Alaska Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Yakutat",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Alaska Standard Time",
        "rawOffset": -32400000
      },
      "rawOffset": -32400000
    },
    "id": "America/Yakutat",
    "shortName": "AKDT",
    "longName": "Alaska Daylight Time",
    "utcOffset": "(UTC-21:00) America/Yakutat AKDT - Alaska Daylight Time ",
    "gmtOffset": "GMT-09:00 America/Yakutat AKDT - Alaska Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Gambier",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Gambier Time",
      "lastRuleInstance": null,
      "rawOffset": -32400000
    },
    "id": "Pacific/Gambier",
    "shortName": "GAMT",
    "longName": "Gambier Time",
    "utcOffset": "(UTC-21:00) Pacific/Gambier GAMT - Gambier Time ",
    "gmtOffset": "GMT-09:00 Pacific/Gambier GAMT - Gambier Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Dawson",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pacific Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Dawson",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Pacific Standard Time",
        "rawOffset": -28800000
      },
      "rawOffset": -28800000
    },
    "id": "America/Dawson",
    "shortName": "PDT",
    "longName": "Pacific Daylight Time",
    "utcOffset": "(UTC-20:00) America/Dawson PDT - Pacific Daylight Time ",
    "gmtOffset": "GMT-08:00 America/Dawson PDT - Pacific Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Ensenada",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pacific Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Ensenada",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Pacific Standard Time",
        "rawOffset": -28800000
      },
      "rawOffset": -28800000
    },
    "id": "America/Ensenada",
    "shortName": "PDT",
    "longName": "Pacific Daylight Time",
    "utcOffset": "(UTC-20:00) America/Ensenada PDT - Pacific Daylight Time ",
    "gmtOffset": "GMT-08:00 America/Ensenada PDT - Pacific Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Los_Angeles",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pacific Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Los_Angeles",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Pacific Standard Time",
        "rawOffset": -28800000
      },
      "rawOffset": -28800000
    },
    "id": "America/Los_Angeles",
    "shortName": "PDT",
    "longName": "Pacific Daylight Time",
    "utcOffset": "(UTC-20:00) America/Los_Angeles PDT - Pacific Daylight Time ",
    "gmtOffset": "GMT-08:00 America/Los_Angeles PDT - Pacific Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Santa_Isabel",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pacific Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Santa_Isabel",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Pacific Standard Time",
        "rawOffset": -28800000
      },
      "rawOffset": -28800000
    },
    "id": "America/Santa_Isabel",
    "shortName": "PDT",
    "longName": "Pacific Daylight Time",
    "utcOffset": "(UTC-20:00) America/Santa_Isabel PDT - Pacific Daylight Time ",
    "gmtOffset": "GMT-08:00 America/Santa_Isabel PDT - Pacific Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Tijuana",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pacific Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Tijuana",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Pacific Standard Time",
        "rawOffset": -28800000
      },
      "rawOffset": -28800000
    },
    "id": "America/Tijuana",
    "shortName": "PDT",
    "longName": "Pacific Daylight Time",
    "utcOffset": "(UTC-20:00) America/Tijuana PDT - Pacific Daylight Time ",
    "gmtOffset": "GMT-08:00 America/Tijuana PDT - Pacific Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Vancouver",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pacific Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Vancouver",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Pacific Standard Time",
        "rawOffset": -28800000
      },
      "rawOffset": -28800000
    },
    "id": "America/Vancouver",
    "shortName": "PDT",
    "longName": "Pacific Daylight Time",
    "utcOffset": "(UTC-20:00) America/Vancouver PDT - Pacific Daylight Time ",
    "gmtOffset": "GMT-08:00 America/Vancouver PDT - Pacific Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Whitehorse",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pacific Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Whitehorse",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Pacific Standard Time",
        "rawOffset": -28800000
      },
      "rawOffset": -28800000
    },
    "id": "America/Whitehorse",
    "shortName": "PDT",
    "longName": "Pacific Daylight Time",
    "utcOffset": "(UTC-20:00) America/Whitehorse PDT - Pacific Daylight Time ",
    "gmtOffset": "GMT-08:00 America/Whitehorse PDT - Pacific Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Pitcairn",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pitcairn Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -28800000
    },
    "id": "Pacific/Pitcairn",
    "shortName": "PST",
    "longName": "Pitcairn Standard Time",
    "utcOffset": "(UTC-20:00) Pacific/Pitcairn PST - Pitcairn Standard Time ",
    "gmtOffset": "GMT-08:00 Pacific/Pitcairn PST - Pitcairn Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Boise",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Boise",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Boise",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Boise MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Boise MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Cambridge_Bay",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Cambridge_Bay",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Cambridge_Bay",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Cambridge_Bay MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Cambridge_Bay MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Chihuahua",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Chihuahua",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Chihuahua",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Chihuahua MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Chihuahua MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Creston",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -25200000
    },
    "id": "America/Creston",
    "shortName": "MST",
    "longName": "Mountain Standard Time",
    "utcOffset": "(UTC-19:00) America/Creston MST - Mountain Standard Time ",
    "gmtOffset": "GMT-07:00 America/Creston MST - Mountain Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Dawson_Creek",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -25200000
    },
    "id": "America/Dawson_Creek",
    "shortName": "MST",
    "longName": "Mountain Standard Time",
    "utcOffset": "(UTC-19:00) America/Dawson_Creek MST - Mountain Standard Time ",
    "gmtOffset": "GMT-07:00 America/Dawson_Creek MST - Mountain Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Denver",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Denver",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Denver",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Denver MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Denver MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Edmonton",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Edmonton",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Edmonton",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Edmonton MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Edmonton MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Fort_Nelson",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -25200000
    },
    "id": "America/Fort_Nelson",
    "shortName": "MST",
    "longName": "Mountain Standard Time",
    "utcOffset": "(UTC-19:00) America/Fort_Nelson MST - Mountain Standard Time ",
    "gmtOffset": "GMT-07:00 America/Fort_Nelson MST - Mountain Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Hermosillo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -25200000
    },
    "id": "America/Hermosillo",
    "shortName": "MST",
    "longName": "Mountain Standard Time",
    "utcOffset": "(UTC-19:00) America/Hermosillo MST - Mountain Standard Time ",
    "gmtOffset": "GMT-07:00 America/Hermosillo MST - Mountain Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Inuvik",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Inuvik",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Inuvik",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Inuvik MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Inuvik MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Mazatlan",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Mazatlan",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Mazatlan",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Mazatlan MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Mazatlan MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Ojinaga",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Ojinaga",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Ojinaga",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Ojinaga MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Ojinaga MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Phoenix",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -25200000
    },
    "id": "America/Phoenix",
    "shortName": "MST",
    "longName": "Mountain Standard Time",
    "utcOffset": "(UTC-19:00) America/Phoenix MST - Mountain Standard Time ",
    "gmtOffset": "GMT-07:00 America/Phoenix MST - Mountain Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Shiprock",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Shiprock",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Shiprock",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Shiprock MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Shiprock MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Yellowknife",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Mountain Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Yellowknife",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Mountain Standard Time",
        "rawOffset": -25200000
      },
      "rawOffset": -25200000
    },
    "id": "America/Yellowknife",
    "shortName": "MDT",
    "longName": "Mountain Daylight Time",
    "utcOffset": "(UTC-19:00) America/Yellowknife MDT - Mountain Daylight Time ",
    "gmtOffset": "GMT-07:00 America/Yellowknife MDT - Mountain Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Bahia_Banderas",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Bahia_Banderas",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Bahia_Banderas",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Bahia_Banderas CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Bahia_Banderas CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Belize",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "America/Belize",
    "shortName": "CST",
    "longName": "Central Standard Time",
    "utcOffset": "(UTC-18:00) America/Belize CST - Central Standard Time ",
    "gmtOffset": "GMT-06:00 America/Belize CST - Central Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Chicago",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Chicago",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Chicago",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Chicago CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Chicago CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Costa_Rica",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "America/Costa_Rica",
    "shortName": "CST",
    "longName": "Central Standard Time",
    "utcOffset": "(UTC-18:00) America/Costa_Rica CST - Central Standard Time ",
    "gmtOffset": "GMT-06:00 America/Costa_Rica CST - Central Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/El_Salvador",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "America/El_Salvador",
    "shortName": "CST",
    "longName": "Central Standard Time",
    "utcOffset": "(UTC-18:00) America/El_Salvador CST - Central Standard Time ",
    "gmtOffset": "GMT-06:00 America/El_Salvador CST - Central Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Guatemala",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "America/Guatemala",
    "shortName": "CST",
    "longName": "Central Standard Time",
    "utcOffset": "(UTC-18:00) America/Guatemala CST - Central Standard Time ",
    "gmtOffset": "GMT-06:00 America/Guatemala CST - Central Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indiana/Knox",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indiana/Knox",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Indiana/Knox",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Indiana/Knox CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Indiana/Knox CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indiana/Tell_City",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indiana/Tell_City",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Indiana/Tell_City",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Indiana/Tell_City CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Indiana/Tell_City CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Knox_IN",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Knox_IN",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Knox_IN",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Knox_IN CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Knox_IN CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Managua",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "America/Managua",
    "shortName": "CST",
    "longName": "Central Standard Time",
    "utcOffset": "(UTC-18:00) America/Managua CST - Central Standard Time ",
    "gmtOffset": "GMT-06:00 America/Managua CST - Central Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Matamoros",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Matamoros",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Matamoros",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Matamoros CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Matamoros CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Menominee",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Menominee",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Menominee",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Menominee CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Menominee CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Merida",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Merida",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Merida",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Merida CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Merida CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Mexico_City",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Mexico_City",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Mexico_City",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Mexico_City CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Mexico_City CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Monterrey",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Monterrey",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Monterrey",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Monterrey CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Monterrey CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/North_Dakota/Beulah",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/North_Dakota/Beulah",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/North_Dakota/Beulah",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/North_Dakota/Beulah CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/North_Dakota/Beulah CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/North_Dakota/Center",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/North_Dakota/Center",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/North_Dakota/Center",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/North_Dakota/Center CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/North_Dakota/Center CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/North_Dakota/New_Salem",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/North_Dakota/New_Salem",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/North_Dakota/New_Salem",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/North_Dakota/New_Salem CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/North_Dakota/New_Salem CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Rainy_River",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Rainy_River",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Rainy_River",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Rainy_River CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Rainy_River CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Rankin_Inlet",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Rankin_Inlet",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Rankin_Inlet",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Rankin_Inlet CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Rankin_Inlet CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Regina",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "America/Regina",
    "shortName": "CST",
    "longName": "Central Standard Time",
    "utcOffset": "(UTC-18:00) America/Regina CST - Central Standard Time ",
    "gmtOffset": "GMT-06:00 America/Regina CST - Central Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Resolute",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Resolute",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Resolute",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Resolute CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Resolute CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Swift_Current",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "America/Swift_Current",
    "shortName": "CST",
    "longName": "Central Standard Time",
    "utcOffset": "(UTC-18:00) America/Swift_Current CST - Central Standard Time ",
    "gmtOffset": "GMT-06:00 America/Swift_Current CST - Central Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Tegucigalpa",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "America/Tegucigalpa",
    "shortName": "CST",
    "longName": "Central Standard Time",
    "utcOffset": "(UTC-18:00) America/Tegucigalpa CST - Central Standard Time ",
    "gmtOffset": "GMT-06:00 America/Tegucigalpa CST - Central Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Winnipeg",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Winnipeg",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central Standard Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "America/Winnipeg",
    "shortName": "CDT",
    "longName": "Central Daylight Time",
    "utcOffset": "(UTC-18:00) America/Winnipeg CDT - Central Daylight Time ",
    "gmtOffset": "GMT-06:00 America/Winnipeg CDT - Central Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Pacific/Easter",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Easter Is. Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Pacific/Easter",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Easter Is. Time",
        "rawOffset": -21600000
      },
      "rawOffset": -21600000
    },
    "id": "Pacific/Easter",
    "shortName": "EASST",
    "longName": "Easter Is. Summer Time",
    "utcOffset": "(UTC-18:00) Pacific/Easter EASST - Easter Is. Summer Time ",
    "gmtOffset": "GMT-06:00 Pacific/Easter EASST - Easter Is. Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Galapagos",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Galapagos Time",
      "lastRuleInstance": null,
      "rawOffset": -21600000
    },
    "id": "Pacific/Galapagos",
    "shortName": "GALT",
    "longName": "Galapagos Time",
    "utcOffset": "(UTC-18:00) Pacific/Galapagos GALT - Galapagos Time ",
    "gmtOffset": "GMT-06:00 Pacific/Galapagos GALT - Galapagos Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Atikokan",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Atikokan",
    "shortName": "EST",
    "longName": "Eastern Standard Time",
    "utcOffset": "(UTC-17:00) America/Atikokan EST - Eastern Standard Time ",
    "gmtOffset": "GMT-05:00 America/Atikokan EST - Eastern Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Bogota",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Colombia Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Bogota",
    "shortName": "COT",
    "longName": "Colombia Time",
    "utcOffset": "(UTC-17:00) America/Bogota COT - Colombia Time ",
    "gmtOffset": "GMT-05:00 America/Bogota COT - Colombia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Cancun",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Cancun",
    "shortName": "EST",
    "longName": "Eastern Standard Time",
    "utcOffset": "(UTC-17:00) America/Cancun EST - Eastern Standard Time ",
    "gmtOffset": "GMT-05:00 America/Cancun EST - Eastern Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Cayman",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Cayman",
    "shortName": "EST",
    "longName": "Eastern Standard Time",
    "utcOffset": "(UTC-17:00) America/Cayman EST - Eastern Standard Time ",
    "gmtOffset": "GMT-05:00 America/Cayman EST - Eastern Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Coral_Harbour",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Coral_Harbour",
    "shortName": "EST",
    "longName": "Eastern Standard Time",
    "utcOffset": "(UTC-17:00) America/Coral_Harbour EST - Eastern Standard Time ",
    "gmtOffset": "GMT-05:00 America/Coral_Harbour EST - Eastern Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Detroit",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Detroit",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Detroit",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Detroit EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Detroit EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Eirunepe",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Acre Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Eirunepe",
    "shortName": "ACT",
    "longName": "Acre Time",
    "utcOffset": "(UTC-17:00) America/Eirunepe ACT - Acre Time ",
    "gmtOffset": "GMT-05:00 America/Eirunepe ACT - Acre Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Fort_Wayne",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Fort_Wayne",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Fort_Wayne",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Fort_Wayne EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Fort_Wayne EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Grand_Turk",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Grand_Turk",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Atlantic Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Grand_Turk",
    "shortName": "ADT",
    "longName": "Atlantic Daylight Time",
    "utcOffset": "(UTC-17:00) America/Grand_Turk ADT - Atlantic Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Grand_Turk ADT - Atlantic Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Guayaquil",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Ecuador Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Guayaquil",
    "shortName": "ECT",
    "longName": "Ecuador Time",
    "utcOffset": "(UTC-17:00) America/Guayaquil ECT - Ecuador Time ",
    "gmtOffset": "GMT-05:00 America/Guayaquil ECT - Ecuador Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Havana",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Cuba Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Havana",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Cuba Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Havana",
    "shortName": "CDT",
    "longName": "Cuba Daylight Time",
    "utcOffset": "(UTC-17:00) America/Havana CDT - Cuba Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Havana CDT - Cuba Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indiana/Indianapolis",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indiana/Indianapolis",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Indiana/Indianapolis",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Indiana/Indianapolis EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Indiana/Indianapolis EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indiana/Marengo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indiana/Marengo",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Indiana/Marengo",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Indiana/Marengo EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Indiana/Marengo EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indiana/Petersburg",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indiana/Petersburg",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Indiana/Petersburg",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Indiana/Petersburg EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Indiana/Petersburg EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indiana/Vevay",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indiana/Vevay",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Indiana/Vevay",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Indiana/Vevay EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Indiana/Vevay EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indiana/Vincennes",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indiana/Vincennes",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Indiana/Vincennes",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Indiana/Vincennes EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Indiana/Vincennes EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indiana/Winamac",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indiana/Winamac",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Indiana/Winamac",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Indiana/Winamac EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Indiana/Winamac EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Indianapolis",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Indianapolis",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Indianapolis",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Indianapolis EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Indianapolis EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Iqaluit",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Iqaluit",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Iqaluit",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Iqaluit EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Iqaluit EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Jamaica",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Jamaica",
    "shortName": "EST",
    "longName": "Eastern Standard Time",
    "utcOffset": "(UTC-17:00) America/Jamaica EST - Eastern Standard Time ",
    "gmtOffset": "GMT-05:00 America/Jamaica EST - Eastern Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Kentucky/Louisville",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Kentucky/Louisville",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Kentucky/Louisville",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Kentucky/Louisville EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Kentucky/Louisville EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Kentucky/Monticello",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Kentucky/Monticello",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Kentucky/Monticello",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Kentucky/Monticello EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Kentucky/Monticello EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Lima",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Peru Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Lima",
    "shortName": "PET",
    "longName": "Peru Time",
    "utcOffset": "(UTC-17:00) America/Lima PET - Peru Time ",
    "gmtOffset": "GMT-05:00 America/Lima PET - Peru Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Louisville",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Louisville",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Louisville",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Louisville EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Louisville EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Montreal",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Montreal",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Montreal",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Montreal EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Montreal EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Nassau",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Nassau",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Nassau",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Nassau EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Nassau EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/New_York",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/New_York",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/New_York",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/New_York EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/New_York EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Nipigon",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Nipigon",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Nipigon",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Nipigon EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Nipigon EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Panama",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Panama",
    "shortName": "EST",
    "longName": "Eastern Standard Time",
    "utcOffset": "(UTC-17:00) America/Panama EST - Eastern Standard Time ",
    "gmtOffset": "GMT-05:00 America/Panama EST - Eastern Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Pangnirtung",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Pangnirtung",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Pangnirtung",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Pangnirtung EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Pangnirtung EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Port-au-Prince",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Port-au-Prince",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Port-au-Prince",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Port-au-Prince EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Port-au-Prince EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Porto_Acre",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Acre Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Porto_Acre",
    "shortName": "ACT",
    "longName": "Acre Time",
    "utcOffset": "(UTC-17:00) America/Porto_Acre ACT - Acre Time ",
    "gmtOffset": "GMT-05:00 America/Porto_Acre ACT - Acre Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Rio_Branco",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Acre Time",
      "lastRuleInstance": null,
      "rawOffset": -18000000
    },
    "id": "America/Rio_Branco",
    "shortName": "ACT",
    "longName": "Acre Time",
    "utcOffset": "(UTC-17:00) America/Rio_Branco ACT - Acre Time ",
    "gmtOffset": "GMT-05:00 America/Rio_Branco ACT - Acre Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Thunder_Bay",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Thunder_Bay",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Thunder_Bay",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Thunder_Bay EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Thunder_Bay EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Toronto",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Toronto",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Standard Time",
        "rawOffset": -18000000
      },
      "rawOffset": -18000000
    },
    "id": "America/Toronto",
    "shortName": "EDT",
    "longName": "Eastern Daylight Time",
    "utcOffset": "(UTC-17:00) America/Toronto EDT - Eastern Daylight Time ",
    "gmtOffset": "GMT-05:00 America/Toronto EDT - Eastern Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Anguilla",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Anguilla",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Anguilla AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Anguilla AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Antigua",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Antigua",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Antigua AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Antigua AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Aruba",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Aruba",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Aruba AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Aruba AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Asuncion",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Paraguay Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Asuncion",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Paraguay Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Asuncion",
    "shortName": "PYT",
    "longName": "Paraguay Time",
    "utcOffset": "(UTC-16:00) America/Asuncion PYT - Paraguay Time ",
    "gmtOffset": "GMT-04:00 America/Asuncion PYT - Paraguay Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Barbados",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Barbados",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Barbados AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Barbados AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Blanc-Sablon",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Blanc-Sablon",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Blanc-Sablon AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Blanc-Sablon AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Boa_Vista",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Amazon Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Boa_Vista",
    "shortName": "AMT",
    "longName": "Amazon Time",
    "utcOffset": "(UTC-16:00) America/Boa_Vista AMT - Amazon Time ",
    "gmtOffset": "GMT-04:00 America/Boa_Vista AMT - Amazon Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Campo_Grande",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Amazon Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Campo_Grande",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Amazon Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Campo_Grande",
    "shortName": "AMT",
    "longName": "Amazon Time",
    "utcOffset": "(UTC-16:00) America/Campo_Grande AMT - Amazon Time ",
    "gmtOffset": "GMT-04:00 America/Campo_Grande AMT - Amazon Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Caracas",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Venezuela Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Caracas",
    "shortName": "VET",
    "longName": "Venezuela Time",
    "utcOffset": "(UTC-16:00) America/Caracas VET - Venezuela Time ",
    "gmtOffset": "GMT-04:00 America/Caracas VET - Venezuela Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Cuiaba",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Amazon Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Cuiaba",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Amazon Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Cuiaba",
    "shortName": "AMT",
    "longName": "Amazon Time",
    "utcOffset": "(UTC-16:00) America/Cuiaba AMT - Amazon Time ",
    "gmtOffset": "GMT-04:00 America/Cuiaba AMT - Amazon Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Curacao",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Curacao",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Curacao AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Curacao AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Dominica",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Dominica",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Dominica AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Dominica AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Glace_Bay",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Glace_Bay",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Atlantic Standard Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Glace_Bay",
    "shortName": "ADT",
    "longName": "Atlantic Daylight Time",
    "utcOffset": "(UTC-16:00) America/Glace_Bay ADT - Atlantic Daylight Time ",
    "gmtOffset": "GMT-04:00 America/Glace_Bay ADT - Atlantic Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Goose_Bay",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Goose_Bay",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Atlantic Standard Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Goose_Bay",
    "shortName": "ADT",
    "longName": "Atlantic Daylight Time",
    "utcOffset": "(UTC-16:00) America/Goose_Bay ADT - Atlantic Daylight Time ",
    "gmtOffset": "GMT-04:00 America/Goose_Bay ADT - Atlantic Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Grenada",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Grenada",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Grenada AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Grenada AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Guadeloupe",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Guadeloupe",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Guadeloupe AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Guadeloupe AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Guyana",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Guyana Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Guyana",
    "shortName": "GYT",
    "longName": "Guyana Time",
    "utcOffset": "(UTC-16:00) America/Guyana GYT - Guyana Time ",
    "gmtOffset": "GMT-04:00 America/Guyana GYT - Guyana Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Halifax",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Halifax",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Atlantic Standard Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Halifax",
    "shortName": "ADT",
    "longName": "Atlantic Daylight Time",
    "utcOffset": "(UTC-16:00) America/Halifax ADT - Atlantic Daylight Time ",
    "gmtOffset": "GMT-04:00 America/Halifax ADT - Atlantic Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Kralendijk",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Kralendijk",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Kralendijk AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Kralendijk AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/La_Paz",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Bolivia Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/La_Paz",
    "shortName": "BOT",
    "longName": "Bolivia Time",
    "utcOffset": "(UTC-16:00) America/La_Paz BOT - Bolivia Time ",
    "gmtOffset": "GMT-04:00 America/La_Paz BOT - Bolivia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Lower_Princes",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Lower_Princes",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Lower_Princes AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Lower_Princes AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Manaus",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Amazon Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Manaus",
    "shortName": "AMT",
    "longName": "Amazon Time",
    "utcOffset": "(UTC-16:00) America/Manaus AMT - Amazon Time ",
    "gmtOffset": "GMT-04:00 America/Manaus AMT - Amazon Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Marigot",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Marigot",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Marigot AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Marigot AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Martinique",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Martinique",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Martinique AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Martinique AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Moncton",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Moncton",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Atlantic Standard Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Moncton",
    "shortName": "ADT",
    "longName": "Atlantic Daylight Time",
    "utcOffset": "(UTC-16:00) America/Moncton ADT - Atlantic Daylight Time ",
    "gmtOffset": "GMT-04:00 America/Moncton ADT - Atlantic Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Montserrat",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Montserrat",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Montserrat AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Montserrat AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Port_of_Spain",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Port_of_Spain",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Port_of_Spain AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Port_of_Spain AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Porto_Velho",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Amazon Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Porto_Velho",
    "shortName": "AMT",
    "longName": "Amazon Time",
    "utcOffset": "(UTC-16:00) America/Porto_Velho AMT - Amazon Time ",
    "gmtOffset": "GMT-04:00 America/Porto_Velho AMT - Amazon Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Puerto_Rico",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Puerto_Rico",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Puerto_Rico AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Puerto_Rico AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Santiago",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Chile Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Santiago",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Chile Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Santiago",
    "shortName": "CLST",
    "longName": "Chile Summer Time",
    "utcOffset": "(UTC-16:00) America/Santiago CLST - Chile Summer Time ",
    "gmtOffset": "GMT-04:00 America/Santiago CLST - Chile Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Santo_Domingo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Santo_Domingo",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Santo_Domingo AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Santo_Domingo AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/St_Barthelemy",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/St_Barthelemy",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/St_Barthelemy AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/St_Barthelemy AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/St_Kitts",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/St_Kitts",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/St_Kitts AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/St_Kitts AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/St_Lucia",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/St_Lucia",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/St_Lucia AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/St_Lucia AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/St_Thomas",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/St_Thomas",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/St_Thomas AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/St_Thomas AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/St_Vincent",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/St_Vincent",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/St_Vincent AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/St_Vincent AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Thule",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Thule",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Atlantic Standard Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "America/Thule",
    "shortName": "ADT",
    "longName": "Atlantic Daylight Time",
    "utcOffset": "(UTC-16:00) America/Thule ADT - Atlantic Daylight Time ",
    "gmtOffset": "GMT-04:00 America/Thule ADT - Atlantic Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Tortola",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Tortola",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Tortola AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Tortola AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Virgin",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -14400000
    },
    "id": "America/Virgin",
    "shortName": "AST",
    "longName": "Atlantic Standard Time",
    "utcOffset": "(UTC-16:00) America/Virgin AST - Atlantic Standard Time ",
    "gmtOffset": "GMT-04:00 America/Virgin AST - Atlantic Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Atlantic/Bermuda",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Atlantic Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Atlantic/Bermuda",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Atlantic Standard Time",
        "rawOffset": -14400000
      },
      "rawOffset": -14400000
    },
    "id": "Atlantic/Bermuda",
    "shortName": "ADT",
    "longName": "Atlantic Daylight Time",
    "utcOffset": "(UTC-16:00) Atlantic/Bermuda ADT - Atlantic Daylight Time ",
    "gmtOffset": "GMT-04:00 Atlantic/Bermuda ADT - Atlantic Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/St_Johns",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Newfoundland Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/St_Johns",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Newfoundland Standard Time",
        "rawOffset": -12600000
      },
      "rawOffset": -12600000
    },
    "id": "America/St_Johns",
    "shortName": "NDT",
    "longName": "Newfoundland Daylight Time",
    "utcOffset": "(UTC-15:30) America/St_Johns NDT - Newfoundland Daylight Time ",
    "gmtOffset": "GMT-03:30 America/St_Johns NDT - Newfoundland Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Araguaina",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Brasilia Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Araguaina",
    "shortName": "BRT",
    "longName": "Brasilia Time",
    "utcOffset": "(UTC-15:00) America/Araguaina BRT - Brasilia Time ",
    "gmtOffset": "GMT-03:00 America/Araguaina BRT - Brasilia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Buenos_Aires",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Buenos_Aires",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Buenos_Aires ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Buenos_Aires ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Catamarca",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Catamarca",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Catamarca ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Catamarca ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/ComodRivadavia",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/ComodRivadavia",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/ComodRivadavia ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/ComodRivadavia ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Cordoba",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Cordoba",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Cordoba ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Cordoba ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Jujuy",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Jujuy",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Jujuy ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Jujuy ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/La_Rioja",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/La_Rioja",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/La_Rioja ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/La_Rioja ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Mendoza",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Mendoza",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Mendoza ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Mendoza ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Rio_Gallegos",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Rio_Gallegos",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Rio_Gallegos ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Rio_Gallegos ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Salta",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Salta",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Salta ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Salta ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/San_Juan",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/San_Juan",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/San_Juan ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/San_Juan ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/San_Luis",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/San_Luis",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/San_Luis ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/San_Luis ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Tucuman",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Tucuman",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Tucuman ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Tucuman ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Argentina/Ushuaia",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Argentina/Ushuaia",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Argentina/Ushuaia ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Argentina/Ushuaia ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Bahia",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Brasilia Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Bahia",
    "shortName": "BRT",
    "longName": "Brasilia Time",
    "utcOffset": "(UTC-15:00) America/Bahia BRT - Brasilia Time ",
    "gmtOffset": "GMT-03:00 America/Bahia BRT - Brasilia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Belem",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Brasilia Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Belem",
    "shortName": "BRT",
    "longName": "Brasilia Time",
    "utcOffset": "(UTC-15:00) America/Belem BRT - Brasilia Time ",
    "gmtOffset": "GMT-03:00 America/Belem BRT - Brasilia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Buenos_Aires",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Buenos_Aires",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Buenos_Aires ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Buenos_Aires ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Catamarca",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Catamarca",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Catamarca ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Catamarca ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Cayenne",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "French Guiana Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Cayenne",
    "shortName": "GFT",
    "longName": "French Guiana Time",
    "utcOffset": "(UTC-15:00) America/Cayenne GFT - French Guiana Time ",
    "gmtOffset": "GMT-03:00 America/Cayenne GFT - French Guiana Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Cordoba",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Cordoba",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Cordoba ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Cordoba ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Fortaleza",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Brasilia Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Fortaleza",
    "shortName": "BRT",
    "longName": "Brasilia Time",
    "utcOffset": "(UTC-15:00) America/Fortaleza BRT - Brasilia Time ",
    "gmtOffset": "GMT-03:00 America/Fortaleza BRT - Brasilia Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Godthab",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Western Greenland Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Godthab",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Western Greenland Time",
        "rawOffset": -10800000
      },
      "rawOffset": -10800000
    },
    "id": "America/Godthab",
    "shortName": "WGST",
    "longName": "Western Greenland Summer Time",
    "utcOffset": "(UTC-15:00) America/Godthab WGST - Western Greenland Summer Time ",
    "gmtOffset": "GMT-03:00 America/Godthab WGST - Western Greenland Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Jujuy",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Jujuy",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Jujuy ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Jujuy ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Maceio",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Brasilia Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Maceio",
    "shortName": "BRT",
    "longName": "Brasilia Time",
    "utcOffset": "(UTC-15:00) America/Maceio BRT - Brasilia Time ",
    "gmtOffset": "GMT-03:00 America/Maceio BRT - Brasilia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Mendoza",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Mendoza",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Mendoza ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Mendoza ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Miquelon",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pierre & Miquelon Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Miquelon",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Pierre & Miquelon Standard Time",
        "rawOffset": -10800000
      },
      "rawOffset": -10800000
    },
    "id": "America/Miquelon",
    "shortName": "PMDT",
    "longName": "Pierre & Miquelon Daylight Time",
    "utcOffset": "(UTC-15:00) America/Miquelon PMDT - Pierre & Miquelon Daylight Time ",
    "gmtOffset": "GMT-03:00 America/Miquelon PMDT - Pierre & Miquelon Daylight Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Montevideo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Uruguay Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Montevideo",
    "shortName": "UYT",
    "longName": "Uruguay Time",
    "utcOffset": "(UTC-15:00) America/Montevideo UYT - Uruguay Time ",
    "gmtOffset": "GMT-03:00 America/Montevideo UYT - Uruguay Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Paramaribo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Suriname Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Paramaribo",
    "shortName": "SRT",
    "longName": "Suriname Time",
    "utcOffset": "(UTC-15:00) America/Paramaribo SRT - Suriname Time ",
    "gmtOffset": "GMT-03:00 America/Paramaribo SRT - Suriname Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Punta_Arenas",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "GMT-03:00",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Punta_Arenas",
    "shortName": "GMT-03:00",
    "longName": "GMT-03:00",
    "utcOffset": "(UTC-15:00) America/Punta_Arenas GMT-03:00 - GMT-03:00 ",
    "gmtOffset": "GMT-03:00 America/Punta_Arenas GMT-03:00 - GMT-03:00 "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Recife",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Brasilia Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Recife",
    "shortName": "BRT",
    "longName": "Brasilia Time",
    "utcOffset": "(UTC-15:00) America/Recife BRT - Brasilia Time ",
    "gmtOffset": "GMT-03:00 America/Recife BRT - Brasilia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Rosario",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Argentine Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Rosario",
    "shortName": "ART",
    "longName": "Argentine Time",
    "utcOffset": "(UTC-15:00) America/Rosario ART - Argentine Time ",
    "gmtOffset": "GMT-03:00 America/Rosario ART - Argentine Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Santarem",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Brasilia Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "America/Santarem",
    "shortName": "BRT",
    "longName": "Brasilia Time",
    "utcOffset": "(UTC-15:00) America/Santarem BRT - Brasilia Time ",
    "gmtOffset": "GMT-03:00 America/Santarem BRT - Brasilia Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Sao_Paulo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Brasilia Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Sao_Paulo",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Brasilia Time",
        "rawOffset": -10800000
      },
      "rawOffset": -10800000
    },
    "id": "America/Sao_Paulo",
    "shortName": "BRT",
    "longName": "Brasilia Time",
    "utcOffset": "(UTC-15:00) America/Sao_Paulo BRT - Brasilia Time ",
    "gmtOffset": "GMT-03:00 America/Sao_Paulo BRT - Brasilia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Atlantic/Stanley",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Falkland Is. Time",
      "lastRuleInstance": null,
      "rawOffset": -10800000
    },
    "id": "Atlantic/Stanley",
    "shortName": "FKT",
    "longName": "Falkland Is. Time",
    "utcOffset": "(UTC-15:00) Atlantic/Stanley FKT - Falkland Is. Time ",
    "gmtOffset": "GMT-03:00 Atlantic/Stanley FKT - Falkland Is. Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Noronha",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Fernando de Noronha Time",
      "lastRuleInstance": null,
      "rawOffset": -7200000
    },
    "id": "America/Noronha",
    "shortName": "FNT",
    "longName": "Fernando de Noronha Time",
    "utcOffset": "(UTC-14:00) America/Noronha FNT - Fernando de Noronha Time ",
    "gmtOffset": "GMT-02:00 America/Noronha FNT - Fernando de Noronha Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Atlantic/South_Georgia",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "South Georgia Standard Time",
      "lastRuleInstance": null,
      "rawOffset": -7200000
    },
    "id": "Atlantic/South_Georgia",
    "shortName": "GST",
    "longName": "South Georgia Standard Time",
    "utcOffset": "(UTC-14:00) Atlantic/South_Georgia GST - South Georgia Standard Time ",
    "gmtOffset": "GMT-02:00 Atlantic/South_Georgia GST - South Georgia Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "America/Scoresbysund",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern Greenland Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "America/Scoresbysund",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern Greenland Time",
        "rawOffset": -3600000
      },
      "rawOffset": -3600000
    },
    "id": "America/Scoresbysund",
    "shortName": "EGST",
    "longName": "Eastern Greenland Summer Time",
    "utcOffset": "(UTC-13:00) America/Scoresbysund EGST - Eastern Greenland Summer Time ",
    "gmtOffset": "GMT-01:00 America/Scoresbysund EGST - Eastern Greenland Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Atlantic/Azores",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Azores Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Atlantic/Azores",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Azores Time",
        "rawOffset": -3600000
      },
      "rawOffset": -3600000
    },
    "id": "Atlantic/Azores",
    "shortName": "AZOST",
    "longName": "Azores Summer Time",
    "utcOffset": "(UTC-13:00) Atlantic/Azores AZOST - Azores Summer Time ",
    "gmtOffset": "GMT-01:00 Atlantic/Azores AZOST - Azores Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Atlantic/Cape_Verde",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Cape Verde Time",
      "lastRuleInstance": null,
      "rawOffset": -3600000
    },
    "id": "Atlantic/Cape_Verde",
    "shortName": "CVT",
    "longName": "Cape Verde Time",
    "utcOffset": "(UTC-13:00) Atlantic/Cape_Verde CVT - Cape Verde Time ",
    "gmtOffset": "GMT-01:00 Atlantic/Cape_Verde CVT - Cape Verde Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "America/Danmarkshavn",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": null,
      "rawOffset": 0
    },
    "id": "America/Danmarkshavn",
    "shortName": "GMT",
    "longName": "Greenwich Mean Time",
    "utcOffset": "(UTC+12:00) America/Danmarkshavn GMT - Greenwich Mean Time ",
    "gmtOffset": "GMT+00:00 America/Danmarkshavn GMT - Greenwich Mean Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Atlantic/Canary",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Western European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Atlantic/Canary",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Western European Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Atlantic/Canary",
    "shortName": "WEST",
    "longName": "Western European Summer Time",
    "utcOffset": "(UTC+12:00) Atlantic/Canary WEST - Western European Summer Time ",
    "gmtOffset": "GMT+00:00 Atlantic/Canary WEST - Western European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Atlantic/Faeroe",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Western European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Atlantic/Faeroe",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Western European Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Atlantic/Faeroe",
    "shortName": "WEST",
    "longName": "Western European Summer Time",
    "utcOffset": "(UTC+12:00) Atlantic/Faeroe WEST - Western European Summer Time ",
    "gmtOffset": "GMT+00:00 Atlantic/Faeroe WEST - Western European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Atlantic/Faroe",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Western European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Atlantic/Faroe",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Western European Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Atlantic/Faroe",
    "shortName": "WEST",
    "longName": "Western European Summer Time",
    "utcOffset": "(UTC+12:00) Atlantic/Faroe WEST - Western European Summer Time ",
    "gmtOffset": "GMT+00:00 Atlantic/Faroe WEST - Western European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Atlantic/Madeira",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Western European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Atlantic/Madeira",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Western European Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Atlantic/Madeira",
    "shortName": "WEST",
    "longName": "Western European Summer Time",
    "utcOffset": "(UTC+12:00) Atlantic/Madeira WEST - Western European Summer Time ",
    "gmtOffset": "GMT+00:00 Atlantic/Madeira WEST - Western European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Atlantic/Reykjavik",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": null,
      "rawOffset": 0
    },
    "id": "Atlantic/Reykjavik",
    "shortName": "GMT",
    "longName": "Greenwich Mean Time",
    "utcOffset": "(UTC+12:00) Atlantic/Reykjavik GMT - Greenwich Mean Time ",
    "gmtOffset": "GMT+00:00 Atlantic/Reykjavik GMT - Greenwich Mean Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Atlantic/St_Helena",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": null,
      "rawOffset": 0
    },
    "id": "Atlantic/St_Helena",
    "shortName": "GMT",
    "longName": "Greenwich Mean Time",
    "utcOffset": "(UTC+12:00) Atlantic/St_Helena GMT - Greenwich Mean Time ",
    "gmtOffset": "GMT+00:00 Atlantic/St_Helena GMT - Greenwich Mean Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Belfast",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Belfast",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Greenwich Mean Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Europe/Belfast",
    "shortName": "BST",
    "longName": "British Summer Time",
    "utcOffset": "(UTC+12:00) Europe/Belfast BST - British Summer Time ",
    "gmtOffset": "GMT+00:00 Europe/Belfast BST - British Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Dublin",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Dublin",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Greenwich Mean Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Europe/Dublin",
    "shortName": "IST",
    "longName": "Irish Summer Time",
    "utcOffset": "(UTC+12:00) Europe/Dublin IST - Irish Summer Time ",
    "gmtOffset": "GMT+00:00 Europe/Dublin IST - Irish Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Guernsey",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Guernsey",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Greenwich Mean Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Europe/Guernsey",
    "shortName": "BST",
    "longName": "British Summer Time",
    "utcOffset": "(UTC+12:00) Europe/Guernsey BST - British Summer Time ",
    "gmtOffset": "GMT+00:00 Europe/Guernsey BST - British Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Isle_of_Man",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Isle_of_Man",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Greenwich Mean Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Europe/Isle_of_Man",
    "shortName": "BST",
    "longName": "British Summer Time",
    "utcOffset": "(UTC+12:00) Europe/Isle_of_Man BST - British Summer Time ",
    "gmtOffset": "GMT+00:00 Europe/Isle_of_Man BST - British Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Jersey",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Jersey",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Greenwich Mean Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Europe/Jersey",
    "shortName": "BST",
    "longName": "British Summer Time",
    "utcOffset": "(UTC+12:00) Europe/Jersey BST - British Summer Time ",
    "gmtOffset": "GMT+00:00 Europe/Jersey BST - British Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Lisbon",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Western European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Lisbon",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Western European Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Europe/Lisbon",
    "shortName": "WEST",
    "longName": "Western European Summer Time",
    "utcOffset": "(UTC+12:00) Europe/Lisbon WEST - Western European Summer Time ",
    "gmtOffset": "GMT+00:00 Europe/Lisbon WEST - Western European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/London",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Greenwich Mean Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/London",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Greenwich Mean Time",
        "rawOffset": 0
      },
      "rawOffset": 0
    },
    "id": "Europe/London",
    "shortName": "BST",
    "longName": "British Summer Time",
    "utcOffset": "(UTC+12:00) Europe/London BST - British Summer Time ",
    "gmtOffset": "GMT+00:00 Europe/London BST - British Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Atlantic/Jan_Mayen",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Atlantic/Jan_Mayen",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Atlantic/Jan_Mayen",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Atlantic/Jan_Mayen CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Atlantic/Jan_Mayen CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Amsterdam",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Amsterdam",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Amsterdam",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Amsterdam CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Amsterdam CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Andorra",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Andorra",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Andorra",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Andorra CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Andorra CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Belgrade",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Belgrade",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Belgrade",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Belgrade CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Belgrade CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Berlin",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Berlin",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Berlin",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Berlin CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Berlin CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Bratislava",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Bratislava",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Bratislava",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Bratislava CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Bratislava CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Brussels",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Brussels",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Brussels",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Brussels CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Brussels CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Budapest",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Budapest",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Budapest",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Budapest CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Budapest CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Busingen",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Busingen",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Busingen",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Busingen CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Busingen CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Copenhagen",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Copenhagen",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Copenhagen",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Copenhagen CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Copenhagen CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Gibraltar",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Gibraltar",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Gibraltar",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Gibraltar CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Gibraltar CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Ljubljana",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Ljubljana",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Ljubljana",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Ljubljana CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Ljubljana CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Luxembourg",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Luxembourg",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Luxembourg",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Luxembourg CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Luxembourg CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Madrid",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Madrid",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Madrid",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Madrid CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Madrid CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Malta",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Malta",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Malta",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Malta CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Malta CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Monaco",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Monaco",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Monaco",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Monaco CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Monaco CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Oslo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Oslo",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Oslo",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Oslo CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Oslo CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Paris",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Paris",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Paris",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Paris CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Paris CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Podgorica",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Podgorica",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Podgorica",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Podgorica CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Podgorica CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Prague",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Prague",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Prague",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Prague CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Prague CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Rome",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Rome",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Rome",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Rome CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Rome CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/San_Marino",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/San_Marino",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/San_Marino",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/San_Marino CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/San_Marino CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Sarajevo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Sarajevo",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Sarajevo",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Sarajevo CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Sarajevo CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Skopje",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Skopje",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Skopje",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Skopje CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Skopje CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Stockholm",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Stockholm",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Stockholm",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Stockholm CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Stockholm CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Tirane",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Tirane",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Tirane",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Tirane CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Tirane CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Vaduz",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Vaduz",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Vaduz",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Vaduz CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Vaduz CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Vatican",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Vatican",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Vatican",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Vatican CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Vatican CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Vienna",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Vienna",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Vienna",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Vienna CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Vienna CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Warsaw",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Warsaw",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Warsaw",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Warsaw CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Warsaw CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Zagreb",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Zagreb",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Zagreb",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Zagreb CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Zagreb CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Zurich",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Central European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Zurich",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Central European Time",
        "rawOffset": 3600000
      },
      "rawOffset": 3600000
    },
    "id": "Europe/Zurich",
    "shortName": "CEST",
    "longName": "Central European Summer Time",
    "utcOffset": "(UTC+13:00) Europe/Zurich CEST - Central European Summer Time ",
    "gmtOffset": "GMT+01:00 Europe/Zurich CEST - Central European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Athens",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Athens",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Athens",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Athens EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Athens EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Bucharest",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Bucharest",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Bucharest",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Bucharest EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Bucharest EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Chisinau",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Chisinau",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Chisinau",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Chisinau EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Chisinau EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Helsinki",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Helsinki",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Helsinki",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Helsinki EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Helsinki EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Kaliningrad",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": null,
      "rawOffset": 7200000
    },
    "id": "Europe/Kaliningrad",
    "shortName": "EET",
    "longName": "Eastern European Time",
    "utcOffset": "(UTC+14:00) Europe/Kaliningrad EET - Eastern European Time ",
    "gmtOffset": "GMT+02:00 Europe/Kaliningrad EET - Eastern European Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Kiev",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Kiev",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Kiev",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Kiev EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Kiev EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Mariehamn",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Mariehamn",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Mariehamn",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Mariehamn EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Mariehamn EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Nicosia",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Nicosia",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Nicosia",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Nicosia EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Nicosia EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Riga",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Riga",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Riga",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Riga EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Riga EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Sofia",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Sofia",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Sofia",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Sofia EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Sofia EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Tallinn",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Tallinn",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Tallinn",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Tallinn EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Tallinn EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Tiraspol",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Tiraspol",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Tiraspol",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Tiraspol EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Tiraspol EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Uzhgorod",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Uzhgorod",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Uzhgorod",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Uzhgorod EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Uzhgorod EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Vilnius",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Vilnius",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Vilnius",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Vilnius EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Vilnius EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Europe/Zaporozhye",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Europe/Zaporozhye",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Eastern European Time",
        "rawOffset": 7200000
      },
      "rawOffset": 7200000
    },
    "id": "Europe/Zaporozhye",
    "shortName": "EEST",
    "longName": "Eastern European Summer Time",
    "utcOffset": "(UTC+14:00) Europe/Zaporozhye EEST - Eastern European Summer Time ",
    "gmtOffset": "GMT+02:00 Europe/Zaporozhye EEST - Eastern European Summer Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Istanbul",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Eastern European Time",
      "lastRuleInstance": null,
      "rawOffset": 10800000
    },
    "id": "Europe/Istanbul",
    "shortName": "EET",
    "longName": "Eastern European Time",
    "utcOffset": "(UTC+15:00) Europe/Istanbul EET - Eastern European Time ",
    "gmtOffset": "GMT+03:00 Europe/Istanbul EET - Eastern European Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Kirov",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "GMT+03:00",
      "lastRuleInstance": null,
      "rawOffset": 10800000
    },
    "id": "Europe/Kirov",
    "shortName": "GMT+03:00",
    "longName": "GMT+03:00",
    "utcOffset": "(UTC+15:00) Europe/Kirov GMT+03:00 - GMT+03:00 ",
    "gmtOffset": "GMT+03:00 Europe/Kirov GMT+03:00 - GMT+03:00 "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Minsk",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Moscow Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 10800000
    },
    "id": "Europe/Minsk",
    "shortName": "MSK",
    "longName": "Moscow Standard Time",
    "utcOffset": "(UTC+15:00) Europe/Minsk MSK - Moscow Standard Time ",
    "gmtOffset": "GMT+03:00 Europe/Minsk MSK - Moscow Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Moscow",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Moscow Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 10800000
    },
    "id": "Europe/Moscow",
    "shortName": "MSK",
    "longName": "Moscow Standard Time",
    "utcOffset": "(UTC+15:00) Europe/Moscow MSK - Moscow Standard Time ",
    "gmtOffset": "GMT+03:00 Europe/Moscow MSK - Moscow Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Simferopol",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Moscow Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 10800000
    },
    "id": "Europe/Simferopol",
    "shortName": "MSK",
    "longName": "Moscow Standard Time",
    "utcOffset": "(UTC+15:00) Europe/Simferopol MSK - Moscow Standard Time ",
    "gmtOffset": "GMT+03:00 Europe/Simferopol MSK - Moscow Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Volgograd",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Moscow Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 10800000
    },
    "id": "Europe/Volgograd",
    "shortName": "MSK",
    "longName": "Moscow Standard Time",
    "utcOffset": "(UTC+15:00) Europe/Volgograd MSK - Moscow Standard Time ",
    "gmtOffset": "GMT+03:00 Europe/Volgograd MSK - Moscow Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Astrakhan",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "GMT+04:00",
      "lastRuleInstance": null,
      "rawOffset": 14400000
    },
    "id": "Europe/Astrakhan",
    "shortName": "GMT+04:00",
    "longName": "GMT+04:00",
    "utcOffset": "(UTC+16:00) Europe/Astrakhan GMT+04:00 - GMT+04:00 ",
    "gmtOffset": "GMT+04:00 Europe/Astrakhan GMT+04:00 - GMT+04:00 "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Samara",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Samara Time",
      "lastRuleInstance": null,
      "rawOffset": 14400000
    },
    "id": "Europe/Samara",
    "shortName": "SAMT",
    "longName": "Samara Time",
    "utcOffset": "(UTC+16:00) Europe/Samara SAMT - Samara Time ",
    "gmtOffset": "GMT+04:00 Europe/Samara SAMT - Samara Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Saratov",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "GMT+04:00",
      "lastRuleInstance": null,
      "rawOffset": 14400000
    },
    "id": "Europe/Saratov",
    "shortName": "GMT+04:00",
    "longName": "GMT+04:00",
    "utcOffset": "(UTC+16:00) Europe/Saratov GMT+04:00 - GMT+04:00 ",
    "gmtOffset": "GMT+04:00 Europe/Saratov GMT+04:00 - GMT+04:00 "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Europe/Ulyanovsk",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "GMT+04:00",
      "lastRuleInstance": null,
      "rawOffset": 14400000
    },
    "id": "Europe/Ulyanovsk",
    "shortName": "GMT+04:00",
    "longName": "GMT+04:00",
    "utcOffset": "(UTC+16:00) Europe/Ulyanovsk GMT+04:00 - GMT+04:00 ",
    "gmtOffset": "GMT+04:00 Europe/Ulyanovsk GMT+04:00 - GMT+04:00 "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Australia/Perth",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Western Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 28800000
    },
    "id": "Australia/Perth",
    "shortName": "AWST",
    "longName": "Australian Western Standard Time",
    "utcOffset": "(UTC+20:00) Australia/Perth AWST - Australian Western Standard Time ",
    "gmtOffset": "GMT+08:00 Australia/Perth AWST - Australian Western Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Australia/West",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Western Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 28800000
    },
    "id": "Australia/West",
    "shortName": "AWST",
    "longName": "Australian Western Standard Time",
    "utcOffset": "(UTC+20:00) Australia/West AWST - Australian Western Standard Time ",
    "gmtOffset": "GMT+08:00 Australia/West AWST - Australian Western Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Australia/Eucla",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Central Western Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 31500000
    },
    "id": "Australia/Eucla",
    "shortName": "ACWST",
    "longName": "Australian Central Western Standard Time",
    "utcOffset": "(UTC+20:45) Australia/Eucla ACWST - Australian Central Western Standard Time ",
    "gmtOffset": "GMT+08:45 Australia/Eucla ACWST - Australian Central Western Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Palau",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Palau Time",
      "lastRuleInstance": null,
      "rawOffset": 32400000
    },
    "id": "Pacific/Palau",
    "shortName": "PWT",
    "longName": "Palau Time",
    "utcOffset": "(UTC+21:00) Pacific/Palau PWT - Palau Time ",
    "gmtOffset": "GMT+09:00 Pacific/Palau PWT - Palau Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Adelaide",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Central Standard Time (South Australia)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Adelaide",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Central Standard Time (South Australia)",
        "rawOffset": 34200000
      },
      "rawOffset": 34200000
    },
    "id": "Australia/Adelaide",
    "shortName": "ACST",
    "longName": "Australian Central Standard Time (South Australia)",
    "utcOffset": "(UTC+21:30) Australia/Adelaide ACST - Australian Central Standard Time (South Australia) ",
    "gmtOffset": "GMT+09:30 Australia/Adelaide ACST - Australian Central Standard Time (South Australia) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Broken_Hill",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Central Standard Time (South Australia/New South Wales)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Broken_Hill",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Central Standard Time (South Australia/New South Wales)",
        "rawOffset": 34200000
      },
      "rawOffset": 34200000
    },
    "id": "Australia/Broken_Hill",
    "shortName": "ACST",
    "longName": "Australian Central Standard Time (South Australia/New South Wales)",
    "utcOffset": "(UTC+21:30) Australia/Broken_Hill ACST - Australian Central Standard Time (South Australia/New South Wales) ",
    "gmtOffset": "GMT+09:30 Australia/Broken_Hill ACST - Australian Central Standard Time (South Australia/New South Wales) "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Australia/Darwin",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Central Standard Time (Northern Territory)",
      "lastRuleInstance": null,
      "rawOffset": 34200000
    },
    "id": "Australia/Darwin",
    "shortName": "ACST",
    "longName": "Australian Central Standard Time (Northern Territory)",
    "utcOffset": "(UTC+21:30) Australia/Darwin ACST - Australian Central Standard Time (Northern Territory) ",
    "gmtOffset": "GMT+09:30 Australia/Darwin ACST - Australian Central Standard Time (Northern Territory) "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Australia/North",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Central Standard Time (Northern Territory)",
      "lastRuleInstance": null,
      "rawOffset": 34200000
    },
    "id": "Australia/North",
    "shortName": "ACST",
    "longName": "Australian Central Standard Time (Northern Territory)",
    "utcOffset": "(UTC+21:30) Australia/North ACST - Australian Central Standard Time (Northern Territory) ",
    "gmtOffset": "GMT+09:30 Australia/North ACST - Australian Central Standard Time (Northern Territory) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/South",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Central Standard Time (South Australia)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/South",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Central Standard Time (South Australia)",
        "rawOffset": 34200000
      },
      "rawOffset": 34200000
    },
    "id": "Australia/South",
    "shortName": "ACST",
    "longName": "Australian Central Standard Time (South Australia)",
    "utcOffset": "(UTC+21:30) Australia/South ACST - Australian Central Standard Time (South Australia) ",
    "gmtOffset": "GMT+09:30 Australia/South ACST - Australian Central Standard Time (South Australia) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Yancowinna",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Central Standard Time (South Australia/New South Wales)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Yancowinna",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Central Standard Time (South Australia/New South Wales)",
        "rawOffset": 34200000
      },
      "rawOffset": 34200000
    },
    "id": "Australia/Yancowinna",
    "shortName": "ACST",
    "longName": "Australian Central Standard Time (South Australia/New South Wales)",
    "utcOffset": "(UTC+21:30) Australia/Yancowinna ACST - Australian Central Standard Time (South Australia/New South Wales) ",
    "gmtOffset": "GMT+09:30 Australia/Yancowinna ACST - Australian Central Standard Time (South Australia/New South Wales) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/ACT",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (New South Wales)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/ACT",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (New South Wales)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/ACT",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (New South Wales)",
    "utcOffset": "(UTC+22:00) Australia/ACT AEST - Australian Eastern Standard Time (New South Wales) ",
    "gmtOffset": "GMT+10:00 Australia/ACT AEST - Australian Eastern Standard Time (New South Wales) "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Australia/Brisbane",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (Queensland)",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Australia/Brisbane",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (Queensland)",
    "utcOffset": "(UTC+22:00) Australia/Brisbane AEST - Australian Eastern Standard Time (Queensland) ",
    "gmtOffset": "GMT+10:00 Australia/Brisbane AEST - Australian Eastern Standard Time (Queensland) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Canberra",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (New South Wales)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Canberra",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (New South Wales)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/Canberra",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (New South Wales)",
    "utcOffset": "(UTC+22:00) Australia/Canberra AEST - Australian Eastern Standard Time (New South Wales) ",
    "gmtOffset": "GMT+10:00 Australia/Canberra AEST - Australian Eastern Standard Time (New South Wales) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Currie",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (New South Wales)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Currie",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (New South Wales)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/Currie",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (New South Wales)",
    "utcOffset": "(UTC+22:00) Australia/Currie AEST - Australian Eastern Standard Time (New South Wales) ",
    "gmtOffset": "GMT+10:00 Australia/Currie AEST - Australian Eastern Standard Time (New South Wales) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Hobart",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (Tasmania)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Hobart",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (Tasmania)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/Hobart",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (Tasmania)",
    "utcOffset": "(UTC+22:00) Australia/Hobart AEST - Australian Eastern Standard Time (Tasmania) ",
    "gmtOffset": "GMT+10:00 Australia/Hobart AEST - Australian Eastern Standard Time (Tasmania) "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Australia/Lindeman",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (Queensland)",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Australia/Lindeman",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (Queensland)",
    "utcOffset": "(UTC+22:00) Australia/Lindeman AEST - Australian Eastern Standard Time (Queensland) ",
    "gmtOffset": "GMT+10:00 Australia/Lindeman AEST - Australian Eastern Standard Time (Queensland) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Melbourne",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (Victoria)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Melbourne",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (Victoria)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/Melbourne",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (Victoria)",
    "utcOffset": "(UTC+22:00) Australia/Melbourne AEST - Australian Eastern Standard Time (Victoria) ",
    "gmtOffset": "GMT+10:00 Australia/Melbourne AEST - Australian Eastern Standard Time (Victoria) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/NSW",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (New South Wales)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/NSW",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (New South Wales)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/NSW",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (New South Wales)",
    "utcOffset": "(UTC+22:00) Australia/NSW AEST - Australian Eastern Standard Time (New South Wales) ",
    "gmtOffset": "GMT+10:00 Australia/NSW AEST - Australian Eastern Standard Time (New South Wales) "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Australia/Queensland",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (Queensland)",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Australia/Queensland",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (Queensland)",
    "utcOffset": "(UTC+22:00) Australia/Queensland AEST - Australian Eastern Standard Time (Queensland) ",
    "gmtOffset": "GMT+10:00 Australia/Queensland AEST - Australian Eastern Standard Time (Queensland) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Sydney",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (New South Wales)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Sydney",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (New South Wales)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/Sydney",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (New South Wales)",
    "utcOffset": "(UTC+22:00) Australia/Sydney AEST - Australian Eastern Standard Time (New South Wales) ",
    "gmtOffset": "GMT+10:00 Australia/Sydney AEST - Australian Eastern Standard Time (New South Wales) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Tasmania",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (Tasmania)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Tasmania",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (Tasmania)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/Tasmania",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (Tasmania)",
    "utcOffset": "(UTC+22:00) Australia/Tasmania AEST - Australian Eastern Standard Time (Tasmania) ",
    "gmtOffset": "GMT+10:00 Australia/Tasmania AEST - Australian Eastern Standard Time (Tasmania) "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Australia/Victoria",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Australian Eastern Standard Time (Victoria)",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Australia/Victoria",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Australian Eastern Standard Time (Victoria)",
        "rawOffset": 36000000
      },
      "rawOffset": 36000000
    },
    "id": "Australia/Victoria",
    "shortName": "AEST",
    "longName": "Australian Eastern Standard Time (Victoria)",
    "utcOffset": "(UTC+22:00) Australia/Victoria AEST - Australian Eastern Standard Time (Victoria) ",
    "gmtOffset": "GMT+10:00 Australia/Victoria AEST - Australian Eastern Standard Time (Victoria) "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Chuuk",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Chuuk Time",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Pacific/Chuuk",
    "shortName": "CHUT",
    "longName": "Chuuk Time",
    "utcOffset": "(UTC+22:00) Pacific/Chuuk CHUT - Chuuk Time ",
    "gmtOffset": "GMT+10:00 Pacific/Chuuk CHUT - Chuuk Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Guam",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Chamorro Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Pacific/Guam",
    "shortName": "ChST",
    "longName": "Chamorro Standard Time",
    "utcOffset": "(UTC+22:00) Pacific/Guam ChST - Chamorro Standard Time ",
    "gmtOffset": "GMT+10:00 Pacific/Guam ChST - Chamorro Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Port_Moresby",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Papua New Guinea Time",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Pacific/Port_Moresby",
    "shortName": "PGT",
    "longName": "Papua New Guinea Time",
    "utcOffset": "(UTC+22:00) Pacific/Port_Moresby PGT - Papua New Guinea Time ",
    "gmtOffset": "GMT+10:00 Pacific/Port_Moresby PGT - Papua New Guinea Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Saipan",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Chamorro Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Pacific/Saipan",
    "shortName": "ChST",
    "longName": "Chamorro Standard Time",
    "utcOffset": "(UTC+22:00) Pacific/Saipan ChST - Chamorro Standard Time ",
    "gmtOffset": "GMT+10:00 Pacific/Saipan ChST - Chamorro Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Truk",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Chuuk Time",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Pacific/Truk",
    "shortName": "CHUT",
    "longName": "Chuuk Time",
    "utcOffset": "(UTC+22:00) Pacific/Truk CHUT - Chuuk Time ",
    "gmtOffset": "GMT+10:00 Pacific/Truk CHUT - Chuuk Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Yap",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Chuuk Time",
      "lastRuleInstance": null,
      "rawOffset": 36000000
    },
    "id": "Pacific/Yap",
    "shortName": "CHUT",
    "longName": "Chuuk Time",
    "utcOffset": "(UTC+22:00) Pacific/Yap CHUT - Chuuk Time ",
    "gmtOffset": "GMT+10:00 Pacific/Yap CHUT - Chuuk Time "
  },
  {
    "tz": {
      "DSTSavings": 1800000,
      "ID": "Australia/LHI",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Lord Howe Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 1800000,
        "ID": "Australia/LHI",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Lord Howe Standard Time",
        "rawOffset": 37800000
      },
      "rawOffset": 37800000
    },
    "id": "Australia/LHI",
    "shortName": "LHST",
    "longName": "Lord Howe Standard Time",
    "utcOffset": "(UTC+22:30) Australia/LHI LHST - Lord Howe Standard Time ",
    "gmtOffset": "GMT+10:30 Australia/LHI LHST - Lord Howe Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 1800000,
      "ID": "Australia/Lord_Howe",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Lord Howe Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 1800000,
        "ID": "Australia/Lord_Howe",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Lord Howe Standard Time",
        "rawOffset": 37800000
      },
      "rawOffset": 37800000
    },
    "id": "Australia/Lord_Howe",
    "shortName": "LHST",
    "longName": "Lord Howe Standard Time",
    "utcOffset": "(UTC+22:30) Australia/Lord_Howe LHST - Lord Howe Standard Time ",
    "gmtOffset": "GMT+10:30 Australia/Lord_Howe LHST - Lord Howe Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Bougainville",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Bougainville Standard Time",
      "lastRuleInstance": null,
      "rawOffset": 39600000
    },
    "id": "Pacific/Bougainville",
    "shortName": "BST",
    "longName": "Bougainville Standard Time",
    "utcOffset": "(UTC+23:00) Pacific/Bougainville BST - Bougainville Standard Time ",
    "gmtOffset": "GMT+11:00 Pacific/Bougainville BST - Bougainville Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Efate",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Vanuatu Time",
      "lastRuleInstance": null,
      "rawOffset": 39600000
    },
    "id": "Pacific/Efate",
    "shortName": "VUT",
    "longName": "Vanuatu Time",
    "utcOffset": "(UTC+23:00) Pacific/Efate VUT - Vanuatu Time ",
    "gmtOffset": "GMT+11:00 Pacific/Efate VUT - Vanuatu Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Guadalcanal",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Solomon Is. Time",
      "lastRuleInstance": null,
      "rawOffset": 39600000
    },
    "id": "Pacific/Guadalcanal",
    "shortName": "SBT",
    "longName": "Solomon Is. Time",
    "utcOffset": "(UTC+23:00) Pacific/Guadalcanal SBT - Solomon Is. Time ",
    "gmtOffset": "GMT+11:00 Pacific/Guadalcanal SBT - Solomon Is. Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Kosrae",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Kosrae Time",
      "lastRuleInstance": null,
      "rawOffset": 39600000
    },
    "id": "Pacific/Kosrae",
    "shortName": "KOST",
    "longName": "Kosrae Time",
    "utcOffset": "(UTC+23:00) Pacific/Kosrae KOST - Kosrae Time ",
    "gmtOffset": "GMT+11:00 Pacific/Kosrae KOST - Kosrae Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Norfolk",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Norfolk Time",
      "lastRuleInstance": null,
      "rawOffset": 39600000
    },
    "id": "Pacific/Norfolk",
    "shortName": "NFT",
    "longName": "Norfolk Time",
    "utcOffset": "(UTC+23:00) Pacific/Norfolk NFT - Norfolk Time ",
    "gmtOffset": "GMT+11:00 Pacific/Norfolk NFT - Norfolk Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Noumea",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "New Caledonia Time",
      "lastRuleInstance": null,
      "rawOffset": 39600000
    },
    "id": "Pacific/Noumea",
    "shortName": "NCT",
    "longName": "New Caledonia Time",
    "utcOffset": "(UTC+23:00) Pacific/Noumea NCT - New Caledonia Time ",
    "gmtOffset": "GMT+11:00 Pacific/Noumea NCT - New Caledonia Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Pohnpei",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pohnpei Time",
      "lastRuleInstance": null,
      "rawOffset": 39600000
    },
    "id": "Pacific/Pohnpei",
    "shortName": "PONT",
    "longName": "Pohnpei Time",
    "utcOffset": "(UTC+23:00) Pacific/Pohnpei PONT - Pohnpei Time ",
    "gmtOffset": "GMT+11:00 Pacific/Pohnpei PONT - Pohnpei Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Ponape",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Pohnpei Time",
      "lastRuleInstance": null,
      "rawOffset": 39600000
    },
    "id": "Pacific/Ponape",
    "shortName": "PONT",
    "longName": "Pohnpei Time",
    "utcOffset": "(UTC+23:00) Pacific/Ponape PONT - Pohnpei Time ",
    "gmtOffset": "GMT+11:00 Pacific/Ponape PONT - Pohnpei Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Pacific/Auckland",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "New Zealand Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Pacific/Auckland",
        "class": "java.util.SimpleTimeZone",
        "displayName": "New Zealand Standard Time",
        "rawOffset": 43200000
      },
      "rawOffset": 43200000
    },
    "id": "Pacific/Auckland",
    "shortName": "NZST",
    "longName": "New Zealand Standard Time",
    "utcOffset": "(UTC+00:00) Pacific/Auckland NZST - New Zealand Standard Time ",
    "gmtOffset": "GMT+12:00 Pacific/Auckland NZST - New Zealand Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Pacific/Fiji",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Fiji Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Pacific/Fiji",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Fiji Time",
        "rawOffset": 43200000
      },
      "rawOffset": 43200000
    },
    "id": "Pacific/Fiji",
    "shortName": "FJT",
    "longName": "Fiji Time",
    "utcOffset": "(UTC+00:00) Pacific/Fiji FJT - Fiji Time ",
    "gmtOffset": "GMT+12:00 Pacific/Fiji FJT - Fiji Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Funafuti",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Tuvalu Time",
      "lastRuleInstance": null,
      "rawOffset": 43200000
    },
    "id": "Pacific/Funafuti",
    "shortName": "TVT",
    "longName": "Tuvalu Time",
    "utcOffset": "(UTC+00:00) Pacific/Funafuti TVT - Tuvalu Time ",
    "gmtOffset": "GMT+12:00 Pacific/Funafuti TVT - Tuvalu Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Kwajalein",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Marshall Islands Time",
      "lastRuleInstance": null,
      "rawOffset": 43200000
    },
    "id": "Pacific/Kwajalein",
    "shortName": "MHT",
    "longName": "Marshall Islands Time",
    "utcOffset": "(UTC+00:00) Pacific/Kwajalein MHT - Marshall Islands Time ",
    "gmtOffset": "GMT+12:00 Pacific/Kwajalein MHT - Marshall Islands Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Majuro",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Marshall Islands Time",
      "lastRuleInstance": null,
      "rawOffset": 43200000
    },
    "id": "Pacific/Majuro",
    "shortName": "MHT",
    "longName": "Marshall Islands Time",
    "utcOffset": "(UTC+00:00) Pacific/Majuro MHT - Marshall Islands Time ",
    "gmtOffset": "GMT+12:00 Pacific/Majuro MHT - Marshall Islands Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Nauru",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Nauru Time",
      "lastRuleInstance": null,
      "rawOffset": 43200000
    },
    "id": "Pacific/Nauru",
    "shortName": "NRT",
    "longName": "Nauru Time",
    "utcOffset": "(UTC+00:00) Pacific/Nauru NRT - Nauru Time ",
    "gmtOffset": "GMT+12:00 Pacific/Nauru NRT - Nauru Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Tarawa",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Gilbert Is. Time",
      "lastRuleInstance": null,
      "rawOffset": 43200000
    },
    "id": "Pacific/Tarawa",
    "shortName": "GILT",
    "longName": "Gilbert Is. Time",
    "utcOffset": "(UTC+00:00) Pacific/Tarawa GILT - Gilbert Is. Time ",
    "gmtOffset": "GMT+12:00 Pacific/Tarawa GILT - Gilbert Is. Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Wake",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Wake Time",
      "lastRuleInstance": null,
      "rawOffset": 43200000
    },
    "id": "Pacific/Wake",
    "shortName": "WAKT",
    "longName": "Wake Time",
    "utcOffset": "(UTC+00:00) Pacific/Wake WAKT - Wake Time ",
    "gmtOffset": "GMT+12:00 Pacific/Wake WAKT - Wake Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Wallis",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Wallis & Futuna Time",
      "lastRuleInstance": null,
      "rawOffset": 43200000
    },
    "id": "Pacific/Wallis",
    "shortName": "WFT",
    "longName": "Wallis & Futuna Time",
    "utcOffset": "(UTC+00:00) Pacific/Wallis WFT - Wallis & Futuna Time ",
    "gmtOffset": "GMT+12:00 Pacific/Wallis WFT - Wallis & Futuna Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Pacific/Chatham",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Chatham Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Pacific/Chatham",
        "class": "java.util.SimpleTimeZone",
        "displayName": "Chatham Standard Time",
        "rawOffset": 45900000
      },
      "rawOffset": 45900000
    },
    "id": "Pacific/Chatham",
    "shortName": "CHAST",
    "longName": "Chatham Standard Time",
    "utcOffset": "(UTC+00:45) Pacific/Chatham CHAST - Chatham Standard Time ",
    "gmtOffset": "GMT+12:45 Pacific/Chatham CHAST - Chatham Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 3600000,
      "ID": "Pacific/Apia",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "West Samoa Standard Time",
      "lastRuleInstance": {
        "DSTSavings": 3600000,
        "ID": "Pacific/Apia",
        "class": "java.util.SimpleTimeZone",
        "displayName": "West Samoa Standard Time",
        "rawOffset": 46800000
      },
      "rawOffset": 46800000
    },
    "id": "Pacific/Apia",
    "shortName": "WSST",
    "longName": "West Samoa Standard Time",
    "utcOffset": "(UTC+01:00) Pacific/Apia WSST - West Samoa Standard Time ",
    "gmtOffset": "GMT+13:00 Pacific/Apia WSST - West Samoa Standard Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Enderbury",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Phoenix Is. Time",
      "lastRuleInstance": null,
      "rawOffset": 46800000
    },
    "id": "Pacific/Enderbury",
    "shortName": "PHOT",
    "longName": "Phoenix Is. Time",
    "utcOffset": "(UTC+01:00) Pacific/Enderbury PHOT - Phoenix Is. Time ",
    "gmtOffset": "GMT+13:00 Pacific/Enderbury PHOT - Phoenix Is. Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Fakaofo",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Tokelau Time",
      "lastRuleInstance": null,
      "rawOffset": 46800000
    },
    "id": "Pacific/Fakaofo",
    "shortName": "TKT",
    "longName": "Tokelau Time",
    "utcOffset": "(UTC+01:00) Pacific/Fakaofo TKT - Tokelau Time ",
    "gmtOffset": "GMT+13:00 Pacific/Fakaofo TKT - Tokelau Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Tongatapu",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Tonga Time",
      "lastRuleInstance": null,
      "rawOffset": 46800000
    },
    "id": "Pacific/Tongatapu",
    "shortName": "TOT",
    "longName": "Tonga Time",
    "utcOffset": "(UTC+01:00) Pacific/Tongatapu TOT - Tonga Time ",
    "gmtOffset": "GMT+13:00 Pacific/Tongatapu TOT - Tonga Time "
  },
  {
    "tz": {
      "DSTSavings": 0,
      "ID": "Pacific/Kiritimati",
      "class": "sun.util.calendar.ZoneInfo",
      "dirty": false,
      "displayName": "Line Is. Time",
      "lastRuleInstance": null,
      "rawOffset": 50400000
    },
    "id": "Pacific/Kiritimati",
    "shortName": "LINT",
    "longName": "Line Is. Time",
    "utcOffset": "(UTC+02:00) Pacific/Kiritimati LINT - Line Is. Time ",
    "gmtOffset": "GMT+14:00 Pacific/Kiritimati LINT - Line Is. Time "
  }
];

App.dict.countries = {};

    App.dict.countries['afg'] = { name: 'Afghanistan', id: 'afg' };

    App.dict.countries['alb'] = { name: 'Albania', id: 'alb' };

    App.dict.countries['dza'] = { name: 'Algeria', id: 'dza' };

    App.dict.countries['asm'] = { name: 'American Samoa', id: 'asm' };

    App.dict.countries['and'] = { name: 'Andorra', id: 'and' };

    App.dict.countries['ago'] = { name: 'Angola', id: 'ago' };

    App.dict.countries['aia'] = { name: 'Anguilla', id: 'aia' };

    App.dict.countries['ata'] = { name: 'Antarctica', id: 'ata' };

    App.dict.countries['atg'] = { name: 'Antigua and Barbuda', id: 'atg' };

    App.dict.countries['arg'] = { name: 'Argentina', id: 'arg' };

    App.dict.countries['arm'] = { name: 'Armenia', id: 'arm' };

    App.dict.countries['abw'] = { name: 'Aruba', id: 'abw' };

    App.dict.countries['aus'] = { name: 'Australia', id: 'aus' };

    App.dict.countries['aut'] = { name: 'Austria', id: 'aut' };

    App.dict.countries['aze'] = { name: 'Azerbaijan', id: 'aze' };

    App.dict.countries['bhs'] = { name: 'Bahamas', id: 'bhs' };

    App.dict.countries['bhr'] = { name: 'Bahrain', id: 'bhr' };

    App.dict.countries['bgd'] = { name: 'Bangladesh', id: 'bgd' };

    App.dict.countries['brb'] = { name: 'Barbados', id: 'brb' };

    App.dict.countries['blr'] = { name: 'Belarus', id: 'blr' };

    App.dict.countries['bel'] = { name: 'Belgium', id: 'bel' };

    App.dict.countries['blz'] = { name: 'Belize', id: 'blz' };

    App.dict.countries['ben'] = { name: 'Benin', id: 'ben' };

    App.dict.countries['bmu'] = { name: 'Bermuda', id: 'bmu' };

    App.dict.countries['btn'] = { name: 'Bhutan', id: 'btn' };

    App.dict.countries['bol'] = { name: 'Bolivia', id: 'bol' };

    App.dict.countries['bes'] = { name: 'Bonaire, Sint Eustatius and Saba', id: 'bes' };

    App.dict.countries['bih'] = { name: 'Bosnia and Herzegovina', id: 'bih' };

    App.dict.countries['bwa'] = { name: 'Botswana', id: 'bwa' };

    App.dict.countries['bvt'] = { name: 'Bouvet Island', id: 'bvt' };

    App.dict.countries['bra'] = { name: 'Brazil', id: 'bra' };

    App.dict.countries['iot'] = { name: 'British Indian Ocean Territory', id: 'iot' };

    App.dict.countries['vgb'] = { name: 'British Virgin Islands', id: 'vgb' };

    App.dict.countries['brn'] = { name: 'Brunei Darussalam', id: 'brn' };

    App.dict.countries['bgr'] = { name: 'Bulgaria', id: 'bgr' };

    App.dict.countries['bfa'] = { name: 'Burkina Faso', id: 'bfa' };

    App.dict.countries['bdi'] = { name: 'Burundi', id: 'bdi' };

    App.dict.countries['khm'] = { name: 'Cambodia', id: 'khm' };

    App.dict.countries['cmr'] = { name: 'Cameroon', id: 'cmr' };

    App.dict.countries['can'] = { name: 'Canada', id: 'can' };

    App.dict.countries['cpv'] = { name: 'Cape Verde', id: 'cpv' };

    App.dict.countries['cym'] = { name: 'Cayman Islands', id: 'cym' };

    App.dict.countries['caf'] = { name: 'Central African', id: 'caf' };

    App.dict.countries['tcd'] = { name: 'Chad', id: 'tcd' };

    App.dict.countries['chl'] = { name: 'Chile', id: 'chl' };

    App.dict.countries['chn'] = { name: 'China', id: 'chn' };

    App.dict.countries['cxr'] = { name: 'Christmas Island', id: 'cxr' };

    App.dict.countries['cck'] = { name: 'Cocos (Keeling) Islands', id: 'cck' };

    App.dict.countries['col'] = { name: 'Colombia', id: 'col' };

    App.dict.countries['com'] = { name: 'Comoros', id: 'com' };

    App.dict.countries['cok'] = { name: 'Cook Islands', id: 'cok' };

    App.dict.countries['cri'] = { name: 'Costa Rica', id: 'cri' };

    App.dict.countries['hrv'] = { name: 'Croatia', id: 'hrv' };

    App.dict.countries['cub'] = { name: 'Cuba', id: 'cub' };

    App.dict.countries['cuw'] = { name: 'Cura\u00E7ao', id: 'cuw' };

    App.dict.countries['cyp'] = { name: 'Cyprus', id: 'cyp' };

    App.dict.countries['cze'] = { name: 'Czech Republic', id: 'cze' };

    App.dict.countries['civ'] = { name: 'C\u00F4te d\'Ivoire', id: 'civ' };

    App.dict.countries['prk'] = { name: 'Democratic People\'s Republic of Korea', id: 'prk' };

    App.dict.countries['dnk'] = { name: 'Denmark', id: 'dnk' };

    App.dict.countries['dji'] = { name: 'Djibouti', id: 'dji' };

    App.dict.countries['dma'] = { name: 'Dominica', id: 'dma' };

    App.dict.countries['dom'] = { name: 'Dominican Republic', id: 'dom' };

    App.dict.countries['ecu'] = { name: 'Ecuador', id: 'ecu' };

    App.dict.countries['egy'] = { name: 'Egypt', id: 'egy' };

    App.dict.countries['slv'] = { name: 'El Salvador', id: 'slv' };

    App.dict.countries['gnq'] = { name: 'Equatorial Guinea', id: 'gnq' };

    App.dict.countries['eri'] = { name: 'Eritrea', id: 'eri' };

    App.dict.countries['est'] = { name: 'Estonia', id: 'est' };

    App.dict.countries['eth'] = { name: 'Ethiopia', id: 'eth' };

    App.dict.countries['flk'] = { name: 'Falkland Islands', id: 'flk' };

    App.dict.countries['fro'] = { name: 'Faroe Islands', id: 'fro' };

    App.dict.countries['fsm'] = { name: 'Federated States of Micronesia', id: 'fsm' };

    App.dict.countries['fji'] = { name: 'Fiji', id: 'fji' };

    App.dict.countries['fin'] = { name: 'Finland', id: 'fin' };

    App.dict.countries['fra'] = { name: 'France', id: 'fra' };

    App.dict.countries['guf'] = { name: 'French Guiana', id: 'guf' };

    App.dict.countries['pyf'] = { name: 'French Polynesia', id: 'pyf' };

    App.dict.countries['atf'] = { name: 'French Southern Territories', id: 'atf' };

    App.dict.countries['gab'] = { name: 'Gabon', id: 'gab' };

    App.dict.countries['gmb'] = { name: 'Gambia', id: 'gmb' };

    App.dict.countries['geo'] = { name: 'Georgia', id: 'geo' };

    App.dict.countries['deu'] = { name: 'Germany', id: 'deu' };

    App.dict.countries['gha'] = { name: 'Ghana', id: 'gha' };

    App.dict.countries['gib'] = { name: 'Gibraltar', id: 'gib' };

    App.dict.countries['grc'] = { name: 'Greece', id: 'grc' };

    App.dict.countries['grl'] = { name: 'Greenland', id: 'grl' };

    App.dict.countries['grd'] = { name: 'Grenada', id: 'grd' };

    App.dict.countries['glp'] = { name: 'Guadeloupe', id: 'glp' };

    App.dict.countries['gum'] = { name: 'Guam', id: 'gum' };

    App.dict.countries['gtm'] = { name: 'Guatemala', id: 'gtm' };

    App.dict.countries['gin'] = { name: 'Guinea', id: 'gin' };

    App.dict.countries['gnb'] = { name: 'Guinea-Bissau', id: 'gnb' };

    App.dict.countries['guy'] = { name: 'Guyana', id: 'guy' };

    App.dict.countries['hti'] = { name: 'Haiti', id: 'hti' };

    App.dict.countries['hmd'] = { name: 'Heard Island and McDonald Islands', id: 'hmd' };

    App.dict.countries['hnd'] = { name: 'Honduras', id: 'hnd' };

    App.dict.countries['hkg'] = { name: 'Hong Kong', id: 'hkg' };

    App.dict.countries['hun'] = { name: 'Hungary', id: 'hun' };

    App.dict.countries['isl'] = { name: 'Iceland', id: 'isl' };

    App.dict.countries['ind'] = { name: 'India', id: 'ind' };

    App.dict.countries['idn'] = { name: 'Indonesia', id: 'idn' };

    App.dict.countries['irq'] = { name: 'Iraq', id: 'irq' };

    App.dict.countries['irl'] = { name: 'Ireland', id: 'irl' };

    App.dict.countries['irn'] = { name: 'Islamic Republic of Iran', id: 'irn' };

    App.dict.countries['imn'] = { name: 'Isle of Man', id: 'imn' };

    App.dict.countries['isr'] = { name: 'Israel', id: 'isr' };

    App.dict.countries['ita'] = { name: 'Italy', id: 'ita' };

    App.dict.countries['jam'] = { name: 'Jamaica', id: 'jam' };

    App.dict.countries['jpn'] = { name: 'Japan', id: 'jpn' };

    App.dict.countries['jor'] = { name: 'Jordan', id: 'jor' };

    App.dict.countries['kaz'] = { name: 'Kazakhstan', id: 'kaz' };

    App.dict.countries['ken'] = { name: 'Kenya', id: 'ken' };

    App.dict.countries['kir'] = { name: 'Kiribati', id: 'kir' };

    App.dict.countries['kwt'] = { name: 'Kuwait', id: 'kwt' };

    App.dict.countries['kgz'] = { name: 'Kyrgyzstan', id: 'kgz' };

    App.dict.countries['lao'] = { name: 'Lao People\'s Democratic Republic', id: 'lao' };

    App.dict.countries['lva'] = { name: 'Latvia', id: 'lva' };

    App.dict.countries['lbn'] = { name: 'Lebanon', id: 'lbn' };

    App.dict.countries['lso'] = { name: 'Lesotho', id: 'lso' };

    App.dict.countries['lbr'] = { name: 'Liberia', id: 'lbr' };

    App.dict.countries['lby'] = { name: 'Libyan Arab Jamahiriya', id: 'lby' };

    App.dict.countries['lie'] = { name: 'Liechtenstein', id: 'lie' };

    App.dict.countries['ltu'] = { name: 'Lithuania', id: 'ltu' };

    App.dict.countries['lux'] = { name: 'Luxembourg', id: 'lux' };

    App.dict.countries['mac'] = { name: 'Macao', id: 'mac' };

    App.dict.countries['mdg'] = { name: 'Madagascar', id: 'mdg' };

    App.dict.countries['mwi'] = { name: 'Malawi', id: 'mwi' };

    App.dict.countries['mys'] = { name: 'Malaysia', id: 'mys' };

    App.dict.countries['mdv'] = { name: 'Maldives', id: 'mdv' };

    App.dict.countries['mli'] = { name: 'Mali', id: 'mli' };

    App.dict.countries['mlt'] = { name: 'Malta', id: 'mlt' };

    App.dict.countries['mhl'] = { name: 'Marshall Islands', id: 'mhl' };

    App.dict.countries['mtq'] = { name: 'Martinique', id: 'mtq' };

    App.dict.countries['mrt'] = { name: 'Mauritania', id: 'mrt' };

    App.dict.countries['mus'] = { name: 'Mauritius', id: 'mus' };

    App.dict.countries['myt'] = { name: 'Mayotte', id: 'myt' };

    App.dict.countries['mex'] = { name: 'Mexico', id: 'mex' };

    App.dict.countries['mco'] = { name: 'Monaco', id: 'mco' };

    App.dict.countries['mng'] = { name: 'Mongolia', id: 'mng' };

    App.dict.countries['mne'] = { name: 'Montenegro', id: 'mne' };

    App.dict.countries['msr'] = { name: 'Montserrat', id: 'msr' };

    App.dict.countries['mar'] = { name: 'Morocco', id: 'mar' };

    App.dict.countries['moz'] = { name: 'Mozambique', id: 'moz' };

    App.dict.countries['mmr'] = { name: 'Myanmar', id: 'mmr' };

    App.dict.countries['nam'] = { name: 'Namibia', id: 'nam' };

    App.dict.countries['nru'] = { name: 'Nauru', id: 'nru' };

    App.dict.countries['npl'] = { name: 'Nepal', id: 'npl' };

    App.dict.countries['nld'] = { name: 'Netherlands', id: 'nld' };

    App.dict.countries['ncl'] = { name: 'New Caledonia', id: 'ncl' };

    App.dict.countries['nzl'] = { name: 'New Zealand', id: 'nzl' };

    App.dict.countries['nic'] = { name: 'Nicaragua', id: 'nic' };

    App.dict.countries['ner'] = { name: 'Niger', id: 'ner' };

    App.dict.countries['nga'] = { name: 'Nigeria', id: 'nga' };

    App.dict.countries['niu'] = { name: 'Niue', id: 'niu' };

    App.dict.countries['nfk'] = { name: 'Norfolk Island', id: 'nfk' };

    App.dict.countries['mnp'] = { name: 'Northern Mariana Islands', id: 'mnp' };

    App.dict.countries['nor'] = { name: 'Norway', id: 'nor' };

    App.dict.countries['pse'] = { name: 'Occupied Palestinian Territory', id: 'pse' };

    App.dict.countries['omn'] = { name: 'Oman', id: 'omn' };

    App.dict.countries['pak'] = { name: 'Pakistan', id: 'pak' };

    App.dict.countries['plw'] = { name: 'Palau', id: 'plw' };

    App.dict.countries['pan'] = { name: 'Panama', id: 'pan' };

    App.dict.countries['png'] = { name: 'Papua New Guinea', id: 'png' };

    App.dict.countries['pry'] = { name: 'Paraguay', id: 'pry' };

    App.dict.countries['per'] = { name: 'Peru', id: 'per' };

    App.dict.countries['phl'] = { name: 'Philippines', id: 'phl' };

    App.dict.countries['pcn'] = { name: 'Pitcairn', id: 'pcn' };

    App.dict.countries['pol'] = { name: 'Poland', id: 'pol' };

    App.dict.countries['prt'] = { name: 'Portugal', id: 'prt' };

    App.dict.countries['pri'] = { name: 'Puerto Rico', id: 'pri' };

    App.dict.countries['qat'] = { name: 'Qatar', id: 'qat' };

    App.dict.countries['kor'] = { name: 'Republic of Korea', id: 'kor' };

    App.dict.countries['mda'] = { name: 'Republic of Moldova', id: 'mda' };

    App.dict.countries['cog'] = { name: 'Republic of the Congo', id: 'cog' };

    App.dict.countries['rou'] = { name: 'Romania', id: 'rou' };

    App.dict.countries['rus'] = { name: 'Russian Federation', id: 'rus' };

    App.dict.countries['rwa'] = { name: 'Rwanda', id: 'rwa' };

    App.dict.countries['reu'] = { name: 'R\u00E9union', id: 'reu' };

    App.dict.countries['shn'] = { name: 'Saint Helena', id: 'shn' };

    App.dict.countries['kna'] = { name: 'Saint Kitts and Nevis', id: 'kna' };

    App.dict.countries['lca'] = { name: 'Saint Lucia', id: 'lca' };

    App.dict.countries['vct'] = { name: 'Saint Vincent and the Grenadines', id: 'vct' };

    App.dict.countries['spm'] = { name: 'Saint-Pierre and Miquelon', id: 'spm' };

    App.dict.countries['wsm'] = { name: 'Samoa', id: 'wsm' };

    App.dict.countries['smr'] = { name: 'San Marino', id: 'smr' };

    App.dict.countries['stp'] = { name: 'Sao Tome and Principe', id: 'stp' };

    App.dict.countries['sau'] = { name: 'Saudi Arabia', id: 'sau' };

    App.dict.countries['sen'] = { name: 'Senegal', id: 'sen' };

    App.dict.countries['srb'] = { name: 'Serbia', id: 'srb' };

    App.dict.countries['syc'] = { name: 'Seychelles', id: 'syc' };

    App.dict.countries['sle'] = { name: 'Sierra Leone', id: 'sle' };

    App.dict.countries['sgp'] = { name: 'Singapore', id: 'sgp' };

    App.dict.countries['sxm'] = { name: 'Sint Maarten (Dutch part)', id: 'sxm' };

    App.dict.countries['svk'] = { name: 'Slovakia', id: 'svk' };

    App.dict.countries['svn'] = { name: 'Slovenia', id: 'svn' };

    App.dict.countries['slb'] = { name: 'Solomon Islands', id: 'slb' };

    App.dict.countries['som'] = { name: 'Somalia', id: 'som' };

    App.dict.countries['zaf'] = { name: 'South Africa', id: 'zaf' };

    App.dict.countries['sgs'] = { name: 'South Georgia and the South Sandwich Islands', id: 'sgs' };

    App.dict.countries['esp'] = { name: 'Spain', id: 'esp' };

    App.dict.countries['lka'] = { name: 'Sri Lanka', id: 'lka' };

    App.dict.countries['sdn'] = { name: 'Sudan', id: 'sdn' };

    App.dict.countries['sur'] = { name: 'Suriname', id: 'sur' };

    App.dict.countries['sjm'] = { name: 'Svalbard and Jan Mayen', id: 'sjm' };

    App.dict.countries['swz'] = { name: 'Swaziland', id: 'swz' };

    App.dict.countries['swe'] = { name: 'Sweden', id: 'swe' };

    App.dict.countries['che'] = { name: 'Switzerland', id: 'che' };

    App.dict.countries['syr'] = { name: 'Syrian Arab Republic', id: 'syr' };

    App.dict.countries['twn'] = { name: 'Taiwan', id: 'twn' };

    App.dict.countries['tjk'] = { name: 'Tajikistan', id: 'tjk' };

    App.dict.countries['tha'] = { name: 'Thailand', id: 'tha' };

    App.dict.countries['cod'] = { name: 'The Democratic Republic Of The Congo', id: 'cod' };

    App.dict.countries['mkd'] = { name: 'The Former Yugoslav Republic of Macedonia', id: 'mkd' };

    App.dict.countries['tls'] = { name: 'Timor-Leste', id: 'tls' };

    App.dict.countries['tgo'] = { name: 'Togo', id: 'tgo' };

    App.dict.countries['tkl'] = { name: 'Tokelau', id: 'tkl' };

    App.dict.countries['ton'] = { name: 'Tonga', id: 'ton' };

    App.dict.countries['tto'] = { name: 'Trinidad and Tobago', id: 'tto' };

    App.dict.countries['tun'] = { name: 'Tunisia', id: 'tun' };

    App.dict.countries['tur'] = { name: 'Turkey', id: 'tur' };

    App.dict.countries['tkm'] = { name: 'Turkmenistan', id: 'tkm' };

    App.dict.countries['tca'] = { name: 'Turks and Caicos Islands', id: 'tca' };

    App.dict.countries['tuv'] = { name: 'Tuvalu', id: 'tuv' };

    App.dict.countries['vir'] = { name: 'U.S. Virgin Islands', id: 'vir' };

    App.dict.countries['uga'] = { name: 'Uganda', id: 'uga' };

    App.dict.countries['ukr'] = { name: 'Ukraine', id: 'ukr' };

    App.dict.countries['are'] = { name: 'United Arab Emirates', id: 'are' };

    App.dict.countries['gbr'] = { name: 'United Kingdom', id: 'gbr' };

    App.dict.countries['tza'] = { name: 'United Republic Of Tanzania', id: 'tza' };

    App.dict.countries['usa'] = { name: 'United States', id: 'usa' };

    App.dict.countries['umi'] = { name: 'United States Minor Outlying Islands', id: 'umi' };

    App.dict.countries['ury'] = { name: 'Uruguay', id: 'ury' };

    App.dict.countries['uzb'] = { name: 'Uzbekistan', id: 'uzb' };

    App.dict.countries['vut'] = { name: 'Vanuatu', id: 'vut' };

    App.dict.countries['vat'] = { name: 'Vatican City State', id: 'vat' };

    App.dict.countries['ven'] = { name: 'Venezuela', id: 'ven' };

    App.dict.countries['vnm'] = { name: 'Vietnam', id: 'vnm' };

    App.dict.countries['wlf'] = { name: 'Wallis and Futuna', id: 'wlf' };

    App.dict.countries['esh'] = { name: 'Western Sahara', id: 'esh' };

    App.dict.countries['yem'] = { name: 'Yemen', id: 'yem' };

    App.dict.countries['zmb'] = { name: 'Zambia', id: 'zmb' };

    App.dict.countries['zwe'] = { name: 'Zimbabwe', id: 'zwe' };

    App.dict.countries['ala'] = { name: '\u00C5land Islands', id: 'ala' };


App.dict.customizedFeeTemplate = {};

    App.dict.customizedFeeTemplate[1] = {
  "class": "com.ngs.id.model.CustomizedFeeTemplate",
  "id": 1,
  "createdBy": "support@interpreterintelligence.com",
  "createdDate": "2014-05-08T13:38:24Z",
  "description": "Fee based on distance to service location.",
  "endpoint": "DistanceFee",
  "lastModifiedBy": "support@interpreterintelligence.com",
  "lastModifiedDate": "2014-05-08T13:38:24Z",
  "name": "Distance Fee",
  "parameters": "Start (miles), End (miles), Prorated (true/false), # Hours (Travelled), Use Incidental, Tag(s), To?",
  "uuid": "5a9c17b0-d67b-11e3-8bd4-22000b020126"
};

    App.dict.customizedFeeTemplate[2] = {
  "class": "com.ngs.id.model.CustomizedFeeTemplate",
  "id": 2,
  "createdBy": "support@interpreterintelligence.com",
  "createdDate": "2014-05-15T16:18:57Z",
  "description": "Fee based on duration of job.",
  "endpoint": "DurationFee",
  "lastModifiedBy": "support@interpreterintelligence.com",
  "lastModifiedDate": "2014-05-15T16:18:57Z",
  "name": "Duration Fee",
  "parameters": "Start Duration (mins), End Duration (mins)",
  "uuid": "f196aaae-dc11-11e3-b0b0-22000a7b8bd8"
};

    App.dict.customizedFeeTemplate[3] = {
  "class": "com.ngs.id.model.CustomizedFeeTemplate",
  "id": 3,
  "createdBy": "support@interpreterintelligence.com",
  "createdDate": "2014-07-28T14:18:35Z",
  "description": "Cancellation Fee based on cut-off time.",
  "endpoint": "TimedCancelFee",
  "lastModifiedBy": "support@interpreterintelligence.com",
  "lastModifiedDate": "2014-07-28T14:18:35Z",
  "name": "Cancellation Fee (time based)",
  "parameters": "No. of days before, Cut-off time (e.g. 23:59), Business days only (true/false)",
  "uuid": "63965010-1627-11e4-aef9-22000b020128"
};


App.dict.scheduleType = {};

    App.dict.scheduleType['weekly'] = {
  "class": "com.ngs.id.model.type.ScheduleType",
  "id": 1,
  "description": "Weekly (Midnight)",
  "l10nKey": null,
  "name": "Weekly (Midnight)",
  "nameKey": "weekly"
};

    App.dict.scheduleType['daily'] = {
  "class": "com.ngs.id.model.type.ScheduleType",
  "id": 2,
  "description": "Daily (Midnight)",
  "l10nKey": null,
  "name": "Daily (Midnight)",
  "nameKey": "daily"
};

    App.dict.scheduleType['monthly'] = {
  "class": "com.ngs.id.model.type.ScheduleType",
  "id": 3,
  "description": "Monthly (Midnight)",
  "l10nKey": null,
  "name": "Monthly (Midnight)",
  "nameKey": "monthly"
};


App.dict.assessmentType = {}

    App.dict.assessmentType['first_assessment'] = {
  "class": "com.ngs.id.model.type.AssessmentType",
  "id": 1,
  "defaultOption": true,
  "description": "Recruitment - 1st Assessment",
  "l10nKey": null,
  "name": "Recruitment - 1st Assessment",
  "nameKey": "first_assessment"
};

    App.dict.assessmentType['second_assessment'] = {
  "class": "com.ngs.id.model.type.AssessmentType",
  "id": 2,
  "defaultOption": false,
  "description": "Recruitment - 2nd Assessment",
  "l10nKey": null,
  "name": "Recruitment - 2nd Assessment",
  "nameKey": "second_assessment"
};

    App.dict.assessmentType['quality_request'] = {
  "class": "com.ngs.id.model.type.AssessmentType",
  "id": 3,
  "defaultOption": false,
  "description": "Quality Request",
  "l10nKey": null,
  "name": "Quality Request",
  "nameKey": "quality_request"
};

    App.dict.assessmentType['reassessment'] = {
  "class": "com.ngs.id.model.type.AssessmentType",
  "id": 4,
  "defaultOption": false,
  "description": "Reassessment",
  "l10nKey": null,
  "name": "Reassessment",
  "nameKey": "reassessment"
};

    App.dict.assessmentType['referral_bonus'] = {
  "class": "com.ngs.id.model.type.AssessmentType",
  "id": 5,
  "defaultOption": false,
  "description": "Referral Bonus",
  "l10nKey": null,
  "name": "Referral Bonus",
  "nameKey": "referral_bonus"
};

    App.dict.assessmentType['retainer_fee'] = {
  "class": "com.ngs.id.model.type.AssessmentType",
  "id": 6,
  "defaultOption": false,
  "description": "Retainer Fee",
  "l10nKey": null,
  "name": "Retainer Fee",
  "nameKey": "retainer_fee"
};

    App.dict.assessmentType['administration_fees'] = {
  "class": "com.ngs.id.model.type.AssessmentType",
  "id": 7,
  "defaultOption": false,
  "description": "Administration Fees - Invoices/Statements",
  "l10nKey": null,
  "name": "Administration Fees - Invoices/Statements",
  "nameKey": "administration_fees"
};


App.dict.paymentTier = {}

    App.dict.paymentTier['10'] = {
  "class": "com.ngs.id.model.type.AssessmentPaymentTier",
  "id": 1,
  "defaultOption": true,
  "description": "$10",
  "l10nKey": null,
  "name": "$10",
  "nameKey": "10"
};

    App.dict.paymentTier['15'] = {
  "class": "com.ngs.id.model.type.AssessmentPaymentTier",
  "id": 2,
  "defaultOption": false,
  "description": "$15",
  "l10nKey": null,
  "name": "$15",
  "nameKey": "15"
};

    App.dict.paymentTier['30'] = {
  "class": "com.ngs.id.model.type.AssessmentPaymentTier",
  "id": 3,
  "defaultOption": false,
  "description": "$30",
  "l10nKey": null,
  "name": "$30",
  "nameKey": "30"
};

    App.dict.paymentTier['deduction_10'] = {
  "class": "com.ngs.id.model.type.AssessmentPaymentTier",
  "id": 4,
  "defaultOption": false,
  "description": "Deduction $10",
  "l10nKey": null,
  "name": "Deduction $10",
  "nameKey": "deduction_10"
};

    App.dict.paymentTier['100'] = {
  "class": "com.ngs.id.model.type.AssessmentPaymentTier",
  "id": 5,
  "defaultOption": false,
  "description": "$100",
  "l10nKey": null,
  "name": "$100",
  "nameKey": "100"
};

    App.dict.paymentTier['150'] = {
  "class": "com.ngs.id.model.type.AssessmentPaymentTier",
  "id": 6,
  "defaultOption": false,
  "description": "$150",
  "l10nKey": null,
  "name": "$150",
  "nameKey": "150"
};

    App.dict.paymentTier['other'] = {
  "class": "com.ngs.id.model.type.AssessmentPaymentTier",
  "id": 7,
  "defaultOption": false,
  "description": "Other",
  "l10nKey": null,
  "name": "Other",
  "nameKey": "other"
};


App.dict.reportInformation = {};

    App.dict.reportInformation['61'] = {
  "id": 61,
  "name": "Bookings"
};


App.dict.notificationType = {};


    App.dict.notificationType['email'] = {
  "class": "com.ngs.id.model.type.NotificationType",
  "id": 1,
  "defaultOption": null,
  "description": "Email",
  "l10nKey": null,
  "name": "Email",
  "nameKey": "email"
};

    App.dict.notificationType['sms'] = {
  "class": "com.ngs.id.model.type.NotificationType",
  "id": 2,
  "defaultOption": null,
  "description": "SMS",
  "l10nKey": null,
  "name": "SMS",
  "nameKey": "sms"
};



App.dict.defaults = App.dict.defaults || {};
App.dict.defaults.booking = {
  "id": null,
  "versionValue": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": "",
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "visit.id": null,
  "timeZone": "Europe/Dublin",
  "terpTimeZone": "Europe/Dublin",
  "timeZoneDisplayName": "IST",
  "terpTimeZoneDisplayName": "IST",
  "bookingDate": "",
  "bookingDateField": "",
  "bookingTime": "",
  "status.id": null,
  "status.nameKey": null,
  "paymentStatus.id": null,
  "invoiceStatus.id": null,
  "valid": true,
  "invalidFields": 
  [
  ],
  "language.id": "",
  "languageCode": "",
  "createdTime": "",
  "expectedStartDate": "",
  "expectedStartDateMs": "",
  "startDate": "",
  "startTime": "",
  "expectedEndDate": "",
  "expectedEndDateMs": "",
  "expectedDurationHrs": null,
  "expectedDuration": "",
  "endDate": "",
  "endTime": "",
  "terpExpectedStartDate": "",
  "terpStartDate": "",
  "terpStartTime": "",
  "terpExpectedEndDate": "",
  "terpEndDate": "",
  "terpEndTime": "",
  "contactArrivalDate": "",
  "arrivalDate": "",
  "arrivalTime": "",
  "actualStartDate": "",
  "actualStartDateMs": "",
  "actStartDate": "",
  "actStartTime": "",
  "contactLateMins": null,
  "actualEndDate": "",
  "actualEndDateMs": "",
  "actualDuration": "",
  "actualDurationHrs": null,
  "actEndDate": "",
  "actEndTime": "",
  "frozen": false,
  "interpreterSubmitted": false,
  "interpreter.label": null,
  "interpreter.id": "",
  "assignmentDate": "",
  "cancellationReason.id": "",
  "cancellationReason.label": "",
  "cancellationDate": "",
  "unfulfilledReason.id": "",
  "unfulfilledReason.label": "",
  "unfulfilledDate": "",
  "bookingMode.id": "",
  "bookingMode.label": null,
  "location.id": "",
  "location.label": "",
  "customLocation": null,
  "subLocation.id": "",
  "subLocation.label": "",
  "phoneNum": null,
  "locationNote": "",
  "actualLocation": null,
  "location": null,
  "actualLocationDisplayLabel": "",
  "numberForTelephoneTranslation": "Awaiting interpreter assignment.",
  "isTelephoneTranslation": false,
  "billingLocation.label": null,
  "billingLocation.id": "",
  "requestor.id": "",
  "customRequestor": null,
  "siteContact": null,
  "billingCustomer.id": "",
  "customer.id": "",
  "customerNotes": "",
  "contractType": "",
  "client.id": "",
  "contactNumber": null,
  "superBooking.id": "",
  "superBookingVisits": null,
  "ref": "",
  "refs": null,
  "genderRequirement.id": "",
  "requirements": null,
  "notes": null,
  "billingNotes": null,
  "interpreterNotes": null,
  "visitNotes": null,
  "visitDetails": null,
  "customerSpecialInstructions": null,
  "contactSpecialInstructions": null,
  "companySpecialInstructions": null,
  "bookingDetails": null,
  "notificationEmail": null,
  "notify": null,
  "requestedBy": null,
  "hasMoreInfo": false,
  "averageRating": 0,
  "ratePlanOverride.id": "",
  "rateZoneOverride.id": "",
  "durationOverrideHrs": null,
  "interpreterOverride": false,
  "customerRatePlanOverride.id": "",
  "customerRateZoneOverride.id": "",
  "customerDurationOverrideHrs": null,
  "customerOverride": false,
  "vosRequired": false,
  "consumerCountEnabled": false,
  "consumerCount": null,
  "esignatureRequired": false,
  "esignatureGracePeriod": null,
  "teamSize": 0,
  "mileage": null,
  "currencyCode": null,
  "currencySymbol": null,
  "timeInterpreterDepartedOutbound": "",
  "timeInterpreterArrivedOutbound": "",
  "timeInterpreterDepartedInbound": "",
  "timeInterpreterArrivedInbound": "",
  "timeInterpreterDepartedDateOutbound": "",
  "timeInterpreterDepartedTimeOutbound": "",
  "timeInterpreterArrivedDateOutbound": "",
  "timeInterpreterArrivedTimeOutbound": "",
  "timeInterpreterDepartedDateInbound": "",
  "timeInterpreterDepartedTimeInbound": "",
  "timeInterpreterArrivedDateInbound": "",
  "timeInterpreterArrivedTimeInbound": "",
  "assignmentDateDate": "",
  "assignmentDateTime": "",
  "preferredInterpreter": null,
  "slaReportingEnabled": false,
  "timeTrackingEnabled": false,
  "locked": null,
  "userEditing": null,
  "preventEdit": null,
  "startEditing": null,
  "excludeFromAutoOffer": false,
  "isCancelled": false,
  "jobCompleteEmailSent": false,
  "customerRatePlan.id": "",
  "contactRatePlan.id": ""
};
App.dict.defaults.user = {
  "id": null,
  "uuid": null,
  "createdDate": "",
  "createdBy": null,
  "lastModifiedDate": "",
  "lastModifiedBy": null,
  "name": "null null",
  "username": null,
  "password": "",
  "passwordConfirm": "",
  "firstName": null,
  "lastName": null,
  "defaultLocation": null,
  "canSwitchLocation": false,
  "admin": false,
  "finance": false,
  "enabled": false,
  "accountExpired": false,
  "accountLocked": false,
  "passwordExpired": false,
  "roles": 
  [
  ],
  "company": null,
  "businessUnit": null,
  "primaryCompany": null,
  "interpreter": null,
  "customer": null,
  "tz": null,
  "timeZone": "Europe/Dublin",
  "timeZoneDisplayName": "IST",
  "email": null
};
App.dict.defaults.message = {
  "id": null,
  "uuid": null,
  "company.id": null,
  "title": null,
  "type.id": null,
  "dateActive": null,
  "dateActiveStr": null,
  "dateInactive": null,
  "summary": null,
  "body": null,
  "audience.id": null,
  "notifyByEmail": null
};
App.dict.defaults.rateZoneGroup = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "name": null,
  "description": null,
  "defaultGroup": null,
  "zones": 
  [
  ]
};
App.dict.defaults.rateZone = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "includeHolidays": null,
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "name": null,
  "description": null,
  "overnightNightEnabled": null,
  "overnightName": null,
  "overnightDescription": null,
  "nightName": null,
  "nightDescription": null,
  "type.id": null,
  "rateZoneGroup.id": null,
  "segments": 
  [
  ]
};
App.dict.defaults.rateZoneSegment = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "rateZone.id": "",
  "day.id": "",
  "date": null,
  "dateAsStr": null,
  "allDay": null,
  "startHour": null,
  "startMinute": null,
  "endHour": null,
  "endMinute": null
};
App.dict.defaults.contactRatePlan = {
  "id": null,
  "company.id": null,
  "contact": null,
  "ratePlan": null,
  "versionValue": null,
  "uuid": null,
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "activeStartDate": null,
  "activeEndDate": null
};
App.dict.defaults.customerRatePlan = {
  "id": null,
  "company.id": null,
  "customer": null,
  "ratePlan": null,
  "versionValue": null,
  "uuid": null,
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "activeStartDate": null,
  "activeEndDate": null
};
App.dict.defaults.contactRateZoneGroup = {
  "id": null,
  "company.id": null,
  "contact": null,
  "rateZoneGroup": null
};
App.dict.defaults.customerRateZoneGroup = {
  "id": null,
  "company.id": null,
  "customer": null,
  "rateZoneGroup": null
};
App.dict.defaults.contact = {
  "id": null,
  "versionValue": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": null,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "name": "",
  "displayName": "No valid name specified",
  "salutation": "",
  "firstName": "",
  "middleName": "",
  "lastName": "",
  "nickName": "",
  "suffix": "",
  "gender.id": null,
  "businessUnit.id": "",
  "dateOfBirth": null,
  "contactTypes": null,
  "accountingReference": null,
  "referenceId": null,
  "languageMappings": null,
  "primaryNumber": null,
  "numbers": null,
  "primaryAddress": null,
  "lat": 0.0,
  "lng": 0.0,
  "addresses": null,
  "primaryEmail": null,
  "emails": null,
  "qualifications": 
  [
  ],
  "eligibilities": 
  [
  ],
  "criteriaHierarchy": 
  [
  ],
  "hasTransportation": null,
  "hasChildren": null,
  "notes": null,
  "companyName": null,
  "website": null,
  "region": null,
  "countryOfOrigin": null,
  "countryOfResidence": null,
  "countryOfNationality": null,
  "active": true,
  "activeNote": null,
  "availability": null,
  "experience": null,
  "registeredTaxId": null,
  "bankAccount": null,
  "sortCode": null,
  "iban": null,
  "swift": null,
  "eft.id": "",
  "paymentMethod.id": "",
  "paymentAccount": null,
  "registeredTax": false,
  "registeredTaxRate": null,
  "registeredTaxIdDescription": null,
  "employmentCategory.id": "",
  "assignmentTier.id": "",
  "timeZone": "",
  "ethnicity": "",
  "document": {
    "id": ""
  },
  "imagePath": "nullimages/placeholder.png",
  "outOfOffice": false,
  "disableUpcomingReminder": null,
  "disableCloseReminder": null,
  "disableConfirmReminder": null,
  "bankAccountDescription": null,
  "timeWorked": "Interpreter's activation date is not set. If you would like their active time to be calculated, please view the Activation tab and set an Activation Date.",
  "activationDate": null,
  "originalStartDate": null,
  "datePhotoSentToPrinter": null,
  "datePhotoSentToInterpreter": null,
  "inductionDate": null,
  "reActivationDate": null,
  "iolNrcpdNumber": null,
  "referralSource": null,
  "refereeSourceName": null,
  "recruiterName": null,
  "taleoId": null,
  "bankAccountReference": null,
  "status": null,
  "disableConfirmationEmails": false,
  "disableOfferEmails": false,
  "disableAutoOffers": false,
  "currencyCode.id": "",
  "currencySymbol": null,
  "bankBranch": null,
  "services": null,
  "enableAllServices": true,
  "isSynchronized": false,
  "lastSynchronizedDate": null,
  "isSynchronizedManually": false
};
App.dict.defaults.contactPerson = {
  "id": null,
  "uuid": null,
  "customer.id": "",
  "displayLabel": "null",
  "displayName": "null",
  "name": "null",
  "firstName": null,
  "lastName": null,
  "number": null,
  "faxNumber": null,
  "email": null,
  "other": null,
  "active": true
};
App.dict.defaults.consumer = {
  "id": null,
  "versionValue": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": null,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "firstName": "",
  "middleName": "",
  "lastName": "",
  "name": "",
  "recordNumber": "",
  "businessUnit.id": "",
  "email": "",
  "phoneNumber": "",
  "payor": "",
  "payorRecordNumber": "",
  "dateOfBirth": null,
  "notes": null,
  "comments": null,
  "accountingReference": null,
  "active": true,
  "gender.id": "",
  "criteria": null,
  "claimNumber": null,
  "dateOfInjury": null
};
App.dict.defaults.number = {
  "id": null,
  "parsedNumber": null,
  "numberFormatted": null,
  "countryCode": null,
  "areaCode": null,
  "number": null,
  "type.id": null,
  "primaryNumber": false
};
App.dict.defaults.address = {
  "id": null,
  "client.id": "",
  "clientLabel": null,
  "company.id": "",
  "customer.id": "",
  "customerBilling.id": "",
  "displayLabel": "No valid address specified",
  "description": null,
  "notes": null,
  "addrEntered": null,
  "addrFormatted": null,
  "aptUnit": null,
  "preamble": null,
  "street1": null,
  "street2": null,
  "street3": null,
  "cityTown": null,
  "stateCounty": null,
  "postalCode": null,
  "country": null,
  "primaryAddress": false,
  "valid": false,
  "validationStatus": null,
  "validated": false,
  "type.id": "",
  "lat": 0.0,
  "lng": 0.0,
  "addressPhone": null,
  "addressFax": null,
  "addressEmail": null,
  "contactPerson": null,
  "costCenter": null,
  "active": true,
  "parent.id": "",
  "parent.label": "",
  "publicNotes": null,
  "customerSpecialInstructions": null,
  "contactSpecialInstructions": null,
  "companySpecialInstructions": null,
  "region.id": "",
  "billingRegion.id": "",
  "costCenterName": null,
  "timeZone": null,
  "accountingReference": null
};
App.dict.defaults.email = {
  "id": null,
  "emailAddress": null,
  "addressVerified": null,
  "dateVerified": null,
  "primaryEmail": false,
  "type.id": null
};
App.dict.defaults.languageMapping = {
  "id": null,
  "contact.id": "",
  "language.id": "",
  "rating": ""
};
App.dict.defaults.qualification = {
  "id": null,
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "company.id": "",
  "criteria.id": "",
  "customerSpecific": false,
  "enforcementPolicy": "",
  "name": "",
  "description": "",
  "validated": null,
  "validatedStatus": "",
  "validatedDate": "",
  "validatedBy": "",
  "validUntil": "",
  "state": null,
  "stateDateSince": "",
  "stateDateUntil": "",
  "notes": "",
  "documents": 
  [
  ],
  "criteriaType": "",
  "language.id": "",
  "languageLabel": "",
  "languageCode": "",
  "supportingInformation": ""
};
App.dict.defaults.employmentEligibility = {
  "id": null,
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "company.id": "",
  "criteria.id": "",
  "customerSpecific": false,
  "enforcementPolicy": "",
  "name": "",
  "description": "",
  "validated": null,
  "validatedStatus": "",
  "validatedDate": "",
  "validatedBy": "",
  "validUntil": "",
  "state": null,
  "stateDateSince": "",
  "stateDateUntil": "",
  "notes": "",
  "documents": 
  [
  ],
  "criteriaType": "",
  "language.id": "",
  "languageLabel": "",
  "languageCode": "",
  "supportingInformation": ""
};
App.dict.defaults.criteria = {
  "id": null,
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "company.id": "",
  "name": "",
  "type.nameKey": null,
  "type.id": null,
  "customerSpecific": false,
  "enableForBooking": false,
  "editable": false,
  "description": "",
  "active.id": null,
  "active.nameKey": null,
  "active.name": null,
  "activeDate": "",
  "inactiveDate": "",
  "enforcementPolicy.id": null,
  "enforcementPolicy.nameKey": null,
  "enforcementPolicy.name": null,
  "durationOfValidity": "",
  "criteriaChildren": 
  [
  ],
  "notifyExpiration": false,
  "inactivateInterpreter": false,
  "presetCriteria": false,
  "excludeFromAssignment": false
};
App.dict.defaults.bookingReference = {
  "id": null,
  "name": null,
  "ref": null,
  "description": null,
  "company.id": "",
  "approved": false,
  "autoComplete.id": "",
  "consumer.id": "",
  "dependent": null,
  "dependentId": null
};
App.dict.defaults.bookingCriteria = {
  "id": null,
  "uuid": null,
  "booking.id": "",
  "criteria.id": "",
  "required": null
};
App.dict.defaults.document = {
  "id": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": null,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "type.id": null,
  "type.nameKey": null,
  "description": null,
  "parentEntityClass": null,
  "parentEntityType": null,
  "parentEntityId": null,
  "fileName": null,
  "fileType": null,
  "fileSize": null,
  "fQPath": "N/A",
  "relativePath": "N/A",
  "isBinary": true,
  "allowPublicView": false
};
App.dict.defaults.report = {
  "id": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": null,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "customer.id": null,
  "type.id": null,
  "type.nameKey": null,
  "name": null,
  "description": null,
  "year": null,
  "month": null,
  "parentEntityClass": null,
  "parentEntityType": null,
  "parentEntityId": null,
  "fileName": null,
  "fileType": null,
  "fileSize": null,
  "fQPath": "N/A",
  "relativePath": "N/A",
  "isBinary": true
};
App.dict.defaults.customerCategory = {
  "id": null,
  "customerCategory.id": null,
  "name": null
};
App.dict.defaults.contactType = {
  "class": "com.ngs.id.model.type.ContactType",
  "id": null,
  "defaultOption": false,
  "description": null,
  "l10nKey": null,
  "name": null,
  "nameKey": null
};
App.dict.defaults.referenceCodeConfig = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "customer.id": "",
  "customerName": "",
  "label": null,
  "regEx": null,
  "required": false,
  "masked": false,
  "disabled": false,
  "hidden": false,
  "groupBy": false,
  "selectField": false,
  "allowFreeText": false,
  "defaultValue": null,
  "promote": false,
  "consumerEnabled": false,
  "customerSpecific": false,
  "enableDropdown": false,
  "helpText": null,
  "dependent": false,
  "collectAtClosing": false
};
App.dict.defaults.customerCriteriaConfig = {
  "id": null,
  "uuid": null,
  "customer.id": null,
  "criteria.id": null,
  "criteria": null,
  "required": null
};
App.dict.defaults.hierarchyNodeAddress = {
  "node": null,
  "location": null
};
App.dict.defaults.smsTemplate = {
  "id": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": null,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "name": null,
  "nameKey": null,
  "used": null,
  "type.id": null,
  "body": null
};
App.dict.defaults.vosTemplate = {
  "id": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": null,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "defaultVos": false,
  "header": null,
  "body": null,
  "footer": null
};
App.dict.defaults.invoiceTemplate = {
  "id": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": null,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "defaultInvoice": false,
  "header": null,
  "body": null,
  "footer": null
};
App.dict.defaults.paymentTemplate = {
  "id": null,
  "uuid": null,
  "createdBy": null,
  "createdDate": null,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "company.id": null,
  "defaultPayment": false,
  "header": null,
  "body": null,
  "footer": null
};
App.dict.defaults.holiday = {
  "id": null,
  "company.id": null,
  "name": null,
  "description": null,
  "date": null
};
App.dict.defaults.cancellationReason = {
  "id": null,
  "company.id": null,
  "name": null,
  "description": null,
  "enabled": true,
  "enabledForCustomers": false,
  "createInteraction": false,
  "billable": true,
  "payable": true,
  "enabledForInterpreters": false
};
App.dict.defaults.unfulfilledReason = {
  "id": null,
  "company.id": null,
  "name": null,
  "description": null,
  "enabled": true
};
App.dict.defaults.actionGroup = {
  "id": null,
  "company.id": null,
  "name": null,
  "description": null,
  "enabled": true
};
App.dict.defaults.languageTier = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "name": null,
  "baseTier": null,
  "accountsClassification": null,
  "languages": 
  [
  ],
  "languageServices": null,
  "premiums": null,
  "rushFees": null,
  "miscellaneousFees": null,
  "cancelFees": null,
  "splitMinimumDuration": false,
  "override": null,
  "inPersonStandard": 0.0,
  "inPersonStandardOvernight": 0.0,
  "inPersonStandardNight": 0.0,
  "minHoursInPersonStandard": 0.0,
  "inPersonPremium": 0.0,
  "inPersonPremiumOvernight": 0.0,
  "inPersonPremiumNight": 0.0,
  "minHoursInPersonPremium": 0.0,
  "inPersonPlatinum": 0.0,
  "inPersonPlatinumOvernight": 0.0,
  "inPersonPlatinumNight": 0.0,
  "minHoursInPersonPlatinum": 0.0,
  "phoneStandard": 0.0,
  "phoneStandardOvernight": 0.0,
  "phoneStandardNight": 0.0,
  "minHoursPhoneStandard": 0.0,
  "phonePremium": 0.0,
  "phonePremiumOvernight": 0.0,
  "phonePremiumNight": 0.0,
  "minHoursPhonePremium": 0.0,
  "phonePlatinum": 0.0,
  "phonePlatinumOvernight": 0.0,
  "phonePlatinumNight": 0.0,
  "minHoursPhonePlatinum": 0.0,
  "videoStandard": 0.0,
  "videoStandardOvernight": 0.0,
  "videoStandardNight": 0.0,
  "minHoursVideoStandard": 0.0,
  "videoPremium": 0.0,
  "videoPremiumOvernight": 0.0,
  "videoPremiumNight": 0.0,
  "minHoursVideoPremium": 0.0,
  "videoPlatinum": 0.0,
  "videoPlatinumOvernight": 0.0,
  "videoPlatinumNight": 0.0,
  "minHoursVideoPlatinum": 0.0,
  "inPersonStandardBaseRate": 0.0,
  "inPersonPremiumBaseRate": 0.0,
  "inPersonPlatinumBaseRate": 0.0,
  "phoneStandardBaseRate": 0.0,
  "phonePremiumBaseRate": 0.0,
  "phonePlatinumBaseRate": 0.0,
  "videoStandardBaseRate": 0.0,
  "videoPremiumBaseRate": 0.0,
  "videoPlatinumBaseRate": 0.0,
  "cliffMinsInPersonStandard": 0.0,
  "cliffRateInPersonStandard": 0.0,
  "cliffMinsInPersonPremium": 0.0,
  "cliffRateInPersonPremium": 0.0,
  "cliffMinsInPersonPlatinum": 0.0,
  "cliffRateInPersonPlatinum": 0.0,
  "cliffMinsPhoneStandard": 0.0,
  "cliffRatePhoneStandard": 0.0,
  "cliffMinsPhonePremium": 0.0,
  "cliffRatePhonePremium": 0.0,
  "cliffMinsPhonePlatinum": 0.0,
  "cliffRatePhonePlatinum": 0.0,
  "cliffMinsVideoStandard": 0.0,
  "cliffRateVideoStandard": 0.0,
  "cliffMinsVideoPremium": 0.0,
  "cliffRateVideoPremium": 0.0,
  "cliffMinsVideoPlatinum": 0.0,
  "cliffRateVideoPlatinum": 0.0,
  "tieredMinHoursInPersonStandard": 0.0,
  "tieredMinHoursInPersonPremium": 0.0,
  "tieredMinHoursInPersonPlatinum": 0.0,
  "tieredMinHoursPhoneStandard": 0.0,
  "tieredMinHoursPhonePremium": 0.0,
  "tieredMinHoursPhonePlatinum": 0.0,
  "tieredMinHoursVideoStandard": 0.0,
  "tieredMinHoursVideoPremium": 0.0,
  "tieredMinHoursVideoPlatinum": 0.0,
  "travelInPersonStandard": 0.0,
  "travelInPersonPremium": 0.0,
  "travelInPersonPlatinum": 0.0,
  "travelPhoneStandard": 0.0,
  "travelPhonePremium": 0.0,
  "travelPhonePlatinum": 0.0,
  "travelVideoStandard": 0.0,
  "travelVideoPremium": 0.0,
  "travelVideoPlatinum": 0.0,
  "unitIncInPerson": 1.0,
  "unitIncPhone": 1.0,
  "unitIncVideo": 1.0,
  "billingIncrementOverride": false,
  "mileage": 0.0,
  "mileageThreshold": 0.0,
  "minMileage": null,
  "maxMileage": null,
  "mileageOverride": false,
  "passThroughInPersonStandard": 0.0,
  "passThroughInPersonPremium": 0.0,
  "passThroughInPersonPlatinum": 0.0,
  "passThroughPhoneStandard": 0.0,
  "passThroughPhonePremium": 0.0,
  "passThroughPhonePlatinum": 0.0,
  "passThroughVideoStandard": 0.0,
  "passThroughVideoPremium": 0.0,
  "passThroughVideoPlatinum": 0.0,
  "payMileageInFull": null
};
App.dict.defaults.premiumTier = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "criteria.id": null,
  "criteria.name": null,
  "accountsClassification": null,
  "premiumServices": null,
  "rushFees": null,
  "miscellaneousFees": null,
  "cancelFees": null,
  "splitMinimumDuration": false,
  "inPersonStandard": 0.0,
  "inPersonStandardOvernight": 0.0,
  "inPersonStandardNight": 0.0,
  "minHoursInPersonStandard": 0.0,
  "inPersonPremium": 0.0,
  "inPersonPremiumOvernight": 0.0,
  "inPersonPremiumNight": 0.0,
  "minHoursInPersonPremium": 0.0,
  "inPersonPlatinum": 0.0,
  "inPersonPlatinumOvernight": 0.0,
  "inPersonPlatinumNight": 0.0,
  "minHoursInPersonPlatinum": 0.0,
  "phoneStandard": 0.0,
  "phoneStandardOvernight": 0.0,
  "phoneStandardNight": 0.0,
  "minHoursPhoneStandard": 0.0,
  "phonePremium": 0.0,
  "phonePremiumOvernight": 0.0,
  "phonePremiumNight": 0.0,
  "minHoursPhonePremium": 0.0,
  "phonePlatinum": 0.0,
  "phonePlatinumOvernight": 0.0,
  "phonePlatinumNight": 0.0,
  "minHoursPhonePlatinum": 0.0,
  "videoStandard": 0.0,
  "videoStandardOvernight": 0.0,
  "videoStandardNight": 0.0,
  "minHoursVideoStandard": 0.0,
  "videoPremium": 0.0,
  "videoPremiumOvernight": 0.0,
  "videoPremiumNight": 0.0,
  "minHoursVideoPremium": 0.0,
  "videoPlatinum": 0.0,
  "videoPlatinumOvernight": 0.0,
  "videoPlatinumNight": 0.0,
  "minHoursVideoPlatinum": 0.0,
  "inPersonStandardBaseRate": 0.0,
  "inPersonPremiumBaseRate": 0.0,
  "inPersonPlatinumBaseRate": 0.0,
  "phoneStandardBaseRate": 0.0,
  "phonePremiumBaseRate": 0.0,
  "phonePlatinumBaseRate": 0.0,
  "videoStandardBaseRate": 0.0,
  "videoPremiumBaseRate": 0.0,
  "videoPlatinumBaseRate": 0.0,
  "cliffMinsInPersonStandard": 0.0,
  "cliffRateInPersonStandard": 0.0,
  "cliffMinsInPersonPremium": 0.0,
  "cliffRateInPersonPremium": 0.0,
  "cliffMinsInPersonPlatinum": 0.0,
  "cliffRateInPersonPlatinum": 0.0,
  "cliffMinsPhoneStandard": 0.0,
  "cliffRatePhoneStandard": 0.0,
  "cliffMinsPhonePremium": 0.0,
  "cliffRatePhonePremium": 0.0,
  "cliffMinsPhonePlatinum": 0.0,
  "cliffRatePhonePlatinum": 0.0,
  "cliffMinsVideoStandard": 0.0,
  "cliffRateVideoStandard": 0.0,
  "cliffMinsVideoPremium": 0.0,
  "cliffRateVideoPremium": 0.0,
  "cliffMinsVideoPlatinum": 0.0,
  "cliffRateVideoPlatinum": 0.0,
  "tieredMinHoursInPersonStandard": 0.0,
  "tieredMinHoursInPersonPremium": 0.0,
  "tieredMinHoursInPersonPlatinum": 0.0,
  "tieredMinHoursPhoneStandard": 0.0,
  "tieredMinHoursPhonePremium": 0.0,
  "tieredMinHoursPhonePlatinum": 0.0,
  "tieredMinHoursVideoStandard": 0.0,
  "tieredMinHoursVideoPremium": 0.0,
  "tieredMinHoursVideoPlatinum": 0.0,
  "travelInPersonStandard": 0.0,
  "travelInPersonPremium": 0.0,
  "travelInPersonPlatinum": 0.0,
  "travelPhoneStandard": 0.0,
  "travelPhonePremium": 0.0,
  "travelPhonePlatinum": 0.0,
  "travelVideoStandard": 0.0,
  "travelVideoPremium": 0.0,
  "travelVideoPlatinum": 0.0,
  "unitIncInPerson": 1.0,
  "unitIncPhone": 1.0,
  "unitIncVideo": 1.0,
  "billingIncrementOverride": false,
  "mileage": 0.0,
  "mileageThreshold": 0.0,
  "minMileage": null,
  "maxMileage": null,
  "mileageOverride": false,
  "passThroughInPersonStandard": 0.0,
  "passThroughInPersonPremium": 0.0,
  "passThroughInPersonPlatinum": 0.0,
  "passThroughPhoneStandard": 0.0,
  "passThroughPhonePremium": 0.0,
  "passThroughPhonePlatinum": 0.0,
  "passThroughVideoStandard": 0.0,
  "passThroughVideoPremium": 0.0,
  "passThroughVideoPlatinum": 0.0,
  "payMileageInFull": null
};
App.dict.defaults.serviceTier = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "service.id": "",
  "service.name": null,
  "languageTier.id": "",
  "premiumTier.id": "",
  "standardBaseRate": 0.0,
  "standard": 0.0,
  "standardOvernight": 0.0,
  "standardNight": 0.0,
  "minHoursStandard": 0.0,
  "premiumBaseRate": 0.0,
  "premium": 0.0,
  "premiumOvernight": 0.0,
  "premiumNight": 0.0,
  "minHoursPremium": 0.0,
  "platinumBaseRate": 0.0,
  "platinum": 0.0,
  "platinumOvernight": 0.0,
  "platinumNight": 0.0,
  "minHoursPlatinum": 0.0,
  "cliffMinsStandard": 0.0,
  "cliffRateStandard": 0.0,
  "cliffMinsPremium": 0.0,
  "cliffRatePremium": 0.0,
  "cliffMinsPlatinum": 0.0,
  "cliffRatePlatinum": 0.0,
  "tieredMinHoursStandard": 0.0,
  "tieredMinHoursPremium": 0.0,
  "tieredMinHoursPlatinum": 0.0,
  "travelStandard": 0.0,
  "travelPremium": 0.0,
  "travelPlatinum": 0.0,
  "passThroughStandard": 0.0,
  "passThroughPremium": 0.0,
  "passThroughPlatinum": 0.0,
  "accountsClassification": null,
  "splitMinimumDuration": false,
  "mileageOverride": false,
  "mileage": 0.0,
  "mileageThreshold": 0.0,
  "minMileage": null,
  "maxMileage": null,
  "payMileageInFull": null,
  "billingIncrementOverride": false,
  "unitInc": 1.0,
  "rushFees": null,
  "miscellaneousFees": null,
  "cancelFees": null
};
App.dict.defaults.fee = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "feeType.id": "",
  "chargeType.id": "",
  "chargeRate": null,
  "period": null,
  "periodRule.id": "",
  "rateZone.id": "",
  "rateZoneCliff": null,
  "excludeStandard": false,
  "applyToRateZone.id": "",
  "precedence": null,
  "description": "null: Within null hr(s), null, null  ",
  "applyToStandardRate": false,
  "applyToInPerson": true,
  "applyToPhone": true,
  "applyToVideo": false,
  "combineWithLineItem": null,
  "applyOnce": false,
  "applyOnceAnnually": false,
  "skipCancelled": false,
  "name": null,
  "aggregate": false,
  "customizedFeeTemplate.id": "",
  "parameter1": null,
  "parameter2": null,
  "parameter3": null,
  "parameter4": null,
  "parameter5": null,
  "parameter6": null,
  "parameter7": null
};
App.dict.defaults.deduction = {
  "id": null,
  "uuid": null,
  "company.id": "",
  "createdDate": "",
  "createdBy": "",
  "lastModifiedDate": "",
  "lastModifiedBy": "",
  "name": null,
  "chargeType.id": null,
  "chargeRate": null,
  "aggregate": true,
  "applyOnce": false,
  "applyOnceAnnually": false,
  "description": "Deduction: null: null @ null",
  "applyToInPerson": true,
  "applyToPhone": true,
  "applyToVideo": false
};
App.dict.defaults.incidental = {
  "class": "com.ngs.id.model.Incidental",
  "id": null,
  "booking": null,
  "clockTimeIn": null,
  "clockTimeOut": null,
  "company": null,
  "createdBy": null,
  "createdDate": null,
  "description": null,
  "isBillable": true,
  "isBilled": false,
  "isPaid": false,
  "isPayable": true,
  "lastModifiedBy": null,
  "lastModifiedDate": null,
  "onDate": null,
  "quantity": null,
  "receipt": null,
  "type": null,
  "uuid": null
}
App.dict.defaults.region = {
  "id": null,
  "name": null,
  "isBilling": false,
  "enabled": true
};
App.dict.defaults.referenceCodeAutoComplete = {
  "id": null,
  "value": null,
  "criteria": null,
  "referenceCodeConfigs": null,
  "company.id": ""
};
App.dict.defaults.role = {
  "id": null,
  "authority": null
};
App.dict.defaults.reportInformation = {
  "id": null,
  "name": null
};
App.dict.defaults.scheduledReport = {
  "id": null,
  "name": null,
  "active": null,
  "lastRun": null,
  "createdDate": null,
  "lastModifiedDate": null,
  "recipients": null,
  "params": {
  },
  "scheduledDay": 0,
  "schedule": "",
  "reportInformation.id": "",
  "reportInformation.name": "",
  "company": ""
};
App.dict.defaults.companyService = {
  "id": null,
  "service": null,
  "enabled": null
};

//]]>

