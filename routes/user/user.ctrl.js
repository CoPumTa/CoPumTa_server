const { UUID, BaseError } = require('sequelize');
const UserInfo = require('../../models/userinfo');

exports.postInfo = async (req, res) => {
  const { cummulativeTime, todaysTime, points, githubId, badge, userId} = req.body;
  const target = await UserInfo.findOne({where: { userId }})
  console.log("target is", target);
  
  target.set({
    cummulativeTime: cummulativeTime || target.cummulativeTime,
    todaysTime: todaysTime || target.todaysTime,
    points: points || target.points,
    githubId: githubId || target.githubId,
    badge: badge || target.badge,
  })

  console.log("changed result is: ", target);
  res.status(204).json(JSON.stringify(target));
}

exports.getInfo = (req, res) => {
  console.log("getInfo logic");
  
}
