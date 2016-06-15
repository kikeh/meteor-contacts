import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Contact } from './contact.js';
import { Company } from '../company/company.js';

export const createContact = function(fields) {
    var contact = null;
    if(fields['name'] != '' && (fields['phone'] != '' || fields['email'] != '') && fields['companyId'] != '') {
        contact = Contact.insert({
            name: fields['name'],
            phone: fields['phone'],
            email: fields['email'],
            company: fields['companyId'],
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    return contact;
};

export const getContact = function(contactId) {
    var contact = Contact.findOne({ _id : contactId });
    return contact;
};

export const getContacts = function() {
    var contacts = [];
    var contactsCursor = Contact.find();
    contactsCursor.forEach(function(contact) {
        contacts.push(contact);
    });
    return contacts;
};

export const getContactsFromCompany = function(companyId) {
    var contacts = Contact.find({
       'company' : companyId
    });

    return contacts.fetch();
};


export const removeContact = function(contactId) {
    Contact.remove({ _id : contactId });
};