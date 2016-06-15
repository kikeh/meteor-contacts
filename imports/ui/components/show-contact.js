import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { $ } from 'meteor/jquery';

import './show-contact.html';

import { getContact } from '../../api/contact/methods.js';

Template.Show_contact.onCreated(function showContactOnCreated() {
    Meteor.subscribe('contact');
    Session.set('errors', []);
});

Template.Show_contact.rendered = function() {
    var contactId = FlowRouter.getParam('contactId');
    Session.set('contactId', contactId);
    console.log(contactId);
}

Template.Show_contact.helpers({
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
    'contact' : function() {
        var contactId = Session.get('contactId');
        var contact = getContact(contactId);
        console.log(contact);
        return contact;
    }
});

Template.Show_contact.events({
    'click .editable-field-off': function(e) {
        var field = $(e.target);
        field.removeClass('editable-field-off');
        field.addClass('editable-field-on');
    },
    'blur .editable-field-on': function(e) {
        var field = $(e.target);
        field.removeClass('editable-field-on');
        field.addClass('editable-field-off');
    }
});
