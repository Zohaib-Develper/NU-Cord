const { Router } = require("express");
const router = Router();
const { Protect, RestrictTo } = require('./../middleware/authMiddleware')
const { createChannel, getAllChannels, getChannelById, deleteChannel } = require('./../controllers/channelController')
const { getAllServers, getAllUsersInServer, removeUserFromServer, deleteServer } = require('../controllers/serverController')

// /api/server/
router.route('/').get(getAllServers);
router.route('/:serverId/users').get(getAllUsersInServer);
router.delete('/:serverId/removeUser/:userId', removeUserFromServer);
router.route('/:serverId').delete(deleteServer);

router.route('/:serverId/channels').post(Protect, RestrictTo(''), createChannel).get(getAllChannels);
router.route('/:serverId/channel/:channelId').get(Protect, getChannelById).delete(/*Protect,*/ deleteChannel);

module.exports = router;