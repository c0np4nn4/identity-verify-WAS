export const EMatchingStatus = {
    IS_IT_ME_SEND: 'IS_IT_ME_SEND',
    IS_IT_ME_RECEIVE: 'IS_IT_ME_RECEIVE',
    REJECT_SEND: 'REJECT_SEND',
    REJECT_RECEIVE: 'REJECT_RECEIVE',
    POST_LABEL_RECEIVE: 'POST_LABEL_RECEIVE',
    POST_LABEL_SEND: 'POST_LABEL_SEND',
};

export type EMatchingStatus =
    (typeof EMatchingStatus)[keyof typeof EMatchingStatus];
