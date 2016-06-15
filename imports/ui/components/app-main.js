import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';

import '../../ui/stylesheets/main.css';
import './app-main.html';

import {
    getCompanies
} from '../../api/company/methods.js';

import {
    getContacts
} from '../../api/contact/methods.js';

Template.App_main.onCreated(function appMainOnCreated() {
    Meteor.subscribe('company');
    Meteor.subscribe('contact');
});

Template.App_main.helpers({
    'companies' : function() {
        return getCompanies();
    }
});

Template.App_main.events({
    'click #companies'(event, instance) {
        console.log(getCompanies());
    },
    'click #contacts'(event, instance) {
        console.log(getContacts());
    }
});
