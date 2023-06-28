const router = require('express').Router();
const AuthController = require('./controllers/auth-controller');
const ActivateController = require('./controllers/activate-controller');
const RoomsController = require('./controllers/rooms-controller')
const authMiddleware = require('./middlewares/auth-middleware');

router.post('/api/otp/send', AuthController.sendOtp);
router.post('/api/otp/verify', AuthController.verifyOtp);
router.post('/api/login', AuthController.login);
router.put('/api/login/forgot', AuthController.forgotPassword);
router.get('/api/login/verifyLink/:token', AuthController.verifyTokenLink);
router.put('/api/login/reset/:token', AuthController.resetPassword);
router.get('/api/refresh', AuthController.refresh);
router.post('/api/activate', authMiddleware, ActivateController.activate);
router.post('/api/logout', authMiddleware, AuthController.logout);
router.post('/api/rooms', authMiddleware, RoomsController.create);
router.get('/api/rooms', authMiddleware, RoomsController.getAll);
router.get('/api/room/:roomId', authMiddleware, RoomsController.getRoomByID);
router.post('/api/room', authMiddleware, RoomsController.getPrivateRoomByToken);

module.exports = router;