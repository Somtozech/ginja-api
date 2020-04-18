import express from 'express';
import adminController from '../../../../controllers/admin/index';
import loginAuthController from '../../../../controllers/admin/loginAuth';
import usersController from '../../../../controllers/admin/users';
import adminUsersController from '../../../../controllers/admin/adminUsers';
import adminRolesController from '../../../../controllers/admin/adminRoles';
import transactionsController from '../../../../controllers/admin/transactions';
import warehousersPaymentsController from '../../../../controllers/admin/warehousersPayments';
import referralsController from '../../../../controllers/admin/referrals';
import stocksController from '../../../../controllers/admin/stocks';
import listingsController from '../../../../controllers/admin/listings';
import statisticsController from '../../../../controllers/admin/statistics';

// MIDDLEWARES
import loginAuth from '../../../../core/middlewares/admin/loginAuth';
import auth from '../../../../core/middlewares/admin/auth';
import managementPermit from '../../../../core/middlewares/admin/management';
import superAdminPermit from '../../../../core/middlewares/admin/superAdmin';
import teamLeadPermit from '../../../../core/middlewares/admin/teamLead';
import supportPermit from '../../../../core/middlewares/admin/support';

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
router.get('/warehousers-payments', [auth, managementPermit], warehousersPaymentsController.allPayments);
router.get('/referrals', [auth, managementPermit], referralsController.allReferrals);
router.get('/listings', [auth, managementPermit], listingsController.allListings);
router.get('/requisitions', [auth, managementPermit], listingsController.allRequisitions);
router.get('/dispatch-orders', [auth, managementPermit], stocksController.dispatchOrders);
router.get('/stocks', [auth, managementPermit], stocksController.allStocks);
router.get('/statistics/total-users', [auth, supportPermit], statisticsController.totalUsers);
router.get('/statistics/users-os', [auth, supportPermit], statisticsController.usersByOs);
router.get('/statistics/total-transactions', [auth, supportPermit], statisticsController.totalTransactions);
router.get('/statistics/total-commissions', [auth, supportPermit], statisticsController.totalCommissions);
router.get('/statistics/total-available-warehouses', [auth, supportPermit], statisticsController.totalAvailableWarehouses);
router.get('/statistics/signups', [auth, supportPermit], statisticsController.signups);
router.get('/statistics/commissions-by-date', [auth, supportPermit], statisticsController.commissionsByDate);
router.get('/statistics/transactions-by-date', [auth, supportPermit], statisticsController.transactionsByDate);

// POST REQUESTS
router.post('/authenticate', loginAuth, loginAuthController);
router.post('/admin-users', [auth, superAdminPermit], adminUsersController.createAdmin);
router.post('/admin-roles', [auth, superAdminPermit], adminRolesController.createRole);

// UPDATE REQUESTS
router.put('/admin-roles', [auth, superAdminPermit], adminRolesController.updateRole);
router.put('/users/:id', [auth, superAdminPermit], usersController.updateUser);
router.put('/listings/:id', [auth, superAdminPermit], listingsController.updateListing);
router.put('/admin-users/update-password', auth, adminUsersController.updatePassword);

// DELETE REQUESTS
router.delete('/admin-roles/:id', [auth, superAdminPermit], adminRolesController.deleteRole);
router.delete('/admin-users/:id', [auth, superAdminPermit], adminUsersController.deleteAdmin);
router.delete('/listings/:id', [auth, superAdminPermit], listingsController.deleteListing);

export default router;
