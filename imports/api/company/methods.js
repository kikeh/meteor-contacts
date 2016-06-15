import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

import { Company } from './company.js';
import { getContact } from '../contact/methods.js';
import { convertToSlug } from '../utils/utils.js';

export const createCompany = function(fields) {
    var company = Company.insert({
        name: fields['name'],
        contacts: [],
        calls: [],
        meetings: [],
        category: fields['category'],
        slug: convertToSlug(fields['name']),
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return company;
};

export const assignContact = function(companyId, contactId) {
    if(contactId != null) {
        var company = Company.findOne({ '_id' : companyId });
        if(company != null) {
            Company.update({ '_id' : companyId }, { '$push' : { contacts : contactId } });
        }
        else {
            console.log('Company does not exist?');
        }
    }
};

export const getCompanies = function() {
    var companies = Company.find();
    return companies.fetch();
};

export const getCompany = function(companyId) {
    var company = Company.findOne({'_id' : companyId});

    if(company != null) {
        company = serializeCompany(company);
    }

    return company;
};

export const updateCompany = function(companyId, fields) {
    Company.update({
        _id : companyId
    }, {
        $set : {
            name: fields['name'],
            category: fields['category'],
            slug: convertToSlug(fields['name']),
            updatedAt: new Date(),
        }
    })
};

export const getCompanyBySlug = function(companySlug) {
    var company = Company.findOne({'slug' : companySlug});
    return company;
};

export const removeContactFromCompany = function(companyId, contactId) {
    var updated = Company.update({
        '_id' : companyId
    },{
        '$pull' : {
            'contacts' : contactId
        }
    });

    return updated;
};

function serializeCompany(company) {
    var contacts = [];
    if(company.contacts.length > 0) {
        _.forEach(company.contacts, function(contactId) {
            var contact = getContact(contactId);
            contacts.push(contact);
        });
    }
    company.contacts = contacts;

    return company;
}
