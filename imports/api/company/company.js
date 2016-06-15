import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

class CompanyCollection extends Mongo.Collection {
    
}

export const Company = new CompanyCollection('Company');

if (Meteor.isServer) {
  Meteor.publish('company', function companyPublication() {
      return Company.find();
  });
}

Company.schema = new SimpleSchema({
    name: {
        type: String,
    },
    contacts: {
        type: [String],
    },
    calls: {
        type: [String],
    },
    meetings: {
        type: [String],
    },
    category: {
        type: String
    },
    slug: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
});

Company.allow({
    'insert': function (name) {
        if(name != '' || name != null) {
            return true;
        }
        return false;
    },
    'update': function () {
        return true;
    },
});

