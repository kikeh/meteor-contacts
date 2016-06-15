import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { $ } from 'meteor/jquery';

import './create-contact.html';

import {
    createContact
} from '../../api/contact/methods.js';

import {
    getCompanyBySlug,
    assignContact
} from '../../api/company/methods.js'

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkFields(fields) {
    var fieldsErrors = [];

    if(fields['name'] == '') {
        fieldsErrors.push('name');
    }

    if(fields['phone'] == '' && fields['email'] == '') {
        fieldsErrors.push('phone');
        fieldsErrors.push('email');
    }
    else if(fields['email'] != '') {
        if(!validateEmail(fields['email'])) {
            fieldsErrors.push('email');
        }
    }

    return fieldsErrors;
}

function validateForm(fields) {
    if(fields['name'] == '') {
        return false;
    }

    if(fields['phone'] == '' && fields['email'] == '') {
        return false;
    }
    else if(fields['email'] != '') {
        if (!validateEmail(fields['email'])) {
            return false;
        }
    }

    return true;
}

function unsetCompany() {
    $('#contactCompany').attr('companyid', null);
    Session.set('companyIsSet', false);
}

Template.Create_contact.onCreated(function createCompanyOnCreated() {
    Meteor.subscribe('company');
    Session.set('errors', []);
});

Template.Create_contact.rendered = function() {
    var companySlug = FlowRouter.getParam('companySlug');
    Session.set('companySlug', companySlug);
};

Template.Create_contact.helpers({
    'companies' : function() {
        return getCompanies();
    },
    'nameError' : function() {
        var errors = Session.get('errors');
        return errors.indexOf('name') != -1;
    },
    'phoneError' : function() {
        var errors = Session.get('errors');
        return errors.indexOf('phone') != -1;
    },
    'emailError' : function() {
        var errors = Session.get('errors');
        return errors.indexOf('email') != -1;
    },
    'companyError' : function() {
        var errors = Session.get('errors');
        return errors.indexOf('company') != -1;
    },
    'company' : function() {
        var companySlug = Session.get('companySlug');
        var company = getCompanyBySlug(companySlug);
        Session.set('company', company);
        return company;
    }
});

Template.Create_contact.events({
    'click #assignContact' : function(e) {
        e.preventDefault();

        var company = Session.get('company');
        var companyId = company._id;

        var fields = {
            name: $('#contactName').val(),
            phone: $('#contactPhone').val(),
            email: $('#contactEmail').val(),
            companyId: companyId
        };

        var isValid = validateForm(fields);

        if(isValid) {
            var contactId = createContact(fields);
            assignContact(fields['companyId'], contactId);
            FlowRouter.go('/company/' + company.slug);
        }
        else {
            fields = checkFields(fields);
            Session.set('errors', fields);
        }
    }
});
