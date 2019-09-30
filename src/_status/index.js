export const productInvestorStatus = {
    requested: {
        translation_key: 'statuses.debtorApplication.requested',
        class: 'badge-info'
    }, // New requests
    open: {
        translation_key: 'statuses.debtorApplication.open',
        class: 'badge-secondary'
    }, // admin has viewed but not processed yet
    questions_for_creditor: {
        translation_key: 'statuses.debtorApplication.questions_for_creditor',
        class: 'badge-warning'
    }, //admin has asked questions to me (I as a creditor)
    approved: {
        translation_key: 'statuses.debtorApplication.approved',
        class: 'badge-success'
    }, //Admin has approved the application (starts matching with products)
    rejected: {
        translation_key: 'statuses.debtorApplication.rejected',
        class: 'badge-warning'
    }, // rejected by admin
    offer_received: {
        translation_key: 'statuses.debtorApplication.offer_received',
        class: 'badge-light'
    }, // one or more offers received (matched)
    offer_accepted: {
        translation_key: 'statuses.debtorApplication.offer_accepted',
        class: 'badge-primary'
    }, // I as creditor has accepted one of the offers
    offer_rejected: {
        translation_key: 'statuses.debtorApplication.offer_rejected',
        class: 'badge-dark'
    }, // All matches has been rejected by investor (if any new products matches with the application, status changes back to offer_received)
    deleted: {
        translation_key: 'statuses.debtorApplication.deleted',
        class: 'badge-deleted'
    },
    expired: {
        translation_key: 'statuses.debtorApplication.expired',
        class: 'badge-deleted'
    },
    suspended: {
        translation_key: 'statuses.debtorApplication.suspended',
        class: 'badge-suspended'
    }
}

export const matchesInvestorStatus = {
    open: {
        translation_key: 'statuses.offer.open',
        class: 'badge-secondary'
    },
    offer_sent: {
        translation_key: 'statuses.offer.accepted_by_investor',
        class: 'badge-warning'
    }, // offer sent by investor
    rejected: {
        translation_key: 'statuses.offer.offer_rejected',
        class: 'badge-danger'
    }, // I as investor when reject application
    rejected_by_creditor: {
        translation_key: 'statuses.offer.rejected_by_creditor',
        class: 'badge-deleted'
    },// rejected by creditor
    accepted_by_creditor: {
        translation_key: 'statuses.offer.accepted_by_creditor',
        class: 'badge-success'
    },// I as creditor have accepted this offer
}