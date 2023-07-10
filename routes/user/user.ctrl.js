const User = require('../../models/user');

exports.postInfo = async (req, res) => {
  console.log("postInfo logic");
  const { cummulativeTime, todaysTime, points, githubId, badge, userId} = req.body;
  const target = await User.findOne({where: { userId: userId }})  
  target.set({
    cummulativeTime: cummulativeTime || target.cummulativeTime,
    todaysTime: todaysTime || target.todaysTime,
    points: points || target.points,
    githubId: githubId || target.githubId,
    badge: badge || target.badge,
  })
  res.status(201);
  res.json(JSON.stringify(target));
}

exports.getInfo = async (req, res) => {
  console.log("getInfo logic");
  const id = req.user.userId;
  console.log("require imformaion of id: ", id);
  const result = await User.findOne({where: { userId: id }});
  res.json(JSON.stringify(result));
}
