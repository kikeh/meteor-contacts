import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import './create-company.html';

import {
    createCompany,
    getCompany
} from '../../api/company/methods.js';

import { convertToSlug } from '../../api/utils/utils.js';

export const getCategories = function() {
    return [
        'Alcohol',
        'Ocio',
        'Tecnología',
        'Compañía Aérea',
        'Comida',
        'Casa',
        'Coches',
        'Grandes almacenes',
        'Ropa'
    ].sort();
}

export const checkFields = function(fields) {
    fieldsErrors = [];

    if(fields['name'] == '') {
        fieldsErrors.push('name');
    }

    if(fields['category'] == '' || fields['category'] == null) {
        fieldsErrors.push('category');
    }

    return fieldsErrors;
}

export const validateForm = function(fields) {

    if(fields['name'] == '') {
        return false;
    }

    if(fields['category'] == '' || fields['category'] == null) {
        return false;
    }

    return true;
}

Template.Create_company.onCreated(function createCompanyOnCreated() {
    Meteor.subscribe('company');
    Session.set('errors', []);
});

Template.Create_company.helpers({
    'nameError' : function() {
        var errors = Session.get('errors');
        return errors.indexOf('name') != -1;
    },
    'categoryError' : function() {
        var errors = Session.get('errors');
        return errors.indexOf('category') != -1;
    },
    'categories' : function() {
        return getCategories();
    }
});

Template.Create_company.events({
    'click #createCompany' : function(e) {
        e.preventDefault();

        var fields = {
            name: $('#companyName').val(),
            category: convertToSlug($('#companyCategory').find(":selected").attr('id'))
        };

        var isValid = validateForm(fields);

        if(isValid) {
            var companyId = createCompany(fields);
            var company = getCompany(companyId);
            FlowRouter.go('/company/' + company.slug);
        }
        else {
            fields = checkFields(fields);
            Session.set('errors', fields);
        }
    },
});
