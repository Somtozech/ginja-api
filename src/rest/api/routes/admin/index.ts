import express from 'express';

// Controllers
import adminController from '../../../../controllers/admin/index';
import loginAuthController from '../../../../controllers/admin/loginAuth';
import usersController from '../../../../controllers/admin/users';
import adminUsersController from '../../../../controllers/admin/adminUsers';
import adminRolesController from '../../../../controllers/admin/adminRoles';

// MIDDLEWARES
import loginAuth from '../../../../core/middlewares/admin/loginAuth';
import auth from '../../../../core/middlewares/admin/auth';
import superAdminPermit from '../../../../core/middlewares/admin/superAdmin';
import managementPermit from '../../../../core/middlewares/admin/management';
import teamLeadPermit from '../../../../core/middlewares/admin/teamLead';
import supportPermit from '../../../../core/middlewares/admin/support';

const router = express.Router();

/**
 * Do not put any middleware here if you dont want it to affect the entire system
 */

// GET REQUESTS
router.get('/', adminController);
router.get('/users', auth, usersController);
router.get('/admin-users', [auth, managementPermit], adminUsersController);
router.get('/admin-roles', [auth, superAdminPermit], adminRolesController);

// POST REQUESTS
// router.post('/', loginAuth, firstTimeLaunchController);
router.post('/authenticate', loginAuth, loginAuthController);

// UPDATE REQUESTS

// DELETE REQUESTS

export default router;
