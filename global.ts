'use strict';

import { FormArray, FormControl, FormGroup } from "@angular/forms";
import * as moment from "moment";

export const API_URL = 'http://localhost:8000/api';
// export const API_URL = 'https://api.elexifyindustries.in/api';

export const APP_NAME = 'Elexify Industries Control Panel';
export const TABLE_LENGTH = 10;

export function getServerErrorMessage(err: any) {
    if (err.status == 401) {
        return err?.error?.message ?? "Unauthorized Action";
    } else if (err.status == 404) {
        return err?.message ?? "Not found exception occured";
    } else {
        return "Internal server error occured. Please try again later";
    }
}

export function getValidationMessage(result: any[]) {
    for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
            const element = result[key];
            if (element.message) {
                return element.message;
            }
        }
    }

    return "Validation Error: Please check all the fields correctly";
}

export function scrollToQuery(query: any) {
    let $_errFormControl = document.querySelectorAll(query);
    if ($_errFormControl.length > 0) {
        const firstErr: Element = $_errFormControl[0];
        firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

export function resetPaginationOption() {
    return {
        hasNextPage: false,
        hasPrevPage: false,
        limit: TABLE_LENGTH,
        nextPage: null,
        page: 1,
        pagingCounter: 1,
        prevPage: null,
        totalDocs: 0,
        totalPages: 1,
    }
}

export function resetTableFilterOptions() {
    return {
        searchkey: "",
        operator: "",
        vendor: "",
        customer: "",
        product: "",
        period: null,
        order_status: "open",
    }
}

export function getPageNumber({
    index = <number>1,
    pageno = <number>1,
    tablelength = <number>TABLE_LENGTH
} = {}) {
    return (tablelength * (pageno - 1)) + (index + 1)
}

export function disableButtonForTimeFrame(remaining: number, buttonid: string, defaultText: string = "Resend") {
    let button = document.getElementById(buttonid);

    if (!button) {
        return false;
    }

    button.setAttribute("disabled", "disabled");

    var m: any = Math.floor(remaining / 60);
    var s: any = remaining % 60;

    m = m < 10 ? '0' + m : m;
    s = s < 10 ? '0' + s : s;

    let buttonIndicatorLabel = button?.querySelector("span.indicator-label");
    if (buttonIndicatorLabel) {
        buttonIndicatorLabel.innerHTML = '<i class="fa fa-clock-o"></i>&nbsp;&nbsp;' + m + ':' + s;
        remaining -= 1;

        if (remaining >= 0) {
            setTimeout(function () {
                disableButtonForTimeFrame(remaining, buttonid);
            }, 1000);
            return;
        }

        buttonIndicatorLabel.innerHTML = defaultText;
        button.removeAttribute("disabled");
        return true;
    } else {
        return false
    }
}


/**
 * ----------------------------------------
 * Form Control Global Functions
 * @param formGroup - Instance of FormGroup
 * ----------------------------------------
 * ----------------------------------------
 */

export function resetForm(formGroup: FormGroup) {
    formGroup.reset();
    for (const key in formGroup.controls) {
        if (Object.prototype.hasOwnProperty.call(formGroup.controls, key)) {
            const element = formGroup.controls[key];

            element.markAsUntouched();
            element.markAsPristine();
        }
    }
}

export function isFormValidationAvailable(formGroup: FormGroup, control: any, rules: any) {
    const formControl: any = formGroup.get(control);
    if (formControl) {
        const validator = formControl.validator && formControl.validator(new FormControl());
        if (validator && validator[rules]) {
            return true;
        }
    }

    return false;
}

export function isInputValid(formGroup: FormGroup, control: any) {
    let valid: boolean = true

    let cntrls = control.split(".")
    let fgroupcontrols: any = formGroup;
    if (cntrls.length > 1) {
        cntrls.forEach((c: any) => {
            fgroupcontrols = fgroupcontrols.controls[c]
        });
    } else {
        fgroupcontrols = fgroupcontrols.controls[control]
    }

    if (!["VALID", "DISABLED"].includes(fgroupcontrols.status) && (fgroupcontrols.touched || fgroupcontrols.dirty)) {
        valid = false
    }

    return valid;
}

export function isInputRuleValid(formGroup: FormGroup, control: any, rule: any) {
    let valid: boolean = true

    let cntrls = control.split(".")
    let fgroupcontrols: any = formGroup;
    if (cntrls.length > 1) {
        cntrls.forEach((c: any) => {
            fgroupcontrols = fgroupcontrols.controls[c]
        });
    } else {
        fgroupcontrols = fgroupcontrols.controls[control]
    }

    if (rule instanceof Array) {
        rule.forEach(r => {
            if (fgroupcontrols.hasError(r) && (fgroupcontrols.touched || fgroupcontrols.dirty)) {
                valid = false
            }
        });
    } else {
        if (fgroupcontrols.hasError(rule) && (fgroupcontrols.touched || fgroupcontrols.dirty)) {
            valid = false
        }
    }

    return valid;
}

export function isInputRuleAvailable(formGroup: FormGroup, control: any, rule: any) {
    const formControl: any = formGroup.get(control);
    if (formControl) {
        const validator = formControl.validator && formControl.validator(new FormControl());
        if (validator && validator[rule]) {
            return true;
        }
    }

    return false;
}

export function onFileUploaded(formGroup: FormGroup, event: any, sourceKey: any, type: any = "single") {
    if (event.target.files.length > 0) {
        const file = event.target.files[0];
        formGroup.patchValue({
            [sourceKey]: file
        });
    } else {
        formGroup.patchValue({
            [sourceKey]: null
        });
    }
}

export function getFormGroupArray(formGroup: FormGroup, type: any) {
    return (formGroup.get(type) as FormArray).controls;
}

export function removeFormGroupArrRow(formGroup: FormGroup, type: any, index: number) {
    const control = <FormArray>formGroup.get(type);
    control.removeAt(index);
}

export function resetFormGroupArrRow(formGroup: FormGroup, type: any) {
    const control = <FormArray>formGroup.get(type);
    control.clear();
}

export function fetchFormGroupIndexOfControl(formGroup: FormGroup, type: any, s_key: any, s_value: any) {
    let arr: any[] = formGroup.value?.[type];
    if (Array.isArray(arr)) {
        let index: any = arr.findIndex(x => x[s_key] == s_value);
        return index;
    }

    return false;
}


/**
 * ----------------------------------------
 * JS Functions for Accessing JS Functions
 * ----------------------------------------
 * ----------------------------------------
 */
export function checkIsArray(value: any) { // Array.isArray()
    if (Array.isArray(value)) {
        return true;
    } else {
        return false;
    }
}

export function stringReplaceAll(mainstring: any, substring: string, replacement: string) { // String.replaceAll
    return mainstring.replaceAll(substring, replacement)
}
export function dayDifference(date: Date) { 
    const createdDate = moment(date);
    // Calculate the difference in days
    const dayGap = moment().diff(createdDate, 'days');
    return dayGap
}
NODE_ENV=dev
NODE_PORT=5000
API_KEY=Ip2A4a02I1r1I9dE1iSnA0S6aB1tE5WS

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=air_india_sats
MYSQL_USERNAME=aisats_superadmin
MYSQL_PASSWORD=QMyo._k83/LwRk*6
PASSWORD_SALT_ROUND=12
DIALECT=mysql

ACCESS_TOKEN_SECRET=random
ACCESS_TOKEN_EXPIRED=86400

SMTP_AUTH_EMAIL=
SMTP_AUTH_PASSWORD=
SMTP_HOST=
SMTP_FROM_EMAIL=
SMTP_PORT=587
SMTP_SECURE=no

S3_BUCKET_NAME=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_REGION=
S3_BUCKET_URL=
AWS_CDN_URL=

DEFAULT_LANGUAGE=en
maxFileUploadSize=20 #MB


siteUrl=
adminSiteUrl=
PROJECT_NAME=AirIndiaSats

SWAGGER_API_USER=swAirIndiaSats
SWAGGER_API_PASSWORD=swAirIndiasatS
