const { UUID, BaseError } = require('sequelize');
const UserInfo = require('../../models/userinfo');

exports.postInfo = async (req, res) => {
  console.log("postInfo logic");
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

exports.getInfo = async (req, res) => {
  console.log("getInfo logic");
  const id = req.user.userId;
  console.log("require imformaion of id: ", id);
  const result = await UserInfo.findOne({where: { id }});
  res.json(JSON.stringify(result));
}
