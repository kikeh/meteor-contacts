import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import './show-company.html';

import {
    updateCompany,
    removeContactFromCompany,
    getCompanyBySlug,
} from '../../api/company/methods.js';

import {
    checkFields,
    validateForm,
    getCategories
} from './create-company.js';


import {
    getContactsFromCompany,
    getContact,
    removeContact
} from '../../api/contact/methods.js';

import { convertToSlug } from '../../api/utils/utils.js';

Template.Show_company.onCreated(function showCompanyOnCreated() {
    Meteor.subscribe('company');
    Meteor.subscribe('contact');
    Session.set('errors', []);
});

Template.Show_company.rendered = function() {
    var companySlug = FlowRouter.getParam('companySlug');
    Session.set('companySlug', companySlug);
};

Template.Show_company.helpers({
    'nameError' : function() {
        var errors = Session.get('errors');
        return errors.indexOf('name') != -1;
    },
    'company' : function() {
        var companySlug = Session.get('companySlug');
        var company = getCompanyBySlug(companySlug);

        Session.set('company', company);

        if(company != null) {
            var contacts = getContactsFromCompany(company._id);
            Session.set('contacts', contacts);
            selectCompanyCategory(company.category);
        }

        return company;
    },
    'contacts' : function() {
        return Session.get('contacts');
    },
    'categories' : function() {
        return getCategories();
    },
    'convertToSlug' : function(str) {
        return convertToSlug(str);
    }
});

Template.Show_company.events({
    'click .editable-field-off': function(e) {
        var field = $(e.target);
        field.removeClass('editable-field-off');
        field.addClass('editable-field-on');
    },
    'blur .editable-field-on': function(e) {
        var field = $(e.target);
        field.removeClass('editable-field-on');
        field.addClass('editable-field-off');

        enableUpdateButton();
    },
    'change #companyCategory': function() {
        enableUpdateButton();
    },
    'click .remove-contact': function(e) {
        var field = $(e.target);
        var contactId = field.attr('id');

        var contact = getContact(contactId);

        $('#remove-contact-modal .remove-contact-modal-button').attr('id', contactId);
        $('#remove-contact-modal-name').html(contact.name);
    },
    'click .remove-contact-modal-button': function(e) {
        var field = $(e.target);
        var contactId = field.attr('id');
        
        var company = Session.get('company');
        var companyId = company._id;
        
        removeContact(contactId);
        removeContactFromCompany(companyId, contactId);
    },
    'click #updateCompany': function(e) {
        e.preventDefault();

        var fields = {
            name: $('#companyName').val(),
            category: convertToSlug($('#companyCategory').find(":selected").attr('id'))
        };

        var isValid = validateForm(fields);

        if(isValid) {
            var company = Session.get('company');
            updateCompany(company._id, fields);
            FlowRouter.go('/company/' + convertToSlug(fields['name']));
        }
        else {
            fields = checkFields(fields);
            Session.set('errors', fields);
        }
    }
});

function selectCompanyCategory(category) {
    var select = $('#companyCategory').find('option[id="' + category + '"]');
    select.attr('selected','');
};

function fieldsHaveChanged() {
    var company = Session.get('company');
    var companyName = $('#companyName').val();
    var companyCategory = $('#companyCategory').find(':selected').attr('id');

    if(company.name != companyName || company.category != companyCategory) {
        return true;
    }
    else {
        return false;
    }
};

function enableUpdateButton() {
    if(fieldsHaveChanged()) {
        $('#updateCompany').removeAttr('disabled');
    }
    else {
        $('#updateCompany').attr('disabled','');
    }
};