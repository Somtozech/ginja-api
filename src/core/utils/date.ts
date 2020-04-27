/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import moment from 'moment';

export const getHumanTime = () => {
    return `${moment().format('LL')} ${moment().format('LT')}`;
};

export const getDateToday = () => {
    return moment().toDate();
};

export const getDateNextMonth = (days: number = 30) => {
    return moment()
        .add(days, 'days')
        .toDate();
};
