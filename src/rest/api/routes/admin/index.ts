import express from 'express';
import adminController from '../../../../controllers/admin/index';
import loginAuthController from '../../../../controllers/admin/loginAuth';
import usersController from '../../../../controllers/admin/users';
import adminUsersController from '../../../../controllers/admin/adminUsers';
import adminRolesController from '../../../../controllers/admin/adminRoles';
import transactionsController from '../../../../controllers/admin/transactions';
import referralsController from '../../../../controllers/admin/referrals';

// MIDDLEWARES
import loginAuth from '../../../../core/middlewares/admin/loginAuth';
import auth from '../../../../core/middlewares/admin/auth';
import managementPermit from '../../../../core/middlewares/admin/management';
import superAdminPermit from '../../../../core/middlewares/admin/superAdmin';
import supportPermit from '../../../../core/middlewares/admin/support';
import teamLeadPermit from '../../../../core/middlewares/admin/teamLead';

const router = express.Router();

/**
 * Do not put any middleware here if you dont want it to affect the entire system
 */

// GET REQUESTS
router.get('/', adminController);
router.get('/users', auth, usersController.allUsers);
router.get('/users/:id', auth, usersController.singleUser);
router.get('/admin-users', [auth, managementPermit], adminUsersController.getAdmins);
router.get('/admin-roles', [auth, superAdminPermit], adminRolesController.allRoles);
router.get('/transactions', [auth, managementPermit], transactionsController);
router.get('/referrals', [auth, managementPermit], referralsController.allReferrals);

// POST REQUESTS
router.post('/authenticate', loginAuth, loginAuthController);
router.post('/admin-users', [auth, superAdminPermit], adminUsersController.createAdmin);
router.post('/admin-roles', [auth, superAdminPermit], adminRolesController.createRole);

// UPDATE REQUESTS

// DELETE REQUESTS
router.delete('/admin-roles', [auth, superAdminPermit], adminRolesController.deleteRole);

export default router;
