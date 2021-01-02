const production = process.env.NODE_ENV === 'production' ? true : false;

export const defaultURL = production ? "" : "http://localhost:5000";
