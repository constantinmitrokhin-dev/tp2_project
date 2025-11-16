const {
    core_svc_business_find_by_id,
    core_svc_business_create,
    core_svc_business_find_by_url_name
} = require('../services/svc_CoreBusiness');
const {
    MDLW_ERR_BUSINESS_ID_NOT_FOUND,
    MDLW_ERR_BUSINESS_URL_NAME_NOT_FOUND,
    MDLW_ERR_BUSINESS_ALREADY_EXISTS,
    MDLW_ERR_BUSINESS_MISSING_FIELDS
} = require('./utils/msgs_error');

const hasRequiredFields = (data, fields) => {
    return fields.every(field => {
        const value = data[field];
        return value !== undefined && value !== null && value !== '';
    });
};

const validateFields = (requiredFields) => (req, res, next) => {
    if (!hasRequiredFields(req.body, requiredFields)) {
        return res.status(400).json({
            status: 400,
            message: MDLW_ERR_BUSINESS_MISSING_FIELDS
        });
    }
    next();
};

const core_mdlw_validate_business_id = async (req, res, next) => {
    try {
        const business = await core_svc_business_find_by_id(req.validatedId);

        if (!business) {
            return res.status(404).json({
                status: 404,
                message: MDLW_ERR_BUSINESS_ID_NOT_FOUND
            });
        }

        req.business = business;
        next();
    } catch (error) {
        next(error);
    }
};

const core_mdlw_register_business = async (req, res, next) => {
    try {
        const { url_name } = req.body;

        if (await core_svc_business_find_by_url_name(url_name)) {
            return res.status(409).json({
                status: 409,
                message: MDLW_ERR_BUSINESS_ALREADY_EXISTS
            });
        }

        req.registeredBusiness = await core_svc_business_create(req.body);
        next();
    } catch (error) {
        next(error);
    }
};

const core_mdlw_find_business_by_url_name = async (req, res, next) => {
    try {
        const { url_name } = req.query;

        if (!url_name) {
            return res.status(400).json({
                status: 400,
                message: 'URL name is required in query parameters'
            });
        }

        const business = await core_svc_business_find_by_url_name(url_name);

        if (!business) {
            return res.status(404).json({
                status: 404,
                message: MDLW_ERR_BUSINESS_URL_NAME_NOT_FOUND
            });
        }

        req.business = business;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateFields,
    core_mdlw_validate_business_id,
    core_mdlw_register_business,
    core_mdlw_find_business_by_url_name
};
