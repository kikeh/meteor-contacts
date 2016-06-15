import { Mongo } from 'meteor/mongo';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class ContactCollection extends Mongo.Collection {

}

export const Contact = new ContactCollection('Contact');

if (Meteor.isServer) {
    Meteor.publish('contact', function companyPublication() {
        return Contact.find();
    });
}

Contact.schema = new SimpleSchema({
    name: {
        type: String,
    },
    phone: {
        type: [String],
    },
    company: {
        type: String,
    },
    comments: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
});

Contact.allow({
    'insert': function () {
        return true;
    },
    'update': function () {
        return true;
    },
    'remove': function () {
        return true;
    }
  });

Contact.foo = function() {
    Contact.insert({
        name: 'Foo',
        company: 'Bar',
        createdAt: new Date(),
        updatedAt: new Date(),
    });
}


Contact.getContacts = function() {
    return Contact.findOne();
}
