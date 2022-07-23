const router = require('express').Router();
const AuthController = require('./controllers/auth-controller');
const ActivateController = require('./controllers/activate-controller');
const RoomsController = require('./controllers/rooms-controller')
const authMiddleware = require('./middlewares/auth-middleware');

router.post('/api/otp/send', AuthController.sendOtp);
router.post('/api/otp/verify', AuthController.verifyOtp);
router.post('/api/login', AuthController.login);
router.post('/api/activate', authMiddleware, ActivateController.activate);
router.get('/api/refresh', AuthController.refresh);
router.post('/api/logout', authMiddleware, AuthController.logout);
router.post('/api/rooms', authMiddleware, RoomsController.create);
router.get('/api/rooms', authMiddleware, RoomsController.getAll);
router.get('/api/room/:roomId', authMiddleware, RoomsController.getRoomByID);

module.exports = router;