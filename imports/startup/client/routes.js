import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { AccountsTemplates } from 'meteor/useraccounts:core';

import { getCompany, getCompanies } from '../../api/company/methods.js';

// Import to load these templates
import '../../ui/layouts/app-body.js';
import '../../ui/components/app-main.js';
import '../../ui/components/create-company.js';
import '../../ui/components/create-contact.js';
import '../../ui/components/show-company.js';
import '../../ui/components/show-contact.js';

FlowRouter.route('/', {
    name: 'App.home',
    action() {
        BlazeLayout.render('App_body', { main: 'App_main' });
    },
});

FlowRouter.route('/create/company', {
    name: 'App.create.company',
    action: function() {
        BlazeLayout.render('App_body', { main: 'Create_company'} );
    },
});

FlowRouter.route('/company/:companySlug', {
    name: 'App.show.company',
    action: function(params) {
        BlazeLayout.render('App_body', { main: 'Show_company', companySlug: params.companySlug });
    }
});

FlowRouter.route('/company/:companySlug/create/contact', {
    name: 'App.create.contact',
    action: function(params) {
        BlazeLayout.render('App_body', { main: 'Create_contact', companySlug: params.companySlug });
    }
});

FlowRouter.route('/contact/:contactId', {
    name: 'App.show.contact',
    action: function(params) {
        BlazeLayout.render('App_body', { main: 'Show_contact', companySlug: params.contactId });
    }
});
